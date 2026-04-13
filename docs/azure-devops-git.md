# Git remote: Azure DevOps

Pipeline Pantry can live in **Azure Repos** alongside or instead of GitHub. This repo does **not** store PATs or org URLs.

## 1. Create the empty repo in Azure DevOps

**Azure DevOps** → your **Project** → **Repos** → **New repository** → name it (e.g. `pipeline-pantry` or `marketing-war-command-center`).

Copy the **HTTPS** clone URL. It looks like:

`https://dev.azure.com/<ORG>/<PROJECT>/_git/<REPO>`

## 2. Add `azure-devops` as a second remote

From your machine (with the repo cloned):

```bash
git remote add azure-devops "https://dev.azure.com/<ORG>/<PROJECT>/_git/<REPO>"
```

If a remote named `azure-devops` already exists:

```bash
git remote set-url azure-devops "https://dev.azure.com/<ORG>/<PROJECT>/_git/<REPO>"
```

## 3. Authenticate (PAT)

1. **User settings** → **Personal access tokens** → New token with **Code (Read & write)** (or full scope for the project).
2. Use the PAT as the **password** when Git prompts; for HTTPS non-interactive use:

```bash
git push -u azure-devops "$(git branch --show-current)"
```

Git Credential Manager may store the token after the first successful push.

**PAT in URL (avoid in shared shells):**

```text
https://<anything>:<PAT>@dev.azure.com/<ORG>/<PROJECT>/_git/<REPO>
```

Prefer [Git Credential Manager](https://github.com/git-ecosystem/git-credential-manager) or `az devops` where possible.

## 4. One-command push (optional)

With `AZURE_DEVOPS_REPO_URL` set to the **HTTPS** URL (no PAT in the URL if you use GCM):

```bash
export AZURE_DEVOPS_REPO_URL="https://dev.azure.com/<ORG>/<PROJECT>/_git/<REPO>"
./scripts/push-azure-devops.sh
```

Or pass the branch name:

```bash
./scripts/push-azure-devops.sh main
```

## 5. Keep GitHub as `origin` (recommended during migration)

- **`origin`** → GitHub (existing history, PRs, Actions if any).
- **`azure-devops`** → Azure Repos.

Push the same branches to both until you retire one remote:

```bash
git push origin HEAD
git push azure-devops HEAD
```

## 6. CI in Azure Pipelines

Point a YAML pipeline at this repo and branch filters; mirror any secrets from GitHub Actions into **Library** → **Variable groups** or **Key Vault** task references.

---

*Orchestrator: set `AZURE_DEVOPS_REPO_URL` in the agent environment or run the script locally after `az login` / PAT setup.*
