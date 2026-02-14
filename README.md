# SCENTA

SCENTA is a full-stack e-commerce platform for fragrance storefront and admin operations.

This repository is a monorepo with:
- `scenta-frontend`: React + Vite storefront/admin UI
- `scenta-backend`: Express + TypeScript + MongoDB API

## Repository Structure

```text
SCENTA/
  scenta-frontend/   # Customer storefront + Admin dashboard UI
  scenta-backend/    # REST API, auth, catalog, orders, admin, uploads
  PRODUCTION_READINESS.md
```

## Tech Stack

Frontend (`scenta-frontend`)
- React 18, TypeScript, Vite
- React Router, React Query
- Vitest + Testing Library, Playwright

Backend (`scenta-backend`)
- Node.js, Express, TypeScript
- MongoDB + Mongoose
- Zod validation, JWT auth
- Multer uploads, rate limiting, structured logging

## Prerequisites

- Node.js 20+
- npm 10+
- MongoDB running locally or reachable remotely

## Quick Start

### 1. Install dependencies

```bash
cd scenta-backend && npm ci
cd ../scenta-frontend && npm ci
```

### 2. Configure environment variables

Backend (`scenta-backend/.env`):

```env
NODE_ENV=development
PORT=4000
MONGO_URI=mongodb://localhost:27017/scenta
JWT_SECRET=change_me
JWT_EXPIRES_IN=15m
STRIPE_SECRET_KEY=sk_test_change
STRIPE_WEBHOOK_SECRET=whsec_change
EMAIL_PROVIDER=console
SENDGRID_API_KEY=change_me
SENDGRID_FROM=orders@scenta.com
FRONTEND_URL=http://localhost:3000
```

Frontend (`scenta-frontend/.env`):

```env
VITE_API_BASE_URL=http://localhost:4000/api
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key
```

### 3. Run backend

```bash
cd scenta-backend
npm run dev
```

API base: `http://localhost:4000/api`
Health endpoint: `http://localhost:4000/api/health`

### 4. Run frontend

```bash
cd scenta-frontend
npm run dev
```

App URL: `http://localhost:5173`

## Scripts

Backend (`scenta-backend`)
- `npm run dev`: start API in watch mode
- `npm run build`: compile TypeScript
- `npm run start`: run compiled server
- `npm run lint`: run ESLint
- `npm run typecheck`: TypeScript checks only
- `npm run test`: run Vitest tests
- `npm run seed`: seed database

Frontend (`scenta-frontend`)
- `npm run dev`: start Vite dev server
- `npm run build`: typecheck + production build
- `npm run preview`: preview production build
- `npm run lint`: run ESLint
- `npm run typecheck`: TypeScript checks only
- `npm run test`: run Vitest tests
- `npm run test:e2e`: run Playwright tests

## CI

Both projects include CI workflows:
- `scenta-backend/.github/workflows/ci.yml`
- `scenta-frontend/.github/workflows/ci.yml`

Each workflow runs lint, typecheck, and tests.

## Production Notes

Read `PRODUCTION_READINESS.md` before deployment. Current readiness work includes:
- Request ID + structured HTTP logging
- API/auth/checkout rate limits
- Admin route validation hardening
- Image upload MIME filtering
- Health endpoint for liveness checks

## Important

- Do not commit `.env` files.
- Keep secrets in secure secret storage for production.
- Stripe is present in codebase but can be disabled/ignored depending on deployment scope.
