import { Router, Request, Response } from 'express';
import { prisma } from '../config/prisma';
import { authenticateToken, requireRoles } from '../middleware/auth';
import { z } from 'zod';

const router = Router();

const createEnquirySchema = z.object({
  societyName: z.string().min(2),
  contactPerson: z.string().min(2),
  email: z.string().email(),
  phoneNumber: z.string().min(10),
  city: z.string().min(2),
  estimatedUnits: z.number().int().positive().optional(),
  estimatedVehicles: z.number().int().positive().optional(),
  message: z.string().optional()
});

// 1. POST /api/enquiries (Public: Bring Car Care to Your Society)
router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const data = createEnquirySchema.parse(req.body);

    const enquiry = await prisma.societyEnquiry.create({
      data: {
        societyName: data.societyName,
        contactPerson: data.contactPerson,
        email: data.email,
        phoneNumber: data.phoneNumber,
        city: data.city,
        estimatedUnits: data.estimatedUnits,
        estimatedVehicles: data.estimatedVehicles,
        message: data.message,
        status: 'NEW'
      }
    });

    // In production, dispatch notification email/webhook to Super Admin
    res.status(201).json({
      success: true,
      message: 'Thank you for your interest! Our enterprise onboarding team will contact you within 24 hours.',
      enquiryId: enquiry.id
    });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message || 'Failed to submit enquiry.' });
  }
});

// 2. GET /api/enquiries (Super Admin Only: View all B2B leads)
router.get('/', authenticateToken, requireRoles(['SUPER_ADMIN']), async (_req: Request, res: Response): Promise<void> => {
  try {
    const enquiries = await prisma.societyEnquiry.findMany({
      orderBy: { createdAt: 'desc' }
    });

    res.json({ success: true, count: enquiries.length, enquiries });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 3. PATCH /api/enquiries/:id/status (Super Admin Only: Update lead status)
router.patch('/:id/status', authenticateToken, requireRoles(['SUPER_ADMIN']), async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, internalNotes } = req.body;

    const updated = await prisma.societyEnquiry.update({
      where: { id },
      data: {
        status,
        internalNotes
      }
    });

    res.json({ success: true, enquiry: updated });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

export default router;
