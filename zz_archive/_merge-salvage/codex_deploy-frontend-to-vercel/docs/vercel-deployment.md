# Vercel deployment playbook

Deploying the Marketing War Command Center to Vercel keeps the React SPA and Supabase integrations production-ready without
fiddling with custom build pipelines. Follow this checklist to spin up a hosted control surface with a shareable URL.

## 1. Prerequisites

- Vercel account with access to the target organization.
- Supabase project (optional during smoke tests; the UI falls back to demo data when credentials are omitted).
- Twilio credentials stored in Supabase secrets as outlined in [`supabase/README.md`](../supabase/README.md).

## 2. One-time project setup

1. Push this repository to GitHub (or GitLab/Bitbucket) if it is not already backed by git remote hosting.
2. In Vercel, click **Add New → Project** and import the repository.
3. When prompted for the root directory, choose the repository root (`/`).
4. Use the default Vite build settings:
   - **Build Command**: `npm run build`
   - **Install Command**: `npm install`
   - **Output Directory**: `dist`
5. Add the required environment variables under **Settings → Environment Variables**:

   | Name                    | Value                                                | Scope                  |
   | ----------------------- | ---------------------------------------------------- | ---------------------- |
   | `VITE_SUPABASE_URL`     | `https://<your-project>.supabase.co`                 | Production + Preview   |
   | `VITE_SUPABASE_ANON_KEY`| Supabase anon key                                    | Production + Preview   |
   | `VITE_BASE_PATH`        | `/` (optional; only needed if you changed the base) | Production + Preview   |

   Staging-only overrides (e.g., pointing to a Supabase sandbox) can be set in the **Preview** scope.

6. Click **Deploy**. Vercel installs dependencies, runs the Vite build, and publishes the static assets behind a generated URL
   such as `https://marketing-war-command-center.vercel.app`.

## 3. Post-deploy validation

After the first deploy, open the Vercel URL and verify:

- Navigation works across routes such as `/financials`, `/operations`, and any custom flows you have wired up.
- Realtime data appears when Supabase credentials are present, and demo data renders when they are not.
- Toasts and dialogs load correctly; Vercel's static hosting serves the `index.html` shell for all routes thanks to the
  [`vercel.json`](../vercel.json) SPA rewrite.

## 4. Custom domains

1. From the Vercel project, open **Settings → Domains**.
2. Add the marketing domain (e.g., `command.mycompany.com`).
3. Follow the DNS instructions (CNAME or A/AAAA records depending on the provider).
4. Once DNS propagates, Vercel issues certificates automatically.

## 5. CI/CD guardrails

- Keep `main` production-ready. Vercel redeploys on every push.
- Protect the branch with CI checks (`npm run lint`, `npm run build`) to catch regressions before they ship.
- Use Vercel Preview deployments for feature branches; they inherit environment variables automatically.

## 6. Rollback strategy

- Vercel keeps build artifacts for each deployment. Use **Deployments → Promote to Production** to roll back instantly.
- If Supabase migrations need to be rolled back, follow the steps in [`supabase/README.md`](../supabase/README.md) to revert the schema.

With these steps in place, the command center stays "liquid glass" smooth in production while remaining self-healing and
observability friendly.
