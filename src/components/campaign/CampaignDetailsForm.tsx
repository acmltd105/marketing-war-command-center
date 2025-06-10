
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

interface CampaignDetailsFormProps {
  campaign: {
    name: string;
    type: string;
    audience: string;
    schedule: string;
    scheduledTime: string;
  };
  onCampaignChange: (updates: Partial<typeof campaign>) => void;
  audienceSegments: Array<{ name: string; count: number }>;
}

const CampaignDetailsForm = ({ campaign, onCampaignChange, audienceSegments }: CampaignDetailsFormProps) => {
  return (
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
            onChange={(e) => onCampaignChange({ name: e.target.value })}
            className="mt-1"
          />
        </div>

        <div>
          <Label>Campaign Type</Label>
          <Select onValueChange={(value) => onCampaignChange({ type: value })}>
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
          <Select onValueChange={(value) => onCampaignChange({ audience: value })}>
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
          <Select onValueChange={(value) => onCampaignChange({ schedule: value })}>
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
              onChange={(e) => onCampaignChange({ scheduledTime: e.target.value })}
              className="mt-1"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CampaignDetailsForm;
