# TODO - Premier Property Academy (Modules + Resources + DeepSeek AI Bot)

## Step 1 — Prep
- [x] Installed `deepseek` dependency in `backend/`


## Step 2 — Prisma schema extension
- [ ] Update `backend/prisma/schema.prisma`:

  - Add `Module`
  - Add `VideoResource`
  - Add `AIChat`
  - Add `moduleId` relation to `Video`
- [ ] Add/adjust any fields required for drip tracking and membership start date

## Step 3 — Prisma migration + seed
- [ ] Run `npx prisma migrate dev --name add_modules_resources_ai_chat`
- [ ] Update `backend/src/utils/seed.ts` to create default modules and assign videos to modules

## Step 4 — Backend endpoints
- [ ] Add new routes:
  - `GET /api/courses/:courseId/modules`
  - `GET /api/videos/:videoId/resources`
  - `POST /api/chat` (DeepSeek, no OpenAI)
  - (Optional for now) `GET /api/chat/history`
- [ ] Mount new chat/modules/resources routers in `backend/src/index.ts`

## Step 5 — Drip logic
- [ ] Implement drip unlock logic:
  - Determine membership start date
  - Unlock modules/videos based on `dripDays`
- [ ] Expose drip status as needed by UI

## Step 6 — Stripe membership linkage
- [ ] Ensure webhook updates any membership start timestamp used by drip logic

## Step 7 — Frontend UI updates
- [ ] Update `frontend/src/pages/Dashboard.tsx`:
  - show current tier + membershipActive
  - show upgrade prompts
- [ ] Update `frontend/src/pages/CourseDetail.tsx`:
  - replace flat videos view with modules view
  - enforce locked/unlocked based on drip
- [ ] Add `frontend/src/components/AIChat.tsx` and integrate into dashboard/course pages

## Step 8 — Manual testing
- [ ] Test modules endpoint via browser/Postman
- [ ] Test resources endpoint via browser/Postman
- [ ] Test `POST /api/chat` using an authenticated token

## Step 9 — Deployment notes
- [ ] Add `DEEPSEEK_API_KEY` to hosting env vars
- [ ] Verify webhook + Stripe price IDs are correct

