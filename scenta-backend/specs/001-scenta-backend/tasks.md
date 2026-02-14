# Tasks: SCENTA Backend

**Input**: Design documents from `/specs/001-scenta-backend/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/

**Tests**: Tests are REQUIRED unless explicitly waived.

## Phase 1: Setup (Shared Infrastructure)

- [x] T001 Create project structure in `src/` and `tests/`
- [x] T002 Initialize Node/Express + TypeScript config
- [x] T003 [P] Configure linting, formatting, and env management
- [x] T004 [P] Configure test runners (unit/integration)

---

## Phase 2: Foundational (Blocking Prerequisites)

- [x] T005 Implement database connection and config loader
- [x] T006 [P] Create base error handling and response schema
- [x] T007 [P] Implement auth middleware (JWT + roles)
- [x] T008 [P] Add request validation framework (Zod)
- [x] T009 [P] Add rate limiting for auth and checkout routes
- [x] T010 Setup routing and controller structure
- [x] T011 Add logging and audit hooks for admin actions

---

## Phase 3: User Story 1 - Catalog (P1)

### Tests
- [x] T012 [P] Integration test for product list filters in `tests/integration/products.spec.ts`
- [x] T013 [P] Integration test for product detail in `tests/integration/product-detail.spec.ts`

### Implementation
- [x] T014 [P] Build Product model in `src/models/Product.ts`
- [x] T015 [P] Build Collection model in `src/models/Collection.ts`
- [x] T016 [P] Add catalog routes/controllers in `src/routes/catalog.ts`
- [x] T017 [P] Implement filtering and pagination in `src/services/catalogService.ts`

---

## Phase 4: User Story 2 - Checkout and Orders (P2)

### Tests
- [x] T018 [P] Integration test for checkout validation in `tests/integration/checkout.spec.ts`
- [x] T019 [P] Integration test for order creation in `tests/integration/orders.spec.ts`

### Implementation
- [x] T020 [P] Build Order model in `src/models/Order.ts`
- [x] T021 [P] Implement checkout validation in `src/services/checkoutService.ts`
- [x] T022 [P] Add Stripe intent creation in `src/services/paymentService.ts`
- [x] T023 [P] Implement orders routes/controllers in `src/routes/orders.ts`

---

## Phase 5: User Story 3 - Admin Operations (P3)

### Tests
- [x] T024 [P] Integration test for admin products CRUD in `tests/integration/admin-products.spec.ts`
- [x] T025 [P] Integration test for admin orders status in `tests/integration/admin-orders.spec.ts`

### Implementation
- [x] T026 [P] Add admin product routes/controllers in `src/routes/admin/products.ts`
- [x] T027 [P] Add inventory adjustment endpoint in `src/routes/admin/inventory.ts`
- [x] T028 [P] Add admin orders routes/controllers in `src/routes/admin/orders.ts`
- [x] T029 [P] Add admin customers endpoint in `src/routes/admin/customers.ts`

---

## Phase 6: User Story 4 - Reviews, Wishlist, Back-in-Stock (P4)

### Tests
- [x] T030 [P] Integration test for reviews endpoints in `tests/integration/reviews.spec.ts`
- [x] T031 [P] Integration test for wishlist toggle in `tests/integration/wishlist.spec.ts`

### Implementation
- [x] T032 [P] Build Review model in `src/models/Review.ts`
- [x] T033 [P] Build BackInStockSubscription model in `src/models/BackInStock.ts`
- [x] T034 [P] Add review routes/controllers in `src/routes/reviews.ts`
- [x] T035 [P] Add wishlist routes/controllers in `src/routes/wishlist.ts`
- [x] T036 [P] Add back-in-stock routes/controllers in `src/routes/backInStock.ts`

---

## Phase 7: User Story 5 - Content and Theme (P5)

### Tests
- [x] T037 [P] Integration test for CMS endpoints in `tests/integration/content.spec.ts`

### Implementation
- [x] T038 [P] Add blog/page models in `src/models/Content.ts`
- [x] T039 [P] Add theme config model in `src/models/ThemeConfig.ts`
- [x] T040 [P] Add CMS routes/controllers in `src/routes/admin/content.ts`
- [x] T041 [P] Add theme routes/controllers in `src/routes/admin/theme.ts`

---

## Phase 8: Polish & Cross-Cutting

- [x] T042 [P] Add response compression and caching headers
- [x] T043 [P] Add security headers and CORS policy
- [x] T044 [P] Documentation updates in `specs/001-scenta-backend/quickstart.md`
- [x] T045 [P] Performance checks for catalog endpoints
