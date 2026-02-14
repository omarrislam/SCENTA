# Data Model: SCENTA Frontend

**Date**: 2026-01-17
**Source Spec**: specs/001-scenta-frontend/spec.md

## Entities

### Product
- Fields: id, slug, name, description, notes, flags (new, featured, bestSeller), status, seo
- Relationships: has many Variants, has many Images, belongs to Collections, has many Reviews

### Variant
- Fields: id, sku, size, price, compareAtPrice, stock
- Relationships: belongs to Product

### Collection
- Fields: id, slug, title, description, image, type (manual or smart)
- Relationships: has many Products

### Review
- Fields: id, productId, rating, title, body, isHidden, createdAt
- Relationships: belongs to Product, belongs to Customer

### Cart
- Fields: id, userId (optional), currency, subtotal, total
- Relationships: has many CartItems

### CartItem
- Fields: id, productId, variantId, quantity, unitPrice
- Relationships: belongs to Cart

### Order
- Fields: id, orderNumber, status, totals, paymentMethod, createdAt
- Relationships: has many OrderItems, belongs to Customer, has ShippingAddress

### OrderItem
- Fields: id, productId, variantId, quantity, unitPrice
- Relationships: belongs to Order

### Customer
- Fields: id, name, email, phone, locale
- Relationships: has many Orders, has many Addresses, has many WishlistItems

### Address
- Fields: id, type (shipping/billing), line1, line2, city, region, postalCode, country
- Relationships: belongs to Customer

### WishlistItem
- Fields: id, productId, createdAt
- Relationships: belongs to Customer

### Coupon
- Fields: id, code, type, value, usageLimit, startsAt, endsAt, status
- Relationships: applies to Orders

### BlogPost
- Fields: id, slug, title, body, excerpt, coverImage, status, seo

### Page
- Fields: id, slug, title, body, status, seo

### ThemeSection
- Fields: id, type, content, order, isVisible

### QuizQuestion
- Fields: id, prompt, options, order

### QuizResult
- Fields: id, summary, recommendedProductIds, rationale

### AdminUser
- Fields: id, name, email, role

## State Transitions

- Order status: pending -> paid -> fulfilled -> completed (with cancel/refund paths)
- Coupon status: draft -> active -> expired
- Product status: draft -> published -> archived

## Validation Rules

- Slugs are unique for products, collections, pages, and blog posts.
- Stock cannot be negative.
- Reviews with isHidden=true are excluded from rating aggregates.
- Coupon usage cannot exceed usageLimit.
