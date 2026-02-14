# Quickstart: SCENTA Frontend

**Date**: 2026-01-17
**Spec**: specs/001-scenta-frontend/spec.md

## Prerequisites

- Node.js 20.x
- npm 10.x

## Environment

Create `.env.local` with:

```
VITE_API_BASE_URL=http://localhost:4000/api
VITE_STRIPE_PUBLISHABLE_KEY=your_key_here
VITE_DEFAULT_LOCALE=en
VITE_SUPPORTED_LOCALES=ar,en
VITE_ADMIN_EMAIL=admin@scenta.com
VITE_ADMIN_PASSWORD=admin123
```

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
npm run lint
npm test
npm run test:e2e
```

## Notes

- Default locale is Arabic (RTL); switch to English to verify LTR parity.
- Verify key routes: /, /shop, /product/:slug, /cart, /checkout, /admin.
