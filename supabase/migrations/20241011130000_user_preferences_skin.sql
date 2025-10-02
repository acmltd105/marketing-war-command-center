-- Persist dashboard skin preferences per authenticated user
CREATE TABLE IF NOT EXISTS public.user_preferences (
    user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    dashboard_skin text NOT NULL DEFAULT 'fortune-100',
    created_at timestamptz NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at timestamptz NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT user_preferences_skin_allowed CHECK (
        dashboard_skin = ANY (ARRAY['fortune-100', 'aurora-glass', 'ember-vanguard'])
    )
);

COMMENT ON TABLE public.user_preferences IS 'End-user UI preferences keyed to Supabase auth users.';
COMMENT ON COLUMN public.user_preferences.dashboard_skin IS 'Selected dashboard skin (theme) for the marketing war command center.';

DROP TRIGGER IF EXISTS trg_touch_user_preferences ON public.user_preferences;
CREATE TRIGGER trg_touch_user_preferences
    BEFORE UPDATE ON public.user_preferences
    FOR EACH ROW
    EXECUTE FUNCTION public.touch_updated_at();

ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "user read own preferences" ON public.user_preferences;
CREATE POLICY "user read own preferences"
    ON public.user_preferences
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "user upsert own preferences" ON public.user_preferences;
CREATE POLICY "user upsert own preferences"
    ON public.user_preferences
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "user update own preferences" ON public.user_preferences;
CREATE POLICY "user update own preferences"
    ON public.user_preferences
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "service role manage user preferences" ON public.user_preferences;
CREATE POLICY "service role manage user preferences"
    ON public.user_preferences
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);
