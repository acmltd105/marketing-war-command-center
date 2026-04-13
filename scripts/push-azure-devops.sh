#!/usr/bin/env bash
set -euo pipefail

# Push current (or given) branch to Azure DevOps remote.
# Requires AZURE_DEVOPS_REPO_URL (HTTPS clone URL) or existing remote "azure-devops".
# See docs/azure-devops-git.md

BRANCH="${1:-$(git branch --show-current)}"
REMOTE_NAME="azure-devops"

if [[ -z "${BRANCH}" ]]; then
  echo "Could not determine branch. Pass it as the first argument." >&2
  exit 1
fi

if [[ -n "${AZURE_DEVOPS_REPO_URL:-}" ]]; then
  if git remote get-url "${REMOTE_NAME}" &>/dev/null; then
    git remote set-url "${REMOTE_NAME}" "${AZURE_DEVOPS_REPO_URL}"
  else
    git remote add "${REMOTE_NAME}" "${AZURE_DEVOPS_REPO_URL}"
  fi
  echo "Remote '${REMOTE_NAME}' -> ${AZURE_DEVOPS_REPO_URL}"
elif ! git remote get-url "${REMOTE_NAME}" &>/dev/null; then
  echo "Set AZURE_DEVOPS_REPO_URL to your Azure Repos HTTPS URL, or add remote '${REMOTE_NAME}' manually." >&2
  echo "See docs/azure-devops-git.md" >&2
  exit 1
fi

git push -u "${REMOTE_NAME}" "${BRANCH}"
