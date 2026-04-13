import React from "react";

import AuthGate from "./AuthGate";
import MsalAuthGate from "./MsalAuthGate";
import { isMockAuthEnabled } from "@/lib/devAuth";
import { isMsalConfigured } from "@/lib/msalConfig";

/**
 * Picks mock session gate vs Entra MSAL gate.
 */
export default function AppAuthGate({ children }: React.PropsWithChildren) {
  if (isMockAuthEnabled()) {
    return <AuthGate>{children}</AuthGate>;
  }
  if (isMsalConfigured()) {
    return <MsalAuthGate>{children}</MsalAuthGate>;
  }
  return <>{children}</>;
}
