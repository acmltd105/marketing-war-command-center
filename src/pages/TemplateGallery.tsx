import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
codex/find-email-templates-for-dental-and-precare-coverage-bku57i
=======
codex/find-email-templates-for-dental-and-precare-coverage-dftp26
 main
import { CheckCircle2, Copy, FileText, MessageCircleMore, Sparkles } from 'lucide-react';
import { CoverageTemplate, topDentalTemplates } from '@/data/dentalTemplates';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RcsTemplate, spotlightPetcareRcsTemplates } from '@/data/petcareRcsTemplates';

const HeroHeading = () => (
  <div className="flex flex-col gap-4 rounded-2xl border border-corporate-blue/40 bg-corporate-navy/20 p-8 shadow-xl backdrop-blur">
    <div className="flex items-center gap-3 text-corporate-platinum">
      <Sparkles className="h-6 w-6 text-revenue-green" />
      <span className="text-sm uppercase tracking-[0.3em]">Twilio Template Command Center</span>
    </div>
    <div className="flex flex-col gap-3">
      <h1 className="text-4xl font-semibold text-white drop-shadow">Petcare Coverage Template Deck</h1>
      <p className="max-w-3xl text-base text-corporate-silver">
        Toggle between Twilio SendGrid emails and Twilio RCS rich cards. Each tile distills persona targeting, CTA strategy, dynamic field mapping, and payload guidance you can trigger from Supabase and mirror in your Rust desktop copilots.
 codex/find-email-templates-for-dental-and-precare-coverage-bku57i
=======
=======
import { CheckCircle2, Copy, FileText, Sparkles } from 'lucide-react';
import { CoverageTemplate, topDentalTemplates } from '@/data/dentalTemplates';

const SectionHeading = () => (
  <div className="flex flex-col gap-4 rounded-2xl border border-corporate-blue/40 bg-corporate-navy/20 p-8 shadow-xl backdrop-blur">
    <div className="flex items-center gap-3 text-corporate-platinum">
      <Sparkles className="h-6 w-6 text-revenue-green" />
      <span className="text-sm uppercase tracking-[0.3em]">Twilio Ready Email Ops</span>
    </div>
    <div className="flex flex-col gap-3">
      <h1 className="text-4xl font-semibold text-white drop-shadow">Dental Coverage Template Deck</h1>
      <p className="max-w-3xl text-base text-corporate-silver">
        Visualize the top ten templates from the 50-email library. Each tile distills persona targeting, CTA strategy, dynamic field mapping, and the exact HTML payload you can sync into Twilio SendGrid via your Supabase-powered automation flows.
main
main
      </p>
    </div>
    <div className="flex flex-wrap gap-3">
      <Badge className="bg-corporate-blue/80 text-white">Liquid glass UI preview</Badge>
      <Badge className="bg-revenue-green/80 text-corporate-charcoal">Supabase metadata ready</Badge>
 codex/find-email-templates-for-dental-and-precare-coverage-bku57i
      <Badge className="bg-corporate-crimson/70 text-white">Twilio SendGrid compliant</Badge>
      <Badge className="bg-amber-500/70 text-corporate-charcoal">Twilio RCS optimized</Badge>
=======
codex/find-email-templates-for-dental-and-precare-coverage-dftp26
      <Badge className="bg-corporate-crimson/70 text-white">Twilio SendGrid compliant</Badge>
      <Badge className="bg-amber-500/70 text-corporate-charcoal">Twilio RCS optimized</Badge>
=======
      <Badge className="bg-corporate-crimson/70 text-white">Twilio template compliant</Badge>
 main
main
    </div>
  </div>
);

type CopyTarget = {
  id: string;
  type: 'subject' | 'body';
};

const TemplateCard = ({ template }: { template: CoverageTemplate }) => {
  const [copied, setCopied] = React.useState<CopyTarget | null>(null);

  React.useEffect(() => {
    if (!copied) return;
    if (typeof window === 'undefined') return;
    const timer = window.setTimeout(() => setCopied(null), 2400);
    return () => window.clearTimeout(timer);
  }, [copied]);

  const handleCopy = async (value: string, type: CopyTarget['type']) => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(value);
        setCopied({ id: template.id, type });
      }
    } catch (error) {
      console.error('Unable to copy template content', error);
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
              {template.category} {template.id.split('-')[1]} — {template.title}
            </CardTitle>
            <CardDescription className="text-sm text-corporate-silver">
              Persona: {template.persona}
            </CardDescription>
          </div>
          <Badge className="bg-corporate-navy/80 text-xs uppercase tracking-wide text-corporate-platinum">
            {template.cta}
          </Badge>
        </div>
        <div className="grid gap-2 text-sm text-corporate-platinum">
          <div>
            <span className="font-semibold text-revenue-green">Subject:</span>{' '}
            <span>{template.subject}</span>
          </div>
          <div className="text-corporate-silver">
            <span className="font-semibold text-corporate-platinum">Preview:</span>{' '}
            {template.preview}
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
            onClick={() => handleCopy(template.subject, 'subject')}
            className="border-corporate-blue/60 bg-background/40 text-corporate-platinum hover:bg-corporate-blue/10"
          >
            {copied?.id === template.id && copied?.type === 'subject' ? (
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
            onClick={() => handleCopy(template.bodyHtml, 'body')}
            className="border-corporate-blue/60 bg-background/40 text-corporate-platinum hover:bg-corporate-blue/10"
          >
            {copied?.id === template.id && copied?.type === 'body' ? (
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
            {template.bodyHtml.split('\n').map((line, index) => (
              <div key={`${template.id}-line-${index}`}>{line}</div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

codex/find-email-templates-for-dental-and-precare-coverage-bku57i
=======
codex/find-email-templates-for-dental-and-precare-coverage-dftp26
 main
const renderActionLabel = (action: RcsTemplate['suggestedActions'][number]) => {
  switch (action.type) {
    case 'openUrl':
      return (
        <div className="flex flex-col">
          <span className="text-corporate-platinum">{action.label}</span>
          <span className="text-xs text-corporate-silver">URL: {action.url}</span>
        </div>
      );
    case 'dialerAction':
      return (
        <div className="flex flex-col">
          <span className="text-corporate-platinum">{action.label}</span>
          <span className="text-xs text-corporate-silver">Dial: {action.phoneNumber}</span>
        </div>
      );
    case 'postback':
      return (
        <div className="flex flex-col">
          <span className="text-corporate-platinum">{action.label}</span>
          <span className="text-xs text-corporate-silver">Payload: {action.data}</span>
        </div>
      );
    default:
      return null;
  }
};

const RcsTemplateCard = ({ template }: { template: RcsTemplate }) => (
  <Card className="relative overflow-hidden border-corporate-blue/40 bg-background/60 shadow-lg backdrop-blur">
    <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-amber-400 via-corporate-blue to-revenue-green opacity-70" />
    <CardHeader className="space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <CardTitle className="text-2xl text-corporate-platinum">
            {template.category} {template.id.split('-')[2]} — {template.title}
          </CardTitle>
          <CardDescription className="text-sm text-corporate-silver">Persona: {template.persona}</CardDescription>
          <CardDescription className="text-sm text-corporate-silver">Scenario: {template.scenario}</CardDescription>
        </div>
        <Badge className="bg-amber-500/80 text-xs uppercase tracking-wide text-corporate-charcoal">
          RCS rich card
        </Badge>
      </div>
      <div className="text-sm text-corporate-platinum">
        <span className="font-semibold text-revenue-green">Primary Message:</span>
        <ScrollArea className="mt-3 h-28 rounded-lg border border-corporate-blue/30 bg-corporate-navy/20 p-3 text-sm text-corporate-platinum">
          {template.primaryMessage}
        </ScrollArea>
      </div>
      {template.media ? (
        <div className="rounded-xl border border-corporate-blue/30 bg-corporate-navy/10 p-4 text-xs text-corporate-silver">
          <div className="flex items-center gap-2 text-corporate-platinum">
            <MessageCircleMore className="h-4 w-4 text-amber-400" /> Media guidance
          </div>
          <div className="mt-2 grid gap-1">
            <span>
              Type: <span className="text-corporate-platinum">{template.media.type}</span>
            </span>
            <span>
              URL placeholder: <span className="text-corporate-platinum">{template.media.url}</span>
            </span>
            <span>
              Alt: <span className="text-corporate-platinum">{template.media.alt}</span>
            </span>
          </div>
        </div>
      ) : null}
      <div className="grid gap-2">
        <span className="text-sm font-semibold text-revenue-green">Suggested actions</span>
        <div className="grid gap-2">
          {template.suggestedActions.map((action, index) => (
            <div
              key={`${template.id}-action-${index}`}
              className="flex items-start gap-3 rounded-xl border border-corporate-blue/30 bg-corporate-navy/10 p-3"
            >
              <Badge className="bg-corporate-blue/70 text-xs uppercase text-white">{action.type}</Badge>
              {renderActionLabel(action)}
            </div>
          ))}
        </div>
      </div>
      <div className="text-sm text-corporate-silver">
        <span className="font-semibold text-corporate-platinum">Fallback SMS:</span> {template.fallbackSms}
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
    <CardContent className="space-y-4 text-sm text-corporate-silver">
      <Separator className="bg-corporate-blue/20" />
      <div>
        <span className="font-semibold text-corporate-platinum">Twilio delivery notes:</span>
        <p className="mt-1 leading-relaxed">{template.twilioNotes}</p>
      </div>
    </CardContent>
  </Card>
);

const TemplateGallery = () => {
  return (
    <div className="space-y-10">
      <HeroHeading />
      <Tabs defaultValue="email" className="space-y-8">
        <TabsList className="w-full justify-start gap-3 rounded-2xl border border-corporate-blue/40 bg-corporate-navy/30 p-2">
          <TabsTrigger
            value="email"
            className="rounded-xl px-4 py-2 text-sm text-corporate-platinum transition data-[state=active]:bg-corporate-blue/60 data-[state=active]:text-white"
          >
            Email templates
          </TabsTrigger>
          <TabsTrigger
            value="rcs"
            className="rounded-xl px-4 py-2 text-sm text-corporate-platinum transition data-[state=active]:bg-amber-400/80 data-[state=active]:text-corporate-charcoal"
          >
            RCS templates
          </TabsTrigger>
        </TabsList>
        <TabsContent value="email" className="space-y-6">
          <div className="grid gap-6 xl:grid-cols-2">
            {topDentalTemplates.map((template) => (
              <TemplateCard key={template.id} template={template} />
            ))}
          </div>
          <div className="rounded-2xl border border-corporate-blue/40 bg-corporate-navy/10 p-6 text-sm text-corporate-platinum">
            Need the full 50-template playbook? Sync the markdown from{' '}
            <a
              href="/docs/email-templates/dental-precare-templates"
              className="font-semibold text-revenue-green underline-offset-4 hover:underline"
            >
              docs/email-templates/dental-precare-templates.md
            </a>{' '}
            into your Supabase storage bucket or marketing knowledge base for complete access.
          </div>
        </TabsContent>
        <TabsContent value="rcs" className="space-y-6">
          <div className="grid gap-6 xl:grid-cols-2">
            {spotlightPetcareRcsTemplates.map((template) => (
              <RcsTemplateCard key={template.id} template={template} />
            ))}
          </div>
          <div className="rounded-2xl border border-corporate-blue/40 bg-corporate-navy/10 p-6 text-sm text-corporate-platinum">
            Need the complete RCS playbook with 20 scripts? Mirror{' '}
            <a
              href="/docs/rcs-templates/petcare-rcs-templates"
              className="font-semibold text-amber-300 underline-offset-4 hover:underline"
            >
              docs/rcs-templates/petcare-rcs-templates.md
            </a>{' '}
            inside Supabase storage or your internal enablement wiki.
          </div>
        </TabsContent>
      </Tabs>
codex/find-email-templates-for-dental-and-precare-coverage-bku57i
=======
const TemplateGallery = () => {
  return (
    <div className="space-y-10">
      <SectionHeading />
      <div className="grid gap-6 xl:grid-cols-2">
        {topDentalTemplates.map((template) => (
          <TemplateCard key={template.id} template={template} />
        ))}
      </div>
      <div className="rounded-2xl border border-corporate-blue/40 bg-corporate-navy/10 p-6 text-sm text-corporate-platinum">
        Need the full 50-template playbook? Sync the markdown from{' '}
        <a
          href="/docs/email-templates/dental-precare-templates"
          className="font-semibold text-revenue-green underline-offset-4 hover:underline"
        >
          docs/email-templates/dental-precare-templates.md
        </a>{' '}
        into your Supabase storage bucket or marketing knowledge base for complete access.
      </div>
main
 main
    </div>
  );
};

export default TemplateGallery;
