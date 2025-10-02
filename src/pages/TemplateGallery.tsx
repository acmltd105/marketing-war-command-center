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
      </p>
    </div>
    <div className="flex flex-wrap gap-3">
      <Badge className="bg-corporate-blue/80 text-white">Liquid glass UI preview</Badge>
      <Badge className="bg-revenue-green/80 text-corporate-charcoal">Supabase metadata ready</Badge>
      <Badge className="bg-corporate-crimson/70 text-white">Twilio template compliant</Badge>
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
    </div>
  );
};

export default TemplateGallery;
