import React from "react";
import { Navigate, useLocation } from "react-router-dom";

import { isOnboardingComplete } from "@/lib/onboarding";

/**
 * Sends first-time operators through `/onboarding` until they finish or
 * the app is built with `VITE_SUPABASE_*` (CI / GitHub Pages with secrets).
 */
export default function OnboardingGate({ children }: React.PropsWithChildren) {
  const location = useLocation();
  const complete = isOnboardingComplete();

  if (!complete && location.pathname !== "/onboarding") {
    return <Navigate to="/onboarding" replace state={{ from: location.pathname }} />;
  }

  return <>{children}</>;
}
