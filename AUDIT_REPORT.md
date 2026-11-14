# Jobryn Repository Audit Report

**Repository:** `fadedyouth987/job-wren` (canonical product: **Jobryn**)  
**Audit date:** 2026-11-14  
**Scope:** Static review of `main` plus local verification commands; **no application code was modified.**  
**Production target (per repo docs):** [jobryn.org](https://jobryn.org) via **Cloudflare** (`jobryn` Workers/Pages), Supabase, Stripe.

## Executive summary

Jobryn’s server layer shows deliberate security design: Helmet/CORS/rate limits, Supabase JWT verification, workspace membership checks, Stripe webhook signature verification with idempotent event claiming, and layered Postgres RLS migrations (`0003`–`0006`). **No live API keys or secrets were found in the tracked tree**; `scripts/security-check.mjs` passed.

The repo is **not shippable from `main` today**: `npm run typecheck` and `npm run build` fail because of a JSX syntax error on the pricing page. GitHub Actions **Jobryn CI** has been failing on recent `main` pushes for the same reason. Billing **usage entitlements are defined in SQL and TypeScript but are not enforced on API routes** (`consumeWorkspaceUsage` is never called). Starting Stripe checkout for a trial workspace without an existing Stripe customer can flip subscription status to `incomplete` and **lock the tenant out of paid-gated APIs** until webhook processing completes.

Stale **GitHub repository metadata** still describes an “AI Influencer” product (`job-wren`); in-repo docs correctly describe Jobryn and Cloudflare. There is **no Vercel configuration** in the tree (appropriate for the documented Cloudflare deployment).

## Top 5 fix-first items

1. **Repair `src/pages/PricingPage.tsx` JSX** so `typecheck` and `build` pass and CI goes green.
2. **Wire usage metering** (`consumeWorkspaceUsage` / `usage.*` entitlements) on metered actions before trusting plan limits.
3. **Fix checkout customer bootstrap** so creating a Stripe customer does not downgrade an active local trial to `incomplete` without entitlements.
4. **Resolve npm `zod` advisory** (GHSA-mrhx-c7xc-m3w5) with a planned upgrade to Zod ≥4.6.6.
5. **Update GitHub repo description/name** to match Jobryn (metadata is public and misleads operators and security reviewers).

## Severity counts

| Severity | Count |
|----------|------:|
| Critical | 0 |
| High | 6 |
| Medium | 9 |
| Low | 6 |
| Uncertain | 3 |

---

## Methodology

- Reviewed server auth (`server/supabase.ts`), security middleware (`server/security.ts`), billing/webhooks (`server/routes/billing.ts`), all API route modules, Supabase migrations, CI workflow, deployment docs, and client auth/API helpers.
- Ran: `npm install`, `npm run typecheck`, `npm run security:check`, `npm run build`, `npm audit` (no `test` script exists).
- Scanned git history for common secret patterns (`sk_live`, committed `.env`); no matches in sampled history.
- Searched for Nexus / influencer / Vercel artefacts in application source.

---

## High severity findings

### H1 — Production build and typecheck fail (Pricing page JSX)

- **File:** `src/pages/PricingPage.tsx` (line 12; Vite reports column ~3510)
- **What:** A malformed `className` string breaks JSX: `text-white>${plan.price}` — the `${plan.price}` is inside an unclosed attribute instead of a JSX expression.
- **Why it matters:** `npm run build` and CI `typecheck` fail; Cloudflare/Docker production images cannot be built from current `main`. The pricing route is broken even if manually deployed.
- **Fix:** Correct to something like `className="... text-white">{plan.price}</span>` and format the file for maintainability; re-run `npm run verify`.

### H2 — CI on `main` is red

- **File:** `.github/workflows/ci.yml`
- **What:** Recent workflow runs (e.g. push to `main`, 2026-10-04/06) concluded **failure** in ~3–4s, consistent with TypeScript/build failure from H1.
- **Why it matters:** No automated gate protects `main`; regressions ship silently if deploy hooks do not enforce CI.
- **Fix:** Fix H1; confirm Actions passes; optionally require CI on `main` in branch protection.

### H3 — Subscription usage limits are not enforced on the API

- **Files:** `server/supabase.ts` (lines 135–161); all metered route modules under `server/routes/`
- **What:** `consumeWorkspaceUsage()` exists and calls RPC `consume_workspace_usage`, but **no route imports or invokes it**. Entitlements such as `usage.sms` and `usage.ai_actions` in `server/routes/billing.ts` are never decremented server-side.
- **Why it matters:** Plan limits are cosmetic; tenants can exceed SMS/AI quotas. Undermines billing fairness and abuse resistance.
- **Fix:** Call `consumeWorkspaceUsage` (with stable idempotency keys from `idempotency-key` header) on SMS send, AI actions, and other metered operations; return 402/429 when limits exceeded.

### H4 — Checkout can revoke local trial access mid-flow

- **File:** `server/routes/billing.ts` (lines 190–205)
- **What:** When creating the first Stripe customer, `subscriptions.upsert` sets `status: 'incomplete'` without preserving `trial_ends_at` or entitlements. `requireActiveSubscription` rejects `incomplete` (`server/supabase.ts` lines 105–111).
- **Why it matters:** Owner on a 14-day local trial (see `create_workspace` in `0004_subscription_and_tenant_invariants.sql`) who starts checkout may lose API access before completing payment until webhooks run—or indefinitely if checkout is abandoned.
- **Fix:** Upsert only `stripe_customer_id`; do not downgrade `status`/`trial_ends_at` until Stripe events confirm; or treat `incomplete` with active `trial_ends_at` as allowed.

### H5 — Dependency: high-severity `zod` advisory

- **File:** `package.json` / `package-lock.json` (`zod` 3.25.x)
- **What:** `npm audit` reports **1 high** — GHSA-mrhx-c7xc-m3w5 (memory exhaustion on oversized collections).
- **Why it matters:** Attackers can send crafted payloads to any Zod-validated route to stress memory.
- **Fix:** Upgrade to `zod@^4.6.7` (breaking); run full typecheck and validation tests after migration.

### H6 — Cloudflare static build vs Express API split

- **Files:** `CLOUDFLARE_DEPLOY.md`, `wrangler.toml` (`pages_build_output_dir = "dist"`), `Dockerfile`, `server.ts`
- **What:** Docs describe Pages output as `dist` (static SPA). The API is a bundled Express app (`dist/server.cjs`) started via `npm start` / Dockerfile—not automatic on pure static Pages.
- **Why it matters:** Misconfiguration yields a working marketing SPA but **broken `/api/*`** (auth, billing, CRM), or stale API origin env in the browser.
- **Fix:** Document and enforce a single production topology (e.g. Node container/Worker with `nodejs_compat` for API + static assets, or separate API host with `APP_URL`/CORS aligned).

---

## Medium severity findings

### M1 — Stale public GitHub repository metadata (outside repo tree)

- **Location:** GitHub repo settings (`gh repo view`: description **"AI Influencer Creation & Automation Platform"**, name `job-wren`)
- **What:** Contradicts `README.md`, `PROJECT_STATE.md`, and `metadata.json` (Jobryn / revenue OS).
- **Why it matters:** Public mislabeling confuses deployers, violates PROJECT_BOUNDARIES messaging, and can trigger wrong security scoping.
- **Fix:** Rename/description in GitHub to Jobryn; align topic tags; keep `job-wren` redirect if needed.

### M2 — Supabase/Postgres errors echoed to clients

- **Files:** e.g. `server/routes/workspaces.ts` (36), `server/routes/crm.ts` (56, 89), `server/routes/intelligence.ts` (43)
- **What:** Several handlers return `message: error.message` from Supabase in JSON responses.
- **Why it matters:** Can leak schema, constraint, or RLS detail to authenticated (or sometimes anonymous) clients—aiding enumeration.
- **Fix:** Log full errors server-side; return stable `error` codes only in production.

### M3 — Unauthenticated `/api/health` configuration probe

- **File:** `server.ts` (lines 37–47)
- **What:** Public endpoint reports `databaseConfigured`, `stripeConfigured`, `aiConfigured`, release status.
- **Why it matters:** Low-cost reconnaissance for attackers sizing the attack surface.
- **Fix:** Restrict to internal networks, add auth, or reduce to `{ status: "ok" }` publicly.

### M4 — Stripe webhooks subject to global rate limit

- **Files:** `server.ts` (line 24), `server/security.ts` (lines 56–62)
- **What:** `globalRateLimit` (240 req/min/IP) applies to `/api/stripe/webhook` before signature verification path.
- **Why it matters:** Burst legitimate Stripe retries or multi-tenant event floods could hit 429 and delay billing state updates.
- **Fix:** `skip` webhook path on global limiter or use dedicated high ceiling.

### M5 — `authRateLimit` defined but unused

- **File:** `server/security.ts` (lines 64–69)
- **What:** Auth-specific limiter is never mounted on login-adjacent routes (auth is Supabase-hosted, but API still has session-dependent entry points).
- **Why it matters:** Dead security control; reviewers may assume it is active.
- **Fix:** Apply to sensitive unauthenticated or token-exchange routes, or remove to avoid false confidence.

### M6 — AI / Gemini stack not implemented despite policy and dependency

- **Files:** `package.json` (`@google/genai`), `server/env.ts`, `SECURITY.md` (AI tool layer); `server/routes/operator.ts` (regex-only commands)
- **What:** No server code calls Gemini; operator uses pattern matching, not LLM tool calling. Health still exposes `aiConfigured`.
- **Why it matters:** SECURITY.md promises allowlisted tools and approvals; product claims “AI Operator” but runtime is read-only SQL templates—future Gemini wiring must not expose keys client-side or skip metering.
- **Fix:** Implement allowlisted tool executor with `consumeWorkspaceUsage('usage.ai_actions')`, approvals table, and server-only keys; or narrow marketing/docs until live.

### M7 — `consume_workspace_usage` idempotency helper generates random keys

- **File:** `server/supabase.ts` (line 155)
- **What:** Default idempotency key is `${metricKey}:${crypto.randomUUID()}` per call—no deduplication on client retries.
- **Why it matters:** When metering is wired, double-clicks/retries can double-charge usage.
- **Fix:** Require client `Idempotency-Key` header (already allowed in CORS) and pass through unchanged.

### M8 — No automated test suite

- **File:** `package.json` (no `test` script)
- **What:** `npm test` fails; CI does not run integration or RLS regression tests.
- **Why it matters:** Multi-tenant and billing invariants in SQL are high-risk without automated checks.
- **Fix:** Add minimal API + RLS tests (e.g. vitest + test Supabase) for workspace isolation and webhook idempotency.

### M9 — Pricing page duplicate headers (maintainability / UX)

- **File:** `src/pages/PricingPage.tsx` (line 12)
- **What:** Two stacked `<header>` elements (legacy light + dark nav) in one component.
- **Why it matters:** Increases bug surface (already caused H1); confusing layout.
- **Fix:** Remove duplicate header when fixing JSX.

---

## Low severity findings

### L1 — Public repo name `job-wren` vs product name Jobryn

- **What:** GitHub slug `job-wren` does not match branding in docs (`jobryn.org`, `wrangler.toml` name `jobryn`).
- **Fix:** Optional GitHub rename with redirects; document canonical slug in README.

### L2 — Legacy credit `reserve_credits` RPC still granted to `authenticated`

- **File:** `supabase/migrations/0001_jobryn_core.sql` (line 206)
- **What:** Any workspace member can invoke `reserve_credits` via Supabase REST if credits exist (function checks membership only).
- **Why it matters:** Parallel credit system vs Stripe entitlements; potential confusion or drift if credits are reintroduced.
- **Fix:** Revoke from `authenticated` if credits are deprecated; enforce via service role only.

### L3 — Team invitations not implemented in API

- **Files:** `server/routes/team.ts` (read-only); `0005` revokes direct `workspace_members` mutation from browser
- **What:** Admins cannot invite members through documented server flows; RLS expects audited server paths.
- **Fix:** Add invite endpoints using service role + `usage.users` enforcement.

### L4 — CRM search filter sanitization is partial

- **File:** `server/routes/crm.ts` (line 37)
- **What:** Strips `%`, `_`, `,` from search strings before `.or()` filter; other PostgREST filter metacharacters may remain.
- **Fix:** Use parameterized RPC or `ilike` with escaped patterns.

### L5 — `metadata.json` and in-repo docs are aligned; GitHub description is not

- **File:** `metadata.json` (correct Jobryn description)
- **Fix:** See M1.

### L6 — Archive branch retains pre-Jobryn Nexus tree

- **Reference:** `PROJECT_STATE.md` — `archive/nexus-before-jobryn-2026-08-31`
- **What:** Historical Nexus code remains on a remote branch (not on `main`).
- **Fix:** Keep branch documented; ensure deploy keys/CI never target it.

---

## Uncertain (not verified in this environment)

### U1 — Supabase migrations applied in production

- **What:** Local audit read SQL files only; production RLS (`0005`, `0006`) may be pending if `db push` was not run.
- **Fix:** Compare `supabase_migrations.schema_migrations` in production to repo.

### U2 — Cloudflare production topology

- **What:** Unclear whether jobryn.org serves Node API + SPA from one service or split hosts without dashboard access.
- **Fix:** Confirm Worker/Pages project bindings and API origin env vars match `CORS_ORIGINS` and `APP_URL`.

### U3 — Email verification and MFA defaults in production

- **Files:** `server/env.ts` (`REQUIRE_EMAIL_VERIFICATION`, `REQUIRE_AAL2_SENSITIVE` default `true` in production)
- **What:** Runtime values depend on deployed env; not verified against live jobryn.org.
- **Fix:** Audit production env in secret store.

---

## Security positives (verified)

- **Secrets in tree:** Only placeholders in `.env.example`; `security-check.mjs` scans 40 source files—passed.
- **Client bundle:** Server-only keys use `process.env` in `server/`; browser uses `VITE_SUPABASE_*` and feature flags only (`src/lib/supabase.ts`).
- **Auth:** Bearer JWT validated via Supabase `getUser`; workspace header validated against `workspace_members` (`server/supabase.ts`).
- **Stripe webhooks:** Raw body + `constructEvent`; atomic `claim_stripe_webhook_event` before mutation (`server/routes/billing.ts`, migration `0003`).
- **RLS hardening:** `0005_least_privilege_rbac.sql` revokes direct subscription/entitlement/integration writes from `authenticated`.
- **Headers:** Helmet + CSP in production, HSTS, CORS allowlist (`server/security.ts`).
- **Nexus / Vercel artefacts in app source:** None in TS/TSX/config (only boundary documentation). **No `vercel.json`.** CLOUDFLARE is the documented deploy target.

---

## Build, test, and CI results (2026-11-14)

| Command | Result | Notes |
|---------|--------|-------|
| `npm install` | **Pass** | 279 packages; 1 high vuln reported |
| `npm run typecheck` | **Fail** | `src/pages/PricingPage.tsx:12` JSX errors (see H1) |
| `npm run security:check` | **Pass** | 40 files scanned |
| `npm run build` | **Fail** | Vite/esbuild same PricingPage error |
| `npm audit` | **Fail advisory gate** | 1 high: `zod` &lt;4.6.6 |
| `npm test` | **N/A** | Script not defined |
| GitHub Actions **Jobryn CI** | **Fail (historical)** | Recent `main` runs failed (~3–4s), consistent with H1/H2 |

### CI workflow (`.github/workflows/ci.yml`)

Steps: `npm install` → `typecheck` → `security:check` → `npm audit --omit=dev --audit-level=high` → `build`. No lint script beyond `tsc`. Node **22**.

### Deploy config notes

- **Cloudflare:** `wrangler.toml` — project name `jobryn`, `pages_build_output_dir = "dist"`.
- **Docker:** Multi-stage build runs `npm run build`; runtime `node dist/server.cjs`, port 3000, `NODE_ENV=production` (triggers `assertProductionSecrets()`).
- **Static fallback:** `public/_redirects` SPA rule `/* /index.html 200`.

---

## Appendix — Billing and data integrity (correctness)

| Area | Assessment |
|------|------------|
| Stripe checkout metadata | Server sets `workspace_id` and `plan` on session/subscription—good. |
| `apply_subscription_state` | SECURITY DEFINER RPC; entitlements from server-side `PLAN_FEATURES` map—good. |
| Appointment double-booking | DB EXCLUDE constraint in `0004`—good defense in depth beyond HTTP check. |
| Cross-tenant FKs | `assert_same_workspace_reference` triggers in `0004`—good. |
| Operator “AI” commands | Read-only queries; write paths marked `approvalRequired` without execution—aligned with hardened MVP. |

*End of report.*

---