import { NavLink } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Activity,
  AlertTriangle,
  BarChart3,
  Coins,
  Database,
  Gauge,
  Globe,
  LayoutDashboard,
  MessageSquare,
  Phone,
  Plus,
  Radar,
  Settings,
  Target,
  Upload,
} from "lucide-react";

const navItems = [
  { name: "Revenue Dashboard", path: "/", icon: LayoutDashboard, badge: null },
  { name: "Financial Command", path: "/financials", icon: Coins, badge: "Live" },
  { name: "Campaign Operations", path: "/campaigns", icon: Target, badge: "3 Active" },
  { name: "Go-To-Market War Map", path: "/war-map", icon: Radar, badge: null },
  { name: "Launch Campaign", path: "/create", icon: Plus, badge: null },
  { name: "DNC Upload", path: "/dnc-upload", icon: Upload, badge: null },
  { name: "Lead Intelligence", path: "/leads", icon: Database, badge: "Ingest" },
  { name: "Journey Builder", path: "/journeys", icon: Gauge, badge: null },
  { name: "Flex Workflows", path: "/workflows", icon: BarChart3, badge: null },
  { name: "Landing & Web Dev", path: "/web-dev", icon: Globe, badge: null },
  { name: "Message Templates", path: "/templates", icon: MessageSquare, badge: "24" },
  { name: "Client Previews", path: "/client-previews", icon: Phone, badge: "Demo" },
  { name: "System Configuration", path: "/settings", icon: Settings, badge: null },
];

const quickStats = [
  { label: "Revenue Generated", value: "$2.4M", tone: "text-revenue-green" },
  { label: "Active Operations", value: "12", tone: "text-corporate-blue" },
  { label: "Queue Processing", value: "847", tone: "text-warning-amber" },
  { label: "System Alerts", value: "2", tone: "text-corporate-crimson" },
];

export const Sidebar = () => {
  return (
    <div className="flex h-screen w-72 flex-col border-r border-sidebar-border bg-sidebar p-4">
      <div className="mb-8 rounded-lg border border-corporate-navy bg-corporate-navy/30 p-4">
        <h1 className="fortune-heading mb-1 text-xl font-bold">REVENUE ENGINE</h1>
        <p className="text-xs text-corporate-silver">Enterprise Command Center</p>
        <div className="mt-2 flex items-center gap-2">
          <Activity className="h-3 w-3 text-revenue-green" />
          <span className="text-xs text-corporate-silver">Systems Operational</span>
        </div>
      </div>

      <div className="mb-6 rounded-lg border border-corporate-charcoal p-4">
        <h3 className="mb-3 text-sm font-semibold text-corporate-platinum">Executive Metrics</h3>
        <div className="space-y-3">
          {quickStats.map((stat) => (
            <div key={stat.label} className="flex items-center justify-between">
              <span className="text-xs text-corporate-silver">{stat.label}</span>
              <span className={`text-sm font-bold ${stat.tone}`}>{stat.value}</span>
            </div>
          ))}
        </div>
      </div>

      <nav className="flex-1">
        <div className="space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-4 py-3 text-sm transition ${
                  isActive
                    ? "bg-corporate-blue text-white font-semibold shadow-[0_12px_28px_-16px_rgba(37,99,235,0.55)]"
                    : "text-corporate-silver hover:bg-corporate-charcoal hover:text-corporate-platinum"
                }`
              }
            >
              <item.icon className="h-4 w-4" />
              <span className="flex-1">{item.name}</span>
              {item.badge && (
                <Badge
                  variant="secondary"
                  className="text-xs font-semibold uppercase tracking-wide text-corporate-platinum"
                >
                  {item.badge}
                </Badge>
              )}
            </NavLink>
          ))}
        </div>
      </nav>

      <div className="mt-6 rounded-lg border border-corporate-crimson/30 bg-corporate-crimson/10 p-4">
        <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold text-corporate-crimson">
          <AlertTriangle className="h-4 w-4" />
          Critical Controls
        </h4>
        <Button
          variant="destructive"
          size="sm"
          className="w-full bg-corporate-crimson text-white hover:bg-corporate-crimson/90"
        >
          Emergency Stop All
        </Button>
      </div>

      <div className="mt-4 flex items-center gap-2 rounded-lg border border-revenue-green/30 bg-revenue-green/10 p-3 text-xs">
        <Activity className="h-3 w-3 animate-pulse text-revenue-green" />
        <span className="text-corporate-silver">All Systems:</span>
        <span className="font-semibold text-revenue-green">OPERATIONAL</span>
      </div>
    </div>
  );
};

export default Sidebar;
