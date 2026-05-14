import { Router } from 'express';
import Stripe from 'stripe';

import bcrypt from 'bcryptjs';
import crypto from 'node:crypto';

import { prisma } from '../services/prisma.js';
import { sendOnboardingEmail } from '../services/email.js';
import { requireEnv } from '../utils/requireEnv.js';

export const webhookRouter = Router();

const STRIPE_SECRET_KEY = requireEnv('STRIPE_SECRET_KEY');
const STRIPE_WEBHOOK_SECRET = requireEnv('STRIPE_WEBHOOK_SECRET');

const stripe = new Stripe(STRIPE_SECRET_KEY, { apiVersion: '2024-06-20' });

// Must be mounted on a route where express.json does NOT consume the body.
// We override the body parsing by using express.raw() in index.ts.
webhookRouter.post('/webhook', async (req: any, res: any) => {
  const sig = req.headers['stripe-signature'];
  console.log('[Webhook] Received request. Signature present:', !!sig);
  
  if (!sig || typeof sig !== 'string') {
    console.error('[Webhook] Missing stripe-signature header');
    return res.status(400).send('Missing stripe-signature');
  }

  const rawBody = req.body;
  console.log('[Webhook] Raw body length:', rawBody?.length);

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, STRIPE_WEBHOOK_SECRET);
    console.log('[Webhook] Event verified successfully:', event.type);
  } catch (err: any) {
    console.error('[Webhook] Signature verification failed:', err.message);
    console.error('[Webhook] Using Secret (first 5 chars):', STRIPE_WEBHOOK_SECRET.substring(0, 5) + '...');
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    const userId = session.metadata?.userId;
    const tier = session.metadata?.tier;
    const email = session.customer_details?.email || `guest_${userId}@example.com`;

    if (userId && tier && (tier === 'PREMIUM' || tier === 'ELITE')) {
      const tempPassword = crypto.randomBytes(4).toString('hex'); // 8 char hex password
      const passwordHash = await bcrypt.hash(tempPassword, 12);

      const user = await prisma.user.upsert({
        where: { id: userId },
        create: {
          id: userId,
          email,
          passwordHash,
          tier: tier as any,
          membershipActive: true
        },
        update: {
          membershipActive: true,
          email, // update email to the real one from stripe
          tier: tier as any,
          stripeCustomerId:
            typeof session.customer === 'string' ? session.customer : session.customer?.toString(),
          stripeSubscriptionId: session.subscription ?? null
        }
      });

      // Only send the temp password if we just created a new user or if they didn't have a valid password before.
      // For simplicity, we'll send it if they were previously "inactive".
      const isNewActivation = !user.membershipActive;

      await sendOnboardingEmail(userId, tempPassword);
      return res.json({ received: true });
    }
  }

  res.json({ received: true });
});

