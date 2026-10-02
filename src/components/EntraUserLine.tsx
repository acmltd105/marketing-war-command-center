import React from "react";
import { useMsal } from "@azure/msal-react";

/** One line: signed-in Microsoft account. Only render under MsalProvider. */
export default function EntraUserLine() {
  const { accounts } = useMsal();
  const name = accounts[0]?.name ?? accounts[0]?.username ?? "Signed in";

  return (
    <p className="text-muted-foreground mt-2 text-xs">
      Signed in as <span className="text-foreground font-medium">{name}</span> · live gateway
    </p>
  );
}
