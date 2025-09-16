# Desktop Companion

A lightweight Rust CLI that tails local build logs and forwards status updates to the Supabase `report-build` edge function. Use it when builds execute outside of cloud CI (e.g., on-prem runners or developer laptops) so the marketing command center dashboard stays accurate.

## Features

- Watches a log file and streams appended lines as structured chunks.
- Retries network calls with exponential backoff and heartbeats when idle.
- Automatically resumes from log rotations and handles SIGINT/SIGTERM gracefully.
- Emits metadata so the dashboard shows the latest log headline in real time.

## Building

```bash
cd desktop-companion
cargo build --release
```

The resulting binary lives at `target/release/desktop-companion`.

## Usage

```bash
./desktop-companion \
  --project-slug marketing-war-command-center \
  --project-name "Marketing War Command Center" \
  --repository-url https://github.com/acme/marketing-war-command-center \
  --ci-provider local-runner \
  --branch main \
  --commit-sha $(git rev-parse HEAD) \
  --build-number 42 \
  --external-id local-build-42 \
  --report-url https://<project-ref>.functions.supabase.co/report-build \
  --token $BUILD_REPORT_TOKEN \
  --log-path /var/log/build.log
```

### Helpful flags

| Flag | Description |
| --- | --- |
| `--from-start` | Stream the entire log file instead of just new content. |
| `--final-status` | Override the terminal status sent on exit (`succeeded`, `failed`, etc.). |
| `--max-chunk-bytes` | Tune the payload size if the default 8KB is too small or too large. |
| `--heartbeat-seconds` | Interval for sending "still running" updates when no new log lines arrive. |

## Connecting to Supabase

1. Deploy the `report-build` edge function and grab the invocation URL.
2. Generate a long random token and set it both as the function secret (`BUILD_REPORT_TOKEN`) and the CLI `--token` value.
3. The CLI automatically enriches payloads with metadata so the dashboard highlights the latest log snippet.

> ℹ️ The CLI intentionally keeps configuration minimal—if the process crashes or loses network connectivity, it retries with exponential backoff and stops cleanly on Ctrl+C while reporting the final status you choose.
