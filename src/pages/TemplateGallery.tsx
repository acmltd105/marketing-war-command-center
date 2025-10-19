import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle2, Copy, FileText, MessageCircleMore, Sparkles } from "lucide-react";
import { CoverageTemplate, topDentalTemplates } from "@/data/dentalTemplates";
import { RcsTemplate, spotlightPetcareRcsTemplates } from "@/data/petcareRcsTemplates";

const CopyToast = ({ label }: { label: string }) => (
  <span className="inline-flex items-center gap-2 text-xs text-corporate-silver">
    <CheckCircle2 className="h-3.5 w-3.5 text-revenue-green" /> {label}
  </span>
);

const SectionHeading = () => (
  <div className="flex flex-col gap-4 rounded-2xl border border-corporate-blue/40 bg-corporate-navy/20 p-8 shadow-xl backdrop-blur">
    <div className="flex items-center gap-3 text-corporate-platinum">
      <Sparkles className="h-6 w-6 text-revenue-green" />
      <span className="text-sm uppercase tracking-[0.3em]">Twilio Template Command Center</span>
    </div>
    <div className="flex flex-col gap-3">
      <h1 className="text-4xl font-semibold text-white drop-shadow">Coverage Template Deck</h1>
      <p className="max-w-3xl text-base text-corporate-silver">
        Toggle between Twilio SendGrid emails and Twilio RCS rich cards. Each tile distills persona targeting, CTA strategy,
        dynamic field mapping, and payload guidance you can trigger from Supabase and mirror in your Rust desktop copilots.
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

type CopyTarget = {
  id: string;
  type: "subject" | "body" | "payload";
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
            <span className="font-semibold text-revenue-green">Subject:</span> {template.subject}
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
              <CopyToast label="Copied subject" />
            ) : (
              <span className="flex items-center gap-2 text-sm">
                <Copy className="h-4 w-4" /> Copy subject
              </span>
            )}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleCopy(template.bodyHtml, "body")}
            className="border-corporate-blue/60 bg-background/40 text-corporate-platinum hover:bg-corporate-blue/10"
          >
            {copied?.id === template.id && copied?.type === "body" ? (
              <CopyToast label="Copied HTML" />
            ) : (
              <span className="flex items-center gap-2 text-sm">
                <FileText className="h-4 w-4" /> Copy HTML
              </span>
            )}
          </Button>
        </div>
        <Separator className="bg-corporate-blue/40" />
        <ScrollArea className="max-h-64 rounded-xl border border-corporate-blue/40 bg-corporate-navy/30 p-4 text-sm text-corporate-platinum">
          <div dangerouslySetInnerHTML={{ __html: template.bodyHtml }} />
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

const RcsTemplateCard = ({ template }: { template: RcsTemplate }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(JSON.stringify(template.payload, null, 2));
        setCopied(true);
        window.setTimeout(() => setCopied(false), 2400);
      }
    } catch (error) {
      console.error("Unable to copy RCS payload", error);
      setCopied(false);
    }
  };

  return (
    <Card className="border border-amber-400/40 bg-background/60 shadow-lg backdrop-blur">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl text-white">
          <MessageCircleMore className="h-5 w-5 text-amber-400" /> {template.title}
        </CardTitle>
        <CardDescription className="text-sm text-corporate-silver">{template.description}</CardDescription>
        <div className="flex flex-wrap gap-2">
          {template.tags.map((tag) => (
            <Badge key={tag} variant="outline" className="border-amber-400/60 text-amber-300">
              {tag}
            </Badge>
          ))}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button
          variant="outline"
          size="sm"
          onClick={handleCopy}
          className="border-amber-400/60 text-amber-200 hover:bg-amber-500/10"
        >
          {copied ? <CopyToast label="Copied JSON" /> : "Copy JSON payload"}
        </Button>
        <ScrollArea className="max-h-64 rounded-xl border border-amber-400/40 bg-black/40 p-4 text-xs text-amber-100">
          <pre>{JSON.stringify(template.payload, null, 2)}</pre>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

const TemplateGallery = () => {
  return (
    <div className="space-y-8">
      <SectionHeading />
      <Tabs defaultValue="email" className="space-y-6">
        <TabsList className="w-full justify-start gap-2 rounded-xl bg-white/5 p-1">
          <TabsTrigger value="email">SendGrid Email Templates</TabsTrigger>
          <TabsTrigger value="rcs">RCS Rich Cards</TabsTrigger>
        </TabsList>
        <TabsContent value="email" className="space-y-6">
          <ScrollArea className="h-[70vh] rounded-2xl border border-corporate-blue/20 p-6">
            <div className="grid gap-6 lg:grid-cols-2">
              {topDentalTemplates.map((template) => (
                <TemplateCard key={template.id} template={template} />
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
        <TabsContent value="rcs" className="space-y-6">
          <ScrollArea className="h-[70vh] rounded-2xl border border-amber-400/20 p-6">
            <div className="grid gap-6 lg:grid-cols-2">
              {spotlightPetcareRcsTemplates.map((template) => (
                <RcsTemplateCard key={template.id} template={template} />
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TemplateGallery;
