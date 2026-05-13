import { Router } from 'express';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { prisma } from '../services/prisma.js';
import { requireAuth } from '../middleware/requireAuth.js';

const JWT_SECRET = process.env.JWT_SECRET ?? 'dev_secret_change_me';

export const authRouter = Router();

authRouter.post('/register', async (req, res) => {
  const bodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(8)
  });

  const parsed = bodySchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const { email, password } = parsed.data;
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return res.status(409).json({ error: 'Email already registered' });

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: {
      email,
      passwordHash
    }
  });

  const token = jwt.sign({ sub: user.id, role: user.role, tier: user.tier }, JWT_SECRET, {
    expiresIn: '7d'
  });

  res.status(201).json({ token });
});

authRouter.post('/login', async (req, res) => {
  const bodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(1)
  });

  const parsed = bodySchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const { email, password } = parsed.data;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

  const token = jwt.sign({ sub: user.id, role: user.role, tier: user.tier }, JWT_SECRET, {
    expiresIn: '7d'
  });

  res.json({ token });
});

authRouter.post('/change-password', requireAuth, async (req, res) => {
  const bodySchema = z.object({
    currentPassword: z.string().min(1),
    newPassword: z.string().min(8)
  });

  const parsed = bodySchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const { currentPassword, newPassword } = parsed.data;

  const userId = req.user!.id;
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return res.status(404).json({ error: 'User not found' });

  const ok = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!ok) return res.status(401).json({ error: 'Invalid current password' });

  const passwordHash = await bcrypt.hash(newPassword, 12);
  await prisma.user.update({ where: { id: userId }, data: { passwordHash } });

  res.json({ ok: true });
});

