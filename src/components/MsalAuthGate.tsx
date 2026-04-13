import React from "react";
import { useIsAuthenticated } from "@azure/msal-react";
import { Navigate, useLocation } from "react-router-dom";

/**
 * Requires Entra session when MSAL is configured (mock auth off).
 */
export default function MsalAuthGate({ children }: React.PropsWithChildren) {
  const isAuthenticated = useIsAuthenticated();
  const location = useLocation();
  const path = location.pathname;

  if (path === "/login" || path === "/onboarding") {
    return <>{children}</>;
  }

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return <Navigate to="/login" replace state={{ from: location.pathname }} />;
}
