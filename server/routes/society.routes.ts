import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { prisma } from '../config/prisma';
import { authenticateToken, requireRoles } from '../middleware/auth';
import { enforceTenantIsolation } from '../middleware/tenantGuard';
import { z } from 'zod';

const router = Router();

const createSocietySchema = z.object({
  name: z.string().min(2),
  code: z.string().min(2).toUpperCase(),
  addressLine: z.string().min(3),
  locality: z.string().min(2),
  city: z.string().min(2),
  state: z.string().default('Karnataka'),
  pincode: z.string().min(6),
  waterPolicy: z.string().default('WATERLESS_ONLY'),
  timezone: z.string().default('Asia/Kolkata'),
  maxUnits: z.number().int().positive().default(500),
  adminFullName: z.string().min(2),
  adminEmail: z.string().email(),
  adminPhone: z.string().min(10)
});

const addTowerSchema = z.object({
  name: z.string().min(1),
  totalFloors: z.number().int().min(1).default(20)
});

const addParkingSlotSchema = z.object({
  towerId: z.string().uuid(),
  level: z.string().min(1),
  slotNumber: z.string().min(1),
  walkingSequence: z.number().int().min(1).default(1)
});

// 1. POST /api/societies (Super Admin Only: Provision New Society & Secure Single-Use Invite Token)
router.post('/', authenticateToken, requireRoles(['SUPER_ADMIN']), async (req: Request, res: Response): Promise<void> => {
  try {
    const data = createSocietySchema.parse(req.body);

    // Generate single-use secure invite token for the Society Admin
    const rawToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days valid

    // Atomic transaction: create Society, Onboarding, and Invitation Token
    const result = await prisma.$transaction(async (tx) => {
      const society = await tx.society.create({
        data: {
          name: data.name,
          code: data.code,
          addressLine: data.addressLine,
          locality: data.locality,
          city: data.city,
          state: data.state,
          pincode: data.pincode,
          waterPolicy: data.waterPolicy,
          timezone: data.timezone,
          maxUnits: data.maxUnits,
          tenantStatus: 'PROVISIONED',
          onboardingState: {
            create: {
              currentStep: 1,
              step1Details: true
            }
          }
        }
      });

      const invite = await tx.invitationToken.create({
        data: {
          societyId: society.id,
          email: data.adminEmail,
          role: 'SOCIETY_ADMIN',
          tokenHash,
          expiresAt
        }
      });

      // Create standard commission rule
      await tx.commissionRule.create({
        data: {
          societyId: society.id,
          name: `${society.name} Standard Tier`,
          platformFeePercentage: 40.0,
          providerPayoutRate: 22
        }
      });

      return { society, invite };
    });

    const inviteUrl = `${req.protocol}://${req.get('host')}/setup-account?token=${rawToken}`;

    res.status(201).json({
      success: true,
      message: 'Society provisioned successfully. Single-use invitation generated.',
      society: result.society,
      onboardingPackage: {
        adminEmail: data.adminEmail,
        adminPhone: data.adminPhone,
        inviteUrl,
        rawToken,
        expiresAt: result.invite.expiresAt
      }
    });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message || 'Failed to create society.' });
  }
});

// 2. GET /api/societies (Super Admin views all, Society Admin views their own)
router.get('/', authenticateToken, async (req: Request, res: Response): Promise<void> => {
  try {
    if (req.user!.role === 'SUPER_ADMIN') {
      const societies = await prisma.society.findMany({
        include: {
          towers: { include: { slots: true } },
          onboardingState: true,
          _count: {
            select: { users: true, jobs: true, providers: true }
          }
        },
        orderBy: { createdAt: 'desc' }
      });
      res.json({ success: true, count: societies.length, societies });
      return;
    }

    if (!req.user!.societyId) {
      res.status(403).json({ success: false, error: 'User is not linked to any society.' });
      return;
    }

    const society = await prisma.society.findUnique({
      where: { id: req.user!.societyId },
      include: {
        towers: { include: { slots: true } },
        onboardingState: true,
        commissionRules: true
      }
    });

    res.json({ success: true, society });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 3. GET /api/societies/:societyId (Strict Tenant Isolated)
router.get('/:societyId', authenticateToken, enforceTenantIsolation, async (req: Request, res: Response): Promise<void> => {
  try {
    const { societyId } = req.params;
    const society = await prisma.society.findUnique({
      where: { id: societyId },
      include: {
        towers: {
          include: {
            floors: { include: { apartments: true } },
            slots: {
              include: { vehicles: true }
            }
          }
        },
        parkingLevels: { include: { slots: true } },
        providers: {
          include: { user: true }
        },
        onboardingState: true
      }
    });

    if (!society) {
      res.status(404).json({ success: false, error: 'Society not found.' });
      return;
    }

    res.json({ success: true, society });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 4. POST /api/societies/:societyId/towers (Add Tower with Floors)
router.post('/:societyId/towers', authenticateToken, enforceTenantIsolation, requireRoles(['SUPER_ADMIN', 'SOCIETY_ADMIN']), async (req: Request, res: Response): Promise<void> => {
  try {
    const { societyId } = req.params;
    const { name, totalFloors } = addTowerSchema.parse(req.body);

    const tower = await prisma.$transaction(async (tx) => {
      const createdTower = await tx.buildingTower.create({
        data: {
          societyId,
          name,
          totalFloors
        }
      });

      // Auto-generate floor entities for this tower
      const floorData = Array.from({ length: totalFloors }, (_, idx) => ({
        towerId: createdTower.id,
        floorNumber: idx + 1,
        floorLabel: `Floor ${idx + 1}`
      }));

      await tx.buildingFloor.createMany({ data: floorData });

      return createdTower;
    });

    res.status(201).json({ success: true, tower });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message || 'Failed to add tower.' });
  }
});

// 5. POST /api/societies/:societyId/slots (Add Parking Slot)
router.post('/:societyId/slots', authenticateToken, enforceTenantIsolation, requireRoles(['SUPER_ADMIN', 'SOCIETY_ADMIN']), async (req: Request, res: Response): Promise<void> => {
  try {
    const { towerId, level, slotNumber, walkingSequence } = addParkingSlotSchema.parse(req.body);

    const slot = await prisma.parkingSlot.create({
      data: {
        towerId,
        level,
        slotNumber,
        walkingSequence
      }
    });

    res.status(201).json({ success: true, slot });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message || 'Failed to add parking slot.' });
  }
});

// 6. POST /api/societies/:societyId/bulk-import-slots (Transactional Bulk Import)
router.post('/:societyId/bulk-import-slots', authenticateToken, enforceTenantIsolation, requireRoles(['SUPER_ADMIN', 'SOCIETY_ADMIN']), async (req: Request, res: Response): Promise<void> => {
  try {
    const { slots } = req.body; // Array of { towerId, level, slotNumber, walkingSequence }

    if (!Array.isArray(slots) || slots.length === 0) {
      res.status(400).json({ success: false, error: 'Valid slots array is required.' });
      return;
    }

    const createdCount = await prisma.$transaction(async (tx) => {
      let count = 0;
      for (const item of slots) {
        await tx.parkingSlot.upsert({
          where: {
            towerId_level_slotNumber: {
              towerId: item.towerId,
              level: item.level,
              slotNumber: item.slotNumber
            }
          },
          update: { walkingSequence: item.walkingSequence || 0 },
          create: {
            towerId: item.towerId,
            level: item.level,
            slotNumber: item.slotNumber,
            walkingSequence: item.walkingSequence || 0
          }
        });
        count++;
      }
      return count;
    });

    res.status(201).json({ success: true, message: `Successfully imported ${createdCount} parking slots.` });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message || 'Bulk slot import failed.' });
  }
});

export default router;
