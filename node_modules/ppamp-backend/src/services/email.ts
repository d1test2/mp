import sgMail from '@sendgrid/mail';

import { prisma } from './prisma.js';
import { requireEnv } from '../utils/requireEnv.js';

const SENDGRID_API_KEY = requireEnv('SENDGRID_API_KEY');

sgMail.setApiKey(SENDGRID_API_KEY);

export async function sendOnboardingEmail(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { email: true, tier: true } });
  if (!user) return;

  const msg = {
    to: user.email,
    from: process.env.SENDGRID_FROM_EMAIL ?? 'no-reply@example.com',
    subject: 'Welcome to PPAMP membership',
    text: `You're now activated for tier: ${user.tier}.\n\nLogin and start learning.`,
    html: `<p>You&#39;re now activated for <b>${user.tier}</b>.</p><p>Login and start learning.</p>`
  };

  await sgMail.send(msg as any);
}

