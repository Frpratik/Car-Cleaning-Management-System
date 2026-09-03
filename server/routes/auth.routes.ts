import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/prisma';
import { env } from '../config/env';
import { authenticateToken, AuthenticatedUserPayload, requireRole } from '../middleware/auth';
import { z } from 'zod';

const router = Router();

const loginSchema = z.object({
  phoneNumber: z.string().min(10),
  password: z.string().min(6)
});

const registerCustomerSchema = z.object({
  fullName: z.string().min(2),
  phoneNumber: z.string().min(10),
  email: z.string().email().optional(),
  password: z.string().min(6),
  societyId: z.string().uuid(),
  apartmentNumber: z.string().min(1)
});

const redeemInviteSchema = z.object({
  token: z.string().min(16),
  fullName: z.string().min(2),
  phoneNumber: z.string().min(10),
  password: z.string().min(8)
});

const changePasswordSchema = z.object({
  currentPassword: z.string().min(6),
  newPassword: z.string().min(8)
});

// Helper: generate signed JWT
const generateToken = (payload: AuthenticatedUserPayload) => {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: '7d' });
};

// 1. POST /api/auth/login
router.post('/login', async (req: Request, res: Response): Promise<void> => {
  try {
    const { phoneNumber, password } = loginSchema.parse(req.body);

    const user = await prisma.user.findUnique({
      where: { phoneNumber },
      include: {
        society: true,
        customerProfile: true,
        providerProfile: true,
        adminProfile: true
      }
    });

    if (!user) {
      res.status(401).json({ success: false, error: 'Invalid phone number or password.' });
      return;
    }

    if (!user.isActive) {
      res.status(403).json({ success: false, error: 'Account is deactivated. Please contact support.' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      res.status(401).json({ success: false, error: 'Invalid phone number or password.' });
      return;
    }

    const payload: AuthenticatedUserPayload = {
      userId: user.id,
      role: user.role,
      societyId: user.societyId,
      email: user.email,
      phoneNumber: user.phoneNumber,
      fullName: user.fullName
    };

    const token = generateToken(payload);

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() }
    });

    res.cookie('token', token, {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        fullName: user.fullName,
        phoneNumber: user.phoneNumber,
        email: user.email,
        role: user.role,
        societyId: user.societyId,
        societyName: user.society?.name || null,
        mustResetPassword: user.mustResetPassword
      }
    });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message || 'Login failed.' });
  }
});

// 2. POST /api/auth/create-invite (Super Admin or Society Admin generates single-use token)
router.post('/create-invite', authenticateToken, requireRole(['SUPER_ADMIN', 'SOCIETY_ADMIN']), async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, role, societyId, apartmentUnitId, expiresInHours = 72 } = req.body;

    const targetSocietyId = req.user!.role === 'SUPER_ADMIN' ? societyId : req.user!.societyId;
    if (!targetSocietyId) {
      res.status(400).json({ success: false, error: 'Target societyId is required.' });
      return;
    }

    // Generate random cryptographically secure token
    const rawToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
    const expiresAt = new Date(Date.now() + expiresInHours * 60 * 60 * 1000);

    const invite = await prisma.invitationToken.create({
      data: {
        societyId: targetSocietyId,
        email,
        role: role || 'CUSTOMER',
        tokenHash,
        apartmentUnitId: apartmentUnitId || null,
        expiresAt
      },
      include: { society: true }
    });

    const inviteUrl = `${req.protocol}://${req.get('host')}/join/invite?token=${rawToken}`;

    res.status(201).json({
      success: true,
      inviteId: invite.id,
      inviteUrl,
      rawToken,
      expiresAt: invite.expiresAt,
      societyName: invite.society.name
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 3. POST /api/auth/redeem-invite (Redeems single-use invite token)
router.post('/redeem-invite', async (req: Request, res: Response): Promise<void> => {
  try {
    const { token, fullName, phoneNumber, password } = redeemInviteSchema.parse(req.body);

    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

    const invite = await prisma.invitationToken.findFirst({
      where: {
        tokenHash,
        isRedeemed: false,
        expiresAt: { gt: new Date() }
      },
      include: { society: true, apartmentUnit: true }
    });

    if (!invite) {
      res.status(400).json({ success: false, error: 'Invalid, expired, or already redeemed invitation token.' });
      return;
    }

    // Check if phone number already in use
    const existingPhone = await prisma.user.findUnique({ where: { phoneNumber } });
    if (existingPhone) {
      res.status(409).json({ success: false, error: 'An account with this phone number already exists.' });
      return;
    }

    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create user and mark invite redeemed in transaction
    const [newUser] = await prisma.$transaction([
      prisma.user.create({
        data: {
          fullName,
          phoneNumber,
          email: invite.email,
          passwordHash,
          role: invite.role,
          societyId: invite.societyId,
          isEmailVerified: true,
          ...(invite.role === 'CUSTOMER' ? {
            customerProfile: {
              create: {
                apartmentUnitId: invite.apartmentUnitId,
                apartmentNumber: invite.apartmentUnit ? `Unit ${invite.apartmentUnit.unitNumber}` : null
              }
            }
          } : invite.role === 'SOCIETY_ADMIN' ? {
            adminProfile: {
              create: { department: 'MANAGEMENT' }
            }
          } : {})
        }
      }),
      prisma.invitationToken.update({
        where: { id: invite.id },
        data: { isRedeemed: true, redeemedAt: new Date() }
      })
    ]);

    const payload: AuthenticatedUserPayload = {
      userId: newUser.id,
      role: newUser.role,
      societyId: newUser.societyId,
      email: newUser.email,
      phoneNumber: newUser.phoneNumber,
      fullName: newUser.fullName
    };

    const jwtToken = generateToken(payload);

    res.status(201).json({
      success: true,
      token: jwtToken,
      user: {
        id: newUser.id,
        fullName: newUser.fullName,
        phoneNumber: newUser.phoneNumber,
        email: newUser.email,
        role: newUser.role,
        societyId: newUser.societyId,
        societyName: invite.society.name
      }
    });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message || 'Invitation redemption failed.' });
  }
});

// 4. POST /api/auth/register (Standard Customer Registration)
router.post('/register', async (req: Request, res: Response): Promise<void> => {
  try {
    const data = registerCustomerSchema.parse(req.body);

    const existingUser = await prisma.user.findUnique({
      where: { phoneNumber: data.phoneNumber }
    });

    if (existingUser) {
      res.status(409).json({ success: false, error: 'An account with this phone number already exists.' });
      return;
    }

    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(data.password, salt);

    const user = await prisma.user.create({
      data: {
        fullName: data.fullName,
        phoneNumber: data.phoneNumber,
        email: data.email,
        passwordHash,
        role: 'CUSTOMER',
        societyId: data.societyId,
        customerProfile: {
          create: {
            apartmentNumber: data.apartmentNumber
          }
        }
      },
      include: {
        society: true
      }
    });

    const payload: AuthenticatedUserPayload = {
      userId: user.id,
      role: user.role,
      societyId: user.societyId,
      email: user.email,
      phoneNumber: user.phoneNumber,
      fullName: user.fullName
    };

    const token = generateToken(payload);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user.id,
        fullName: user.fullName,
        phoneNumber: user.phoneNumber,
        email: user.email,
        role: user.role,
        societyId: user.societyId,
        societyName: user.society?.name
      }
    });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message || 'Registration failed.' });
  }
});

// 5. POST /api/auth/change-password
router.post('/change-password', authenticateToken, async (req: Request, res: Response): Promise<void> => {
  try {
    const { currentPassword, newPassword } = changePasswordSchema.parse(req.body);

    const user = await prisma.user.findUnique({ where: { id: req.user!.userId } });
    if (!user) {
      res.status(404).json({ success: false, error: 'User not found.' });
      return;
    }

    const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isMatch) {
      res.status(400).json({ success: false, error: 'Current password does not match.' });
      return;
    }

    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(newPassword, salt);

    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash, mustResetPassword: false }
    });

    res.json({ success: true, message: 'Password updated successfully.' });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message || 'Password update failed.' });
  }
});

// 6. GET /api/auth/me
router.get('/me', authenticateToken, async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.userId },
      include: {
        society: true,
        customerProfile: {
          include: {
            vehicles: {
              include: {
                parkingSlot: {
                  include: { tower: true }
                }
              }
            }
          }
        },
        providerProfile: true,
        adminProfile: true
      }
    });

    if (!user) {
      res.status(404).json({ success: false, error: 'User not found.' });
      return;
    }

    res.json({
      success: true,
      user: {
        id: user.id,
        fullName: user.fullName,
        phoneNumber: user.phoneNumber,
        email: user.email,
        role: user.role,
        societyId: user.societyId,
        society: user.society,
        customerProfile: user.customerProfile,
        providerProfile: user.providerProfile,
        adminProfile: user.adminProfile,
        mustResetPassword: user.mustResetPassword
      }
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 7. POST /api/auth/logout
router.post('/logout', (_req: Request, res: Response): void => {
  res.clearCookie('token');
  res.json({ success: true, message: 'Logged out successfully.' });
});

export default router;
