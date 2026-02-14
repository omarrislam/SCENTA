# SCENTA Frontend Specification
Version: 1.0
Scope: Frontend-only (React)
Market: Egypt (EGP)
Languages: Arabic (RTL) and English (LTR)
Brand: SCENTA (own brand only)

---

## 1) One-sentence pitch
SCENTA is a luxury/minimal Shopify-style perfume storefront with bilingual (AR/EN) UX, rich product discovery, and a full admin dashboard for catalog and order management.

---

## 2) Frontend Goals and Non-Goals

### Goals
- Premium luxury/minimal UI with smooth, tasteful animations.
- Fast, Shopify-like performance across storefront and admin.
- Full RTL/LTR support and localized content.
- Complete customer journey: browse -> product -> cart -> checkout -> order tracking.
- Admin dashboard UI to manage the business (front-end only).
- Clean separation between UI and backend APIs.

### Non-Goals
- Backend implementation, database design, or server infrastructure.
- Multi-vendor marketplace or subscriptions.

---

## 3) Roles
- Guest: browse, search, filter, view products.
- Customer: account, wishlist, reviews, checkout, order tracking.
- Admin: full dashboard access.

---

## 4) Routes and Navigation

### Storefront (Public)
- `/` Home
- `/shop` Product listing with filters
- `/collections/:slug` Collection page
- `/product/:slug` Product details
- `/quiz` Find Your Scent quiz
- `/blog` Blog listing
- `/blog/:slug` Blog post
- `/pages/:slug` Static pages (Terms, Privacy, Returns, Shipping, About, Contact)
- `/auth/login`
- `/auth/register`
- `/auth/forgot-password`
- `/auth/reset-password`

### Storefront (Customer)
- `/account`
- `/account/orders`
- `/account/orders/:orderId`
- `/account/wishlist`
- `/checkout` (requires login)
- `/cart`

### Admin
- `/admin`
- `/admin/products`
- `/admin/products/new`
- `/admin/products/:id/edit`
- `/admin/inventory`
- `/admin/orders`
- `/admin/orders/:id`
- `/admin/customers`
- `/admin/coupons`
- `/admin/collections`
- `/admin/theme` (homepage sections editor)
- `/admin/blog`
- `/admin/pages`
- `/admin/reports`

---

## 5) UI/UX Direction (Luxury / Minimal)
- Generous whitespace, premium typography, neutral palette with dark accents.
- Product photography is the hero (large images, crisp zoom).
- Required animations:
  - Page transitions (light fade/slide).
  - Product card hover (image zoom + quick actions).
  - Sticky add-to-cart on product page.
  - Skeleton loaders for product grids.
  - Micro-interactions (button press, input focus, toasts).
- Accessibility: keyboard navigation, ARIA labels, contrast compliance.
- Full RTL support for Arabic (dir switching, mirrored icons).

---

## 6) Storefront Pages (Functional Requirements)

### 6.1 Home (`/`)
- Hero banner with primary and secondary CTAs.
- Best sellers (8-12 items) with quick add/view.
- Shop by notes section (links to filtered `/shop`).
- New arrivals section.
- Quiz teaser section.
- Email signup section.
- Sections are configurable and reorderable via Theme Editor.

### 6.2 Shop (`/shop`)
- Filter sidebar (desktop) and bottom sheet (mobile).
- Debounced search input.
- Sort: featured, best sellers, new arrivals, price low/high.
- Pagination (default).
- Product cards: hover image swap, price, rating, tags, stock.
- Filters: price, gender, size, notes, season, occasion, longevity, sillage, new/best seller, in stock.
- URL reflects filters (shareable).

### 6.3 Product Details (`/product/:slug`)
- Gallery with thumbnails and smooth zoom.
- Variant selector (size 50ml/100ml).
- Add to cart, wishlist toggle, back-in-stock subscribe.
- Tabs: description, notes pyramid, specs, reviews.
- Sticky add-to-cart on scroll (desktop and mobile).

### 6.4 Cart (`/cart`)
- Line items with variant and quantity.
- Stock validation messaging.
- Upsell section (related or best sellers).
- Cart persists for logged-in users (and optionally local storage for guests).

### 6.5 Checkout (`/checkout`) - login required
- Steps: address -> shipping -> payment -> review.
- Payment methods: COD and Stripe (frontend confirmation with Stripe Elements).
- Tax included label and flat shipping fee.
- Stock revalidation prior to submission.

### 6.6 Account
- Profile basics, orders list/detail, wishlist.
- Optional: back-in-stock subscriptions list.

### 6.7 Find Your Scent Quiz (`/quiz`)
- Short questionnaire with deterministic recommendations.
- Show "Why recommended" on results.
- Optional shareable URL for results.

### 6.8 Blog and Pages
- Blog list and post pages.
- Static pages by slug.

---

## 7) Admin Dashboard (UI Requirements)

### 7.1 Admin Auth
- Role-based access and protected routes.

### 7.2 Products and Variants
- CRUD for products and variants.
- Upload multiple images and select cover image.
- Set notes, season, occasion, longevity, sillage, gender.
- Flags: New, Best seller, Featured.
- SEO fields and draft/publish status.

### 7.3 Inventory
- Stock per variant and adjustment with reason.

### 7.4 Orders
- Orders list with filters and status updates.
- COD and Stripe indicators.

### 7.5 Customers
- Customer list and profile view.

### 7.6 Coupons/Discounts
- Percentage discount and Buy X Get Y.
- Date range and usage limit controls.

### 7.7 Collections
- Manual collections with product selection.
- Optional smart collections UI (rule-based).

### 7.8 Theme Editor
- Reorder sections via drag and drop.
- Toggle section visibility and edit content.

### 7.9 Blog and Pages CMS
- Create/edit posts and pages with status control.
- Featured image and SEO fields.

### 7.10 Reports
- Sales over time and top products dashboards.

---

## 8) Data Dependencies (API Contracts)
Frontend consumes backend REST APIs and expects JSON. Key endpoints:
- Auth: `/api/auth/*`
- Catalog: `/api/products`, `/api/products/:slug`, `/api/collections/*`
- Reviews: `/api/products/:productId/reviews`
- Cart (if server-side): `/api/cart/*`
- Checkout/Orders: `/api/checkout/validate`, `/api/orders`, `/api/orders/me*`
- Payments: `/api/payments/stripe/create-intent`
- Wishlist: `/api/wishlist/*`
- Back in stock: `/api/back-in-stock/*`
- Admin: `/api/admin/*`

Frontend must handle error responses consistently (toasts, inline errors).

---

## 9) State, Caching, and Performance
- Use React Query or SWR for caching and data fetching.
- Route-level code splitting.
- Lazy-load below-the-fold sections.
- Image optimization with responsive sizes and placeholders.
- Stale-while-revalidate caching for catalog lists.
- Avoid heavy animation libraries; keep animations GPU-friendly.

---

## 10) i18n and RTL/LTR
- Use `react-i18next` (or similar).
- `dir="rtl"` for Arabic and `dir="ltr"` for English.
- Mirrored icons where needed.
- Locale-aware formatting for currency (EGP) and dates.
- Fallback language when translations are missing.

---

## 11) SEO
- Clean slugs for products, collections, blog, and pages.
- Meta title/description and OpenGraph tags.
- Robots.txt and sitemap handling on the frontend.

---

## 12) Environment Variables (Frontend)
- `VITE_API_BASE_URL=http://localhost:4000/api`
- `VITE_STRIPE_PUBLISHABLE_KEY=...`
- `VITE_DEFAULT_LOCALE=ar`
- `VITE_SUPPORTED_LOCALES=ar,en`

---

## 13) Edge Cases and Error Handling
- Out-of-stock during checkout -> show message and adjust cart.
- Stripe success but delayed webhook -> show processing state and poll order status.
- Abandoned cart email timing is backend-driven; frontend should not spam users.
- Coupon errors (expired, usage limit, minimum subtotal) -> clear UI feedback.
- Hidden reviews should not affect average rating in UI.

---

## 14) Acceptance Criteria (Frontend)
- All routes render correctly in RTL and LTR.
- Filters update listings without full reload and URL is shareable.
- Product page includes gallery, zoom, variants, wishlist, reviews, and back-in-stock.
- Checkout requires authentication and supports COD and Stripe.
- Admin dashboard supports all management workflows.
- Performance meets fast storefront expectations (optimized LCP/CLS).
