# Twilio Marketing Platform Launch Runbook

This runbook outlines the tasks required to ship the first production-ready version of the Twilio-powered marketing command center today. It assumes the current frontend (React + Tailwind + shadcn-ui), Supabase backend scaffolding, and Twilio alerting functions that already exist in the repository.

## 0. Pre-flight checklist (blockers)
- [ ] Confirm Supabase project is provisioned and migrations in `supabase/migrations` are applied via `supabase db push`.
- [ ] Ensure Twilio account has verified senders and required numbers (SMS + optional WhatsApp).
- [ ] Collect environment secrets for Supabase (`SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_ANON_KEY`) and Twilio (`TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_FROM_NUMBER`).
- [ ] Configure CI/CD credentials for both Supabase and the hosting platform (Lovable / Vercel / custom).
- [ ] Decide on a single source of truth for configuration (e.g., Supabase Vault + Supabase secrets).

## 1. Backend enablement (Supabase + Twilio functions)
1. Apply migrations and confirm tables (`projects`, `builds`, `project_latest_build`) and triggers are present as described in `supabase/README.md`.
2. Deploy `report-build` edge function and set `BUILD_REPORT_TOKEN`. Validate with curl against the local Supabase functions serve URL.
3. Deploy `twilio-build-alert` edge function and set Twilio credentials (`TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_FROM_NUMBER`, `TWILIO_TO_NUMBERS`) along with `TWILIO_ALERT_TOKEN`.
4. Update Postgres parameter `app.twilio_alert_token` with the same token to keep the trigger in sync.
5. Create REST policies for new tables so the frontend can read/write campaign data once endpoints are introduced.
6. Draft Supabase SQL or RPC endpoints for campaign management (create campaign, schedule sends, list analytics) that align with the mock data currently in the UI.
7. Stand up a Supabase cron or background job (e.g., edge function invoked by scheduler) that pushes campaign events to Twilio Studio / Messaging API.
8. Document fallback and retry strategy (e.g., requeue failed sends, store Twilio message SID + status updates).

## 2. Frontend wiring (React dashboard)
1. Replace mock Twilio config state in `src/components/TwilioConfig.tsx` with React Query calls to secure Supabase endpoints for fetching/storing credentials. Use Supabase functions to avoid exposing service role keys to the client.
2. Surface connection status by calling a lightweight health-check endpoint that validates Twilio credentials server-side.
3. Implement journey builder persistence: map each step to a Supabase table and hydrate UI state on load.
4. Connect campaign creation forms to Supabase RPC endpoints; ensure validation with `react-hook-form` + `zod` matches backend constraints.
5. Add optimistic UI and loading/error states for Twilio sends so operators see status in real time.
6. Instrument usage analytics (e.g., Supabase logs or PostHog) to monitor adoption post-launch.

## 3. Automation, QA, and observability
1. Establish end-to-end test coverage for Twilio workflows using mocked Twilio API responses.
2. Add lint/type/test commands to CI (`npm run lint`, `npm run typecheck`, `npm run test` once configured).
3. Use Supabase Edge Function tests or integration suite to validate Twilio webhooks before enabling real traffic.
4. Configure alerting when `twilio-build-alert` fires frequently (to catch systemic issues).
5. Implement feature flags for risky features so you can toggle them off quickly.

## 4. Launch logistics (today)
1. Freeze the main branch after merging critical fixes; tag a release candidate.
2. Run smoke tests against staging environment (Supabase project + Twilio sandbox) covering:
   - Credential save/test flows in Twilio settings UI.
   - Campaign creation and send dry run.
   - Workflow deployment checklist in `WorkflowManager` page.
3. Promote Supabase and frontend configs to production secrets.
4. Point DNS / hosting to the production build and verify SSL.
5. Announce launch internally with runbook links and on-call contact info.
6. Schedule first post-launch review (24 hours later) to evaluate metrics and triage issues.

## 5. Post-launch guardrails
- Monitor Supabase logs for errors and Twilio for delivery failures.
- Prepare rollback plan: redeploy previous build, revoke Twilio secrets, or switch traffic to maintenance page.
- Iterate on onboarding docs so new team members can repeat this launch without missing steps.

## Appendix: useful commands
```bash
# Apply Supabase migrations
supabase db push

# Deploy edge functions
supabase functions deploy report-build
supabase functions deploy twilio-build-alert

# Serve functions locally for integration testing
supabase functions serve --env-file ./supabase/.env.local
```
