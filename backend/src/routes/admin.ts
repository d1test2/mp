import { Router } from 'express';
import { prisma } from '../services/prisma.js';
import { requireAuth } from '../middleware/requireAuth.js';
import { requireRole } from '../middleware/requireRole.js';

export const adminRouter = Router();

adminRouter.use(requireAuth);
adminRouter.use(requireRole('ADMIN'));

adminRouter.get('/users', async (_req, res) => {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    select: { id: true, email: true, role: true, tier: true, membershipActive: true, createdAt: true }
  });

  res.json({ users });
});

adminRouter.patch('/users/:id/tier', async (req, res) => {
  const tier = req.body?.tier;
  if (!['PREMIUM', 'ELITE', 'PPIC'].includes(tier)) return res.status(400).json({ error: 'Invalid tier' });

  const user = await prisma.user.update({
    where: { id: req.params.id },
    data: { tier, membershipActive: tier === 'PPIC' ? true : true }
  });

  res.json({ user });
});

