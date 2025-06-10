
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Settings, Plus, List } from 'lucide-react';

const TwilioWorkflowManager = () => {
  const [workflows, setWorkflows] = useState([
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

  const [newWorkflow, setNewWorkflow] = useState({
    name: '',
    type: '',
    queue: '',
    priority: ''
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-tactical-green text-black';
      case 'Standby': return 'bg-tactical-yellow text-black';
      case 'Inactive': return 'bg-tactical-red text-white';
      default: return 'bg-secondary';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <List className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold text-primary">Workflow Command Center</h2>
      </div>

      {/* Create New Workflow */}
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
                onChange={(e) => setNewWorkflow(prev => ({ ...prev, name: e.target.value }))}
                className="mt-1"
              />
            </div>
            <div>
              <Label>Workflow Type</Label>
              <Select onValueChange={(value) => setNewWorkflow(prev => ({ ...prev, type: value }))}>
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
              <Select onValueChange={(value) => setNewWorkflow(prev => ({ ...prev, queue: value }))}>
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
              <Select onValueChange={(value) => setNewWorkflow(prev => ({ ...prev, priority: value }))}>
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
          <Button className="mt-4 glow-blue">
            Deploy Workflow
          </Button>
        </CardContent>
      </Card>

      {/* Workflow Monitoring */}
      <Card className="border-border bg-card/50 backdrop-blur">
        <CardHeader>
          <CardTitle>Real-time Workflow Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Active Workflows</p>
              <p className="text-3xl font-bold text-tactical-green">
                {workflows.filter(w => w.status === 'Active').length}
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

      {/* Workflow List */}
      <div className="grid gap-4">
        {workflows.map((workflow) => (
          <Card key={workflow.id} className="border-border bg-card/50 backdrop-blur">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold">{workflow.name}</h3>
                    <Badge className={getStatusColor(workflow.status)}>
                      {workflow.status}
                    </Badge>
                    <Badge variant="outline">{workflow.type}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">SID: {workflow.sid}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">Configure</Button>
                  <Button variant="outline" size="sm">Monitor</Button>
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
                  <p className="text-lg font-bold text-foreground">{workflow.type}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TwilioWorkflowManager;
