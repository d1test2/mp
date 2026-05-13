# PPAMP (Project scaffold)

Monorepo scaffold:
- `backend/` Node.js + Express + PostgreSQL (Prisma)
- `frontend/` React + Tailwind

## Local dev

### Backend
1. Create `.env` from `backend/.env.example`
2. Install deps:
   - `cd backend && npm i`
3. Run migrations:
   - `npx prisma migrate dev --name init`
4. Start:
   - `npm run dev`

### Frontend
1. Install deps:
   - `cd frontend && npm i`
2. Start:
   - `npm run dev`

