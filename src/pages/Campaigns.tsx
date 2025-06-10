
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const Campaigns = () => {
  const campaigns = [
    { 
      id: 1, 
      name: "Black Friday Mega Sale", 
      status: "Active", 
      type: "Promotional",
      sent: 15420, 
      delivered: 15201, 
      opened: 8945,
      created: "2024-06-08",
      scheduled: null
    },
    { 
      id: 2, 
      name: "Product Launch Teaser", 
      status: "Scheduled", 
      type: "Promotional",
      sent: 0, 
      delivered: 0, 
      opened: 0,
      created: "2024-06-09",
      scheduled: "2024-06-11 10:00"
    },
    { 
      id: 3, 
      name: "Customer Feedback Survey", 
      status: "Completed", 
      type: "Transactional",
      sent: 8734, 
      delivered: 8621, 
      opened: 4832,
      created: "2024-06-05",
      scheduled: null
    },
    { 
      id: 4, 
      name: "Cart Abandonment Recovery", 
      status: "Paused", 
      type: "Automated",
      sent: 2145, 
      delivered: 2098, 
      opened: 1245,
      created: "2024-06-07",
      scheduled: null
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-tactical-green text-black';
      case 'Scheduled': return 'bg-tactical-yellow text-black';
      case 'Paused': return 'bg-tactical-red text-white';
      case 'Completed': return 'bg-muted text-muted-foreground';
      default: return 'bg-secondary';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">Campaign Management</h1>
          <p className="text-muted-foreground">Monitor and control all marketing operations</p>
        </div>
        <Button className="glow-blue">
          New Campaign
        </Button>
      </div>

      <div className="grid gap-6">
        {campaigns.map((campaign) => (
          <Card key={campaign.id} className="border-border bg-card/50 backdrop-blur">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold">{campaign.name}</h3>
                    <Badge className={getStatusColor(campaign.status)}>
                      {campaign.status}
                    </Badge>
                    <Badge variant="outline">{campaign.type}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Created: {campaign.created}
                    {campaign.scheduled && ` • Scheduled: ${campaign.scheduled}`}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">Edit</Button>
                  <Button variant="outline" size="sm">Duplicate</Button>
                  <Button variant="outline" size="sm">
                    {campaign.status === 'Active' ? 'Pause' : 
                     campaign.status === 'Paused' ? 'Resume' : 'View'}
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Messages Sent</p>
                  <p className="text-2xl font-bold text-primary">{campaign.sent.toLocaleString()}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Delivered</p>
                  <p className="text-2xl font-bold text-tactical-cyan">{campaign.delivered.toLocaleString()}</p>
                  {campaign.sent > 0 && (
                    <p className="text-xs text-muted-foreground">
                      {((campaign.delivered / campaign.sent) * 100).toFixed(1)}% rate
                    </p>
                  )}
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Opened</p>
                  <p className="text-2xl font-bold text-tactical-green">{campaign.opened.toLocaleString()}</p>
                  {campaign.delivered > 0 && (
                    <p className="text-xs text-muted-foreground">
                      {((campaign.opened / campaign.delivered) * 100).toFixed(1)}% rate
                    </p>
                  )}
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Cost</p>
                  <p className="text-2xl font-bold text-foreground">
                    ${(campaign.sent * 0.0075).toFixed(2)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Campaigns;
