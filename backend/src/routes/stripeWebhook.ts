import { Router } from 'express';
import Stripe from 'stripe';

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
  if (!sig || typeof sig !== 'string') return res.status(400).send('Missing stripe-signature');

  const rawBody = req.body as any;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, STRIPE_WEBHOOK_SECRET);
  } catch (err: any) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    const userId = session.metadata?.userId;
    const tier = session.metadata?.tier;

    if (userId && tier && (tier === 'PREMIUM' || tier === 'ELITE')) {
      await prisma.user.update({
        where: { id: userId },
        data: {
          membershipActive: true,
          tier: tier as any,
          stripeCustomerId:
            typeof session.customer === 'string' ? session.customer : session.customer?.toString(),
          stripeSubscriptionId: session.subscription ?? null
        }
      });

      await sendOnboardingEmail(userId);
    }
  }

  res.json({ received: true });
});



