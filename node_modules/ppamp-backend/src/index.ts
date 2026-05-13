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



const app = express();

app.set('trust proxy', 1);

app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN ?? '*', credentials: true }));
app.use(morgan('dev'));

// Parse JSON by default.
app.use(express.json({ limit: '2mb' }));

// Stripe webhook must receive RAW body for signature verification.
app.use('/api/stripe/webhook', express.raw({ type: 'application/json' }));


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
app.use('/api/stripe', webhookRouter);
app.use('/api/stripe', stripeCheckoutRouter);

app.use('/api/admin', adminRouter);



const port = Number(process.env.PORT ?? 4000);
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Backend listening on http://localhost:${port}`);
});

