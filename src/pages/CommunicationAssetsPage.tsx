import React from "react";
import { Phone } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const CommunicationAssetsPage = () => {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="fortune-heading text-3xl font-bold tracking-tight">Communication assets</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Numbers, sender profiles, and channel inventory—one place before you scale sends.
        </p>
      </div>

      <Card className="border-dashed">
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <Phone className="h-6 w-6 text-muted-foreground" />
          </div>
          <CardTitle>Coming next</CardTitle>
          <CardDescription>
            Twilio numbers and messaging services will sync here from your vault / settings integration.
          </CardDescription>
        </CardHeader>
        <CardContent />
      </Card>
    </div>
  );
};

export default CommunicationAssetsPage;
