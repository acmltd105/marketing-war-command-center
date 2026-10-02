import { PublicClientApplication, type Configuration } from "@azure/msal-browser";

let instance: PublicClientApplication | null = null;

export function isMsalConfigured(): boolean {
  return Boolean(
    (import.meta.env.VITE_MSAL_CLIENT_ID as string | undefined)?.trim() &&
      (import.meta.env.VITE_MSAL_TENANT_ID as string | undefined)?.trim(),
  );
}

function buildConfig(): Configuration {
  const clientId = import.meta.env.VITE_MSAL_CLIENT_ID as string;
  const tenantId = import.meta.env.VITE_MSAL_TENANT_ID as string;
  const redirectUri =
    (import.meta.env.VITE_MSAL_REDIRECT_URI as string | undefined)?.trim() ||
    (typeof window !== "undefined" ? window.location.origin : "http://localhost:8080");

  return {
    auth: {
      clientId,
      authority: `https://login.microsoftonline.com/${tenantId}`,
      redirectUri,
      navigateToLoginRequestUrl: true,
    },
    cache: {
      cacheLocation: "sessionStorage",
      storeAuthStateInCookie: false,
    },
  };
}

/** Synchronous accessor after initializeMsal() has run. */
export function getMsalInstance(): PublicClientApplication {
  if (!isMsalConfigured()) {
    throw new Error("MSAL is not configured (missing VITE_MSAL_CLIENT_ID or VITE_MSAL_TENANT_ID).");
  }
  if (!instance) {
    instance = new PublicClientApplication(buildConfig());
  }
  return instance;
}

/**
 * Call once before React root render. Handles redirect response from Entra.
 */
export async function initializeMsal(): Promise<PublicClientApplication | null> {
  if (!isMsalConfigured()) {
    return null;
  }
  const app = getMsalInstance();
  await app.initialize();
  await app.handleRedirectPromise();
  return app;
}

/** Bearer token for gateway calls — uses VITE_MSAL_API_SCOPE when set, else User.Read (Graph). */
export async function acquireGatewayAccessToken(): Promise<string | null> {
  if (!isMsalConfigured()) return null;
  const app = getMsalInstance();
  const accounts = app.getAllAccounts();
  if (accounts.length === 0) return null;

  const apiScope = (import.meta.env.VITE_MSAL_API_SCOPE as string | undefined)?.trim();
  const scopes = apiScope ? [apiScope] : ["User.Read"];

  try {
    const result = await app.acquireTokenSilent({
      account: accounts[0],
      scopes,
    });
    return result.accessToken;
  } catch {
    return null;
  }
}
