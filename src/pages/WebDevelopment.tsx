import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CalendarCheck,
  Figma,
  GitBranch,
  MonitorSmartphone,
  Palette,
  Rocket,
  ServerCog,
} from "lucide-react";

const sprintMilestones = [
  {
    name: "Sprint 24.10",
    focus: "Landing page revamp",
    status: "In Progress",
    progress: 68,
    eta: "Oct 21",
  },
  {
    name: "Sprint 24.11",
    focus: "CMS component library",
    status: "Queued",
    progress: 12,
    eta: "Nov 04",
  },
];

const creativeBrief = [
  "Hero section with realtime revenue telemetry",
  "Modular testimonials with CMS tagging",
  "Server-driven personalization blocks via Segment",
  "ADA & WCAG 2.2 AA compliance report",
];

const deploymentTracks = [
  {
    name: "Staging",
    branch: "feature/landing-liquid-glass",
    status: "Deploying",
    progress: 82,
  },
  {
    name: "Production",
    branch: "main",
    status: "Green",
    progress: 100,
  },
  {
    name: "Preview",
    branch: "pr-482",
    status: "Awaiting QA",
    progress: 54,
  },
];

const WebDevelopment = () => {
  return (
    <div className="min-h-screen bg-background corporate-grid p-6 space-y-8">
      <header className="space-y-2">
        <Badge className="bg-corporate-blue/20 text-corporate-blue border border-corporate-blue/40">
          Creative Ops
        </Badge>
        <h1 className="text-4xl font-bold fortune-heading text-corporate-platinum">
          LANDING & WEBSITE OPERATIONS
        </h1>
        <p className="text-corporate-silver max-w-4xl">
          Coordinate design, development, and release pipelines for marketing web assets. Track Figma delivery,
          code integration, and Twilio-powered personalization from a single command surface.
        </p>
      </header>

      <Tabs defaultValue="landing" className="space-y-6">
        <TabsList className="w-full justify-start gap-2 bg-corporate-charcoal/40 border border-corporate-charcoal">
          <TabsTrigger value="landing" className="data-[state=active]:bg-corporate-blue data-[state=active]:text-white">
            <MonitorSmartphone className="h-4 w-4 mr-2" /> Landing Experience
          </TabsTrigger>
          <TabsTrigger value="website" className="data-[state=active]:bg-corporate-blue data-[state=active]:text-white">
            <Palette className="h-4 w-4 mr-2" /> Website System
          </TabsTrigger>
          <TabsTrigger value="deploy" className="data-[state=active]:bg-corporate-blue data-[state=active]:text-white">
            <Rocket className="h-4 w-4 mr-2" /> Release Pipeline
          </TabsTrigger>
        </TabsList>

        <TabsContent value="landing" className="space-y-6">
          <Card className="executive-card border-corporate-navy">
            <CardHeader>
              <CardTitle className="text-lg text-corporate-platinum">Creative Production</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6 lg:grid-cols-2">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-corporate-platinum font-semibold text-lg flex items-center gap-2">
                    <Figma className="h-5 w-5 text-corporate-gold" /> Figma Delivery
                  </h3>
                  <Badge className="bg-corporate-blue text-white">Sync 1m ago</Badge>
                </div>
                <ul className="list-disc pl-5 text-sm text-corporate-silver space-y-1">
                  {creativeBrief.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <Button variant="outline" className="border-corporate-navy text-corporate-platinum w-fit">
                  View Prototype
                </Button>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-corporate-platinum font-semibold text-lg flex items-center gap-2">
                    <CalendarCheck className="h-5 w-5 text-revenue-green" /> Sprint Tracker
                  </h3>
                  <Badge variant="outline" className="border-revenue-green text-revenue-green">
                    Velocity: 38 pts
                  </Badge>
                </div>
                <div className="space-y-3">
                  {sprintMilestones.map((sprint) => (
                    <div
                      key={sprint.name}
                      className="p-4 rounded-lg border border-corporate-charcoal bg-corporate-charcoal/30 space-y-2"
                    >
                      <div className="flex items-center justify-between text-sm">
                        <p className="text-corporate-platinum font-semibold">{sprint.name}</p>
                        <Badge className="bg-corporate-blue/30 text-corporate-blue">{sprint.status}</Badge>
                      </div>
                      <p className="text-xs text-corporate-silver">{sprint.focus}</p>
                      <Progress value={sprint.progress} className="h-2 bg-corporate-charcoal" />
                      <p className="text-xs text-corporate-silver">ETA {sprint.eta}</p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="website" className="space-y-6">
          <Card className="executive-card border-corporate-charcoal">
            <CardHeader>
              <CardTitle className="text-lg text-corporate-platinum">Component Library</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                {[
                  "Liquid glass hero blocks",
                  "Dynamic KPI tiles",
                  "Twilio-powered signup modals",
                ].map((item) => (
                  <div
                    key={item}
                    className="p-4 rounded-lg border border-corporate-charcoal bg-corporate-charcoal/30 text-sm text-corporate-silver"
                  >
                    {item}
                  </div>
                ))}
              </div>
              <Button variant="outline" className="border-corporate-navy text-corporate-platinum w-fit">
                Sync with CMS
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="deploy" className="space-y-6">
          <Card className="executive-card border-corporate-navy">
            <CardHeader>
              <CardTitle className="text-lg text-corporate-platinum">Deployment Orchestration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {deploymentTracks.map((track) => (
                <div
                  key={track.name}
                  className="p-4 rounded-lg border border-corporate-charcoal bg-corporate-charcoal/30 space-y-2"
                >
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-corporate-platinum font-semibold">
                      <ServerCog className="h-4 w-4 text-corporate-gold" /> {track.name}
                    </div>
                    <Badge className="bg-corporate-blue/30 text-corporate-blue">{track.status}</Badge>
                  </div>
                  <p className="text-xs text-corporate-silver">Source branch: {track.branch}</p>
                  <div className="flex items-center gap-3">
                    <Progress value={track.progress} className="h-2 bg-corporate-charcoal flex-1" />
                    <span className="text-xs text-corporate-platinum font-semibold">{track.progress}%</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-corporate-silver">
                    <GitBranch className="h-4 w-4" /> Twilio Engage personalization hooks deployed after CI smoke
                    tests complete.
                  </div>
                </div>
              ))}
              <Button className="btn-corporate text-white w-fit">
                Launch Production Deploy
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WebDevelopment;
