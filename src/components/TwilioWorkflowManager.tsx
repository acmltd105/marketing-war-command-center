import React, { DragEvent, useCallback, useMemo, useRef, useState } from 'react';
import ReactFlow, {
  Background,
  Connection,
  Controls,
  Edge,
  MarkerType,
  MiniMap,
  Node,
  NodeProps,
  ReactFlowInstance,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
  addEdge,
  Handle,
  Position
} from 'reactflow';
import 'reactflow/dist/style.css';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { List, Plus, Workflow } from 'lucide-react';

interface WorkflowSummary {
  id: string;
  name: string;
  sid: string;
  status: 'Active' | 'Standby' | 'Inactive';
  type: string;
  tasks: number;
  avgWaitTime: string;
  efficiency: string;
}

interface NewWorkflowState {
  name: string;
  type: string;
  queue: string;
  priority: string;
}

interface StudioNodeData {
  label: string;
  channel: string;
  description: string;
  fallback?: boolean;
}

interface StudioPaletteItem {
  type: StudioBlueprintNodeType;
  label: string;
  channel: string;
  description: string;
  accent: string;
}

type StudioBlueprintNodeType =
  | 'trigger'
  | 'profile'
  | 'rcs'
  | 'status-check'
  | 'sms'
  | 'wait'
  | 'reminder'
  | 'escalate'
  | 'analytics';

const studioPalette: StudioPaletteItem[] = [
  {
    type: 'trigger',
    label: 'Campaign Trigger',
    channel: 'HTTP Trigger',
    description: 'Kick off flow from Supabase Edge Functions, Segment, or Zapier.',
    accent: 'from-sky-500 to-sky-400'
  },
  {
    type: 'profile',
    label: 'Profile Lookup',
    channel: 'Supabase RPC',
    description: 'Hydrate customer preferences, opt-in and sentiment.',
    accent: 'from-violet-500 to-violet-400'
  },
  {
    type: 'rcs',
    label: 'Send RCS',
    channel: 'RCS Rich Card',
    description: 'Deliver hero offers with carousel buttons and callbacks.',
    accent: 'from-emerald-500 to-emerald-400'
  },
  {
    type: 'status-check',
    label: 'Delivery Split',
    channel: 'Callback Event',
    description: 'Branch when delivery fails or timeout occurs.',
    accent: 'from-amber-500 to-amber-400'
  },
  {
    type: 'sms',
    label: 'Send SMS Fallback',
    channel: 'SMS',
    description: 'Graceful fallback copy with shortened tracking links.',
    accent: 'from-rose-500 to-rose-400'
  },
  {
    type: 'wait',
    label: 'Wait For Reply',
    channel: 'Split Based On',
    description: 'Listen for responses, escalate positive conversions.',
    accent: 'from-indigo-500 to-indigo-400'
  },
  {
    type: 'reminder',
    label: 'Reminder Nudge',
    channel: 'SMS + Email',
    description: 'Follow-up blend to keep journey alive and compliant.',
    accent: 'from-cyan-500 to-cyan-400'
  },
  {
    type: 'escalate',
    label: 'Flex Escalation',
    channel: 'TaskRouter',
    description: 'Create prioritized Flex task with transcripts.',
    accent: 'from-fuchsia-500 to-fuchsia-400'
  },
  {
    type: 'analytics',
    label: 'Analytics Update',
    channel: 'Supabase',
    description: 'Persist conversions, opt-outs, and attribution.',
    accent: 'from-lime-500 to-lime-400'
  }
];

const initialStudioNodes: Node<StudioNodeData>[] = [
  {
    id: 'trigger',
    position: { x: 0, y: 0 },
    type: 'studioNode',
    data: {
      label: 'Campaign Trigger',
      channel: 'HTTP Trigger',
      description: 'Start from Supabase Edge Function or inbound webhook.'
    }
  },
  {
    id: 'profile-lookup',
    position: { x: 260, y: -40 },
    type: 'studioNode',
    data: {
      label: 'Profile Lookup',
      channel: 'Supabase RPC',
      description: 'Enrich contact metadata + channel preferences.'
    }
  },
  {
    id: 'send-rcs',
    position: { x: 520, y: -80 },
    type: 'studioNode',
    data: {
      label: 'Send RCS Rich Card',
      channel: 'RCS',
      description: 'Send carousel with CTAs and record delivery callbacks.'
    }
  },
  {
    id: 'delivery-check',
    position: { x: 520, y: 120 },
    type: 'studioNode',
    data: {
      label: 'Delivery Status Split',
      channel: 'Callback Event',
      description: 'Branch when delivery fails or times out.',
      fallback: true
    }
  },
  {
    id: 'send-sms',
    position: { x: 780, y: 80 },
    type: 'studioNode',
    data: {
      label: 'Send SMS Fallback',
      channel: 'SMS',
      description: 'Fallback copy with short link and opt-out language.',
      fallback: true
    }
  },
  {
    id: 'wait',
    position: { x: 780, y: -120 },
    type: 'studioNode',
    data: {
      label: 'Wait For Reply',
      channel: 'Split Based On',
      description: 'Route positive sentiment to Flex agents.'
    }
  },
  {
    id: 'reminder',
    position: { x: 1040, y: 120 },
    type: 'studioNode',
    data: {
      label: 'Reminder Nudge',
      channel: 'SMS + Email',
      description: 'Re-engage after 1 hour with multi-channel message.',
      fallback: true
    }
  },
  {
    id: 'flex',
    position: { x: 1040, y: -80 },
    type: 'studioNode',
    data: {
      label: 'Flex Escalation',
      channel: 'TaskRouter',
      description: 'Create Flex task with transcript + campaign context.'
    }
  },
  {
    id: 'analytics',
    position: { x: 1320, y: -40 },
    type: 'studioNode',
    data: {
      label: 'Analytics Update',
      channel: 'Supabase',
      description: 'Persist engagement + attribution insights.'
    }
  }
];

const initialStudioEdges: Edge[] = [
  {
    id: 'e-trigger-profile',
    source: 'trigger',
    target: 'profile-lookup',
    type: 'smoothstep',
    animated: true,
    markerEnd: { type: MarkerType.ArrowClosed },
    style: { stroke: '#38bdf8', strokeWidth: 2 }
  },
  {
    id: 'e-profile-rcs',
    source: 'profile-lookup',
    target: 'send-rcs',
    type: 'smoothstep',
    markerEnd: { type: MarkerType.ArrowClosed },
    style: { stroke: '#22c55e', strokeWidth: 2 }
  },
  {
    id: 'e-profile-delivery',
    source: 'profile-lookup',
    target: 'delivery-check',
    type: 'smoothstep',
    markerEnd: { type: MarkerType.ArrowClosed },
    style: { stroke: '#f97316', strokeWidth: 2 }
  },
  {
    id: 'e-rcs-wait',
    source: 'send-rcs',
    target: 'wait',
    type: 'smoothstep',
    markerEnd: { type: MarkerType.ArrowClosed },
    style: { stroke: '#0ea5e9', strokeWidth: 2 }
  },
  {
    id: 'e-delivery-sms',
    source: 'delivery-check',
    target: 'send-sms',
    type: 'smoothstep',
    markerEnd: { type: MarkerType.ArrowClosed },
    style: { stroke: '#f97316', strokeWidth: 2 }
  },
  {
    id: 'e-sms-reminder',
    source: 'send-sms',
    target: 'reminder',
    type: 'smoothstep',
    markerEnd: { type: MarkerType.ArrowClosed },
    style: { stroke: '#f97316', strokeWidth: 2 }
  },
  {
    id: 'e-wait-flex',
    source: 'wait',
    target: 'flex',
    type: 'smoothstep',
    markerEnd: { type: MarkerType.ArrowClosed },
    style: { stroke: '#22c55e', strokeWidth: 2 }
  },
  {
    id: 'e-flex-analytics',
    source: 'flex',
    target: 'analytics',
    type: 'smoothstep',
    markerEnd: { type: MarkerType.ArrowClosed },
    style: { stroke: '#6366f1', strokeWidth: 2 }
  },
  {
    id: 'e-reminder-flex',
    source: 'reminder',
    target: 'flex',
    type: 'smoothstep',
    markerEnd: { type: MarkerType.ArrowClosed },
    style: { stroke: '#f97316', strokeWidth: 2 }
  }
];

const StudioNode = ({ data }: NodeProps<StudioNodeData>) => {
  const baseGradient = data.fallback ? 'from-amber-500 to-rose-500' : 'from-sky-500 to-emerald-500';

  return (
    <div className="w-[240px] rounded-2xl border border-white/20 bg-slate-900/70 backdrop-blur shadow-lg shadow-black/20">
      <div className={`rounded-t-2xl px-4 py-2 text-xs font-semibold uppercase text-slate-900 bg-gradient-to-r ${baseGradient}`}>
        {data.channel}
      </div>
      <div className="space-y-1 px-4 py-3">
        <p className="text-base font-semibold text-slate-100">{data.label}</p>
        <p className="text-xs text-slate-300">{data.description}</p>
      </div>
      <Handle type="target" position={Position.Left} className="h-3 w-3 bg-slate-100" />
      <Handle type="source" position={Position.Right} className="h-3 w-3 bg-primary" />
    </div>
  );
};

const nodeTypes = { studioNode: StudioNode };

const getStatusColor = (status: WorkflowSummary['status']) => {
  switch (status) {
    case 'Active':
      return 'bg-tactical-green text-black';
    case 'Standby':
      return 'bg-tactical-yellow text-black';
    case 'Inactive':
      return 'bg-tactical-red text-white';
    default:
      return 'bg-secondary';
  }
};

const TwilioWorkflowManager = () => {
  const [workflows] = useState<WorkflowSummary[]>([
    {
      id: 'wf-1',
      name: 'Customer Support Queue',
      sid: 'WWxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
      status: 'Active',
      type: 'TaskRouter',
      tasks: 156,
      avgWaitTime: '2:34',
      efficiency: '94%'
    },
    {
      id: 'wf-2',
      name: 'Sales Lead Distribution',
      sid: 'WWyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy',
      status: 'Active',
      type: 'Studio',
      tasks: 89,
      avgWaitTime: '1:12',
      efficiency: '97%'
    },
    {
      id: 'wf-3',
      name: 'Emergency Escalation',
      sid: 'WWzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz',
      status: 'Standby',
      type: 'TaskRouter',
      tasks: 0,
      avgWaitTime: '0:00',
      efficiency: '100%'
    }
  ]);

  const [newWorkflow, setNewWorkflow] = useState<NewWorkflowState>({
    name: '',
    type: '',
    queue: '',
    priority: ''
  });

  const studioFlowBlueprint = {
    name: 'RCS-First Lead Nurture Journey',
    objective:
      'Deliver a rich marketing experience via RCS with automated SMS fallback and human escalation for high-intent leads.',
    channels: ['RCS / Google Business Messages', 'SMS Fallback', 'Email Backup', 'Flex Agent Escalation'],
    entryPoints: ['Supabase Edge Function webhook', 'Zapier or Segment marketing trigger', 'Manual agent injection'],
    sla: 'Respond within 5 minutes or automatically re-engage'
  };

  const studioFlowSteps = [
    {
      step: '1',
      action: 'Inbound Campaign Webhook',
      channel: 'HTTP Trigger',
      outcome: 'Start Studio Flow with contact metadata from Supabase profile enrichment.'
    },
    {
      step: '2',
      action: 'Profile Lookup',
      channel: 'Function / Supabase RPC',
      outcome: 'Fetch opt-in status, preferred channel, and previous conversion notes.'
    },
    {
      step: '3',
      action: 'Send RCS Rich Card',
      channel: 'RCS',
      outcome: 'Deliver carousel with offer hero image, CTA buttons, and track delivery callbacks.'
    },
    {
      step: '4',
      action: 'Delivery Status Split',
      channel: 'Callback Event',
      outcome: 'If RCS not delivered within 90 seconds, branch to SMS fallback path.'
    },
    {
      step: '5',
      action: 'Fallback SMS Campaign',
      channel: 'SMS',
      outcome: 'Send concise copy with shortened tracking link and opt-out language.'
    },
    {
      step: '6',
      action: 'Wait for Customer Reply',
      channel: 'Studio Split Based On Input',
      outcome: 'Positive intent routes to Flex task; negative or no response triggers reminder.'
    },
    {
      step: '7',
      action: 'Reminder Nudge',
      channel: 'SMS + Email',
      outcome: 'After 1 hour send MMS reminder and optional email to keep journey alive.'
    },
    {
      step: '8',
      action: 'Flex Agent Escalation',
      channel: 'TaskRouter',
      outcome: 'Create prioritized task with transcript and campaign context.'
    },
    {
      step: '9',
      action: 'Supabase Analytics Update',
      channel: 'PostgREST',
      outcome: 'Write engagement outcome, conversions, and time-to-response for dashboards.'
    }
  ];

  const [nodes, setNodes, onNodesChange] = useNodesState<StudioNodeData>(initialStudioNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialStudioEdges);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);
  const reactFlowWrapper = useRef<HTMLDivElement | null>(null);

  const onConnect = useCallback(
    (connection: Edge | Connection) =>
      setEdges((eds) =>
        addEdge(
          {
            ...connection,
            type: 'smoothstep',
            markerEnd: { type: MarkerType.ArrowClosed },
            style: { stroke: '#38bdf8', strokeWidth: 2 }
          },
          eds
        )
      ),
    [setEdges]
  );

  const paletteLookup = useMemo(() => {
    return studioPalette.reduce<Record<StudioBlueprintNodeType, StudioPaletteItem>>((acc, item) => {
      acc[item.type] = item;
      return acc;
    }, {} as Record<StudioBlueprintNodeType, StudioPaletteItem>);
  }, []);

  const onDragStart = useCallback((event: DragEvent<HTMLDivElement>, nodeType: StudioBlueprintNodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  }, []);

  const onDragOver = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      const type = event.dataTransfer.getData('application/reactflow') as StudioBlueprintNodeType | '';

      if (!type || !reactFlowWrapper.current || !reactFlowInstance) return;

      const bounds = reactFlowWrapper.current.getBoundingClientRect();
      const position = reactFlowInstance.project({
        x: event.clientX - bounds.left,
        y: event.clientY - bounds.top
      });

      const paletteNode = paletteLookup[type];
      if (!paletteNode) return;

      const id = `${type}-${Date.now()}`;
      const newNode: Node<StudioNodeData> = {
        id,
        position,
        type: 'studioNode',
        data: {
          label: paletteNode.label,
          channel: paletteNode.channel,
          description: paletteNode.description,
          fallback: ['sms', 'reminder'].includes(type)
        }
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [paletteLookup, reactFlowInstance, setNodes]
  );

  return (
    <ReactFlowProvider>
      <div className="space-y-6">
        <div className="flex items-center gap-3 mb-6">
          <List className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold text-primary">Workflow Command Center</h2>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="w-full md:w-auto">
            <TabsTrigger value="overview">Operations Dashboard</TabsTrigger>
            <TabsTrigger value="studio">Studio Flow Canvas</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card className="border-border bg-card/50 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Deploy New Workflow
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <Label htmlFor="workflowName">Workflow Name</Label>
                    <Input
                      id="workflowName"
                      placeholder="Support Queue"
                      value={newWorkflow.name}
                      onChange={(e) => setNewWorkflow((prev) => ({ ...prev, name: e.target.value }))}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Workflow Type</Label>
                    <Select onValueChange={(value) => setNewWorkflow((prev) => ({ ...prev, type: value }))}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="taskrouter">TaskRouter</SelectItem>
                        <SelectItem value="studio">Studio Flow</SelectItem>
                        <SelectItem value="functions">Twilio Functions</SelectItem>
                        <SelectItem value="flex">Flex Plugin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Target Queue</Label>
                    <Select onValueChange={(value) => setNewWorkflow((prev) => ({ ...prev, queue: value }))}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select queue" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="support">Customer Support</SelectItem>
                        <SelectItem value="sales">Sales Team</SelectItem>
                        <SelectItem value="technical">Technical Support</SelectItem>
                        <SelectItem value="billing">Billing Inquiries</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Priority Level</Label>
                    <Select onValueChange={(value) => setNewWorkflow((prev) => ({ ...prev, priority: value }))}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Set priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high">High Priority</SelectItem>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="low">Low Priority</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button className="mt-4 glow-blue">Deploy Workflow</Button>
              </CardContent>
            </Card>

            <Card className="border-border bg-card/50 backdrop-blur">
              <CardHeader>
                <CardTitle>Real-time Workflow Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Active Workflows</p>
                    <p className="text-3xl font-bold text-tactical-green">
                      {workflows.filter((w) => w.status === 'Active').length}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Total Tasks</p>
                    <p className="text-3xl font-bold text-tactical-cyan">
                      {workflows.reduce((sum, w) => sum + w.tasks, 0)}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Avg Wait Time</p>
                    <p className="text-3xl font-bold text-primary">1:54</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">System Efficiency</p>
                    <p className="text-3xl font-bold text-tactical-green">96%</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-4">
              {workflows.map((workflow) => (
                <Card key={workflow.id} className="border-border bg-card/50 backdrop-blur">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-semibold">{workflow.name}</h3>
                          <Badge className={getStatusColor(workflow.status)}>{workflow.status}</Badge>
                          <Badge variant="outline">{workflow.type}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">SID: {workflow.sid}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          Configure
                        </Button>
                        <Button variant="outline" size="sm">
                          Monitor
                        </Button>
                        <Button variant="outline" size="sm">
                          {workflow.status === 'Active' ? 'Pause' : 'Activate'}
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Active Tasks</p>
                        <p className="text-2xl font-bold text-primary">{workflow.tasks}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Avg Wait Time</p>
                        <p className="text-2xl font-bold text-tactical-cyan">{workflow.avgWaitTime}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Efficiency</p>
                        <p className="text-2xl font-bold text-tactical-green">{workflow.efficiency}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Type</p>
                        <p className="text-2xl font-bold text-tactical-cyan">{workflow.type}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="studio" className="space-y-6">
            <Card className="border-border bg-card/60 backdrop-blur">
              <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Workflow className="h-5 w-5" />
                    Studio Blueprint Canvas
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Drag widgets onto the canvas to design a Twilio Studio experience with RCS-first routing.
                  </p>
                </div>
                <div className="text-xs text-muted-foreground">
                  Tip: Connect nodes by dragging between handles. Use fallback nodes to model resilience.
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
                  <div className="space-y-4">
                    <div className="rounded-2xl border border-border/60 bg-slate-900/60 p-4 shadow-inner">
                      <h3 className="text-sm font-semibold text-primary">Blueprint Settings</h3>
                      <div className="mt-3 space-y-2 text-xs text-muted-foreground">
                        <p>
                          <span className="font-semibold text-foreground">Objective:</span> {studioFlowBlueprint.objective}
                        </p>
                        <p>
                          <span className="font-semibold text-foreground">Channels:</span> {studioFlowBlueprint.channels.join(', ')}
                        </p>
                        <p>
                          <span className="font-semibold text-foreground">Entry Points:</span> {studioFlowBlueprint.entryPoints.join(', ')}
                        </p>
                        <p>
                          <span className="font-semibold text-foreground">SLA:</span> {studioFlowBlueprint.sla}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h3 className="text-sm font-semibold text-primary">Drag &amp; Drop Widgets</h3>
                      {studioPalette.map((item) => (
                        <div
                          key={item.type}
                          draggable
                          onDragStart={(event) => onDragStart(event, item.type)}
                          className={`cursor-grab rounded-2xl border border-white/10 bg-gradient-to-r ${item.accent} p-4 text-white shadow-lg transition hover:scale-[1.01] active:cursor-grabbing`}
                        >
                          <p className="text-sm font-semibold">{item.label}</p>
                          <p className="text-xs text-white/80">{item.channel}</p>
                          <p className="mt-1 text-[11px] text-white/70">{item.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col gap-4">
                    <div ref={reactFlowWrapper} className="h-[540px] overflow-hidden rounded-3xl border border-border/60 bg-slate-950/80">
                      <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        onConnect={onConnect}
                        nodeTypes={nodeTypes}
                        fitView
                        fitViewOptions={{ padding: 0.2 }}
                        onInit={setReactFlowInstance}
                        onDrop={onDrop}
                        onDragOver={onDragOver}
                        panOnScroll
                        panOnDrag={[1, 2]}
                        zoomOnPinch
                        minZoom={0.4}
                        maxZoom={1.5}
                      >
                        <Background color="#1e293b" gap={24} />
                        <MiniMap pannable zoomable />
                        <Controls position="bottom-left" />
                      </ReactFlow>
                    </div>
                    <div className="rounded-2xl border border-border/60 bg-slate-900/60 p-4">
                      <h3 className="text-sm font-semibold text-primary">Studio JSON Starter</h3>
                      <pre className="mt-2 max-h-52 overflow-auto rounded-xl bg-slate-950/80 p-4 text-xs text-slate-200">
{`{
  "states": [
    { "name": "trigger", "type": "trigger" },
    { "name": "profile_lookup", "type": "run-function", "properties": { "service_sid": "ZSxxxxxxxx" } },
    { "name": "send_rcs", "type": "send-and-wait-for-reply", "properties": { "channel": "rcs" } },
    { "name": "delivery_split", "type": "split-based-on", "properties": { "input": "{{widgets.send_rcs.delivery_status}}" } },
    { "name": "send_sms", "type": "send-message", "properties": { "channel": "sms" } },
    { "name": "flex_task", "type": "create-task", "properties": { "workspace": "Flex" } }
  ]
}`}
                      </pre>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border bg-card/60 backdrop-blur">
              <CardHeader>
                <CardTitle>RCS-First Journey Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[60px]">Step</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Channel</TableHead>
                      <TableHead>Outcome</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {studioFlowSteps.map((step) => (
                      <TableRow key={step.step}>
                        <TableCell className="font-semibold">{step.step}</TableCell>
                        <TableCell>{step.action}</TableCell>
                        <TableCell>{step.channel}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{step.outcome}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ReactFlowProvider>
  );
};

export default TwilioWorkflowManager;
