# Research Summary: SCENTA Frontend

**Date**: 2026-01-17
**Source Spec**: specs/001-scenta-frontend/spec.md

## Decisions

### 1) React 18 + TypeScript
**Decision**: Use React 18 with TypeScript 5.x for the frontend codebase.
**Rationale**: Provides stable ecosystem, strong typing, and broad tooling support.
**Alternatives considered**: JavaScript-only React, Vue 3, Next.js.

### 2) Vite for build and dev server
**Decision**: Use Vite for local development and production builds.
**Rationale**: Fast dev server and build performance; standard for modern React apps.
**Alternatives considered**: CRA, webpack-only setups.

### 3) React Router for routing
**Decision**: Use React Router for SPA routing across storefront and admin.
**Rationale**: Mature routing features, nested routes, and code-splitting support.
**Alternatives considered**: Custom routing, other routers.

### 4) React Query for server state
**Decision**: Use React Query for data fetching and caching.
**Rationale**: Aligns with spec guidance for SWR patterns and reduces custom cache logic.
**Alternatives considered**: SWR, manual fetch + context.

### 5) i18next for localization
**Decision**: Use i18next with RTL/LTR switching.
**Rationale**: Strong community support and proven RTL handling patterns.
**Alternatives considered**: Lingui, custom localization utilities.

### 6) Stripe Elements for card UI
**Decision**: Use Stripe Elements for card payment UI and confirmations.
**Rationale**: Standard card UX, PCI-friendly integration, matches spec requirements.
**Alternatives considered**: Custom card form with tokenization.

### 7) Testing stack
**Decision**: Use Vitest + React Testing Library for unit/integration, Playwright for e2e.
**Rationale**: Fast local tests and reliable browser automation for critical flows.
**Alternatives considered**: Jest, Cypress.

### 8) Styling and tokens
**Decision**: Use CSS variables for design tokens with scoped component styles.
**Rationale**: Enables consistent theming, RTL support, and minimal runtime overhead.
**Alternatives considered**: CSS-in-JS runtime libraries.
