import React from "react";
import { useMsal } from "@azure/msal-react";
import { LogOut } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function MsalSignOutButton() {
  const { instance } = useMsal();

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className="w-full justify-start text-muted-foreground"
      onClick={() => void instance.logoutRedirect({ postLogoutRedirectUri: window.location.origin })}
    >
      <LogOut className="mr-2 h-4 w-4" />
      Sign out
    </Button>
  );
}
