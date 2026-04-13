/**
 * Which cloud / vendor plane the operator chose at onboarding.
 * Azure-first dogfood: SQL + Cosmos + Blobs + containers + Microsoft 365 — no Supabase in the browser for that plane.
 */

const AZURE_PRIMARY_PROVIDER_IDS = new Set([
  "azure-sql",
  "azure-sql-managed-instance",
  "cosmos-sql",
  "cosmos-mongodb",
  "cosmos-cassandra",
  "fabric-sql",
]);

export function isAzurePrimaryProvider(primaryProviderId: string | undefined): boolean {
  if (!primaryProviderId) return false;
  return AZURE_PRIMARY_PROVIDER_IDS.has(primaryProviderId);
}

export function shouldUseSupabaseInBrowser(primaryProviderId: string | undefined): boolean {
  if (primaryProviderId && isAzurePrimaryProvider(primaryProviderId)) {
    return false;
  }
  return true;
}
