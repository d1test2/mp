import { Router } from 'express';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import crypto from 'node:crypto';

import { prisma } from '../services/prisma.js';
import { requireAuth } from '../middleware/requireAuth.js';
import { requireEnv } from '../utils/requireEnv.js';

export const chatRouter = Router();

const DEEPSEEK_API_KEY = requireEnv('DEEPSEEK_API_KEY');

// NOTE: Avoid OpenAI. Use a lightweight DeepSeek-compatible call.
// Expected API shape may vary; this implementation is structured so you can adjust the endpoint/model
// via env vars without touching DB/routes again.
const DEEPSEEK_BASE_URL = process.env.DEEPSEEK_BASE_URL ?? 'https://api.deepseek.com';
const DEEPSEEK_CHAT_PATH = process.env.DEEPSEEK_CHAT_PATH ?? '/v1/chat/completions';
const DEEPSEEK_MODEL = process.env.DEEPSEEK_MODEL ?? 'deepseek-chat';

const bodySchema = z.object({
  question: z.string().min(1).max(4000),
});

const TIER_KEYWORDS: Record<'ELITE' | 'PPIC', string[]> = {
  ELITE: ['advanced', 'analysis software', 'tax consultation', 'deal analyzer', 'slide deck', 'events'],
  PPIC: ['mentorship', 'inner circle', 'application', 'private', '1-on-1', 'exclusive'],
};

function detectSuggestedTier(question: string): 'ELITE' | 'PPIC' | null {
  const lower = question.toLowerCase();
  if (TIER_KEYWORDS.PPIC.some((k) => lower.includes(k))) return 'PPIC';
  if (TIER_KEYWORDS.ELITE.some((k) => lower.includes(k))) return 'ELITE';
  return null;
}

function buildUpgradePrompt(suggestedTier: 'ELITE' | 'PPIC', currentTier: string, membershipActive: boolean): string {
  if (membershipActive && currentTier === suggestedTier) return '';
  const prices: Record<'ELITE' | 'PPIC', string> = {
    ELITE: '£99 + VAT',
    PPIC: 'Application Only',
  };

  return `🔒 This question relates to ${suggestedTier} level content. Upgrade to ${suggestedTier} (${prices[suggestedTier]}/month) to access.`;
}

async function deepSeekChatCompletion(question: string): Promise<string> {
  const resp = await fetch(`${DEEPSEEK_BASE_URL}${DEEPSEEK_CHAT_PATH}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
    },
    body: JSON.stringify({
      model: DEEPSEEK_MODEL,
      messages: [
        {
          role: 'user',
          content: question,
        },
      ],
      temperature: 0.2,
    }),
  });

  if (!resp.ok) {
    const text = await resp.text().catch(() => '');
    throw new Error(`DeepSeek error: ${resp.status} ${text}`);
  }

  const data: any = await resp.json();
  // Try a few common fields
  const content =
    data?.choices?.[0]?.message?.content ??
    data?.choices?.[0]?.text ??
    data?.result ??
    '';

  return typeof content === 'string' ? content : JSON.stringify(content);
}

chatRouter.post('/', requireAuth, async (req: any, res: any) => {
  const parsed = bodySchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const userId = req.user.id as string;
  const question = parsed.data.question;

  // Context injection for better lecture-style answers.
  // (Kept server-side so the frontend can remain simple.)
  const jvLectureContext =
    'Joint Ventures in Property: The Complete Lecture (One Paragraph)\n\n' +
    'A Joint Venture in property is simply two or more parties coming together to complete a deal that neither could do alone—typically one party brings the capital (the silent investor) and the other brings the expertise, time, and deal-sourcing ability (the active partner). The most common structure in UK property is the 50/50 JV where the investor puts up all the money for purchase and refurbishment, the active partner finds the deal, manages the project, and handles the exit, and both split the net profit equally after all costs. Variations include the 70/30 split where the investor takes 70% if they provide both capital and a higher-risk tolerance, or the 80/20 structure often used for lease options or commercial conversions. The critical success factors are three: first, a written JV agreement that covers profit split, exit strategy, timelines, and default provisions; second, clear communication including monthly reporting from the active partner to the investor; and third, aligned incentives meaning both parties win more by working together than apart. The biggest mistake new investors make is relying on a handshake—without a legal agreement, disputes over refurbishment overruns or early exits become costly. A proper JV agreement should specify who approves major spending over a threshold (typically £500-£1,000), what happens if the project goes over budget (does the investor add more or does the active partner reduce their split), and the exact method for calculating profit (sale price minus purchase price minus all costs). For the active partner, Joint Ventures are the fastest route from zero to portfolio because you control the deal without using your own credit or savings; for the capital partner, JVs provide hands-off returns typically 8-12% annualised on their cash, far better than a savings account. To find JV partners, attend local property networking events (PINs), join Facebook groups like "UK Property JV Network," or present a "deal-in-a-box" package with the numbers, strategy, and your track record. The golden rule is never ask for money first—always lead with the deal, show the numbers, explain the exit, and let the offer of a JV come naturally. Once you complete two or three successful JVs, capital partners will start approaching you. That is when property stops being a side hustle and becomes a true business.';

  const augmentedQuestion = `\n\n${jvLectureContext}\n\nUser question: ${question}`;

  const user = await prisma.user.findUnique({

    where: { id: userId },
    select: { tier: true, membershipActive: true },
  });

  if (!user) return res.status(404).json({ error: 'User not found' });

  const suggestedTier = detectSuggestedTier(question);
  const upgradePrompt = suggestedTier
    ? buildUpgradePrompt(suggestedTier, user.tier, user.membershipActive)
    : '';

  let answer = '';
  try {
    answer = await deepSeekChatCompletion(question);
  } catch (e: any) {
    // If AI call fails, still save the question & return an error response
    // (keeps chat history intact)
    await prisma.aIChat?.create?.({
      data: {
        userId,
        question,
        answer: '',
        upgradeOffered: !!upgradePrompt,
        suggestedTier: suggestedTier as any,
      },
    }).catch(() => null);

    return res.status(502).json({ error: e?.message ?? 'DeepSeek failed' });
  }

  // Persist to DB (AIChat table may not exist yet during early rollout)
  // If AIChat model/table isn't ready, we still return the answer.
  try {
    // @ts-expect-error - AIChat may not exist in current Prisma schema
    if (prisma.aIChat?.create) {
      // @ts-expect-error - AIChat may not exist in current Prisma schema
      await prisma.aIChat.create({
        data: {
          userId,
          question,
          answer,
          upgradeOffered: !!upgradePrompt,
          suggestedTier: suggestedTier as any,
        },
      });
    }
  } catch (e) {
    console.warn('[Chat] Failed to persist AI chat history:', (e as any)?.message ?? e);
  }

  res.json({ answer, upgradePrompt: upgradePrompt || null, suggestedTier });
});


export default chatRouter;

