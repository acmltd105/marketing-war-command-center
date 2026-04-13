import React from "react";
import { Navigate, useLocation } from "react-router-dom";

import { isMockAuthEnabled, readDevSession } from "@/lib/devAuth";

/**
 * When VITE_USE_MOCK_AUTH=true, require a mock session for all app routes
 * except /login and /onboarding. Real MSAL replaces this in a later phase.
 */
export default function AuthGate({ children }: React.PropsWithChildren) {
  const location = useLocation();

  if (!isMockAuthEnabled()) {
    return <>{children}</>;
  }

  const path = location.pathname;
  if (path === "/login" || path === "/onboarding") {
    return <>{children}</>;
  }

  if (readDevSession()) {
    return <>{children}</>;
  }

  return <Navigate to="/login" replace state={{ from: location.pathname }} />;
}
