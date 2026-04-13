import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { LogOut, Plus, RefreshCw, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Party } from "@/lib/contracts/party";
import { clearDevSession, readDevSession } from "@/lib/devAuth";
import { addParty, isMockApiEnabled, listParties } from "@/lib/gatewayClient";
import { Link } from "react-router-dom";

const ContactsPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const session = readDevSession();
  const mock = isMockApiEnabled();

  const [displayName, setDisplayName] = useState("");
  const [type, setType] = useState<"person" | "org">("person");
  const [email, setEmail] = useState("");

  const partiesQuery = useQuery({
    queryKey: ["parties", mock],
    queryFn: listParties,
  });

  const addMutation = useMutation({
    mutationFn: () =>
      addParty({
        type,
        displayName: displayName.trim(),
        primaryEmail: email.trim() ? email.trim() : null,
        primaryPhone: null,
      }),
    onSuccess: () => {
      setDisplayName("");
      setEmail("");
      void queryClient.invalidateQueries({ queryKey: ["parties"] });
    },
  });

  function signOut() {
    clearDevSession();
    navigate("/login", { replace: true });
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Contacts</h1>
          <p className="text-muted-foreground mt-1 max-w-2xl text-sm">
            People and organizations you message, bill, and move through the pipeline.
          </p>
          {session && (
            <p className="text-muted-foreground mt-2 text-xs">
              Signed in as <span className="text-foreground font-medium">{session.displayName}</span> ·{" "}
              {mock ? "mock API" : "live gateway"}
            </p>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" size="sm" onClick={() => void partiesQuery.refetch()} disabled={partiesQuery.isFetching}>
            <RefreshCw className={`mr-2 h-4 w-4 ${partiesQuery.isFetching ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          {session && (
            <Button type="button" variant="ghost" size="sm" onClick={signOut}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </Button>
          )}
        </div>
      </div>

      {partiesQuery.isError && (
        <Alert variant="destructive">
          <AlertTitle>Could not load contacts</AlertTitle>
          <AlertDescription>
            {(partiesQuery.error as Error).message}{" "}
            {mock ? (
              "Try toggling VITE_USE_MOCK_API."
            ) : (
              <>
                Set <code className="text-xs">VITE_GATEWAY_BASE_URL</code> or enable mock API for local dev.
              </>
            )}
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Plus className="h-5 w-5" />
            Add contact
          </CardTitle>
          <CardDescription>{mock ? "Stored in-memory until you refresh the page." : "Creates via gateway POST /api/parties."}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="displayName">Display name</Label>
              <Input
                id="displayName"
                placeholder="Jordan River"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Type</Label>
              <Select value={type} onValueChange={(v) => setType(v as "person" | "org")}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="person">Person</SelectItem>
                  <SelectItem value="org">Organization</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email (optional)</Label>
              <Input id="email" type="email" placeholder="name@company.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
          </div>
          <Button
            type="button"
            onClick={() => addMutation.mutate()}
            disabled={!displayName.trim() || addMutation.isPending}
          >
            {addMutation.isPending ? "Saving…" : "Save contact"}
          </Button>
          {addMutation.isError && (
            <p className="text-destructive text-sm">{(addMutation.error as Error).message}</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Directory</CardTitle>
          <CardDescription>
            {partiesQuery.data?.length ?? 0} {partiesQuery.data?.length === 1 ? "record" : "records"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {partiesQuery.isLoading && (
            <div className="space-y-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          )}
          {!partiesQuery.isLoading && partiesQuery.data?.length === 0 && (
            <div className="text-muted-foreground flex flex-col items-center gap-4 py-10 text-center">
              <div className="bg-muted flex h-12 w-12 items-center justify-center rounded-full">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <p className="text-foreground font-medium">No contacts yet</p>
                <p className="mt-1 text-sm">Add one above or connect a data source.</p>
              </div>
              <Button variant="outline" asChild>
                <Link to="/leads">Lead intelligence</Link>
              </Button>
            </div>
          )}
          {partiesQuery.data && partiesQuery.data.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Email</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {partiesQuery.data.map((p: Party) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium">{p.displayName}</TableCell>
                    <TableCell className="capitalize text-muted-foreground">{p.type}</TableCell>
                    <TableCell className="text-right text-muted-foreground">{p.primaryEmail ?? "—"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ContactsPage;
