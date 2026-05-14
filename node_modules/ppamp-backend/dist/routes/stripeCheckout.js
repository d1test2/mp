import { Router } from 'express';
import Stripe from 'stripe';
import { z } from 'zod';
import { requireEnv } from '../utils/requireEnv.js';
// Guest checkout: no requireAuth.
// We'll create a user when checkout is initiated (email required).
export const stripeCheckoutRouter = Router();
const STRIPE_SECRET_KEY = requireEnv('STRIPE_SECRET_KEY');
const stripe = new Stripe(STRIPE_SECRET_KEY, { apiVersion: '2024-06-20' });
const bodySchema = z.object({
    tier: z.enum(['PREMIUM', 'ELITE']),
    userId: z.string().min(1)
});
stripeCheckoutRouter.post('/create-checkout-session', async (req, res) => {
    const parsed = bodySchema.safeParse(req.body);
    if (!parsed.success)
        return res.status(400).json({ error: parsed.error.flatten() });
    const { tier } = parsed.data;
    const premiumPriceId = requireEnv('STRIPE_PRICE_PREMIUM');
    const elitePriceId = requireEnv('STRIPE_PRICE_ELITE');
    const priceId = tier === 'PREMIUM' ? premiumPriceId : elitePriceId;
    const session = await stripe.checkout.sessions.create({
        mode: 'subscription',
        line_items: [{ price: priceId, quantity: 1 }],
        success_url: process.env.STRIPE_SUCCESS_URL ?? 'http://localhost:5173/dashboard?success=1',
        cancel_url: process.env.STRIPE_CANCEL_URL ?? 'http://localhost:5173/?canceled=1',
        metadata: {
            // guest checkout userId is injected by frontend (required)
            userId: req.body.userId,
            tier
        },
        subscription_data: {
            metadata: { tier }
        }
    });
    res.json({ url: session.url, id: session.id });
});
