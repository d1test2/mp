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

dotenv.config();

const app = express();

// Stripe webhook must receive RAW body for signature verification.
// This MUST come before express.json()
app.use('/api/stripe/webhook', express.raw({ type: 'application/json' }));

app.use(cors({ origin: process.env.CORS_ORIGIN ?? '*', credentials: true }));
app.use(morgan('dev'));

// Parse JSON for all other routes.
app.use(express.json({ limit: '2mb' }));

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Too many requests, please try again later.',
  })
);

// Health check
app.get('/health', (_req, res) => res.json({ status: 'ok' }));

// API Routes
app.use('/api/auth', authRouter);
app.use('/api/courses', coursesRouter);
app.use('/api/stripe', stripeCheckoutRouter);
app.use('/api/stripe', webhookRouter);
app.use('/api/admin', adminRouter);

async function ensureSeeded() {
  const count = await prisma.courseCategoryModel.count();
  
  if (count === 0) {
    console.log('Database empty. Running initial seed...');
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

    const course = await prisma.course.create({
      data: {
        title: 'Introduction to PPAMP',
        slug: 'intro-to-ppamp',
        description: 'Learn the basics of our platform and how to navigate the courses.',
        categoryId: 'GETTING_STARTED',
      }
    });

    await prisma.video.create({
      data: {
        id: 'video-intro',
        courseId: course.id,
        title: 'Welcome to the Academy',
        slug: 'welcome',
        videoUrl: 'https://youtu.be/NnA4P4ypNeQ',
        sortOrder: 0,
        transcript: 'Welcome to the Premier Property Academy. We are excited to have you here.',
      },
    });
  }

  // Seed/Update default admin
  const adminEmail = 'admin@ppamp.com';
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

  console.log('Auto-seed complete.');
}

const port = Number(process.env.PORT ?? 4000);
app.listen(port, async () => {
  await ensureSeeded().catch(err => console.error('Auto-seed failed:', err));
  console.log(`Backend listening on http://localhost:${port}`);
});
