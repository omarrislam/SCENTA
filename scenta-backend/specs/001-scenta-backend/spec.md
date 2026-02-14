# Feature Specification: SCENTA Backend

**Feature Branch**: `[001-scenta-backend]`  
**Created**: 2026-01-17  
**Status**: Draft  
**Input**: User description: "SCENTA backend storefront and admin APIs"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Browse Catalog (Priority: P1)

As a guest or customer, I want to search, filter, and view products so I can discover fragrances.

**Why this priority**: Catalog discovery is the primary storefront flow and must be reliable.

**Independent Test**: Can be tested by requesting catalog endpoints with filters and verifying results.

**Acceptance Scenarios**:

1. **Given** query and filters, **When** I call `GET /api/products`, **Then** results are filtered and paginated.
2. **Given** a product slug, **When** I call `GET /api/products/:slug`, **Then** I receive product details.

---

### User Story 2 - Checkout and Orders (Priority: P2)

As a customer, I want to place orders with COD or Stripe so I can complete purchases.

**Why this priority**: Revenue depends on reliable checkout and order processing.

**Independent Test**: Can be tested by validating checkout, creating orders, and retrieving order history.

**Acceptance Scenarios**:

1. **Given** in-stock items, **When** I submit checkout, **Then** an order is created or a Stripe intent is issued.
2. **Given** my account, **When** I call `GET /api/orders/me`, **Then** I see my orders.

---

### User Story 3 - Admin Operations (Priority: P3)

As an admin, I want to manage products, inventory, orders, and customers so I can run operations.

**Why this priority**: Admin APIs are required for business management.

**Independent Test**: Can be tested by calling admin CRUD endpoints and verifying data changes.

**Acceptance Scenarios**:

1. **Given** admin credentials, **When** I create or edit a product, **Then** data updates persist.
2. **Given** an order, **When** I update its status, **Then** the new status is saved.

---

### User Story 4 - Reviews, Wishlist, Back-in-Stock (Priority: P4)

As a customer, I want to review products, save wishlist items, and subscribe to back-in-stock alerts.

**Why this priority**: These features improve conversion and retention.

**Independent Test**: Can be tested via review creation, wishlist toggle, and subscription endpoints.

**Acceptance Scenarios**:

1. **Given** verified purchase, **When** I post a review, **Then** it is accepted and marked.
2. **Given** a product variant, **When** I subscribe to back-in-stock, **Then** the subscription is stored.

---

### User Story 5 - Content and Theme Config (Priority: P5)

As an admin, I want to manage blog/pages and theme configuration so content stays updated.

**Why this priority**: Content can ship after commerce-critical endpoints.

**Independent Test**: Can be tested by creating and fetching blog/pages and theme configs.

**Acceptance Scenarios**:

1. **Given** admin credentials, **When** I update a page, **Then** the new content is stored.
2. **Given** a locale, **When** I fetch theme config, **Then** I receive the correct section config.

---

### Edge Cases

- Out-of-stock during checkout -> error and cart adjustment.
- Stripe payment succeeds but webhook delayed -> order marked processing.
- Coupon expired or over limit -> error response.
- Hidden reviews excluded from rating aggregates.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: API MUST expose auth endpoints for register/login/forgot/reset/me.
- **FR-002**: API MUST support catalog filtering, search, and pagination.
- **FR-003**: API MUST return product detail by slug.
- **FR-004**: API MUST support reviews CRUD per product with moderation.
- **FR-005**: API MUST support wishlist toggle and retrieval.
- **FR-006**: API MUST support checkout validation and order creation (COD + Stripe).
- **FR-007**: API MUST expose order history and detail for customers.
- **FR-008**: API MUST expose admin CRUD for products, inventory, orders, customers, coupons, collections.
- **FR-009**: API MUST expose admin content endpoints for blog/pages and theme config.
- **FR-010**: API MUST enforce role-based access for admin routes.
- **FR-011**: API MUST provide consistent JSON error schema.
- **FR-012**: API MUST validate requests and rate limit auth/checkout endpoints.

### UX and Performance Requirements

- Responses MUST be localized where content is stored per locale.
- Performance budgets MUST be defined for catalog endpoints.

### Key Entities *(include if feature involves data)*

- **User**: Customer/admin identity with roles.
- **Product**: Catalog item with variants, images, and flags.
- **Collection**: Manual/smart groupings.
- **Order**: Snapshot of customer purchase and payment.
- **Review**: Product review with moderation state.
- **Wishlist**: Saved products per user.
- **BackInStockSubscription**: Variant subscriptions.
- **BlogPost**: Content entry with SEO.
- **Page**: Static content page.
- **ThemeConfig**: Homepage sections per locale.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Catalog search and filter responses return in under 300ms p95 for 10k products.
- **SC-002**: 99% of order creations succeed without manual intervention.
- **SC-003**: Admin CRUD endpoints respond in under 500ms p95 under expected load.
- **SC-004**: All endpoints return consistent error schema for failures.
- **SC-005**: 100% of protected routes reject unauthorized access.
- **SC-006**: Checkout validation completes in under 300ms p95.
