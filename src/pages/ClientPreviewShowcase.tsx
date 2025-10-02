import React from 'react';
import { topDentalTemplates } from '@/data/dentalTemplates';
import { spotlightPetcareRcsTemplates } from '@/data/petcareRcsTemplates';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Phone, Mail, Sparkles, MessageCircle } from 'lucide-react';

const emailPreviews = topDentalTemplates.slice(0, 3);
const rcsPreviews = spotlightPetcareRcsTemplates.slice(0, 3);

const ClientPreviewShowcase = () => {
  return (
    <div className="space-y-10">
      <div className="rounded-3xl border border-corporate-blue/40 bg-corporate-navy/30 p-10 shadow-2xl backdrop-blur">
        <div className="flex flex-col gap-4 text-corporate-platinum">
          <div className="flex items-center gap-3 text-sm uppercase tracking-[0.3em] text-corporate-silver">
            <Sparkles className="h-6 w-6 text-revenue-green" />
            Client Perspective Walkthrough
          </div>
          <h1 className="text-4xl font-semibold text-white drop-shadow">Immersive Coverage Templates</h1>
          <p className="max-w-3xl text-base text-corporate-silver">
            Preview how members experience our top-performing Twilio SendGrid emails and Twilio RCS rich cards. These renders apply
            live template HTML, dynamic field placeholders, and interaction affordances exactly as delivered to petcare and dental
            clients across devices.
          </p>
          <div className="flex flex-wrap gap-3">
            <Badge className="bg-corporate-blue/80 text-white">Email + RCS parity</Badge>
            <Badge className="bg-revenue-green/80 text-corporate-charcoal">Supabase-ready metadata</Badge>
            <Badge className="bg-amber-400/80 text-corporate-charcoal">Twilio device tested</Badge>
          </div>
        </div>
      </div>

      <Tabs defaultValue="email" className="space-y-8">
        <TabsList className="w-full justify-start gap-3 rounded-2xl border border-corporate-blue/40 bg-corporate-navy/30 p-2">
          <TabsTrigger
            value="email"
            className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm text-corporate-platinum transition data-[state=active]:bg-corporate-blue/60 data-[state=active]:text-white"
          >
            <Mail className="h-4 w-4" />
            Email experiences
          </TabsTrigger>
          <TabsTrigger
            value="rcs"
            className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm text-corporate-platinum transition data-[state=active]:bg-amber-400/80 data-[state=active]:text-corporate-charcoal"
          >
            <MessageCircle className="h-4 w-4" />
            RCS conversations
          </TabsTrigger>
        </TabsList>

        <TabsContent value="email" className="space-y-6">
          <div className="grid gap-8 2xl:grid-cols-3">
            {emailPreviews.map((template) => (
              <article
                key={template.id}
                className="flex h-full flex-col overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-b from-corporate-navy/30 via-background/80 to-background shadow-xl"
              >
                <header className="border-b border-white/5 bg-corporate-navy/40 p-6 text-sm text-corporate-platinum">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs uppercase tracking-[0.24em] text-corporate-silver">Dental member email</span>
                      <Badge className="bg-corporate-blue/60 text-white">{template.cta}</Badge>
                    </div>
                    <div className="flex flex-col gap-1">
                      <p className="text-xs text-corporate-silver">Subject</p>
                      <p className="text-base font-semibold text-white">{template.subject}</p>
                    </div>
                    <div className="flex flex-col gap-1">
                      <p className="text-xs text-corporate-silver">Preview</p>
                      <p className="text-sm text-corporate-platinum">{template.preview}</p>
                    </div>
                  </div>
                </header>
                <ScrollArea className="flex-1 bg-white p-8 text-base text-corporate-charcoal">
                  <div
                    className="email-preview-html space-y-4 text-left leading-relaxed text-corporate-charcoal [&_a]:font-semibold [&_a]:text-corporate-blue"
                    dangerouslySetInnerHTML={{ __html: template.bodyHtml }}
                  />
                </ScrollArea>
              </article>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="rcs" className="space-y-8">
          <div className="grid gap-8 lg:grid-cols-3">
            {rcsPreviews.map((template) => (
              <article
                key={template.id}
                className="flex h-full flex-col items-center gap-6 rounded-[40px] border border-corporate-blue/30 bg-corporate-navy/30 p-8 shadow-xl backdrop-blur"
              >
                <div className="flex w-full items-center justify-between text-sm text-corporate-platinum">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-amber-300" />
                    <span className="uppercase tracking-[0.24em] text-corporate-silver">Twilio RCS</span>
                  </div>
                  <Badge className="bg-amber-400/80 text-corporate-charcoal">{template.category}</Badge>
                </div>
                <div className="relative w-full max-w-[320px] rounded-[42px] border border-corporate-blue/20 bg-gradient-to-b from-[#0b1623] to-[#050b12] p-6 text-corporate-platinum shadow-inner">
                  <div className="mb-4 flex items-center justify-between text-xs text-corporate-silver">
                    <span>{template.title}</span>
                    <span>{template.persona}</span>
                  </div>
                  <div className="space-y-4 text-sm leading-relaxed">
                    <div className="rounded-3xl bg-white/5 p-4 text-[15px] text-white shadow-lg ring-1 ring-white/10">
                      {template.primaryMessage}
                    </div>
                    {template.media ? (
                      <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/20 p-3 text-xs text-corporate-silver">
                        <p className="text-xs uppercase tracking-[0.18em] text-corporate-silver">Media</p>
                        <p className="text-sm text-white">{template.media.type.toUpperCase()} — {template.media.alt}</p>
                        <p className="text-[11px] text-corporate-silver/80">{template.media.url}</p>
                      </div>
                    ) : null}
                    <div className="space-y-2">
                      {template.suggestedActions.map((action, index) => (
                        <div
                          key={`${template.id}-action-${index}`}
                          className="flex items-center justify-between rounded-2xl bg-amber-400/10 px-4 py-3 text-xs text-amber-200"
                        >
                          <span className="font-semibold uppercase tracking-[0.2em]">{action.type}</span>
                          {'url' in action && action.url ? (
                            <span className="truncate pl-2 text-right text-[11px] text-corporate-platinum">{action.url}</span>
                          ) : null}
                          {'phoneNumber' in action && action.phoneNumber ? (
                            <span className="pl-2 text-right text-[11px] text-corporate-platinum">{action.phoneNumber}</span>
                          ) : null}
                          {'data' in action && action.data ? (
                            <span className="pl-2 text-right text-[11px] text-corporate-platinum">{action.data}</span>
                          ) : null}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="w-full rounded-2xl border border-corporate-blue/30 bg-corporate-navy/40 p-4 text-xs text-corporate-silver">
                  <p className="font-semibold uppercase tracking-[0.24em] text-corporate-platinum">Fallback SMS</p>
                  <p className="mt-2 leading-relaxed text-corporate-platinum">{template.fallbackSms}</p>
                </div>
              </article>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ClientPreviewShowcase;
