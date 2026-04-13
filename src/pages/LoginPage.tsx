import React, { useState } from "react";
import { useMsal } from "@azure/msal-react";
import { useNavigate, useLocation } from "react-router-dom";
import { LogIn } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { setDevSession, isMockAuthEnabled } from "@/lib/devAuth";
import { isMsalConfigured } from "@/lib/msalConfig";

/** Only mounted when `isMsalConfigured()` and app is wrapped in `MsalProvider`. */
function EntraLoginSection() {
  const { instance } = useMsal();

  async function signInEntra() {
    const apiScope = (import.meta.env.VITE_MSAL_API_SCOPE as string | undefined)?.trim();
    const scopes = apiScope ? [apiScope] : ["User.Read"];
    await instance.loginRedirect({ scopes });
  }

  return (
    <div className="space-y-2">
      <Button type="button" className="w-full" onClick={() => void signInEntra()}>
        Continue with Microsoft
      </Button>
      <p className="text-muted-foreground text-center text-xs">
        Redirects to Entra. Gateway calls send <code className="text-xs">Bearer</code> when{" "}
        <code className="text-xs">VITE_MSAL_API_SCOPE</code> matches your API registration.
      </p>
    </div>
  );
}

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? "/";

  const [name, setName] = useState("Alex Orch");
  const [email, setEmail] = useState("user@mock.pipelinepantry.test");

  const entra = isMsalConfigured();
  const mock = isMockAuthEnabled();

  function continueMock() {
    setDevSession({ displayName: name.trim() || "Operator", email: email.trim() || "user@mock.pipelinepantry.test" });
    navigate(from.startsWith("/login") ? "/" : from, { replace: true });
  }

  if (!mock && !entra) {
    return (
      <div className="bg-background flex min-h-screen items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Sign in</CardTitle>
            <CardDescription>
              Configure <code className="text-xs">VITE_MSAL_CLIENT_ID</code>,{" "}
              <code className="text-xs">VITE_MSAL_TENANT_ID</code>, and optional{" "}
              <code className="text-xs">VITE_MSAL_REDIRECT_URI</code> / <code className="text-xs">VITE_MSAL_API_SCOPE</code>,
              or set <code className="text-xs">VITE_USE_MOCK_AUTH=true</code> for local mock session.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="bg-background flex min-h-screen items-center justify-center p-6">
      <Card className="w-full max-w-md border-border/80 shadow-sm">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <LogIn className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl font-semibold tracking-tight">Pipeline Pantry</CardTitle>
          <CardDescription>
            {entra ? "Microsoft Entra ID" : "Local mock session"} — choose how to continue.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {entra && <EntraLoginSection />}

          {mock && (
            <>
              {entra && <p className="text-muted-foreground text-center text-xs">or</p>}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="mock-name">Display name</Label>
                  <Input id="mock-name" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mock-email">Email</Label>
                  <Input
                    id="mock-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                  />
                </div>
                <Button type="button" variant={entra ? "outline" : "default"} className="w-full" onClick={continueMock}>
                  Continue with mock session
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
