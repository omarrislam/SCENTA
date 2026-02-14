---

description: "Task list for SCENTA frontend implementation"
---

# Tasks: SCENTA Frontend

**Input**: Design documents from `/specs/001-scenta-frontend/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: The examples below include test tasks. Tests are REQUIRED unless explicitly waived in the feature specification.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/`, `tests/` at repository root
- **Web app**: `backend/src/`, `frontend/src/`
- **Mobile**: `api/src/`, `ios/src/` or `android/src/`
- Paths shown below assume single project - adjust based on plan.md structure

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Create project structure per implementation plan in `src/` and `tests/`
- [x] T002 Initialize TypeScript + React tooling and Vite config
- [x] T003 [P] Configure linting, formatting, and type checking
- [x] T004 [P] Configure test runners (unit/integration/e2e)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**CRITICAL**: No user story work can begin until this phase is complete

- [x] T005 Setup routing shell and layouts in `src/app/` and `src/routes/`
- [x] T006 [P] Implement design tokens and base styles in `src/styles/`
- [x] T007 [P] Setup i18n and RTL/LTR switching in `src/i18n/`
- [x] T008 [P] Implement API client and error handling in `src/services/`
- [x] T009 Implement auth guards for protected routes in `src/app/`
- [x] T010 [P] Setup shared UI components in `src/components/`
- [x] T011 Implement toast and inline error patterns in `src/components/`
- [x] T012 [P] Configure SEO utilities in `src/app/seo/`

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Discover Products (Priority: P1) MVP

**Goal**: Browse, search, filter, and view product details with a premium UI

**Independent Test**: Navigate home, shop, filters, and product detail to verify UX

### Tests for User Story 1 (REQUIRED unless waived) ⚠️

- [x] T013 [P] [US1] Integration test for shop filters and sorting in `tests/integration/shop-filters.spec.ts`
- [x] T014 [P] [US1] Integration test for product detail flow in `tests/integration/product-detail.spec.ts`
- [x] T015 [P] [US1] Unit tests for product card and gallery in `tests/unit/product-components.test.ts`

### Implementation for User Story 1

- [x] T016 [P] [US1] Build home page sections in `src/routes/home/`
- [x] T017 [P] [US1] Build shop listing and filter UI in `src/routes/shop/`
- [x] T018 [P] [US1] Implement product card + quick actions in `src/components/product/`
- [x] T019 [US1] Implement product detail page in `src/routes/product/`
- [x] T020 [US1] Implement reviews list and rating display in `src/storefront/reviews/`
- [x] T021 [US1] Add SEO metadata for product and collection pages in `src/app/seo/`

**Checkpoint**: User Story 1 fully functional and testable independently

---

## Phase 4: User Story 2 - Purchase Flow (Priority: P2)

**Goal**: Cart and checkout with stock validation and payment options

**Independent Test**: Add to cart, checkout steps, and order confirmation

### Tests for User Story 2 (REQUIRED unless waived) ⚠️

- [x] T022 [P] [US2] Integration test for cart updates in `tests/integration/cart.spec.ts`
- [x] T023 [P] [US2] E2E test for checkout flow in `tests/e2e/checkout.spec.ts`

### Implementation for User Story 2

- [x] T024 [P] [US2] Implement cart state and persistence in `src/storefront/cart/`
- [x] T025 [US2] Build cart page UI in `src/routes/cart/`
- [x] T026 [US2] Build checkout steps UI in `src/routes/checkout/`
- [x] T027 [US2] Integrate payment options UI in `src/storefront/payments/`
- [x] T028 [US2] Implement order confirmation view in `src/routes/order-confirmation/`

**Checkpoint**: Purchase flow works independently

---

## Phase 5: User Story 3 - Account and Orders (Priority: P3)

**Goal**: Authentication, account profile, orders, and wishlist

**Independent Test**: Sign in, view orders, and manage wishlist

### Tests for User Story 3 (REQUIRED unless waived) ⚠️

- [x] T029 [P] [US3] Integration test for login and account access in `tests/integration/account-auth.spec.ts`
- [x] T030 [P] [US3] Integration test for wishlist actions in `tests/integration/wishlist.spec.ts`

### Implementation for User Story 3

- [x] T031 [P] [US3] Build auth routes in `src/routes/auth/`
- [x] T032 [US3] Build account profile and orders pages in `src/routes/account/`
- [x] T033 [US3] Implement wishlist UI in `src/routes/account/wishlist/`
- [x] T034 [US3] Implement order detail page in `src/routes/account/orders/`

**Checkpoint**: Account and orders features work independently

---

## Phase 6: User Story 4 - Admin Catalog and Orders (Priority: P4)

**Goal**: Admin tools for product, inventory, and order management

**Independent Test**: Create product, edit inventory, update order status

### Tests for User Story 4 (REQUIRED unless waived) ⚠️

- [x] T035 [P] [US4] Integration test for admin product CRUD in `tests/integration/admin-products.spec.ts`
- [x] T036 [P] [US4] Integration test for admin orders in `tests/integration/admin-orders.spec.ts`

### Implementation for User Story 4

- [x] T037 [P] [US4] Build admin layout and navigation in `src/admin/layout/`
- [x] T038 [US4] Implement products CRUD UI in `src/admin/products/`
- [x] T039 [US4] Implement inventory adjustments UI in `src/admin/inventory/`
- [x] T040 [US4] Implement orders list and detail in `src/admin/orders/`
- [x] T041 [US4] Implement customers list and detail in `src/admin/customers/`

**Checkpoint**: Admin core workflows are functional

---

## Phase 7: User Story 5 - Content, Pages, and Quiz (Priority: P5)

**Goal**: Content pages, blog, quiz, and admin content management

**Independent Test**: View blog post, static page, and quiz results

### Tests for User Story 5 (REQUIRED unless waived) ⚠️

- [x] T042 [P] [US5] Integration test for blog routes in `tests/integration/blog.spec.ts`
- [x] T043 [P] [US5] Integration test for quiz flow in `tests/integration/quiz.spec.ts`

### Implementation for User Story 5

- [x] T044 [P] [US5] Build blog list and post routes in `src/routes/blog/`
- [x] T045 [P] [US5] Build static pages by slug in `src/routes/pages/`
- [x] T046 [US5] Build quiz flow in `src/routes/quiz/`
- [x] T047 [P] [US5] Implement admin blog and pages UI in `src/admin/content/`
- [x] T048 [P] [US5] Implement coupons and collections UI in `src/admin/marketing/`
- [x] T049 [US5] Implement theme editor UI in `src/admin/theme/`

**Checkpoint**: Content and quiz features are functional

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T050 [P] Accessibility audit and fixes across routes
- [x] T051 [P] Performance pass for core routes (LCP/INP/CLS budgets)
- [x] T052 [P] Visual regression checks for RTL/LTR parity
- [x] T053 Documentation updates in `specs/001-scenta-frontend/quickstart.md`
- [x] T054 Code cleanup and refactoring

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 -> P2 -> P3 -> P4 -> P5)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Builds on cart UI from US1
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - Requires auth patterns
- **User Story 4 (P4)**: Can start after Foundational (Phase 2) - Independent admin UI
- **User Story 5 (P5)**: Can start after Foundational (Phase 2) - Content and quiz UI

### Within Each User Story

- Tests MUST be written and FAIL before implementation
- Models before services
- Services before routes
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, all user stories can start in parallel (if team capacity allows)
- All tests for a user story marked [P] can run in parallel
- Different user stories can be worked on in parallel by different team members

---

## Parallel Example: User Story 1

```bash
# Launch all tests for User Story 1 together:
Task: "Integration test for shop filters and sorting in tests/integration/shop-filters.spec.ts"
Task: "Integration test for product detail flow in tests/integration/product-detail.spec.ts"
Task: "Unit tests for product card and gallery in tests/unit/product-components.test.ts"

# Launch all UI pieces for User Story 1 together:
Task: "Build home page sections in src/routes/home/"
Task: "Build shop listing and filter UI in src/routes/shop/"
Task: "Implement product card + quick actions in src/components/product/"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational -> Foundation ready
2. Add User Story 1 -> Test independently -> Deploy/Demo (MVP)
3. Add User Story 2 -> Test independently -> Deploy/Demo
4. Add User Story 3 -> Test independently -> Deploy/Demo
5. Add User Story 4 -> Test independently -> Deploy/Demo
6. Add User Story 5 -> Test independently -> Deploy/Demo

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1
   - Developer B: User Story 2
   - Developer C: User Story 3
   - Developer D: User Story 4
   - Developer E: User Story 5
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
