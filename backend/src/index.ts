import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';

import { prisma } from './services/prisma.js';
import { authRouter } from './routes/auth.js';
import { coursesRouter } from './routes/courses.js';
import { stripeCheckoutRouter } from './routes/stripeCheckout.js';
import { webhookRouter } from './routes/stripeWebhook.js';
import { adminRouter } from './routes/admin.js';
import { chatRouter } from './routes/chat.js';


dotenv.config();

const app = express();

// Stripe webhook must receive RAW body for signature verification.
app.use('/api/stripe/webhook', express.raw({ type: 'application/json' }));

app.use(cors({ origin: process.env.CORS_ORIGIN ?? '*', credentials: true }));
app.use(morgan('dev'));

app.use(express.json({ limit: '2mb' }));

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Too many requests, please try again later.',
  })
);

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

app.use('/api/auth', authRouter);
app.use('/api/courses', coursesRouter);
app.use('/api/stripe', stripeCheckoutRouter);
app.use('/api/stripe', webhookRouter);
app.use('/api/admin', adminRouter);
app.use('/api/chat', chatRouter);


async function ensureSeeded() {
  console.log('[System] Verifying system data...');

  const categories = [
    { id: 'GETTING_STARTED', title: 'Getting Started', slug: 'getting-started' },
    { id: 'SOURCING', title: 'Property Sourcing', slug: 'sourcing' },
    { id: 'FINANCING', title: 'Financing Deals', slug: 'financing' },
    { id: 'LEGAL', title: 'Legal & Compliance', slug: 'legal' },
    { id: 'MANAGEMENT', title: 'Property Management', slug: 'management' },
    { id: 'ADVANCED', title: 'Advanced Strategies', slug: 'advanced' },
  ];
  
  for (const cat of categories) {
    await prisma.courseCategoryModel.upsert({
      where: { id: cat.id },
      update: cat,
      create: cat,
    });
  }

  // Ensure Default Course exists
  const introCourse = await prisma.course.upsert({
    where: { slug: 'intro-to-academy' },
    update: {
      title: 'Introduction to The Academy',
      description: 'Learn the basics of our platform and how to navigate the courses.',
      categoryId: 'GETTING_STARTED',
    },
    create: {
      title: 'Introduction to The Academy',
      slug: 'intro-to-academy',
      description: 'Learn the basics of our platform and how to navigate the courses.',
      categoryId: 'GETTING_STARTED',
    }
  });

  // Ensure Intro Video exists
  await prisma.video.upsert({
    where: { id: 'video-intro' },
    update: {
      courseId: introCourse.id,
      title: 'Welcome to the Academy',
      videoUrl: 'https://youtu.be/NnA4P4ypNeQ',
      sortOrder: 0,
    },
    create: {
      id: 'video-intro',
      courseId: introCourse.id,
      title: 'Welcome to the Academy',
      slug: 'welcome',
      videoUrl: 'https://youtu.be/NnA4P4ypNeQ',
      sortOrder: 0,
      transcript: 'Welcome to the Premier Property Academy. We are excited to have you here.',
    },
  });

  // Seed Admin
  const adminEmail = 'admin@premierproperty.com';
  const bcrypt = await import('bcryptjs').then(m => m.default);
  const adminPasswordHash = await bcrypt.hash('admin123', 12);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      passwordHash: adminPasswordHash,
      role: 'ADMIN',
      membershipActive: true
    },
    create: {
      email: adminEmail,
      passwordHash: adminPasswordHash,
      role: 'ADMIN',
      membershipActive: true,
      tier: 'PPIC'
    }
  });

  console.log('[System] Data verification complete.');
}

const port = Number(process.env.PORT ?? 4000);
app.listen(port, async () => {
  await ensureSeeded().catch(err => console.error('Auto-seed failed:', err));
  console.log(`Backend listening on http://localhost:${port}`);
});
