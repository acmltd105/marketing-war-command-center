# Lead Intelligence Expansion Specification

## Objective
Introduce a dedicated lead ingestion and enrichment experience inside the revenue command center so that operations teams can onboard third-party audiences, cleanse them with compliance guardrails, and activate the best segments through Twilio Segment and Engage.

## Experience Blueprint
1. **Navigation**
   - Surface "Landing & Web Dev" within the primary navigation so marketing engineering teams can jump to creative operations while monitoring builds.
   - Keep the lead workflow embedded on the executive dashboard to preserve one-command-center behavior.
2. **Lead Ingestion Hub**
   - Present batch upload controls for CSV/XLSX lists alongside API-based ingestion status.
   - Track landed records, processing windows, and current sampling percentage for enrichment runs.
   - Provide slider control to choose the percentage of the audience to enrich (requirement: "only a sample that I choose").
3. **Sanitize + Silo Pipeline**
   - Visualize discrete phases: file validation, Twilio Lookup, DNC compliance, enrichment fan-out, and segmentation pushes.
   - Display real-time coverage, SLA expectations, and retry posture for each micro-service.
   - Highlight carrier breakout analytics for telecom strategy teams.
4. **Twilio Segment + Engage Enablement**
   - Summarize persona destinations, activation cadences, and automated re-sync triggers.
   - Call out guardrails such as identity resolution fallbacks and rate limiting.

## Data + Integration Notes
- Supabase remains the system of record. Future iterations will persist `lead_ingestions`, `lead_samples`, and `carrier_breakouts` tables.
- Twilio APIs involved:
  - **Lookup** for line type/carrier validation.
  - **Trust Hub DNC** for compliance scrubbing.
  - **Segment Profiles/Traits** and **Engage Journeys** for activation.
- Carrier insights will initially be derived from Lookup metadata and cached for analytics.

## Operational Guardrails (10 Pre-flight Error Checks)
1. Supabase storage bucket for lead uploads missing or misconfigured.
2. CSV/XLSX schema mismatch (required columns: `phone`, `email`, `consent_source`).
3. Twilio Lookup credential revoked or insufficient permissions.
4. DNC compliance API rate limit exceeded.
5. Enrichment vendor timeout exceeding 5 seconds SLA.
6. Carrier metadata response missing `carrier.name` field.
7. Segment space write key invalid or revoked.
8. Engage campaign template referencing deleted Segment audience.
9. Sampling percentage set to `0%` while activation job marked ready.
10. Lead silo replication lag beyond 2 minutes (Supabase replication delay).

## Visual Design Tokens
- Continue using the "liquid glass" aesthetic via existing `metric-card`, `corporate-*`, and `glow-*` utility classes.
- New pipeline badges should reuse `Badge` components for consistent status treatments.

## Desktop Companion Alignment
- Desktop Rust agent will eventually stream upload logs and sampling telemetry to Supabase.
- Reserve WebSocket channel `lead-ingestion` for future bi-directional coordination.

