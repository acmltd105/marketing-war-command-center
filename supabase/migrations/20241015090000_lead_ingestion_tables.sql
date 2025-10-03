-- Lead ingestion pipeline tables powering CSV/XLSX uploads
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'lead_ingestion_status') THEN
        CREATE TYPE public.lead_ingestion_status AS ENUM ('processing', 'succeeded', 'failed', 'cancelled');
    END IF;
END
$$;

CREATE TABLE IF NOT EXISTS public.lead_ingestions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    filename text NOT NULL,
    status public.lead_ingestion_status NOT NULL DEFAULT 'processing',
    total_rows bigint,
    processed_rows bigint NOT NULL DEFAULT 0,
    error text,
    metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
    created_at timestamptz NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at timestamptz NOT NULL DEFAULT timezone('utc'::text, now()),
    completed_at timestamptz,
    CONSTRAINT lead_ingestions_progress_check CHECK (
        processed_rows >= 0
        AND (total_rows IS NULL OR total_rows >= 0)
        AND (total_rows IS NULL OR processed_rows <= total_rows)
    )
);

COMMENT ON TABLE public.lead_ingestions IS 'Metadata for each batch ingestion initiated from the Lead Intelligence dashboard.';
COMMENT ON COLUMN public.lead_ingestions.filename IS 'Original filename provided by the operator.';
COMMENT ON COLUMN public.lead_ingestions.status IS 'Lifecycle marker for ingestion processing state.';
COMMENT ON COLUMN public.lead_ingestions.total_rows IS 'Expected total rows detected in the uploaded dataset.';
COMMENT ON COLUMN public.lead_ingestions.processed_rows IS 'Rows successfully written to the leads table.';
COMMENT ON COLUMN public.lead_ingestions.metadata IS 'Arbitrary metadata captured during ingestion (column stats, sampling, etc).';

CREATE TABLE IF NOT EXISTS public.leads (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    ingestion_id uuid REFERENCES public.lead_ingestions(id) ON DELETE SET NULL,
    source_filename text,
    first_name text,
    last_name text,
    email text,
    phone text,
    company text,
    hashed_phone text,
    raw_payload jsonb NOT NULL DEFAULT '{}'::jsonb,
    created_at timestamptz NOT NULL DEFAULT timezone('utc'::text, now())
);

COMMENT ON TABLE public.leads IS 'Raw lead records landed from CSV/XLSX uploads and API pushes.';
COMMENT ON COLUMN public.leads.ingestion_id IS 'Foreign key to the originating lead_ingestions row.';
COMMENT ON COLUMN public.leads.source_filename IS 'Convenience reference back to the uploaded file name.';
COMMENT ON COLUMN public.leads.raw_payload IS 'Original sanitized row payload for downstream processing.';
COMMENT ON COLUMN public.leads.hashed_phone IS 'SHA-256 hash of the numeric phone value for dedupe without exposing PII.';

CREATE INDEX IF NOT EXISTS idx_lead_ingestions_status ON public.lead_ingestions(status);
CREATE INDEX IF NOT EXISTS idx_lead_ingestions_updated_at ON public.lead_ingestions(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_ingestion_id ON public.leads(ingestion_id);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON public.leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_email ON public.leads(lower(email)) WHERE email IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_leads_hashed_phone ON public.leads(hashed_phone) WHERE hashed_phone IS NOT NULL;

ALTER TABLE public.lead_ingestions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "allow authenticated read lead_ingestions" ON public.lead_ingestions;
CREATE POLICY "allow authenticated read lead_ingestions"
    ON public.lead_ingestions
    FOR SELECT
    TO authenticated
    USING (true);

DROP POLICY IF EXISTS "allow authenticated write lead_ingestions" ON public.lead_ingestions;
CREATE POLICY "allow authenticated write lead_ingestions"
    ON public.lead_ingestions
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

DROP POLICY IF EXISTS "allow authenticated update lead_ingestions" ON public.lead_ingestions;
CREATE POLICY "allow authenticated update lead_ingestions"
    ON public.lead_ingestions
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

DROP POLICY IF EXISTS "service role manage lead_ingestions" ON public.lead_ingestions;
CREATE POLICY "service role manage lead_ingestions"
    ON public.lead_ingestions
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

DROP POLICY IF EXISTS "allow authenticated read leads" ON public.leads;
CREATE POLICY "allow authenticated read leads"
    ON public.leads
    FOR SELECT
    TO authenticated
    USING (true);

DROP POLICY IF EXISTS "allow authenticated insert leads" ON public.leads;
CREATE POLICY "allow authenticated insert leads"
    ON public.leads
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

DROP POLICY IF EXISTS "service role manage leads" ON public.leads;
CREATE POLICY "service role manage leads"
    ON public.leads
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

DROP TRIGGER IF EXISTS trg_touch_lead_ingestions ON public.lead_ingestions;
CREATE TRIGGER trg_touch_lead_ingestions
    BEFORE UPDATE ON public.lead_ingestions
    FOR EACH ROW
    EXECUTE FUNCTION public.touch_updated_at();

