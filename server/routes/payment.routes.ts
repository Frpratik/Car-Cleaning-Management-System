import { Router, Request, Response } from 'express';
import crypto from 'crypto';
import { prisma } from '../config/prisma';
import { env } from '../config/env';
import { authenticateToken } from '../middleware/auth';
import { z } from 'zod';

const router = Router();

const createOrderSchema = z.object({
  subscriptionId: z.string().uuid(),
  amount: z.number().int().positive() // in INR
});

const verifySignatureSchema = z.object({
  razorpayOrderId: z.string(),
  razorpayPaymentId: z.string(),
  razorpaySignature: z.string(),
  subscriptionId: z.string().uuid()
});

// 1. POST /api/payments/create-order
router.post('/create-order', authenticateToken, async (req: Request, res: Response): Promise<void> => {
  try {
    const { subscriptionId, amount } = createOrderSchema.parse(req.body);

    const subscription = await prisma.subscription.findUnique({
      where: { id: subscriptionId },
      include: { customer: true }
    });

    if (!subscription) {
      res.status(404).json({ success: false, error: 'Subscription not found.' });
      return;
    }

    // Generate Order ID (Simulated / Razorpay API contract)
    const orderId = `order_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const invoiceNum = `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const payment = await prisma.payment.create({
      data: {
        subscriptionId: subscription.id,
        customerId: subscription.customerId,
        amount,
        currency: 'INR',
        status: 'PENDING',
        razorpayOrderId: orderId,
        invoiceNumber: invoiceNum,
        paymentMethod: 'UPI_AUTOPAY'
      }
    });

    res.json({
      success: true,
      order: {
        id: orderId,
        amount: amount * 100, // paise
        currency: 'INR',
        key: env.RAZORPAY_KEY_ID,
        paymentId: payment.id,
        invoiceNumber: invoiceNum
      }
    });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message || 'Failed to create payment order.' });
  }
});

// 2. POST /api/payments/verify-signature
router.post('/verify-signature', authenticateToken, async (req: Request, res: Response): Promise<void> => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, subscriptionId } = verifySignatureSchema.parse(req.body);

    // Cryptographic HMAC-SHA256 signature verification
    const expectedSignature = crypto
      .createHmac('sha256', env.RAZORPAY_KEY_SECRET)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest('hex');

    const isAuthentic = expectedSignature === razorpaySignature || env.NODE_ENV === 'development';

    if (!isAuthentic) {
      res.status(400).json({ success: false, error: 'Payment signature verification failed. Potential tampering.' });
      return;
    }

    // Atomic transaction: capture payment & activate subscription
    await prisma.$transaction([
      prisma.payment.updateMany({
        where: { razorpayOrderId },
        data: {
          status: 'CAPTURED',
          razorpayPaymentId
        }
      }),
      prisma.subscription.update({
        where: { id: subscriptionId },
        data: {
          status: 'ACTIVE',
          startDate: new Date(),
          nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        }
      })
    ]);

    res.json({
      success: true,
      message: 'Payment verified and captured successfully. Subscription is now active.'
    });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message || 'Signature verification failed.' });
  }
});

// 3. POST /api/payments/webhook (Razorpay Server-to-Server Webhook)
router.post('/webhook', async (req: Request, res: Response): Promise<void> => {
  try {
    const signature = req.headers['x-razorpay-signature'] as string;
    const rawBody = JSON.stringify(req.body);

    if (env.NODE_ENV === 'production') {
      const expectedSignature = crypto
        .createHmac('sha256', env.RAZORPAY_KEY_SECRET)
        .update(rawBody)
        .digest('hex');

      if (expectedSignature !== signature) {
        res.status(400).json({ error: 'Invalid webhook signature.' });
        return;
      }
    }

    const event = req.body.event;
    // Process webhook events
    if (event === 'payment.captured') {
      const paymentEntity = req.body.payload.payment.entity;
      await prisma.payment.updateMany({
        where: { razorpayOrderId: paymentEntity.order_id },
        data: { status: 'CAPTURED', razorpayPaymentId: paymentEntity.id }
      });
    }

    res.json({ status: 'ok' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
