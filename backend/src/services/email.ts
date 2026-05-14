import sgMail from '@sendgrid/mail';

import { prisma } from './prisma.js';
import { requireEnv } from '../utils/requireEnv.js';

const SENDGRID_API_KEY = requireEnv('SENDGRID_API_KEY');

sgMail.setApiKey(SENDGRID_API_KEY);

export async function sendOnboardingEmail(userId: string, tempPassword?: string) {
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { email: true, tier: true } });
  if (!user) return;

  const loginUrl = process.env.CLIENT_URL ? `${process.env.CLIENT_URL}/login` : 'http://localhost:5173/login';

  const msg = {
    to: user.email,
    from: process.env.SENDGRID_FROM_EMAIL ?? 'no-reply@example.com',
    subject: 'Welcome to PPAMP membership',
    text: `You're now activated for tier: ${user.tier}.\n\n` + 
          (tempPassword ? `Your temporary login password is: ${tempPassword}\n\n` : '') +
          `Login here: ${loginUrl}\n\nStart learning!`,
    html: `
      <p>You&#39;re now activated for <b>${user.tier}</b>.</p>
      ${tempPassword ? `<p>Your temporary login password is: <code>${tempPassword}</code></p>` : ''}
      <p><a href="${loginUrl}">Click here to login</a> and start learning.</p>
    `
  };

  await sgMail.send(msg as any);
}

