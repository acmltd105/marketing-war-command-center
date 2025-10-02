
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Settings,
  Plus,
  LayoutDashboard,
  Target,
  Users,
  BarChart3,
  Phone,
  FileText,
  AlertTriangle,
  Activity,
 codex/set-up-dashboard-for-project-overview
  Globe,
  Database
=======
 codex/integrate-revenue-and-expense-tabs-ugnmqm
  Upload,
  Coins
codex/integrate-revenue-and-expense-tabs-qmhblg
  Upload,
  Coins
codex/define-lead-processing-and-marketing-workflow
  Radar
  Upload
 main
 main
 main
 main
} from 'lucide-react';

const Sidebar = () => {
  const navItems = [
    { name: 'Revenue Dashboard', path: '/', icon: LayoutDashboard, badge: null },
    { name: 'Financial Command', path: '/financials', icon: Coins, badge: 'New' },
    { name: 'Campaign Operations', path: '/campaigns', icon: Target, badge: '3 Active' },
    { name: 'Go-To-Market War Map', path: '/war-map', icon: Radar, badge: null },
    { name: 'Launch Campaign', path: '/create', icon: Plus, badge: null },
    { name: 'DNC Upload', path: '/dnc-upload', icon: Upload, badge: null },
    { name: 'Customer Database', path: '/contacts', icon: Users, badge: '47K' },
    { name: 'Lead Intelligence', path: '/leads', icon: Database, badge: 'Ingest' },
    { name: 'Performance Analytics', path: '/analytics', icon: BarChart3, badge: null },
    { name: 'Communication Assets', path: '/numbers', icon: Phone, badge: '12' },
    { name: 'Message Templates', path: '/templates', icon: FileText, badge: '24' },
    { name: 'Landing & Web Dev', path: '/web-dev', icon: Globe, badge: null },
    { name: 'System Configuration', path: '/settings', icon: Settings, badge: null },
  ];

  const quickStats = [
    { label: 'Revenue Generated', value: '$2.4M', color: 'text-revenue-green' },
    { label: 'Active Operations', value: '12', color: 'text-corporate-blue' },
    { label: 'Queue Processing', value: '847', color: 'text-warning-amber' },
    { label: 'System Alerts', value: '2', color: 'text-corporate-crimson' },
  ];

  return (
    <div className="w-72 h-screen bg-sidebar border-r border-sidebar-border p-4 flex flex-col">
      {/* Corporate Brand */}
      <div className="mb-8 p-4 bg-corporate-navy/30 rounded-lg border border-corporate-navy">
        <h1 className="text-xl font-bold fortune-heading mb-1">REVENUE ENGINE</h1>
        <p className="text-xs text-corporate-silver">Enterprise Command Center</p>
        <div className="flex items-center gap-2 mt-2">
          <Activity className="h-3 w-3 text-revenue-green" />
          <span className="text-xs text-corporate-silver">Systems Operational</span>
        </div>
      </div>

      {/* Executive Metrics */}
      <div className="mb-6 p-4 metric-card rounded-lg border-corporate-charcoal">
        <h3 className="text-sm font-semibold mb-3 text-corporate-platinum">Executive Metrics</h3>
        <div className="space-y-3">
          {quickStats.map((stat) => (
            <div key={stat.label} className="flex justify-between items-center">
              <span className="text-xs text-corporate-silver">{stat.label}</span>
              <span className={`text-sm font-bold ${stat.color}`}>{stat.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1">
        <div className="space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all duration-200 ${
                  isActive
                    ? 'bg-corporate-blue text-white font-semibold glow-corporate'
                    : 'text-corporate-silver hover:bg-corporate-charcoal hover:text-corporate-platinum'
                }`
              }
            >
              <item.icon className="h-4 w-4" />
              <span className="flex-1">{item.name}</span>
              {item.badge && (
                <Badge 
                  variant="secondary" 
                  className="text-xs bg-corporate-navy text-corporate-platinum font-semibold"
                >
                  {item.badge}
                </Badge>
              )}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Critical System Controls */}
      <div className="mt-6 p-4 bg-corporate-crimson/10 border border-corporate-crimson/30 rounded-lg">
        <h4 className="text-sm font-semibold text-corporate-crimson mb-3 flex items-center gap-2">
          <AlertTriangle className="h-4 w-4" />
          Critical Controls
        </h4>
        <Button 
          variant="destructive" 
          size="sm" 
          className="w-full bg-corporate-crimson hover:bg-corporate-crimson/90 text-white font-semibold"
        >
          Emergency Stop All
        </Button>
      </div>

      {/* System Status */}
      <div className="mt-4 flex items-center gap-2 text-xs p-3 bg-revenue-green/10 rounded-lg border border-revenue-green/30">
        <Activity className="h-3 w-3 text-revenue-green animate-pulse" />
        <span className="text-corporate-silver">All Systems: </span>
        <span className="text-revenue-green font-semibold">OPERATIONAL</span>
      </div>
    </div>
  );
};

export default Sidebar;
