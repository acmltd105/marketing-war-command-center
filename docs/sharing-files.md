# Sharing Documents with the Project Agent

The project agent can only read files that exist inside this Git repository at the time a task is executed. To share new
artifacts (for example CSV exports, spreadsheets, or architectural briefs), add them to the repo and commit them so they show up
in the working tree.

## Recommended workflow

1. Place the file inside the repository (e.g., `docs/inputs/` for reference material or `supabase/` for database artifacts).
2. Run `git add <path-to-your-file>` to stage it.
3. Commit the change: `git commit -m "Add supporting artifact"`.
4. Push the branch to GitHub so the agent can access it during the next session.

## Things that will *not* work

- Uploading documents through chat alone. The environment is isolated and cannot receive arbitrary file uploads.
- Sharing external links that require authentication. The agent cannot log in to third-party services.
- Relying on GitHub comments or pull request attachments without checking the files into the repo.

Keeping everything versioned in the repository ensures the agent can process the same inputs you see locally and keeps the
project history auditable.
