
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Plus, Settings, Bell, TrendingUp, DollarSign, Users, Target } from 'lucide-react';

const Dashboard = () => {
  // Mock data for demonstration
  const campaigns = [
    { id: 1, name: "Q4 Revenue Accelerator", status: "Active", sent: 15420, delivered: 15201, opened: 8945, revenue: 247500 },
    { id: 2, name: "Enterprise Upsell Campaign", status: "Scheduled", sent: 0, delivered: 0, opened: 0, revenue: 0 },
    { id: 3, name: "Customer Retention Blitz", status: "Paused", sent: 8734, delivered: 8621, opened: 4832, revenue: 156780 },
  ];

  const stats = [
    { 
      label: "Revenue Generated", 
      value: "$2.4M", 
      change: "+24%", 
      icon: DollarSign,
      trend: "positive",
      description: "This quarter"
    },
    { 
      label: "Conversion Rate", 
      value: "34.2%", 
      change: "+5.8%", 
      icon: Target,
      trend: "positive",
      description: "Campaign average"
    },
    { 
      label: "Active Customers", 
      value: "47K", 
      change: "+12%", 
      icon: Users,
      trend: "positive",
      description: "Engaged users"
    },
    { 
      label: "ROI Performance", 
      value: "340%", 
      change: "+45%", 
      icon: TrendingUp,
      trend: "positive",
      description: "Year over year"
    },
  ];

  return (
    <div className="min-h-screen bg-background corporate-grid p-6">
      {/* Executive Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold fortune-heading mb-2">REVENUE COMMAND CENTER</h1>
          <p className="text-corporate-silver">Enterprise Marketing Operations • Fortune 100 Class</p>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" className="glow-corporate">
            <Bell className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" className="border-corporate-navy">
            <Settings className="h-4 w-4" />
          </Button>
          <Button className="btn-corporate text-white font-semibold">
            <Plus className="h-4 w-4 mr-2" />
            Launch Campaign
          </Button>
        </div>
      </div>

      {/* Executive KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <Card key={index} className="executive-card metric-card border-corporate-navy">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="p-2 bg-corporate-blue/10 rounded-lg">
                  <stat.icon className="h-5 w-5 text-corporate-blue" />
                </div>
                <Badge 
                  variant="secondary" 
                  className={`${
                    stat.trend === 'positive' ? 'revenue-indicator' : 'conversion-indicator'
                  } text-background font-bold`}
                >
                  {stat.change}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-corporate-silver mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-corporate-platinum mb-1">{stat.value}</p>
                <p className="text-xs text-corporate-silver">{stat.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Active Revenue Operations */}
      <Card className="executive-card border-corporate-navy">
        <CardHeader>
          <CardTitle className="text-xl text-corporate-platinum">Active Revenue Operations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {campaigns.map((campaign) => (
              <div key={campaign.id} className="metric-card rounded-lg p-6 border-corporate-charcoal">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-lg text-corporate-platinum">{campaign.name}</h3>
                    <div className="flex items-center gap-3 mt-2">
                      <Badge 
                        className={
                          campaign.status === 'Active' ? 'revenue-indicator text-background font-bold' :
                          campaign.status === 'Scheduled' ? 'bg-warning-amber text-background font-bold' :
                          'bg-corporate-crimson text-white font-bold'
                        }
                      >
                        {campaign.status}
                      </Badge>
                      {campaign.revenue > 0 && (
                        <Badge variant="outline" className="border-corporate-gold text-corporate-gold">
                          ${campaign.revenue.toLocaleString()} Revenue
                        </Badge>
                      )}
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="border-corporate-navy text-corporate-platinum">
                    Executive View
                  </Button>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-4">
                  <div className="text-center">
                    <p className="text-sm text-corporate-silver">Messages Sent</p>
                    <p className="text-2xl font-bold text-corporate-blue">{campaign.sent.toLocaleString()}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-corporate-silver">Delivered</p>
                    <p className="text-2xl font-bold text-corporate-emerald">{campaign.delivered.toLocaleString()}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-corporate-silver">Engaged</p>
                    <p className="text-2xl font-bold text-revenue-green">{campaign.opened.toLocaleString()}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-corporate-silver">Revenue Impact</p>
                    <p className="text-2xl font-bold text-corporate-gold">
                      ${(campaign.revenue / 1000).toFixed(0)}K
                    </p>
                  </div>
                </div>

                {campaign.sent > 0 && (
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-corporate-silver">Delivery Performance</span>
                      <span className="text-corporate-emerald font-semibold">
                        {((campaign.delivered / campaign.sent) * 100).toFixed(1)}%
                      </span>
                    </div>
                    <Progress 
                      value={(campaign.delivered / campaign.sent) * 100} 
                      className="h-2 bg-corporate-charcoal"
                    />
                    <div className="flex justify-between text-sm">
                      <span className="text-corporate-silver">Engagement Rate</span>
                      <span className="text-revenue-green font-semibold">
                        {((campaign.opened / campaign.delivered) * 100).toFixed(1)}%
                      </span>
                    </div>
                    <Progress 
                      value={(campaign.opened / campaign.delivered) * 100} 
                      className="h-2 bg-corporate-charcoal"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Executive Quick Actions */}
      <div className="fixed bottom-6 right-6">
        <Button 
          size="lg" 
          className="rounded-full w-16 h-16 btn-corporate glow-premium pulse-corporate shadow-2xl"
        >
          <Plus className="h-8 w-8" />
        </Button>
      </div>
    </div>
  );
};

export default Dashboard;
