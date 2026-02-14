# SCENTA Production Readiness (Non-Stripe)

## Status
- Current state: **Not production-ready yet**
- Scope: non-Stripe items only

## Critical Before Launch
1. Secret hygiene
- Rotate any exposed API keys/tokens immediately.
- Move secrets to managed secret storage (not plain `.env` in repo/workstation).

2. Access control hardening
- Enforce strong admin credentials policy and MFA at identity layer.
- Remove insecure fallback admin defaults from non-API auth paths.

3. Abuse protection
- Global API rate limit enabled.
- Auth and checkout specific rate limits enabled.
- Verify reverse proxy (IP forwarding) is configured correctly in production.

4. Input validation for privileged mutations
- Validate all admin write routes with explicit schemas.
- Admin order status mutation now schema-validated.

5. Upload hardening
- Accept only image mime types for admin upload route.
- Keep file size limits and scan uploads in deployment edge if possible.

6. Monitoring and health
- `/api/health` endpoint added for liveness checks.
- Add uptime monitoring + alerting for non-200 health responses.

## Completed In This Pass
- Added global API limiter and stricter limiter headers.
- Added request ID middleware and JSON structured HTTP logs.
- Added production guard for localhost origins in CORS config.
- Added strict validation for admin order status updates.
- Added image-only upload filter for admin uploads.
- Added CI workflows for backend and frontend (`lint`, `typecheck`, `test`).

## High Priority Next
1. Logging and audit
- Ship structured logs to centralized sink.
- Alert on repeated auth failures and admin mutation anomalies.

2. Data safety
- Add periodic verified backups for MongoDB.
- Document restore drill and recovery time objective.

3. Deployment controls
- Add CI gates: lint, unit/integration tests, typecheck.
- Add protected deploy pipeline with staged rollout.

4. Security headers and TLS
- Enforce HTTPS termination at edge/load balancer.
- Confirm HSTS and secure transport policies in production ingress.

## Nice-to-Have (Post-Launch)
1. Session/device controls
- Add token revocation/blacklist strategy for critical account events.

2. Ops quality
- SLOs for API latency and error rates.
- Dashboard for order/admin endpoint health and throughput.
