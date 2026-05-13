# PPAMP — Implementation Checklist

## Plan Approval
- [x] Confirm monorepo scaffold (backend/ + frontend/) 

## Step 1 — Scaffold monorepo
- [ ] Create root structure: backend/, frontend/
- [ ] Add backend package + ts/js setup
- [ ] Add frontend package + React + Tailwind setup

## Step 2 — Backend foundation
- [ ] Implement Express server
- [ ] Configure PostgreSQL connection
- [ ] Add JWT auth (register/login)
- [ ] Add password hashing (bcrypt/argon2)
- [ ] Add rate limiting + validation

## Step 3 — Database schema
- [ ] Create tables for users, tiers/entitlements, courses/categories, video progress
- [ ] Add indexes
- [ ] Add migrations (Prisma recommended)

## Step 4 — Course access + progress
- [ ] Implement course library + detail endpoints
- [ ] Implement RBAC middleware
- [ ] Implement progress tracking (video position/completion)

## Step 5 — Stripe memberships
- [ ] Implement Stripe checkout session creation (Premium/Elite)
- [ ] Implement webhook handler
- [ ] Activate membership + persist tier in DB

## Step 6 — SendGrid onboarding
- [ ] Implement SendGrid email after successful activation

## Step 7 — Admin + analytics
- [ ] Admin RBAC + endpoints (users/courses/categories)
- [ ] Basic analytics endpoints

## Step 8 — Frontend pages (basic UI only)
- [ ] Landing page tier selection + checkout
- [ ] Dashboard (stats + progress)
- [ ] Course library + detail w/ player + transcript/resources placeholders
- [ ] Membership upgrade page
- [ ] Profile settings (password/email)
- [ ] Admin dashboard (basic)

## Step 9 — Local verification
- [ ] Backend run + API health check
- [ ] Frontend run + ensure API integration
- [ ] Verify webhook flow with Stripe CLI (when ready)


