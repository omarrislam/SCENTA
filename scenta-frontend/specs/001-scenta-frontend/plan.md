# Implementation Plan: SCENTA Frontend

**Branch**: `[001-scenta-frontend]` | **Date**: 2026-01-17 | **Spec**: specs/001-scenta-frontend/spec.md
**Input**: Feature specification from `/specs/001-scenta-frontend/spec.md`

## Summary

Build a frontend-only luxury storefront and admin dashboard with bilingual RTL/LTR UX,
full commerce flow, and performance-focused UI.

## Technical Context

**Language/Version**: TypeScript 5.x + React 18  
**Primary Dependencies**: React Router, React Query, i18next, Stripe Elements, Vite  
**Storage**: Browser storage (localStorage) for guest cart; backend API for persistence  
**Testing**: Vitest, React Testing Library, Playwright  
**Target Platform**: Modern web browsers (desktop + mobile)  
**Project Type**: single  
**Performance Goals**: LCP <= 2.5s p75, INP <= 200ms, CLS <= 0.1, 60 fps animations  
**Constraints**: WCAG 2.1 AA, RTL/LTR parity, EGP currency, SEO metadata  
**Scale/Scope**: ~10k products, ~1k concurrent sessions, ~30 admin screens

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Code quality: linting, formatting, and modularity requirements are defined.
- Testing: required unit/integration coverage is planned for each user story.
- UX consistency: shared components, tokens, and accessibility checks are planned.
- Performance: measurable budgets and verification steps are defined.
- Any waivers are documented with owner and rationale.

## Project Structure

### Documentation (this feature)

```text
specs/001-scenta-frontend/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
src/
├── app/                 # App shell, router, layouts
├── routes/              # Route-level pages
├── storefront/          # Storefront features
├── admin/               # Admin features
├── components/          # Shared UI components
├── hooks/               # Shared hooks
├── services/            # API clients
├── i18n/                # Localization assets and setup
├── styles/              # Tokens, themes, global styles
└── assets/              # Images, icons, fonts

public/

tests/
├── unit/
├── integration/
└── e2e/
```

**Structure Decision**: Single frontend app with route-based slices for storefront and admin,
shared components and services, and dedicated test layers.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| None | N/A | N/A |
