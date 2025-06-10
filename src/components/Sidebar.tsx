
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Settings, 
  Plus, 
  Bell,
  Circle,
  CircleCheck,
  CircleMinus,
  CirclePlus,
  MessageCircle,
  MessageSquare,
  Phone
} from 'lucide-react';

const Sidebar = () => {
  const navItems = [
    { name: 'Dashboard', path: '/', icon: Circle, badge: null },
    { name: 'Campaigns', path: '/campaigns', icon: MessageSquare, badge: '3 Active' },
    { name: 'Create Campaign', path: '/create', icon: Plus, badge: null },
    { name: 'Contacts', path: '/contacts', icon: MessageCircle, badge: '15.4K' },
    { name: 'Analytics', path: '/analytics', icon: CircleCheck, badge: null },
    { name: 'Phone Numbers', path: '/numbers', icon: Phone, badge: '5' },
    { name: 'Templates', path: '/templates', icon: MessageSquare, badge: null },
    { name: 'Settings', path: '/settings', icon: Settings, badge: null },
  ];

  const quickStats = [
    { label: 'Active Campaigns', value: '12', color: 'text-tactical-green' },
    { label: 'Queue', value: '847', color: 'text-tactical-yellow' },
    { label: 'Failed', value: '3', color: 'text-tactical-red' },
  ];

  return (
    <div className="w-64 h-screen bg-sidebar border-r border-sidebar-border p-4 flex flex-col">
      {/* Logo/Brand */}
      <div className="mb-8">
        <h1 className="text-xl font-bold text-primary mb-1">WAR MACHINE</h1>
        <p className="text-xs text-muted-foreground">Twilio Control Center</p>
      </div>

      {/* Quick Stats */}
      <div className="mb-6 p-3 bg-sidebar-accent rounded-lg">
        <h3 className="text-sm font-medium mb-3 text-sidebar-foreground">System Status</h3>
        <div className="space-y-2">
          {quickStats.map((stat) => (
            <div key={stat.label} className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">{stat.label}</span>
              <span className={`text-sm font-bold ${stat.color}`}>{stat.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1">
        <div className="space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                  isActive
                    ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent'
                }`
              }
            >
              <item.icon className="h-4 w-4" />
              <span className="flex-1">{item.name}</span>
              {item.badge && (
                <Badge variant="secondary" className="text-xs">
                  {item.badge}
                </Badge>
              )}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Emergency Actions */}
      <div className="mt-6 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
        <h4 className="text-sm font-medium text-destructive mb-2">Emergency Controls</h4>
        <Button variant="destructive" size="sm" className="w-full">
          <CircleMinus className="h-4 w-4 mr-2" />
          Pause All Campaigns
        </Button>
      </div>

      {/* Connection Status */}
      <div className="mt-4 flex items-center gap-2 text-xs">
        <Circle className="h-2 w-2 text-tactical-green" />
        <span className="text-muted-foreground">Twilio Connected</span>
      </div>
    </div>
  );
};

export default Sidebar;
