import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { LogIn } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { setDevSession } from "@/lib/devAuth";
import { isMockAuthEnabled } from "@/lib/devAuth";

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? "/";

  const [name, setName] = useState("Alex Orch");
  const [email, setEmail] = useState("user@mock.pipelinepantry.test");

  if (!isMockAuthEnabled()) {
    return (
      <div className="bg-background flex min-h-screen items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Sign in</CardTitle>
            <CardDescription>
              Mock login is disabled. Set <code className="text-xs">VITE_USE_MOCK_AUTH=true</code> in{" "}
              <code className="text-xs">.env.development</code> for local dev, or configure Microsoft Entra (later phase).
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  function continueMock() {
    setDevSession({ displayName: name.trim() || "Operator", email: email.trim() || "user@mock.pipelinepantry.test" });
    navigate(from.startsWith("/login") ? "/" : from, { replace: true });
  }

  return (
    <div className="bg-background flex min-h-screen items-center justify-center p-6">
      <Card className="w-full max-w-md border-border/80 shadow-sm">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <LogIn className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl font-semibold tracking-tight">Pipeline Pantry</CardTitle>
          <CardDescription>Local mock session — no password stored.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
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
          <Button type="button" className="w-full" onClick={continueMock}>
            Continue with mock session
          </Button>
          <p className="text-muted-foreground text-center text-xs">
            Microsoft Entra sign-in will replace this in Phase 1 production path.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
