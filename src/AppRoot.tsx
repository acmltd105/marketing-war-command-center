import React from "react";
import { MsalProvider } from "@azure/msal-react";

import App from "./App";
import { getMsalInstance, isMsalConfigured } from "@/lib/msalConfig";

export default function AppRoot() {
  if (!isMsalConfigured()) {
    return <App />;
  }
  return (
    <MsalProvider instance={getMsalInstance()}>
      <App />
    </MsalProvider>
  );
}
