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
    data: { tier, membershipActive: true }
  });

  res.json({ user });
});

adminRouter.post('/courses', async (req, res) => {
  const { title, description, categoryId } = req.body;
  const slug = title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
  
  const course = await prisma.course.create({
    data: { title, description, categoryId, slug }
  });
  res.json({ course });
});

adminRouter.post('/courses/:id/videos', async (req, res) => {
  const { title, videoUrl, transcript, sortOrder } = req.body;
  const slug = title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
  
  const video = await prisma.video.create({
    data: { 
      courseId: req.params.id, 
      title, 
      videoUrl, 
      transcript, 
      sortOrder: sortOrder || 0,
      slug 
    }
  });
  res.json({ video });
});

adminRouter.post('/users/:id/resend-email', async (req, res) => {
  const { sendOnboardingEmail } = await import('../services/email.js');
  await sendOnboardingEmail(req.params.id, "Please check your previous records for your password.");
  res.json({ success: true });
});
