import { Router } from 'express';
import { z } from 'zod';

import { prisma } from '../services/prisma.js';
import { requireAuth } from '../middleware/requireAuth.js';
import { requireTier } from '../middleware/requireTier.js';

export const coursesRouter = Router();

coursesRouter.get('/', async (_req, res) => {
  const categories = await prisma.courseCategoryModel.findMany({
    orderBy: { title: 'asc' },
    select: { id: true, title: true, slug: true }
  });

  res.json({ categories });
});

coursesRouter.get('/library', async (req, res) => {
  const categorySlug = z.string().optional().parse(req.query.category);

  const where = categorySlug
    ? {
        category: {
          slug: categorySlug
        }
      }
    : {};

  const courses = await prisma.course.findMany({
    where: where as any,
    orderBy: { title: 'asc' },
    include: {
      category: { select: { slug: true, title: true } }
    }
  });

  res.json({ courses });
});

coursesRouter.get('/:courseSlug', requireAuth, async (req, res) => {
  const course = await prisma.course.findUnique({
    where: { slug: req.params.courseSlug },
    include: {
      category: true,
      videos: { orderBy: { sortOrder: 'asc' } }
    }
  });

  if (!course) return res.status(404).json({ error: 'Course not found' });

  // Simple entitlement policy (placeholder):
  // - Getting Started/Sourcing/Financing/Legal/Management => PREMIUM
  // - Advanced => ELITE
  // - PPIC gated courses would be separate field later.
  const categoryId = course.categoryId;
  const allowedTiers = categoryId === 'ADVANCED' ? ['ELITE', 'PPIC'] : ['PREMIUM', 'ELITE', 'PPIC'];

  await requireTier(allowedTiers)(req, res, async () => {
    res.json({ course });
  });
});

coursesRouter.get('/:courseSlug/videos/:videoSlug/progress', requireAuth, async (req, res) => {
  const video = await prisma.video.findFirst({
    where: {
      slug: req.params.videoSlug,
      course: { slug: req.params.courseSlug }
    },
    select: { id: true }
  });

  if (!video) return res.status(404).json({ error: 'Video not found' });

  const prog = await prisma.userVideoProgress.findUnique({
    where: { userId_videoId: { userId: req.user!.id, videoId: video.id } }
  });

  res.json({ progress: prog ?? { positionSec: 0, completed: false } });
});

