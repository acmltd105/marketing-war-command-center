import React from "react";
import { Users } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

/**
 * Pipeline Pantry — Party spine (contacts) shell.
 * PR2 will wire Supabase `party` table and imports.
 */
const ContactsPage = () => {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="fortune-heading text-3xl font-bold tracking-tight">Contacts</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          People and organizations you message, bill, and move through the pipeline.
        </p>
      </div>

      <Card className="border-dashed">
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <Users className="h-6 w-6 text-muted-foreground" />
          </div>
          <CardTitle>No contacts yet</CardTitle>
          <CardDescription className="text-base">
            No contacts yet—import or connect a source so your pipeline has people to move.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap justify-center gap-2">
          <Button variant="default" asChild>
            <Link to="/leads">Lead intelligence</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/onboarding">Data connection</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContactsPage;
