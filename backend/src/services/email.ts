import { Resend } from 'resend';
import { prisma } from './prisma.js';
import { requireEnv } from '../utils/requireEnv.js';

const RESEND_API_KEY = requireEnv('RESEND_API_KEY');
const resend = new Resend(RESEND_API_KEY);

export async function sendOnboardingEmail(userId: string, tempPassword?: string) {
  const user = await prisma.user.findUnique({ 
    where: { id: userId }, 
    select: { email: true, tier: true } 
  });
  
  if (!user) return;

  const loginUrl = process.env.CLIENT_URL ? `${process.env.CLIENT_URL}/login` : 'http://localhost:5173/login';
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';

  try {
    const { data, error } = await resend.emails.send({
      from: `Premier Property Academy <${fromEmail}>`,
      to: [user.email],
      subject: 'Welcome to Premier Property Academy',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #1e293b;">
          <h1 style="color: #059669;">Welcome to the Academy!</h1>
          <p>Your membership is now activated for the <b>${user.tier}</b> tier.</p>
          ${tempPassword ? `<p>Your temporary login password is: <code style="background: #f1f5f9; padding: 2px 6px; border-radius: 4px;">${tempPassword}</code></p>` : ''}
          <div style="margin-top: 30px;">
            <a href="${loginUrl}" style="background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">Access Your Dashboard</a>
          </div>
          <p style="margin-top: 30px; font-size: 14px; color: #64748b;">If you have any questions, simply reply to this email.</p>
        </div>
      `
    });

    if (error) {
      console.error('[Email] Resend error:', error);
    } else {
      console.log('[Email] Onboarding email sent via Resend:', data?.id);
    }
  } catch (err: any) {
    console.error('[Email] Failed to send email via Resend:', err.message);
  }
}
