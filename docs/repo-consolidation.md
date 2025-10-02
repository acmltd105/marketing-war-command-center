# Consolidating the Revenue & Expense workspace into the War Command Center

This playbook shows how to fold the standalone revenue/expense dashboard into the War Command Center repo while keeping Git
history, Supabase artifacts, and UI conventions intact. It assumes you want both codebases to live side-by-side in this
monorepo and expose the revenue and expense flows as tabs inside the command center shell.

## 1. Prepare both repositories

1. **Clone the source repo** (the smaller revenue/expense UI) locally next to this repository.
2. **Audit dependencies and environment variables** so you understand what the revenue/expense project needs (Supabase tables,
   secrets, third-party SDKs, etc.). This makes it easier to wire the feature flag in step 4.
3. **Decide on a target directory**. We usually drop legacy frontends under `src/features/<feature-name>` (for React code)
   and `supabase/seed/<feature-name>` (for SQL seeds) to keep things discoverable.

> Tip: If the smaller repo already uses Tailwind, shadcn, or Supabase, remove redundant configs once the merge is complete so
> there is a single source of truth.

## 2. Bring the Git history across with `git subtree`

`git subtree` lets you graft another repo into this one without breaking existing history. Run the following from the root of
**this** repo:

```bash
# 2.1 Track the smaller repository as a remote
git remote add revenue-expense <git-url-to-small-repo>

# 2.2 Fetch its branches
git fetch revenue-expense

# 2.3 Pull the code into a nested folder while preserving history
# Replace main with the source branch name if different.
git subtree add --prefix=src/features/revenue-expense revenue-expense main --squash
```

- `--prefix` determines where the files land.
- `--squash` keeps our history linear. Drop it if you want each upstream commit individually.

If you only need a subset of the repo, use [`git filter-repo`](https://github.com/newren/git-filter-repo) on the smaller repo
first to trim out irrelevant directories, then run the `git subtree add` command above on the filtered result.

## 3. Wire up shared infrastructure

1. Move Supabase migrations, Edge functions, and SQL seeds from the smaller repo into `supabase/`.
2. Merge `.env` examples. Add any new variables to `README.md` and to `supabase/.env.example` if present.
3. Update `package.json` dependencies (React, Supabase client, utility libraries) so versions match across both projects.
4. If the smaller repo shipped with its own lint/test setup, port relevant scripts into `package.json` under new commands (e.g.,
   `npm run test:financials`).

## 4. Expose the new tabs inside the War Command Center UI

1. Create a **financials feature module** under `src/features/revenue-expense/` that exports the revenue and expense React
   components you just imported.
2. Update the existing navigation shell (see `src/components/layout/` for the command center chrome) to include two new tabs:
   `Revenue` and `Expenses`. Both tabs should be children of a shared `Financials` section so we can toggle them with a single
   feature flag.
3. Use the existing Supabase client utilities in `src/lib/` to hydrate the new components. This keeps realtime subscriptions
   and error handling consistent across the app.
4. Add E2E smoke coverage (Playwright or Cypress) to ensure the tabs mount and display sample data when Supabase is offline.

## 5. Clean up and document

1. Remove duplicate configs (Tailwind, ESLint, Vite). Only the root configs should remain.
2. Delete the temporary remote once you no longer need it:

```bash
git remote remove revenue-expense
```

3. Update the documentation (including `README.md` and the onboarding playbooks in `docs/`) so new contributors know the
   financials feature now lives inside the command center.

## 6. Optional: keep syncing upstream changes

If the smaller repo will continue to evolve, repeat the subtree pull when you need upstream updates:

```bash
git fetch revenue-expense
git subtree pull --prefix=src/features/revenue-expense revenue-expense main --squash
```

This keeps the embedded code current without manual copy/paste merges.
