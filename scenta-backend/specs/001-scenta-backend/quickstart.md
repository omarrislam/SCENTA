# Quickstart: SCENTA Backend

**Date**: 2026-01-17
**Spec**: specs/001-scenta-backend/spec.md

## Prerequisites

- Node.js 20.x
- npm 10.x
- MongoDB

## Environment

Create `.env` with:

```
NODE_ENV=development
PORT=4000
MONGO_URI=...
JWT_SECRET=...
JWT_EXPIRES_IN=15m
STRIPE_SECRET_KEY=...
STRIPE_WEBHOOK_SECRET=...
EMAIL_PROVIDER=console
SENDGRID_API_KEY=...
SENDGRID_FROM=orders@scenta.com
FRONTEND_URL=http://localhost:3000
```

Notes:
- `FRONTEND_URL` can be a comma-separated list for multiple origins.

## Install

```
npm install
```

## Run

```
npm run dev
```

## Test

```
npm test
```
