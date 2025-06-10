import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Workflow, Circle, ArrowRight } from 'lucide-react';

const MarketingJourneyBuilder = () => {
  const [journeys, setJourneys] = useState([
    {
      id: 'journey-1',
      name: 'Welcome Series',
      status: 'Active',
      trigger: 'User Sign-up',
      steps: 5,
      contacts: 2450,
      conversion: '24.5%'
    },
    {
      id: 'journey-2',
      name: 'Cart Abandonment',
      status: 'Draft',
      trigger: 'Cart Abandoned',
      steps: 3,
      contacts: 0,
      conversion: '0%'
    }
  ]);

  const [newJourney, setNewJourney] = useState({
    name: '',
    trigger: '',
    description: ''
  });

  const journeySteps = [
    { type: 'trigger', name: 'Entry Trigger', description: 'When a user signs up' },
    { type: 'wait', name: 'Wait 1 hour', description: 'Give users time to explore' },
    { type: 'sms', name: 'Welcome SMS', description: 'Send welcome message' },
    { type: 'wait', name: 'Wait 24 hours', description: 'Let message sink in' },
    { type: 'email', name: 'Follow-up Email', description: 'Send getting started guide' },
    { type: 'condition', name: 'Check Engagement', description: 'Did they open email?' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-tactical-green text-black';
      case 'Draft': return 'bg-tactical-yellow text-black';
      case 'Paused': return 'bg-tactical-red text-white';
      default: return 'bg-secondary';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Workflow className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold text-primary">Marketing Journey Builder</h2>
      </div>

      {/* Create New Journey */}
      <Card className="border-border bg-card/50 backdrop-blur">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Create New Journey
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="journeyName">Journey Name</Label>
              <Input
                id="journeyName"
                placeholder="Welcome Series"
                value={newJourney.name}
                onChange={(e) => setNewJourney(prev => ({ ...prev, name: e.target.value }))}
                className="mt-1"
              />
            </div>
            <div>
              <Label>Entry Trigger</Label>
              <Select onValueChange={(value) => setNewJourney(prev => ({ ...prev, trigger: value }))}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select trigger" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="signup">User Sign-up</SelectItem>
                  <SelectItem value="purchase">Purchase Made</SelectItem>
                  <SelectItem value="cart-abandon">Cart Abandoned</SelectItem>
                  <SelectItem value="email-open">Email Opened</SelectItem>
                  <SelectItem value="sms-click">SMS Clicked</SelectItem>
                  <SelectItem value="custom-event">Custom Event</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button className="glow-blue w-full">
                Start Building
              </Button>
            </div>
          </div>
          <div className="mt-4">
            <Label htmlFor="journeyDescription">Description</Label>
            <Textarea
              id="journeyDescription"
              placeholder="Describe your journey..."
              value={newJourney.description}
              onChange={(e) => setNewJourney(prev => ({ ...prev, description: e.target.value }))}
              className="mt-1"
            />
          </div>
        </CardContent>
      </Card>

      {/* Journey Visual Builder */}
      <Card className="border-border bg-card/50 backdrop-blur">
        <CardHeader>
          <CardTitle>Journey Flow Designer</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 max-w-4xl">
            {journeySteps.map((step, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="flex-shrink-0">
                  <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center ${
                    step.type === 'trigger' ? 'bg-tactical-green border-tactical-green' :
                    step.type === 'sms' ? 'bg-tactical-cyan border-tactical-cyan' :
                    step.type === 'email' ? 'bg-tactical-blue border-tactical-blue' :
                    step.type === 'wait' ? 'bg-tactical-yellow border-tactical-yellow' :
                    'bg-primary border-primary'
                  }`}>
                    <Circle className="h-4 w-4 text-black" fill="currentColor" />
                  </div>
                </div>
                <div className="flex-1 bg-secondary/30 border border-border rounded-lg p-4">
                  <h4 className="font-semibold">{step.name}</h4>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>
                {index < journeySteps.length - 1 && (
                  <ArrowRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                )}
              </div>
            ))}
          </div>
          <div className="mt-6 flex gap-4">
            <Button variant="outline">Add Step</Button>
            <Button variant="outline">Add Condition</Button>
            <Button variant="outline">Add Wait</Button>
            <Button className="glow-blue">Save Journey</Button>
          </div>
        </CardContent>
      </Card>

      {/* Existing Journeys */}
      <div className="grid gap-4">
        {journeys.map((journey) => (
          <Card key={journey.id} className="border-border bg-card/50 backdrop-blur">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold">{journey.name}</h3>
                    <Badge className={getStatusColor(journey.status)}>
                      {journey.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">Trigger: {journey.trigger}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">Edit</Button>
                  <Button variant="outline" size="sm">Analytics</Button>
                  <Button variant="outline" size="sm">
                    {journey.status === 'Active' ? 'Pause' : 'Activate'}
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Steps</p>
                  <p className="text-2xl font-bold text-primary">{journey.steps}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Active Contacts</p>
                  <p className="text-2xl font-bold text-tactical-cyan">{journey.contacts.toLocaleString()}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Conversion</p>
                  <p className="text-2xl font-bold text-tactical-green">{journey.conversion}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Performance</p>
                  <div className="flex justify-center">
                    <Circle className="h-6 w-6 text-tactical-green" fill="currentColor" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MarketingJourneyBuilder;
