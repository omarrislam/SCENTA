# SCENTA Backend Specification
Version: 1.0
Scope: Backend-only (Node/Express + MongoDB)
Market: Egypt (EGP)
Languages: Arabic (RTL) and English (LTR) content support
Brand: SCENTA (own brand only)

---

## 1) One-sentence pitch
SCENTA backend powers a luxury perfume storefront with catalog, auth, cart/checkout, orders, reviews, and a full admin suite, exposing REST APIs and integrating Stripe and COD flows.

---

## 2) Backend Goals and Non-Goals

### Goals
- Secure, scalable REST API for storefront and admin.
- Robust catalog filtering, search, and pagination.
- Reliable checkout and order processing for COD and Stripe.
- Admin capabilities for products, inventory, orders, customers, coupons, collections, CMS, and reports.
- Clear separation of concerns with validation, auth, and error handling.

### Non-Goals
- Frontend UI implementation.
- Multi-vendor marketplace or subscriptions.

---

## 3) Roles and Permissions
- Guest: read-only catalog and content.
- Customer: authenticated account, cart/checkout, wishlist, reviews, back-in-stock.
- Admin: full CRUD and reporting.

Role-based middleware required for all admin routes.

---

## 4) Data Model (MongoDB)
Use Mongoose schemas with normalized models and order snapshots.

### 4.1 User
- `_id`, `email` (unique), `passwordHash`, `name`
- `role`: `customer | admin`
- `wishlist`: `[productId + variantKey]`
- `createdAt`, `updatedAt`
- Optional: `twoFAEnabled`, `twoFASecret`, `resetPasswordToken`, `resetPasswordExpires`

### 4.2 Product
- `_id`, `slug` (unique), `title`, `description`
- `gender`: `men | women | unisex`
- `concentration`: `extrait` (constant)
- `bottleType`: `spray` (constant)
- `notes`: `{ top: [string], middle: [string], base: [string] }`
- `season`: [string], `occasion`: [string]
- `longevity`, `sillage`
- `flags`: `{ isNew, isBestSeller, isFeatured }`
- `images`: `{ url, alt, sortOrder }[]`
- `variants`: `{ key, sizeMl, price, compareAtPrice?, sku, stock, isActive }[]`
- `seo`: `{ metaTitle, metaDescription }`
- `status`: `draft | published`
- timestamps

### 4.3 Collection
- `_id`, `slug`, `title`, `description`
- `type`: `manual | smart`
- `rules` (if smart)
- `productIds` (if manual)
- `image`, timestamps

### 4.4 Cart (optional server-side)
- `_id`, `userId`, `items: [{ productId, variantKey, qty }]`
- timestamps

### 4.5 Order (snapshot)
- `_id`, `orderNumber`, `userId`, `status`
- `items`: [{ productId, productTitleSnapshot, productSlugSnapshot, variantKey, sizeMl, unitPrice, qty, imageSnapshot }]
- `shippingAddress`: { fullName, phone, city, area, street, building, notes }
- `shipping`: { method: `standard`, fee }
- `payment`: { method: `cod | stripe`, stripePaymentIntentId?, stripeStatus? }
- `totals`: { subtotal, discountTotal, shippingFee, grandTotal }
- `coupon`?: { code, type, value }
- timestamps

### 4.6 Review
- `_id`, `productId`, `userId`, `rating`, `title`, `body`
- `status`: `published | hidden | pending`
- `isVerifiedPurchase`
- timestamps

### 4.7 BackInStockSubscription
- `_id`, `userId`, `productId`, `variantKey`, `email`
- `status`: `active | notified | cancelled`
- timestamps

### 4.8 BlogPost / Page
- `slug`, `title`, `content`, `status`, `seo`, `featuredImage`, timestamps

### 4.9 ThemeConfig
- `locale`: `ar | en`
- `homeSections`: array of section configs
- timestamps

---

## 5) API Design (REST)
Principles:
- JSON responses with consistent error schema.
- JWT auth for sessions.
- Role-based middleware for admin routes.
- Request validation (zod/joi).
- Rate limiting for auth and checkout endpoints.

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout` (optional)
- `POST /api/auth/forgot-password`
- `POST /api/auth/reset-password`
- `GET /api/auth/me`

### Catalog (Public)
- `GET /api/products`
  - query params: `q, sort, page, limit, priceMin, priceMax, gender, size, notes, season, occasion, longevity, sillage, isNew, isBestSeller, inStock`
- `GET /api/products/:slug`
- `GET /api/collections`
- `GET /api/collections/:slug`

### Reviews
- `GET /api/products/:productId/reviews`
- `POST /api/products/:productId/reviews` (verified purchase check)
- `PATCH /api/admin/reviews/:id` (admin moderation)

### Cart (if server-side)
- `GET /api/cart`
- `POST /api/cart/items`
- `PATCH /api/cart/items/:itemId`
- `DELETE /api/cart/items/:itemId`

### Checkout and Orders
- `POST /api/checkout/validate`
- `POST /api/orders` (COD)
- `POST /api/payments/stripe/create-intent`
- `POST /api/payments/stripe/webhook`
- `GET /api/orders/me`
- `GET /api/orders/me/:orderId`

### Wishlist
- `GET /api/wishlist`
- `POST /api/wishlist/toggle`

### Back in Stock
- `POST /api/back-in-stock/subscribe`
- `GET /api/back-in-stock/me`
- `POST /api/admin/back-in-stock/notify`

### Admin
- `GET /api/admin/products`
- `POST /api/admin/products`
- `PATCH /api/admin/products/:id`
- `DELETE /api/admin/products/:id` (soft delete recommended)
- `PATCH /api/admin/inventory/adjust`
- `GET /api/admin/orders`
- `PATCH /api/admin/orders/:id/status`
- `GET /api/admin/customers`
- `POST /api/admin/coupons`
- `GET /api/admin/coupons`
- `PATCH /api/admin/coupons/:id`
- `POST /api/admin/collections`
- `PATCH /api/admin/collections/:id`
- `GET /api/admin/theme`
- `PATCH /api/admin/theme`
- `POST /api/admin/blog`
- `PATCH /api/admin/blog/:id`
- `POST /api/admin/pages`
- `PATCH /api/admin/pages/:id`
- `GET /api/admin/reports/sales`
- `GET /api/admin/reports/top-products`

---

## 6) Checkout and Payments

### COD
1) Validate stock and totals.
2) Create order with status `Placed`.
3) Send order confirmation email.

### Stripe
1) Create PaymentIntent with amount.
2) Frontend confirms payment.
3) Webhook verifies success.
4) Finalize order and reduce inventory.

Rules:
- Inventory reduction at finalization (Stripe success or COD order creation).
- Re-check stock at final step and fail gracefully.

---

## 7) Email System
Required emails:
- Abandoned cart.
- Order confirmation.
- Back-in-stock notification.

Provider abstraction for SendGrid/Mailgun/SES; local dev logs to console or DB.

---

## 8) Security Requirements
- Password hashing (bcrypt/argon2).
- JWT access tokens; optional refresh tokens.
- Rate limiting: `/auth/*`, `/checkout/*` strict.
- Input validation for all endpoints.
- Admin-only routes protected; audit logging for sensitive actions.
- Optional Phase 2: Admin 2FA (TOTP).

---

## 9) Performance and Indexing
- Indexed fields for filtering (slug, flags, price, notes, etc.).
- Pagination for list endpoints.
- Response compression and caching headers for public catalog endpoints.

---

## 10) Environment Variables (Backend)
- `PORT=4000`
- `MONGO_URI=...`
- `JWT_SECRET=...`
- `JWT_EXPIRES_IN=15m`
- `JWT_REFRESH_SECRET=...` (optional)
- `STRIPE_SECRET_KEY=...`
- `STRIPE_WEBHOOK_SECRET=...`
- `EMAIL_PROVIDER=console`
- `FRONTEND_URL=http://localhost:3000`

---

## 11) Edge Cases and Error Handling
- Out-of-stock during checkout -> return error and adjust cart.
- Stripe payment succeeds but webhook delayed -> order marked as `Processing` and polled by client.
- Abandoned cart email throttling (max 1 per window).
- Coupon errors (expired, usage limit, minimum subtotal).
- Reviews moderation: hidden reviews excluded from average rating.

---

## 12) Acceptance Criteria (Backend)
- All APIs respond with consistent JSON and error schema.
- Catalog filters support all required attributes and are indexed.
- Checkout supports COD and Stripe with correct inventory handling.
- Admin endpoints cover all CRUD and reporting workflows.
- Security controls (hashing, auth, role checks, rate limiting) are enforced.
