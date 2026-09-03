import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
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
  maxUnits: z.number().int().positive().default(500),
  adminFullName: z.string().min(2),
  adminEmail: z.string().email(),
  adminPhone: z.string().min(10)
});

// 1. POST /api/societies (Super Admin Only: Provision New Society & Society Admin Account)
router.post('/', authenticateToken, requireRoles(['SUPER_ADMIN']), async (req: Request, res: Response): Promise<void> => {
  try {
    const data = createSocietySchema.parse(req.body);

    // Generate random temporary password for the society admin
    const tempPassword = `Aura@${Math.random().toString(36).substring(2, 8)}!`;
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(tempPassword, salt);

    // Atomic transaction: create Society, Society Admin user, and Onboarding record
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
          maxUnits: data.maxUnits,
          tenantStatus: 'ACTIVE',
          onboardingState: {
            create: {
              currentStep: 1,
              step1Details: true
            }
          }
        }
      });

      const adminUser = await tx.user.create({
        data: {
          fullName: data.adminFullName,
          email: data.adminEmail,
          phoneNumber: data.adminPhone,
          passwordHash,
          role: 'SOCIETY_ADMIN',
          societyId: society.id,
          mustResetPassword: true,
          adminProfile: {
            create: {
              department: 'RWA_MANAGEMENT'
            }
          }
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

      return { society, adminUser, tempPassword };
    });

    res.status(201).json({
      success: true,
      message: 'Society and Society Admin provisioned successfully.',
      society: result.society,
      onboardingCredentials: {
        adminEmail: result.adminUser.email,
        adminPhone: result.adminUser.phoneNumber,
        tempPassword: result.tempPassword,
        loginUrl: `${req.protocol}://${req.get('host')}/login`
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
            slots: {
              include: { vehicles: true }
            }
          }
        },
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

// 4. POST /api/societies/:societyId/towers (Add Building Tower)
router.post('/:societyId/towers', authenticateToken, requireRoles(['SUPER_ADMIN', 'SOCIETY_ADMIN']), enforceTenantIsolation, async (req: Request, res: Response): Promise<void> => {
  try {
    const { societyId } = req.params;
    const { name, totalFloors } = req.body;

    const tower = await prisma.buildingTower.create({
      data: {
        societyId,
        name,
        totalFloors: totalFloors || 20
      }
    });

    res.status(201).json({ success: true, tower });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// 5. POST /api/societies/:societyId/slots (Add Parking Slot with Walking Sequence)
router.post('/:societyId/slots', authenticateToken, requireRoles(['SUPER_ADMIN', 'SOCIETY_ADMIN']), enforceTenantIsolation, async (req: Request, res: Response): Promise<void> => {
  try {
    const { towerId, level, slotNumber, walkingSequence } = req.body;

    const slot = await prisma.parkingSlot.create({
      data: {
        towerId,
        level,
        slotNumber,
        walkingSequence: walkingSequence || 0
      }
    });

    res.status(201).json({ success: true, slot });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// 6. PATCH /api/societies/:societyId/onboarding (Update 9-step progress)
router.patch('/:societyId/onboarding', authenticateToken, requireRoles(['SUPER_ADMIN', 'SOCIETY_ADMIN']), enforceTenantIsolation, async (req: Request, res: Response): Promise<void> => {
  try {
    const { societyId } = req.params;
    const updateData = req.body;

    const updated = await prisma.societyOnboarding.update({
      where: { societyId },
      data: {
        ...updateData,
        updatedAt: new Date()
      }
    });

    res.json({ success: true, onboarding: updated });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

export default router;
