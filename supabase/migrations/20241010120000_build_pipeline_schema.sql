-- Core schema for project and build tracking
create extension if not exists "pgcrypto";

-- Enumerated status type for builds
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'build_status') THEN
        CREATE TYPE public.build_status AS ENUM (
            'queued',
            'running',
            'succeeded',
            'failed',
            'cancelled',
            'unknown'
        );
    END IF;
END
$$;

-- Projects table represents a CI-enabled repo/application
CREATE TABLE IF NOT EXISTS public.projects (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    slug text NOT NULL UNIQUE CHECK (char_length(slug) >= 3),
    name text NOT NULL,
    repo_url text,
    ci_provider text,
    metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
    created_at timestamptz NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at timestamptz NOT NULL DEFAULT timezone('utc'::text, now())
);

COMMENT ON TABLE public.projects IS 'Repositories or deployable units represented inside the build dashboard.';
COMMENT ON COLUMN public.projects.slug IS 'Human friendly stable identifier that matches CI payloads.';

-- Builds table captures every build execution
CREATE TABLE IF NOT EXISTS public.builds (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    external_id text NOT NULL,
    build_number bigint,
    status public.build_status NOT NULL DEFAULT 'queued',
    progress numeric(5,2) NOT NULL DEFAULT 0,
    branch text,
    commit_sha text,
    ci_provider text,
    logs_url text,
    message text,
    metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
    started_at timestamptz DEFAULT timezone('utc'::text, now()),
    completed_at timestamptz,
    created_at timestamptz NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at timestamptz NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT builds_progress_range CHECK (progress >= 0 AND progress <= 100)
);

COMMENT ON TABLE public.builds IS 'Build executions reported from CI pipelines and the desktop companion.';
COMMENT ON COLUMN public.builds.external_id IS 'Stable identifier from the CI provider (run id, workflow id, etc).';

CREATE UNIQUE INDEX IF NOT EXISTS idx_builds_external_id ON public.builds(external_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_builds_project_number ON public.builds(project_id, build_number) WHERE build_number IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_builds_project_updated_at ON public.builds(project_id, updated_at DESC);

-- Automatically maintain updated_at timestamps
CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS trigger AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_touch_projects ON public.projects;
CREATE TRIGGER trg_touch_projects
    BEFORE UPDATE ON public.projects
    FOR EACH ROW
    EXECUTE FUNCTION public.touch_updated_at();

DROP TRIGGER IF EXISTS trg_touch_builds ON public.builds;
CREATE TRIGGER trg_touch_builds
    BEFORE UPDATE ON public.builds
    FOR EACH ROW
    EXECUTE FUNCTION public.touch_updated_at();

-- Enable and harden row level security
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.builds ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "allow authenticated read projects" ON public.projects;
CREATE POLICY "allow authenticated read projects"
    ON public.projects
    FOR SELECT
    TO authenticated
    USING (true);

DROP POLICY IF EXISTS "allow authenticated read builds" ON public.builds;
CREATE POLICY "allow authenticated read builds"
    ON public.builds
    FOR SELECT
    TO authenticated
    USING (true);

DROP POLICY IF EXISTS "service role manage projects" ON public.projects;
CREATE POLICY "service role manage projects"
    ON public.projects
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

DROP POLICY IF EXISTS "service role manage builds" ON public.builds;
CREATE POLICY "service role manage builds"
    ON public.builds
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- Helpful materialized view for the UI to hydrate quickly with most recent build
CREATE OR REPLACE VIEW public.project_latest_build AS
SELECT
    p.id AS project_id,
    p.slug,
    p.name,
    p.repo_url,
    p.ci_provider,
    p.metadata AS project_metadata,
    b.id AS build_id,
    b.status,
    b.progress,
    b.branch,
    b.commit_sha,
    b.ci_provider AS build_ci_provider,
    b.logs_url,
    b.message,
    b.metadata AS build_metadata,
    b.started_at,
    b.completed_at,
    b.updated_at AS build_updated_at,
    b.build_number,
    b.external_id
FROM public.projects p
LEFT JOIN LATERAL (
    SELECT *
    FROM public.builds b
    WHERE b.project_id = p.id
    ORDER BY b.updated_at DESC NULLS LAST
    LIMIT 1
) b ON TRUE;

COMMENT ON VIEW public.project_latest_build IS 'Convenience view containing each project and its latest build snapshot.';
