import * as React from "react";
import {
  CheckCircle2,
  Copy,
  FileText,
  MessageCircleMore,
  Sparkles,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CoverageTemplate, topDentalTemplates } from "@/data/dentalTemplates";
import { RcsTemplate, spotlightPetcareRcsTemplates } from "@/data/petcareRcsTemplates";

const HeroHeading = () => (
  <div className="flex flex-col gap-4 rounded-2xl border border-corporate-blue/40 bg-corporate-navy/20 p-8 shadow-xl backdrop-blur">
    <div className="flex items-center gap-3 text-corporate-platinum">
      <Sparkles className="h-6 w-6 text-revenue-green" />
      <span className="text-sm uppercase tracking-[0.3em]">Twilio Template Command Center</span>
    </div>
    <div className="flex flex-col gap-3">
      <h1 className="text-4xl font-semibold text-white drop-shadow">Petcare Coverage Template Deck</h1>
      <p className="max-w-3xl text-base text-corporate-silver">
        Toggle between Twilio SendGrid emails and Twilio RCS rich cards. Each tile distills persona targeting,
        CTA strategy, dynamic field mapping, and payload guidance ready to sync with Supabase workflows and your Rust
        desktop copilots.
      </p>
    </div>
    <div className="flex flex-wrap gap-3">
      <Badge className="bg-corporate-blue/80 text-white">Liquid glass UI preview</Badge>
      <Badge className="bg-revenue-green/80 text-corporate-charcoal">Supabase metadata ready</Badge>
      <Badge className="bg-corporate-crimson/70 text-white">Twilio SendGrid compliant</Badge>
      <Badge className="bg-amber-500/70 text-corporate-charcoal">Twilio RCS optimized</Badge>
    </div>
  </div>
);

const SectionHeading = () => (
  <div className="flex flex-col gap-4 rounded-2xl border border-corporate-blue/40 bg-corporate-navy/20 p-8 shadow-xl backdrop-blur">
    <div className="flex items-center gap-3 text-corporate-platinum">
      <Sparkles className="h-6 w-6 text-revenue-green" />
      <span className="text-sm uppercase tracking-[0.3em]">Twilio Ready Email Ops</span>
    </div>
    <div className="flex flex-col gap-3">
      <h2 className="text-3xl font-semibold text-white drop-shadow">Dental Coverage Template Deck</h2>
      <p className="max-w-3xl text-base text-corporate-silver">
        Visualize the top ten templates from the 50-email library. Each tile distills persona targeting, CTA strategy,
        dynamic field mapping, and the exact HTML payload you can sync into Twilio SendGrid via your Supabase-powered
        automation flows.
      </p>
    </div>
  </div>
);

type CopyTarget = {
  id: string;
  type: "subject" | "body" | "rcs";
};

const TemplateCard = ({ template }: { template: CoverageTemplate }) => {
  const [copied, setCopied] = React.useState<CopyTarget | null>(null);

  React.useEffect(() => {
    if (!copied) return;
    if (typeof window === "undefined") return;
    const timer = window.setTimeout(() => setCopied(null), 2400);
    return () => window.clearTimeout(timer);
  }, [copied]);

  const handleCopy = async (value: string, type: CopyTarget["type"]) => {
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(value);
        setCopied({ id: template.id, type });
      }
    } catch (error) {
      console.error("Unable to copy template content", error);
      setCopied(null);
    }
  };

  return (
    <Card className="relative overflow-hidden border-corporate-blue/40 bg-background/60 shadow-lg backdrop-blur">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-revenue-green via-corporate-blue to-corporate-crimson opacity-70" />
      <CardHeader className="space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle className="text-2xl text-corporate-platinum">
              {template.category} {template.id.split("-")[1]} — {template.title}
            </CardTitle>
            <CardDescription className="text-sm text-corporate-silver">Persona: {template.persona}</CardDescription>
          </div>
          <Badge className="bg-corporate-navy/80 text-xs uppercase tracking-wide text-corporate-platinum">
            {template.cta}
          </Badge>
        </div>
        <div className="grid gap-2 text-sm text-corporate-platinum">
          <div>
            <span className="font-semibold text-revenue-green">Subject:</span> <span>{template.subject}</span>
          </div>
          <div className="text-corporate-silver">
            <span className="font-semibold text-corporate-platinum">Preview:</span> {template.preview}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {template.dynamicFields.map((field) => (
            <Badge
              key={field}
              variant="outline"
              className="border-corporate-blue/60 bg-corporate-navy/40 text-xs text-corporate-platinum"
            >
              {`{{${field}}}`}
            </Badge>
          ))}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleCopy(template.subject, "subject")}
            className="border-corporate-blue/60 bg-background/40 text-corporate-platinum hover:bg-corporate-blue/10"
          >
            {copied?.id === template.id && copied?.type === "subject" ? (
              <>
                <CheckCircle2 className="mr-2 h-4 w-4 text-revenue-green" /> Copied subject
              </>
            ) : (
              <>
                <Copy className="mr-2 h-4 w-4" /> Copy subject
              </>
            )}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleCopy(template.bodyHtml, "body")}
            className="border-corporate-blue/60 bg-background/40 text-corporate-platinum hover:bg-corporate-blue/10"
          >
            {copied?.id === template.id && copied?.type === "body" ? (
              <>
                <CheckCircle2 className="mr-2 h-4 w-4 text-revenue-green" /> Copied HTML
              </>
            ) : (
              <>
                <Copy className="mr-2 h-4 w-4" /> Copy HTML
              </>
            )}
          </Button>
          <div className="flex items-center gap-2 rounded-full border border-corporate-blue/40 bg-corporate-navy/30 px-4 py-2 text-xs text-corporate-silver">
            <FileText className="h-4 w-4 text-corporate-platinum" /> Twilio dynamic template ready
          </div>
        </div>
        <Separator className="bg-corporate-blue/20" />
        <ScrollArea className="h-64 w-full rounded-xl border border-corporate-blue/30 bg-corporate-navy/10 p-4 text-sm text-corporate-platinum">
          <div className="font-mono leading-relaxed">
            {template.bodyHtml.split("\n").map((line, index) => (
              <div key={`${template.id}-line-${index}`}>{line}</div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

const RcsTemplateCard = ({ template }: { template: RcsTemplate }) => {
  const [copied, setCopied] = React.useState(false);

  React.useEffect(() => {
    if (!copied || typeof window === "undefined") return;
    const timeout = window.setTimeout(() => setCopied(false), 2400);
    return () => window.clearTimeout(timeout);
  }, [copied]);

  const handleCopy = async () => {
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(JSON.stringify(template.payload, null, 2));
        setCopied(true);
      }
    } catch (error) {
      console.error("Failed to copy RCS payload", error);
      setCopied(false);
    }
  };

  return (
    <Card className="relative overflow-hidden border-corporate-blue/30 bg-background/60 shadow-lg backdrop-blur">
      <CardHeader className="space-y-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-2xl text-corporate-platinum">{template.title}</CardTitle>
            <CardDescription className="text-sm text-corporate-silver">
              Persona: {template.persona} · CTA: {template.cta}
            </CardDescription>
          </div>
          <Badge className="bg-revenue-green/20 text-revenue-green">RCS</Badge>
        </div>
        <div className="flex flex-wrap gap-2 text-xs text-corporate-silver">
          {template.dynamicFields.map((field) => (
            <Badge key={field} variant="outline" className="border-corporate-blue/60 bg-corporate-navy/30">
              {`{{${field}}}`}
            </Badge>
          ))}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2 text-sm text-corporate-silver/80">
          <MessageCircleMore className="h-4 w-4 text-corporate-platinum" /> {template.preview}
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            className="border-corporate-blue/60 bg-background/40 text-corporate-platinum hover:bg-corporate-blue/10"
          >
            {copied ? (
              <>
                <CheckCircle2 className="mr-2 h-4 w-4 text-revenue-green" /> Copied JSON
              </>
            ) : (
              <>
                <Copy className="mr-2 h-4 w-4" /> Copy JSON
              </>
            )}
          </Button>
          <div className="rounded-full border border-corporate-blue/40 bg-corporate-navy/30 px-4 py-2 text-xs text-corporate-silver">
            <Sparkles className="mr-2 inline h-4 w-4 text-primary" /> Suggested actions ready
          </div>
        </div>
        <ScrollArea className="h-64 w-full rounded-xl border border-corporate-blue/30 bg-corporate-navy/10 p-4 text-sm text-corporate-platinum">
          <pre className="whitespace-pre-wrap font-mono text-xs leading-relaxed">
            {JSON.stringify(template.payload, null, 2)}
          </pre>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

const TemplateGallery = () => {
  return (
    <div className="space-y-10">
      <HeroHeading />
      <Tabs defaultValue="email" className="space-y-8">
        <TabsList className="grid w-full grid-cols-2 rounded-2xl bg-white/5 p-1">
          <TabsTrigger value="email">Email templates</TabsTrigger>
          <TabsTrigger value="rcs">RCS templates</TabsTrigger>
        </TabsList>
        <TabsContent value="email" className="space-y-6">
          <SectionHeading />
          <div className="grid gap-6">
            {topDentalTemplates.map((template) => (
              <TemplateCard key={template.id} template={template} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="rcs" className="space-y-6">
          <div className="grid gap-6">
            {spotlightPetcareRcsTemplates.map((template) => (
              <RcsTemplateCard key={template.id} template={template} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TemplateGallery;
