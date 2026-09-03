import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/prisma';
import { env } from '../config/env';
import { authenticateToken, AuthenticatedUserPayload } from '../middleware/auth';
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

// 2. POST /api/auth/register (Resident / Customer)
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

// 3. GET /api/auth/me
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

// 4. POST /api/auth/logout
router.post('/logout', (_req: Request, res: Response): void => {
  res.clearCookie('token');
  res.json({ success: true, message: 'Logged out successfully.' });
});

export default router;
