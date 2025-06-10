
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface CampaignSummaryProps {
  campaign: {
    audience: string;
    schedule: string;
  };
  audienceSegments: Array<{ name: string; count: number }>;
}

const CampaignSummary = ({ campaign, audienceSegments }: CampaignSummaryProps) => {
  const selectedSegment = audienceSegments.find(s => s.name === campaign.audience);
  const targetCount = selectedSegment?.count || 0;
  const estimatedCost = (targetCount * 0.0075).toFixed(2);

  return (
    <Card className="border-border bg-card/50 backdrop-blur">
      <CardHeader>
        <CardTitle>Campaign Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Target Audience</p>
            <p className="text-2xl font-bold text-primary">
              {targetCount.toLocaleString()}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Estimated Cost</p>
            <p className="text-2xl font-bold text-tactical-green">
              ${estimatedCost}
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
  );
};

export default CampaignSummary;
