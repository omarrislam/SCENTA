<!--
Sync Impact Report
- Version change: N/A (template) -> 0.1.0
- Modified principles:
  - [PRINCIPLE_1_NAME] -> I. Code Quality and Maintainability
  - [PRINCIPLE_2_NAME] -> II. Test Standards (NON-NEGOTIABLE)
  - [PRINCIPLE_3_NAME] -> III. UX Consistency and Accessibility
  - [PRINCIPLE_4_NAME] -> IV. Performance Budgets and Verification
  - [PRINCIPLE_5_NAME] -> V. Regression Prevention and Review Discipline
- Added sections: None
- Removed sections: None
- Templates requiring updates:
  - .specify/templates/plan-template.md: updated
  - .specify/templates/spec-template.md: updated
  - .specify/templates/tasks-template.md: updated
- Follow-up TODOs:
  - TODO(RATIFICATION_DATE): adoption date not provided
-->
# SCENTA Frontend Constitution

## Core Principles

### I. Code Quality and Maintainability
- Code MUST be readable, modular, and follow the agreed linting and formatting rules.
- Public APIs and shared components MUST be documented at the point of use.
- Avoid hidden complexity: prefer small functions, clear naming, and explicit data flow.
- Refactors MUST keep behavior identical unless the spec explicitly changes it.
Rationale: Maintainable code reduces regressions and speeds delivery.

### II. Test Standards (NON-NEGOTIABLE)
- Every feature or bug fix MUST include tests that cover the new behavior.
- Unit tests cover core logic; integration tests cover user-critical flows.
- Tests MUST be deterministic and fast enough to run in CI on every PR.
- A change that cannot be tested MUST be redesigned or explicitly waived in the spec.
Rationale: Tests are the primary safety net for rapid iteration.

### III. UX Consistency and Accessibility
- UI changes MUST use shared design tokens and components unless a spec exception exists.
- Interactions, copy tone, and visual hierarchy MUST match established patterns.
- All user-facing UI MUST meet WCAG 2.1 AA accessibility expectations.
- Visual regressions MUST be prevented with review, snapshots, or documented checks.
Rationale: Consistent UX builds trust and reduces support cost.

### IV. Performance Budgets and Verification
- Each feature spec MUST define measurable performance targets and budgets.
- UI must remain responsive under expected load; avoid long main-thread tasks.
- Performance regressions MUST be measured and corrected before release.
- Defer non-critical work, optimize assets, and cache where appropriate.
Rationale: Performance is a user-facing feature, not an afterthought.

### V. Regression Prevention and Review Discipline
- All PRs MUST state UX impact, testing evidence, and performance impact.
- Risky changes require extra review and a rollback plan.
- Breaking behavior changes MUST be called out in the spec and release notes.
Rationale: Disciplined reviews prevent avoidable regressions.

## Quality Gates

- Lint, type checks, and tests MUST pass before merge.
- Accessibility checks are required for any UI change.
- Performance budgets MUST be verified for relevant user flows.
- Any waiver MUST be documented in the spec with owner and rationale.

## Development Workflow and Review

- Specs must include UX consistency notes and performance targets.
- Reviews include design and engineering sign-off for UI changes.
- Merge only after checklist completion and required approvals.

## Governance

- This constitution supersedes all other practices.
- Amendments require a written proposal, team review, and version bump.
- Versioning follows semantic rules: MAJOR for removals, MINOR for additions,
  PATCH for clarifications.
- Compliance is reviewed in planning, spec, and task stages.

**Version**: 0.1.0 | **Ratified**: TODO(RATIFICATION_DATE): adoption date not provided | **Last Amended**: 2026-01-17
