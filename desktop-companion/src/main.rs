use anyhow::{anyhow, Context, Result};
use clap::{Parser, ValueEnum};
use ctrlc;
use notify::{Config, Event, RecommendedWatcher, RecursiveMode, Watcher};
use reqwest::blocking::Client;
use serde_json::{json, Map, Number, Value};
use std::fs::File;
use std::io::{BufReader, Read, Seek, SeekFrom};
use std::path::{Path, PathBuf};
use std::sync::{
    atomic::{AtomicBool, Ordering},
    mpsc, Arc,
};
use std::thread;
use std::time::{Duration, Instant};

#[derive(Copy, Clone, Debug, ValueEnum)]
enum BuildStatus {
    Queued,
    Running,
    Succeeded,
    Failed,
    Cancelled,
    Unknown,
}

impl BuildStatus {
    fn as_str(&self) -> &'static str {
        match self {
            BuildStatus::Queued => "queued",
            BuildStatus::Running => "running",
            BuildStatus::Succeeded => "succeeded",
            BuildStatus::Failed => "failed",
            BuildStatus::Cancelled => "cancelled",
            BuildStatus::Unknown => "unknown",
        }
    }
}

#[derive(Parser, Debug)]
#[command(author, version, about = "Stream build logs to the Supabase report-build endpoint", long_about = None)]
struct Args {
    /// Supabase project slug used to group builds
    #[arg(long)]
    project_slug: String,

    /// Human friendly project name for dashboards
    #[arg(long)]
    project_name: Option<String>,

    /// Repository URL associated with this build
    #[arg(long)]
    repository_url: Option<String>,

    /// CI provider label (github-actions, gitlab-ci, etc.)
    #[arg(long)]
    ci_provider: Option<String>,

    /// Branch being built
    #[arg(long)]
    branch: Option<String>,

    /// Commit SHA for the build
    #[arg(long)]
    commit_sha: Option<String>,

    /// External log URL produced by the CI system
    #[arg(long)]
    logs_url: Option<String>,

    /// Optional build number to display in the dashboard
    #[arg(long)]
    build_number: Option<i64>,

    /// External identifier from the CI system (workflow id, pipeline id, etc.)
    #[arg(long)]
    external_id: Option<String>,

    /// Supabase build_id to continue updating an existing row
    #[arg(long)]
    build_id: Option<String>,

    /// Destination `report-build` endpoint
    #[arg(long)]
    report_url: String,

    /// Bearer token that authenticates against the edge function
    #[arg(long)]
    token: String,

    /// Path to the log file to monitor
    #[arg(long)]
    log_path: PathBuf,

    /// Initial status to publish before streaming logs
    #[arg(long, value_enum, default_value = "running")]
    initial_status: BuildStatus,

    /// Status to send when the watcher shuts down gracefully
    #[arg(long, value_enum)]
    final_status: Option<BuildStatus>,

    /// Number of retry attempts for the HTTP client
    #[arg(long, default_value_t = 5)]
    max_retries: usize,

    /// Milliseconds to wait between HTTP retries (exponential backoff)
    #[arg(long, default_value_t = 500)]
    retry_backoff_ms: u64,

    /// When set, start streaming from the beginning of the log instead of the current end
    #[arg(long, default_value_t = false)]
    from_start: bool,

    /// Maximum size (in bytes) of a log chunk per request
    #[arg(long, default_value_t = 8192)]
    max_chunk_bytes: usize,

    /// Idle heartbeat interval in seconds
    #[arg(long, default_value_t = 60)]
    heartbeat_seconds: u64,
}

fn wait_for_file(path: &Path, shutdown: &Arc<AtomicBool>) -> Result<()> {
    while !shutdown.load(Ordering::SeqCst) {
        if path.exists() {
            return Ok(());
        }
        thread::sleep(Duration::from_millis(200));
    }
    Err(anyhow!("Shutdown before log file appeared"))
}

fn open_reader(path: &Path, position: &mut u64) -> Result<BufReader<File>> {
    let file = File::open(path)
        .with_context(|| format!("Failed to open log file at {}", path.display()))?;
    let metadata = file.metadata()?;
    if *position > metadata.len() {
        // Log rotated or truncated, restart from beginning
        *position = 0;
    }
    let mut reader = BufReader::new(file);
    reader.seek(SeekFrom::Start(*position))?;
    Ok(reader)
}

fn read_new_content(path: &Path, position: &mut u64) -> Result<Option<String>> {
    let mut reader = open_reader(path, position)?;
    let mut buffer = String::new();
    let bytes_read = reader.read_to_string(&mut buffer)? as u64;
    if bytes_read == 0 {
        return Ok(None);
    }
    *position += bytes_read;
    Ok(Some(buffer))
}

fn send_report(
    client: &Client,
    args: &Args,
    external_id: &str,
    status: BuildStatus,
    message: Option<&str>,
    progress: Option<f32>,
    metadata: Option<Value>,
) -> Result<()> {
    let mut payload = Map::new();
    payload.insert(
        "project_slug".into(),
        Value::String(args.project_slug.clone()),
    );

    if let Some(name) = args.project_name.as_ref() {
        payload.insert("project_name".into(), Value::String(name.clone()));
    }
    if let Some(repo) = args.repository_url.as_ref() {
        payload.insert("repository_url".into(), Value::String(repo.clone()));
    }
    if let Some(ci) = args.ci_provider.as_ref() {
        payload.insert("ci_provider".into(), Value::String(ci.clone()));
    }
    if let Some(branch) = args.branch.as_ref() {
        payload.insert("branch".into(), Value::String(branch.clone()));
    }
    if let Some(commit) = args.commit_sha.as_ref() {
        payload.insert("commit_sha".into(), Value::String(commit.clone()));
    }
    if let Some(logs_url) = args.logs_url.as_ref() {
        payload.insert("logs_url".into(), Value::String(logs_url.clone()));
    }
    if let Some(number) = args.build_number {
        payload.insert("build_number".into(), Value::Number(number.into()));
    }

    payload.insert("status".into(), Value::String(status.as_str().to_string()));
    payload.insert("external_id".into(), Value::String(external_id.to_string()));

    if let Some(build_id) = args.build_id.as_ref() {
        payload.insert("build_id".into(), Value::String(build_id.clone()));
    }
    if let Some(msg) = message {
        payload.insert("message".into(), Value::String(msg.to_string()));
    }
    if let Some(p) = progress {
        if let Some(num) = Number::from_f64(p as f64) {
            payload.insert("progress".into(), Value::Number(num));
        }
    }
    if let Some(meta) = metadata {
        payload.insert("metadata".into(), meta);
    }

    let body = Value::Object(payload);

    let max_attempts = args.max_retries.max(1);
    let mut attempt = 0;
    let mut delay = Duration::from_millis(args.retry_backoff_ms.max(100));

    loop {
        attempt += 1;
        let response = client
            .post(&args.report_url)
            .bearer_auth(&args.token)
            .json(&body)
            .send();

        match response {
            Ok(resp) => {
                if resp.status().is_success() {
                    return Ok(());
                }
                let status_code = resp.status();
                let text = resp.text().unwrap_or_else(|_| "<no body>".into());
                if status_code.is_server_error() && attempt < max_attempts {
                    eprintln!(
                        "[desktop-companion] Server error {} — retrying in {}ms",
                        status_code,
                        delay.as_millis()
                    );
                    thread::sleep(delay);
                    delay = Duration::from_millis((delay.as_millis() as u64).saturating_mul(2));
                    continue;
                }
                return Err(anyhow!(
                    "report-build responded with {}: {}",
                    status_code,
                    text.trim()
                ));
            }
            Err(err) => {
                if attempt >= max_attempts {
                    return Err(anyhow!("Failed to contact report-build: {}", err));
                }
                eprintln!(
                    "[desktop-companion] HTTP error — retrying in {}ms: {}",
                    delay.as_millis(),
                    err
                );
                thread::sleep(delay);
                delay = Duration::from_millis((delay.as_millis() as u64).saturating_mul(2));
            }
        }
    }
}

fn coalesce_external_id(args: &Args) -> String {
    if let Some(id) = args.external_id.clone() {
        return id;
    }
    if let Some(id) = args.build_id.clone() {
        return id;
    }
    format!("{}-{}", args.project_slug, chrono::Utc::now().timestamp())
}

fn aggregate_chunks(lines: &[String], max_bytes: usize) -> Vec<String> {
    if lines.is_empty() {
        return vec![];
    }

    let mut chunks = Vec::new();
    let mut current = String::new();

    for line in lines {
        let candidate_len = current.len() + line.len() + if current.is_empty() { 0 } else { 1 };
        if candidate_len > max_bytes && !current.is_empty() {
            chunks.push(current.clone());
            current.clear();
        }

        if !current.is_empty() {
            current.push('\n');
        }
        current.push_str(line);

        if current.len() >= max_bytes {
            chunks.push(current.clone());
            current.clear();
        }
    }

    if !current.is_empty() {
        chunks.push(current);
    }

    chunks
}

fn sanitize_line(line: &str, max_len: usize) -> String {
    if line.len() <= max_len {
        return line.to_string();
    }
    let mut trimmed = line[..max_len].to_string();
    trimmed.push('…');
    trimmed
}

fn forward_raw_logs(
    raw: String,
    args: &Args,
    client: &Client,
    external_id: &str,
    chunk_index: &mut u64,
) -> Result<()> {
    let lines: Vec<String> = raw
        .lines()
        .map(|line| line.trim_end().to_string())
        .collect();
    let chunks = aggregate_chunks(&lines, args.max_chunk_bytes);

    for chunk in chunks {
        *chunk_index += 1;
        let headline = chunk
            .lines()
            .last()
            .map(|line| sanitize_line(line, 180))
            .unwrap_or_else(|| "Streaming log update".to_string());

        let metadata = json!({
            "source": "desktop-companion",
            "event": "log_chunk",
            "chunk_index": *chunk_index,
            "log_chunk": chunk,
            "log_lines": chunk.lines().count(),
            "chunk_bytes": chunk.len(),
            "timestamp": chrono::Utc::now(),
        });

        send_report(
            client,
            args,
            external_id,
            BuildStatus::Running,
            Some(&headline),
            None,
            Some(metadata),
        )?;
    }

    Ok(())
}

fn main() -> Result<()> {
    let args = Args::parse();
    let shutdown = Arc::new(AtomicBool::new(false));
    let shutdown_clone = Arc::clone(&shutdown);

    ctrlc::set_handler(move || {
        if !shutdown_clone.swap(true, Ordering::SeqCst) {
            eprintln!("[desktop-companion] Received shutdown signal, finishing up…");
        }
    })?;

    let client = Client::builder()
        .timeout(Duration::from_secs(15))
        .build()
        .context("Failed to build HTTP client")?;

    let external_id = coalesce_external_id(&args);

    let (tx, rx) = mpsc::channel::<Event>();
    let tx_clone = tx.clone();
    drop(tx);

    let log_path = args.log_path.clone();
    let watcher_shutdown = Arc::clone(&shutdown);
    thread::spawn(move || {
        let tx = tx_clone;
        let watcher_result = RecommendedWatcher::new(
            move |res| match res {
                Ok(event) => {
                    if tx.send(event).is_err() {
                        eprintln!("[desktop-companion] Channel closed while forwarding event");
                    }
                }
                Err(err) => eprintln!("[desktop-companion] Watch error: {}", err),
            },
            Config::default()
                .with_poll_interval(Duration::from_secs(1))
                .with_compare_contents(true),
        );

        if let Ok(mut watcher) = watcher_result {
            let target = if log_path.is_dir() {
                log_path.clone()
            } else {
                log_path.parent().unwrap_or(Path::new(".")).to_path_buf()
            };
            if let Err(err) = watcher.watch(&target, RecursiveMode::NonRecursive) {
                eprintln!(
                    "[desktop-companion] Failed to watch {}: {}",
                    target.display(),
                    err
                );
            }

            while !watcher_shutdown.load(Ordering::SeqCst) {
                thread::sleep(Duration::from_secs(1));
            }
        }
    });

    wait_for_file(&args.log_path, &shutdown)?;

    let mut position = if args.from_start {
        0
    } else {
        std::fs::metadata(&args.log_path)
            .map(|meta| meta.len())
            .unwrap_or(0)
    };

    send_report(
        &client,
        &args,
        &external_id,
        args.initial_status,
        Some("Build watcher initialized"),
        None,
        Some(json!({
            "source": "desktop-companion",
            "event": "started",
            "timestamp": chrono::Utc::now(),
        })),
    )?;

    let mut chunk_index: u64 = 0;
    let mut last_heartbeat = Instant::now();

    if args.from_start {
        if let Some(raw) = read_new_content(&args.log_path, &mut position)? {
            forward_raw_logs(raw, &args, &client, &external_id, &mut chunk_index)?;
            last_heartbeat = Instant::now();
        }
    }

    while !shutdown.load(Ordering::SeqCst) {
        match rx.recv_timeout(Duration::from_millis(500)) {
            Ok(event) => {
                if !event
                    .paths
                    .iter()
                    .any(|path| path.as_path() == args.log_path.as_path())
                {
                    continue;
                }

                if let Some(raw) = read_new_content(&args.log_path, &mut position)? {
                    forward_raw_logs(raw, &args, &client, &external_id, &mut chunk_index)?;
                }
                last_heartbeat = Instant::now();
            }
            Err(mpsc::RecvTimeoutError::Timeout) => {
                if last_heartbeat.elapsed() >= Duration::from_secs(args.heartbeat_seconds) {
                    send_report(
                        &client,
                        &args,
                        &external_id,
                        BuildStatus::Running,
                        Some("Heartbeat"),
                        None,
                        Some(json!({
                            "source": "desktop-companion",
                            "event": "heartbeat",
                            "timestamp": chrono::Utc::now(),
                        })),
                    )?;
                    last_heartbeat = Instant::now();
                }
            }
            Err(mpsc::RecvTimeoutError::Disconnected) => break,
        }
    }

    let final_status = args.final_status.unwrap_or(BuildStatus::Cancelled);
    send_report(
        &client,
        &args,
        &external_id,
        final_status,
        Some("Build watcher stopped"),
        None,
        Some(json!({
            "source": "desktop-companion",
            "event": "stopped",
            "timestamp": chrono::Utc::now(),
            "chunk_index": chunk_index,
        })),
    )?;

    Ok(())
}
