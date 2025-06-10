
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Circle } from 'lucide-react';

const CampaignCreator = () => {
  const [campaign, setCampaign] = useState({
    name: '',
    type: '',
    message: '',
    audience: '',
    schedule: 'immediate',
    scheduledTime: '',
  });

  const [messageCount, setMessageCount] = useState(0);
  const maxLength = 160;

  const handleMessageChange = (value: string) => {
    setCampaign(prev => ({ ...prev, message: value }));
    setMessageCount(value.length);
  };

  const messageTemplates = [
    {
      name: "Flash Sale",
      content: "🔥 FLASH SALE ALERT! Get 50% OFF everything for the next 24 hours only! Use code FLASH50. Shop now: [link] Reply STOP to opt out."
    },
    {
      name: "Product Launch",
      content: "🚀 NEW PRODUCT ALERT! Be the first to experience our latest innovation. Early bird special: 30% OFF for the first 100 customers! [link]"
    },
    {
      name: "Abandoned Cart",
      content: "Hey [name]! You left something amazing in your cart. Complete your purchase now and get FREE shipping! [link] Reply STOP to opt out."
    }
  ];

  const audienceSegments = [
    { name: "All Subscribers", count: 15420 },
    { name: "VIP Customers", count: 2840 },
    { name: "New Signups", count: 1250 },
    { name: "Inactive Users", count: 3670 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Plus className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold text-primary">Campaign Creator</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Campaign Details */}
        <Card className="border-border bg-card/50 backdrop-blur">
          <CardHeader>
            <CardTitle>Campaign Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="campaignName">Campaign Name</Label>
              <Input
                id="campaignName"
                placeholder="Enter campaign name"
                value={campaign.name}
                onChange={(e) => setCampaign(prev => ({ ...prev, name: e.target.value }))}
                className="mt-1"
              />
            </div>

            <div>
              <Label>Campaign Type</Label>
              <Select onValueChange={(value) => setCampaign(prev => ({ ...prev, type: value }))}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select campaign type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="promotional">Promotional</SelectItem>
                  <SelectItem value="transactional">Transactional</SelectItem>
                  <SelectItem value="notification">Notification</SelectItem>
                  <SelectItem value="reminder">Reminder</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Audience Segment</Label>
              <Select onValueChange={(value) => setCampaign(prev => ({ ...prev, audience: value }))}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select audience" />
                </SelectTrigger>
                <SelectContent>
                  {audienceSegments.map((segment) => (
                    <SelectItem key={segment.name} value={segment.name}>
                      <div className="flex items-center justify-between w-full">
                        <span>{segment.name}</span>
                        <Badge variant="secondary" className="ml-2">
                          {segment.count.toLocaleString()}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Schedule</Label>
              <Select onValueChange={(value) => setCampaign(prev => ({ ...prev, schedule: value }))}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="When to send" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="immediate">Send Immediately</SelectItem>
                  <SelectItem value="scheduled">Schedule for Later</SelectItem>
                  <SelectItem value="optimal">Optimal Send Time</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {campaign.schedule === 'scheduled' && (
              <div>
                <Label htmlFor="scheduledTime">Scheduled Time</Label>
                <Input
                  id="scheduledTime"
                  type="datetime-local"
                  value={campaign.scheduledTime}
                  onChange={(e) => setCampaign(prev => ({ ...prev, scheduledTime: e.target.value }))}
                  className="mt-1"
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Message Composer */}
        <Card className="border-border bg-card/50 backdrop-blur">
          <CardHeader>
            <CardTitle>Message Composer</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label htmlFor="message">Message Content</Label>
                <Badge variant={messageCount > maxLength ? "destructive" : "secondary"}>
                  {messageCount}/{maxLength}
                </Badge>
              </div>
              <Textarea
                id="message"
                placeholder="Craft your message..."
                value={campaign.message}
                onChange={(e) => handleMessageChange(e.target.value)}
                className="min-h-32"
              />
              {messageCount > maxLength && (
                <p className="text-sm text-destructive">Message exceeds SMS character limit</p>
              )}
            </div>

            <div>
              <Label>Quick Templates</Label>
              <div className="grid gap-2 mt-2">
                {messageTemplates.map((template) => (
                  <Button
                    key={template.name}
                    variant="outline"
                    className="justify-start text-left h-auto p-3"
                    onClick={() => handleMessageChange(template.content)}
                  >
                    <div>
                      <div className="font-medium">{template.name}</div>
                      <div className="text-sm text-muted-foreground truncate">
                        {template.content.substring(0, 50)}...
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>

            {/* Preview */}
            <div className="border border-border rounded-lg p-3 bg-secondary/20">
              <Label className="text-sm">Preview</Label>
              <div className="mt-2 p-3 bg-background rounded border">
                <div className="text-sm">
                  {campaign.message || "Your message preview will appear here..."}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Campaign Summary & Actions */}
      <Card className="border-border bg-card/50 backdrop-blur">
        <CardHeader>
          <CardTitle>Campaign Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Target Audience</p>
              <p className="text-2xl font-bold text-primary">
                {campaign.audience ? 
                  audienceSegments.find(s => s.name === campaign.audience)?.count.toLocaleString() || '0' 
                  : '0'
                }
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Estimated Cost</p>
              <p className="text-2xl font-bold text-tactical-green">
                $
                {campaign.audience ? 
                  ((audienceSegments.find(s => s.name === campaign.audience)?.count || 0) * 0.0075).toFixed(2)
                  : '0.00'
                }
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Send Time</p>
              <p className="text-2xl font-bold text-tactical-cyan">
                {campaign.schedule === 'immediate' ? 'Now' : 
                 campaign.schedule === 'optimal' ? 'Optimal' : 'Scheduled'}
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <Button variant="outline" className="flex-1">
              Save Draft
            </Button>
            <Button variant="outline" className="flex-1">
              Preview & Test
            </Button>
            <Button className="flex-1 glow-blue">
              Launch Campaign
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CampaignCreator;
