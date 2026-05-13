import { Request, Response, NextFunction } from 'express';

export function requireTier(tiers: string[]) {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) return res.status(401).json({ error: 'Unauthenticated' });

    // membershipActive is for Stripe-activated users
    // PPIC admin-only is handled by requireRole in admin router.
    const membershipOk = req.user.tier && tiers.includes(req.user.tier);
    if (!membershipOk) return res.status(403).json({ error: 'Not entitled' });

    next();
  };
}

