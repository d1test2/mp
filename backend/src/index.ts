import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';

import { authRouter } from './routes/auth.js';
import { coursesRouter } from './routes/courses.js';
import { webhookRouter } from './routes/stripeWebhook.js';
import { stripeCheckoutRouter } from './routes/stripeCheckout.js';
import { adminRouter } from './routes/admin.js';
import { prisma } from './services/prisma.js';
const CourseCategory: any = {
  GETTING_STARTED: 'GETTING_STARTED',
  SOURCING: 'SOURCING',
  FINANCING: 'FINANCING',
  LEGAL: 'LEGAL',
  MANAGEMENT: 'MANAGEMENT',
  ADVANCED: 'ADVANCED'
};



const app = express();

app.set('trust proxy', 1);

app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN ?? '*', credentials: true }));
app.use(morgan('dev'));

// Stripe webhook must receive RAW body for signature verification.
// This MUST come before express.json()
app.use('/api/stripe/webhook', express.raw({ type: 'application/json' }));

// Parse JSON for all other routes.
app.use(express.json({ limit: '2mb' }));


app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 300,
    standardHeaders: true,
    legacyHeaders: false
  })
);


app.get('/api/health', (_req: any, res: any) => {
  res.json({ ok: true });
});

app.use('/api/auth', authRouter);
app.use('/api/courses', coursesRouter);
app.use('/api/stripe', stripeCheckoutRouter);
app.use('/api/stripe', webhookRouter);
app.use('/api/admin', adminRouter);



async function ensureSeeded() {
  const count = await prisma.courseCategoryModel.count();
  if (count > 0) return;

  console.log('No categories found. Auto-seeding database...');
  const categories = [
    { id: CourseCategory.GETTING_STARTED, title: 'Getting Started', slug: 'getting-started' },
    { id: CourseCategory.SOURCING, title: 'Property Sourcing', slug: 'sourcing' },
    { id: CourseCategory.FINANCING, title: 'Financing Deals', slug: 'financing' },
    { id: CourseCategory.LEGAL, title: 'Legal & Compliance', slug: 'legal' },
    { id: CourseCategory.MANAGEMENT, title: 'Property Management', slug: 'management' },
    { id: CourseCategory.ADVANCED, title: 'Advanced Strategies', slug: 'advanced' },
  ];

  for (const cat of categories) {
    await prisma.courseCategoryModel.upsert({
      where: { id: cat.id },
      update: cat,
      create: cat,
    });
  }

  const dummyCourses = [
    { title: 'Introduction to PPAMP', slug: 'intro-to-ppamp', description: 'Learn the basics of our platform and how to navigate the courses.', categoryId: CourseCategory.GETTING_STARTED },
    { title: 'Finding Your First Deal', slug: 'first-deal', description: 'Step-by-step guide to finding profitable property deals.', categoryId: CourseCategory.SOURCING },
    { title: 'Commercial Financing 101', slug: 'comm-fin-101', description: 'Master the art of financing commercial properties.', categoryId: CourseCategory.FINANCING },
    { title: 'HMO Licensing Masterclass', slug: 'hmo-masterclass', description: 'Everything you need to know about HMO licensing.', categoryId: CourseCategory.LEGAL },
    { title: 'Portfolio Optimization', slug: 'portfolio-opt', description: 'Scale your property portfolio with advanced strategies.', categoryId: CourseCategory.ADVANCED },
  ];

  for (const c of dummyCourses) {
    const course = await prisma.course.upsert({
      where: { slug: c.slug },
      update: c,
      create: c,
    });

    await prisma.video.upsert({
      where: { id: `video-${c.slug}` },
      update: {},
      create: {
        id: `video-${c.slug}`,
        courseId: course.id,
        title: `Welcome to ${c.title}`,
        slug: 'welcome',
        videoUrl: 'https://youtu.be/NnA4P4yrNeQ?si=mq3ypVcB6E0HV8j3',
        sortOrder: 0,
        transcript: 'Welcome to this course. Here we will cover all the essentials...',
      },
    });
  }
  // Seed default admin
  const adminEmail = 'admin@ppamp.com';
  const bcrypt = await import('bcryptjs').then(m => m.default);
  const adminPasswordHash = await bcrypt.hash('admin123', 12);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
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
  // eslint-disable-next-line no-console
  console.log(`Backend listening on http://localhost:${port}`);
});

