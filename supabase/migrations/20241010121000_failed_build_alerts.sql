-- Trigger wiring that forwards failed builds to the Twilio alert edge function
CREATE OR REPLACE FUNCTION public.handle_failed_build_alert()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    project_record public.projects%ROWTYPE;
    alert_payload jsonb;
    auth_header text;
    headers jsonb;
BEGIN
    IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        IF NEW.status = 'failed' AND (TG_OP = 'INSERT' OR OLD.status IS DISTINCT FROM NEW.status) THEN
            SELECT * INTO project_record FROM public.projects WHERE id = NEW.project_id;

            IF project_record.id IS NULL THEN
                -- Nothing to alert if the project metadata has not been replicated yet
                RETURN NEW;
            END IF;

            alert_payload := jsonb_build_object(
                'build_id', NEW.id,
                'project_slug', project_record.slug,
                'project_name', project_record.name,
                'status', NEW.status,
                'branch', NEW.branch,
                'commit_sha', NEW.commit_sha,
                'logs_url', NEW.logs_url,
                'message', COALESCE(NEW.message, ''),
                'build_number', NEW.build_number,
                'external_id', NEW.external_id,
                'ci_provider', COALESCE(NEW.ci_provider, project_record.ci_provider)
            );

            auth_header := current_setting('app.twilio_alert_token', true);
            headers := CASE
                WHEN auth_header IS NULL OR auth_header = '' THEN '{}'::jsonb
                ELSE jsonb_build_object('Authorization', 'Bearer ' || auth_header)
            END;

            PERFORM supabase_functions.http_request(
                'twilio-build-alert',
                alert_payload,
                'POST',
                headers
            );
        END IF;
    END IF;

    RETURN NEW;
END;
$$;

COMMENT ON FUNCTION public.handle_failed_build_alert IS 'Fires whenever a build transitions into failed status and forwards the payload to the Twilio alerting edge function.';

DROP TRIGGER IF EXISTS trg_alert_failed_build ON public.builds;
CREATE TRIGGER trg_alert_failed_build
    AFTER INSERT OR UPDATE ON public.builds
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_failed_build_alert();
