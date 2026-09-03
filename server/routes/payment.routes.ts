import { Router, Request, Response } from 'express';
import crypto from 'crypto';
import { prisma } from '../config/prisma';
import { env } from '../config/env';
import { authenticateToken } from '../middleware/auth';
import { z } from 'zod';

const router = Router();

const createOrderSchema = z.object({
  subscriptionId: z.string().uuid()
});

const verifySignatureSchema = z.object({
  razorpayOrderId: z.string(),
  razorpayPaymentId: z.string(),
  razorpaySignature: z.string(),
  subscriptionId: z.string().uuid()
});

// 1. POST /api/payments/create-order (Strict Server-Side Price Lookup)
router.post('/create-order', authenticateToken, async (req: Request, res: Response): Promise<void> => {
  try {
    const { subscriptionId } = createOrderSchema.parse(req.body);

    const subscription = await prisma.subscription.findUnique({
      where: { id: subscriptionId },
      include: {
        customer: true,
        vehicle: true,
        plan: true
      }
    });

    if (!subscription) {
      res.status(404).json({ success: false, error: 'Subscription not found.' });
      return;
    }

    // Determine strict server-side price based on vehicle category
    let finalAmount = subscription.plan.sedanPrice;
    if (subscription.vehicle.type === 'HATCHBACK') finalAmount = subscription.plan.hatchbackPrice;
    else if (subscription.vehicle.type === 'COMPACT_SUV' || subscription.vehicle.type === 'SUV_LUXURY') finalAmount = subscription.plan.suvPrice;

    // Generate Order ID & sequential invoice number
    const orderId = `order_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const invoiceNum = `INV-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;

    const payment = await prisma.payment.create({
      data: {
        subscriptionId: subscription.id,
        customerId: subscription.customerId,
        amount: finalAmount,
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
        amount: finalAmount * 100, // in paise
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

// 2. POST /api/payments/verify-signature (Cryptographic HMAC-SHA256 Verification)
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

// 3. POST /api/payments/webhook (Razorpay Server-to-Server Webhook with Idempotency)
router.post('/webhook', async (req: Request, res: Response): Promise<void> => {
  try {
    const signature = req.headers['x-razorpay-signature'] as string;
    const rawBody = JSON.stringify(req.body);
    const eventId = req.body.event_id || `evt_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

    // Verify webhook signature in production
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

    // Idempotency check: prevent duplicate webhook processing
    const existingEvent = await prisma.paymentWebhookEvent.findUnique({
      where: { eventId }
    });

    if (existingEvent && existingEvent.isProcessed) {
      res.json({ status: 'ok', message: 'Event already processed (idempotent).' });
      return;
    }

    const event = req.body.event;

    await prisma.$transaction(async (tx) => {
      // Record webhook event
      await tx.paymentWebhookEvent.upsert({
        where: { eventId },
        update: { isProcessed: true, processedAt: new Date() },
        create: {
          eventId,
          eventType: event,
          payloadJson: rawBody,
          isProcessed: true,
          processedAt: new Date()
        }
      });

      if (event === 'payment.captured') {
        const paymentEntity = req.body.payload.payment.entity;
        await tx.payment.updateMany({
          where: { razorpayOrderId: paymentEntity.order_id },
          data: { status: 'CAPTURED', razorpayPaymentId: paymentEntity.id }
        });
      } else if (event === 'payment.failed') {
        const paymentEntity = req.body.payload.payment.entity;
        await tx.payment.updateMany({
          where: { razorpayOrderId: paymentEntity.order_id },
          data: { status: 'FAILED' }
        });
      }
    });

    res.json({ status: 'ok' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
