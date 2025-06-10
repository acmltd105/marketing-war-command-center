
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Plus, Settings, Bell } from 'lucide-react';

const Dashboard = () => {
  // Mock data for demonstration
  const campaigns = [
    { id: 1, name: "Black Friday Blast", status: "Active", sent: 15420, delivered: 15201, opened: 8945 },
    { id: 2, name: "Product Launch", status: "Scheduled", sent: 0, delivered: 0, opened: 0 },
    { id: 3, name: "Customer Retention", status: "Paused", sent: 8734, delivered: 8621, opened: 4832 },
  ];

  const stats = [
    { label: "Total Campaigns", value: "47", change: "+12%" },
    { label: "Messages Sent", value: "2.4M", change: "+24%" },
    { label: "Delivery Rate", value: "98.7%", change: "+0.3%" },
    { label: "Engagement Rate", value: "34.2%", change: "+5.8%" },
  ];

  return (
    <div className="min-h-screen bg-background tactical-grid p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-primary mb-2">CONTROL CENTER</h1>
          <p className="text-muted-foreground">Twilio Marketing War Machine</p>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" className="glow-blue">
            <Bell className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Settings className="h-4 w-4" />
          </Button>
          <Button className="glow-blue">
            <Plus className="h-4 w-4 mr-2" />
            New Campaign
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <Card key={index} className="border-border bg-card/50 backdrop-blur">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-3xl font-bold text-primary">{stat.value}</p>
                </div>
                <Badge variant="secondary" className="text-tactical-green">
                  {stat.change}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Active Campaigns */}
      <Card className="border-border bg-card/50 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-xl text-primary">Active Operations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {campaigns.map((campaign) => (
              <div key={campaign.id} className="border border-border rounded-lg p-4 bg-secondary/30">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-lg">{campaign.name}</h3>
                    <Badge 
                      variant={campaign.status === 'Active' ? 'default' : campaign.status === 'Scheduled' ? 'secondary' : 'outline'}
                      className={
                        campaign.status === 'Active' ? 'bg-tactical-green text-black' :
                        campaign.status === 'Scheduled' ? 'bg-tactical-yellow text-black' :
                        'bg-tactical-red text-white'
                      }
                    >
                      {campaign.status}
                    </Badge>
                  </div>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
                
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Sent</p>
                    <p className="text-lg font-bold text-primary">{campaign.sent.toLocaleString()}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Delivered</p>
                    <p className="text-lg font-bold text-tactical-cyan">{campaign.delivered.toLocaleString()}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Opened</p>
                    <p className="text-lg font-bold text-tactical-green">{campaign.opened.toLocaleString()}</p>
                  </div>
                </div>

                {campaign.sent > 0 && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Delivery Rate</span>
                      <span>{((campaign.delivered / campaign.sent) * 100).toFixed(1)}%</span>
                    </div>
                    <Progress 
                      value={(campaign.delivered / campaign.sent) * 100} 
                      className="h-2"
                    />
                    <div className="flex justify-between text-sm">
                      <span>Open Rate</span>
                      <span>{((campaign.opened / campaign.delivered) * 100).toFixed(1)}%</span>
                    </div>
                    <Progress 
                      value={(campaign.opened / campaign.delivered) * 100} 
                      className="h-2"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="fixed bottom-6 right-6">
        <div className="flex flex-col gap-3">
          <Button size="lg" className="rounded-full w-14 h-14 glow-blue pulse-tactical">
            <Plus className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
