# MVP Implementation Roadmap

This roadmap breaks down the work into sequential, testable phases to deliver the intelligent highlights management MVP.

## Phase 1: Foundation & Data Ingestion
- [ ] Set up Next.js 14 + TypeScript project with linting, formatting, and CI pipeline.
- [ ] Implement authentication and user management scaffolding.
- [ ] Create Kindle highlight import workflow (file upload + parsing) and manual note entry.
- [ ] Persist imported highlights and notes in a database (e.g., PostgreSQL) via Prisma ORM.
- [ ] Establish unit tests for parsing utilities, repositories, and authentication flows.
- [ ] Configure integration tests covering highlight imports and note creation via API routes.

**Exit Criteria**
- CI passes linting, type-checking, and unit tests automatically.
- Sample import file successfully populates the database in staging.
- API integration tests validate import and note creation endpoints end-to-end.

## Phase 2: Review Scheduling & Spaced Repetition Engine
- [ ] Implement spaced repetition scheduling algorithm with adjustable intervals.
- [ ] Build review queue API to surface due highlights per user.
- [ ] Track user feedback scores and update review schedule accordingly.
- [ ] Add comprehensive unit tests for scheduling logic and feedback handling.
- [ ] Add integration tests that simulate review submissions and verify schedule adjustments.

**Exit Criteria**
- All scheduling unit tests achieve >90% coverage of algorithm branches.
- Integration tests demonstrate highlights moving through the review pipeline based on feedback.

## Phase 3: Digest Generation & Notifications
- [ ] Design digest templating service producing personalized weekly summaries.
- [ ] Implement email delivery using a provider (e.g., Resend, Postmark) with environment-based configuration.
- [ ] Schedule weekly digest jobs leveraging serverless cron or queue workers.
- [ ] Provide preview endpoint/UI for upcoming digest content.
- [ ] Write unit tests for digest content assembly and email formatting helpers.
- [ ] Implement integration tests that trigger digest generation and assert email payload structure.

**Exit Criteria**
- Staging environment successfully sends test digest emails.
- Digest previews match sent content in automated snapshot tests.

## Phase 4: Insights Dashboard & Analytics
- [ ] Build dashboard surfaces for recent highlights, review performance, and streak tracking.
- [ ] Implement analytics aggregation for spaced repetition outcomes and reading sources.
- [ ] Add filtering/search across highlights and notes.
- [ ] Instrument key product events for telemetry (imports, reviews, digest engagement).
- [ ] Create UI tests (Playwright) for critical dashboard flows.
- [ ] Add data-quality checks validating analytics pipelines.

**Exit Criteria**
- Dashboard Playwright suite passes in CI.
- Analytics reports align with seeded datasets validated via automated checks.

## Phase 5: Launch Hardening & Feedback Loop
- [ ] Conduct performance profiling and optimize critical API routes.
- [ ] Harden security (rate limiting, input validation, secrets rotation, audit logging).
- [ ] Implement feature flagging to roll out spaced repetition tweaks safely.
- [ ] Collect user feedback via in-app prompts and monitor support inbox.
- [ ] Finalize production-ready documentation (runbooks, onboarding, architecture overview).
- [ ] Run load tests and chaos drills for resilience validation.

**Exit Criteria**
- Performance benchmarks meet SLOs for response time and error rate.
- Security review checklist signed off.
- Production readiness review completed with documented launch plan.
