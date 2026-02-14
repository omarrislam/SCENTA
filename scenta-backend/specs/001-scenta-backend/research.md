# Research Summary: SCENTA Backend

**Date**: 2026-01-17
**Source Spec**: specs/001-scenta-backend/spec.md

## Decisions

### 1) Express + TypeScript
**Decision**: Use Express with TypeScript for HTTP routing and controllers.
**Rationale**: Proven ecosystem with broad middleware support.
**Alternatives considered**: Fastify, NestJS.

### 2) Mongoose for MongoDB
**Decision**: Use Mongoose schemas for data modeling.
**Rationale**: Aligns with spec and provides schema validation.
**Alternatives considered**: Native MongoDB driver.

### 3) Zod for validation
**Decision**: Use Zod for request validation.
**Rationale**: Type-safe schemas and clear error reporting.
**Alternatives considered**: Joi, Yup.

### 4) JWT + bcrypt for auth
**Decision**: Use JWT access tokens with bcrypt hashing.
**Rationale**: Standard, secure approach.
**Alternatives considered**: Session cookies, argon2.

### 5) Stripe SDK
**Decision**: Use Stripe official SDK for payment intents and webhooks.
**Rationale**: Official support and reliable webhook handling.
**Alternatives considered**: Manual REST calls.

### 6) Testing stack
**Decision**: Use Vitest (or Jest) + Supertest for API tests.
**Rationale**: Fast feedback and HTTP test coverage.
**Alternatives considered**: Ava, Mocha.
