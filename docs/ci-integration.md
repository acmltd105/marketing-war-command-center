# CI Integration Guide

All pipelines should publish lifecycle events to the `report-build` edge function. Use the shared bearer token that you configured for the function (`BUILD_REPORT_TOKEN`). The payload fields map directly to the Supabase schema, so the service can upsert records idempotently.

## HTTP payload

```json
{
  "project_slug": "marketing-war-command-center",
  "project_name": "Marketing War Command Center",
  "repository_url": "https://github.com/acme/marketing-war-command-center",
  "ci_provider": "github-actions",
  "external_id": "${{ github.run_id }}",
  "build_number": "${{ github.run_number }}",
  "status": "running",
  "branch": "${{ github.ref_name }}",
  "commit_sha": "${{ github.sha }}",
  "logs_url": "${{ github.server_url }}/${{ github.repository }}/actions/runs/${{ github.run_id }}",
  "message": "Workflow started by ${{ github.actor }}"
}
```

## GitHub Actions example

```yaml
name: ci

on:
  push:
    branches: [ main ]
  pull_request:

jobs:
  build:
    runs-on: ubuntu-latest
    env:
      REPORT_BUILD_URL: https://<project>.functions.supabase.co/report-build
      REPORT_BUILD_TOKEN: ${{ secrets.BUILD_REPORT_TOKEN }}
    steps:
      - uses: actions/checkout@v4

      - name: Notify build queued
        run: |
          curl -fsSL -X POST "$REPORT_BUILD_URL" \
            -H "Authorization: Bearer $REPORT_BUILD_TOKEN" \
            -H "Content-Type: application/json" \
            -d '{
              "project_slug": "marketing-war-command-center",
              "project_name": "Marketing War Command Center",
              "repository_url": "https://github.com/${{ github.repository }}",
              "ci_provider": "github-actions",
              "external_id": "${{ github.run_id }}",
              "build_number": "${{ github.run_number }}",
              "status": "running",
              "branch": "${{ github.ref_name }}",
              "commit_sha": "${{ github.sha }}",
              "logs_url": "${{ github.server_url }}/${{ github.repository }}/actions/runs/${{ github.run_id }}",
              "message": "Workflow started by ${{ github.actor }}"
            }'

      - name: Install
        run: npm ci

      - name: Lint
        run: npm run lint

      - name: Build
        run: npm run build

      - name: Report success
        if: success()
        run: |
          curl -fsSL -X POST "$REPORT_BUILD_URL" \
            -H "Authorization: Bearer $REPORT_BUILD_TOKEN" \
            -H "Content-Type: application/json" \
            -d '{
              "project_slug": "marketing-war-command-center",
              "status": "succeeded",
              "external_id": "${{ github.run_id }}",
              "message": "Workflow finished successfully"
            }'

      - name: Report failure
        if: failure()
        run: |
          curl -fsSL -X POST "$REPORT_BUILD_URL" \
            -H "Authorization: Bearer $REPORT_BUILD_TOKEN" \
            -H "Content-Type: application/json" \
            -d '{
              "project_slug": "marketing-war-command-center",
              "status": "failed",
              "external_id": "${{ github.run_id }}",
              "message": "Workflow failed on ${{ github.ref_name }}"
            }'
```

> 💡 For GitLab, CircleCI, Jenkins, and other providers, send the same POST request at each lifecycle stage using the tokens those platforms expose (e.g. `$CI_PIPELINE_ID`, `$CIRCLE_WORKFLOW_ID`).
