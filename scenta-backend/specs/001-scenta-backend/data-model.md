# Data Model: SCENTA Backend

**Date**: 2026-01-17
**Source Spec**: specs/001-scenta-backend/spec.md

## Entities

### User
- Fields: email, passwordHash, name, role, wishlist, resetPasswordToken, resetPasswordExpires
- Relationships: has many Orders, Reviews

### Product
- Fields: slug, title, description, notes, flags, images, variants, seo, status
- Relationships: belongs to Collections, has many Reviews

### Collection
- Fields: slug, title, description, type, rules, productIds, image
- Relationships: has many Products

### Cart
- Fields: userId, items (productId, variantKey, qty)

### Order
- Fields: orderNumber, userId, status, items snapshot, shipping, payment, totals, coupon
- Relationships: belongs to User

### Review
- Fields: productId, userId, rating, title, body, status, isVerifiedPurchase
- Relationships: belongs to Product and User

### BackInStockSubscription
- Fields: userId, productId, variantKey, email, status

### BlogPost
- Fields: slug, title, content, status, seo, featuredImage

### Page
- Fields: slug, title, content, status, seo

### ThemeConfig
- Fields: locale, homeSections

## State Transitions

- Order: pending -> paid -> fulfilled -> completed (cancel/refund paths)
- Review: pending -> published -> hidden
- Product: draft -> published

## Validation Rules

- Slugs are unique.
- Stock cannot be negative.
- Coupons enforce usage limits and date windows.
