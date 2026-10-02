import React from "react";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import MsalSignOutButton from "@/components/MsalSignOutButton";
import { clearDevSession, isMockAuthEnabled } from "@/lib/devAuth";
import { isMsalConfigured } from "@/lib/msalConfig";

export default function SidebarSignOut() {
  const navigate = useNavigate();

  if (isMockAuthEnabled()) {
    return (
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="w-full justify-start text-muted-foreground"
        onClick={() => {
          clearDevSession();
          navigate("/login", { replace: true });
        }}
      >
        <LogOut className="mr-2 h-4 w-4" />
        Sign out
      </Button>
    );
  }

  if (isMsalConfigured()) {
    return <MsalSignOutButton />;
  }

  return null;
}
