import { useState, useMemo } from "react";
import {
  AlertTriangle, Clock, TrendingDown, ShieldAlert, RefreshCw,
  Bell, CheckCircle2, X, ChevronDown, ChevronUp, Filter
} from "lucide-react";
import type { Project } from "@/data/mockData";

export type Alert = {
  id: string;
  type: "stale_data" | "confidence_drop" | "trend_reversal" | "permanence_risk" | "stalling" | "threshold_crossed";
  severity: "critical" | "warning" | "info";
  title: string;
  description: string;
  projectId: string;
  projectName: string;
  timestamp: string;
  action?: string;
};

const severityConfig = {
  critical: {
    border: "border-reversal/30", bg: "bg-reversal-dim",
    icon: "text-reversal", badge: "bg-reversal-dim text-reversal border-reversal/20",
  },
  warning: {
    border: "border-watch/30",   bg: "bg-watch-dim",
    icon: "text-watch",   badge: "bg-watch-dim text-watch border-watch/20",
  },
  info: {
    border: "border-border",     bg: "bg-surface-raised",
    icon: "text-foreground-subtle", badge: "bg-surface-raised text-foreground-muted border-border",
  },
};

const typeIcon = {
  stale_data:        Clock,
  confidence_drop:   ShieldAlert,
  trend_reversal:    TrendingDown,
  permanence_risk:   AlertTriangle,
  stalling:          RefreshCw,
  threshold_crossed: Bell,
};
const typeLabel = {
  stale_data:        "Stale Data",
  confidence_drop:   "Confidence Drop",
  trend_reversal:    "Trend Reversal",
  permanence_risk:   "Permanence Risk",
  stalling:          "Stalling Recovery",
  threshold_crossed: "Threshold Crossed",
};

function generateAlerts(projects: Project[]): Alert[] {
  const alerts: Alert[] = [];
  const now = Date.now();

  projects.forEach((p) => {
    const match = p.lastVerified.match(/^(\d+) days? ago$/);
    const days = match ? parseInt(match[1]) : null;

    if (days && days > 30) {
      alerts.push({
        id: `stale-${p.id}`,
        type: "stale_data",
        severity: days > 60 ? "critical" : "warning",
        title: `Data stale — ${days}d without verification`,
        description: `Last verified ${p.lastVerified}. Confidence scores may be degraded. Field re-verification required before asset issuance.`,
        projectId: p.id,
        projectName: p.name,
        timestamp: new Date(now - days * 86400000).toISOString(),
        action: "Schedule field visit",
      });
    }

    if (p.confidence < 0.60) {
      alerts.push({
        id: `conf-${p.id}`,
        type: "confidence_drop",
        severity: p.confidence < 0.50 ? "critical" : "warning",
        title: `Low confidence — ${(p.confidence * 100).toFixed(0)}% (threshold: 60%)`,
        description: `Evidence is insufficient for RVE asset conversion. Recommend satellite or field verification refresh.`,
        projectId: p.id,
        projectName: p.name,
        timestamp: new Date().toISOString(),
        action: "Request verification",
      });
    }

    if (p.trend === "reversing") {
      alerts.push({
        id: `rev-${p.id}`,
        type: "trend_reversal",
        severity: "critical",
        title: "Recovery reversing",
        description: `${p.type} indicators are regressing from baseline. Intervention required. Asset value at risk of discount.`,
        projectId: p.id,
        projectName: p.name,
        timestamp: new Date().toISOString(),
        action: "Initiate intervention review",
      });
    }

    if (p.trend === "stalling") {
      alerts.push({
        id: `stall-${p.id}`,
        type: "stalling",
        severity: "warning",
        title: "Recovery stalling",
        description: `Progress has plateaued for 2+ consecutive periods. Review constraints, funding allocation, and community engagement.`,
        projectId: p.id,
        projectName: p.name,
        timestamp: new Date().toISOString(),
        action: "Review project constraints",
      });
    }

    if (p.riskLevel === "high") {
      alerts.push({
        id: `risk-${p.id}`,
        type: "permanence_risk",
        severity: "warning",
        title: "High permanence risk",
        description: `Valuation discounted. Permanence risk may affect RVE instrument eligibility and audit renewal.`,
        projectId: p.id,
        projectName: p.name,
        timestamp: new Date().toISOString(),
        action: "Review permanence controls",
      });
    }
  });

  return alerts.sort((a, b) => {
    const order = { critical: 0, warning: 1, info: 2 };
    return order[a.severity] - order[b.severity];
  });
}

function AlertRow({ alert, onDismiss }: { alert: Alert; onDismiss: (id: string) => void }) {
  const [expanded, setExpanded] = useState(false);
  const cfg = severityConfig[alert.severity];
  const Icon = typeIcon[alert.type];

  return (
    <div className={`rounded border ${cfg.border} transition-all`}>
      <div
        className={`flex items-start gap-3 p-3 cursor-pointer hover:bg-surface-raised transition-colors`}
        onClick={() => setExpanded(!expanded)}
      >
        <div className={`p-1.5 rounded flex-shrink-0 ${cfg.bg}`}>
          <Icon size={11} className={cfg.icon} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className={`text-[9px] px-1.5 py-0.5 rounded border font-mono uppercase tracking-widest ${cfg.badge}`}>
                {alert.severity}
              </span>
              <span className="text-[9px] text-foreground-subtle font-mono">{typeLabel[alert.type]}</span>
            </div>
            <div className="flex items-center gap-1">
              {expanded
                ? <ChevronUp size={10} className="text-foreground-subtle" />
                : <ChevronDown size={10} className="text-foreground-subtle" />
              }
              <button
                onClick={(e) => { e.stopPropagation(); onDismiss(alert.id); }}
                className="text-foreground-subtle hover:text-foreground ml-1 p-0.5 rounded hover:bg-surface-overlay transition-colors"
              >
                <X size={10} />
              </button>
            </div>
          </div>
          <div className="text-xs font-medium text-foreground mt-1 leading-snug">{alert.title}</div>
          <div className="text-[10px] text-foreground-subtle font-mono mt-0.5">{alert.projectName}</div>
        </div>
      </div>

      {expanded && (
        <div className="px-3 pb-3 pl-12 space-y-2">
          <p className="text-[10px] text-foreground-subtle leading-relaxed">{alert.description}</p>
          {alert.action && (
            <button className={`text-[10px] px-2.5 py-1 rounded border ${cfg.border} ${cfg.bg} ${cfg.icon} font-mono hover:opacity-80 transition-opacity`}>
              → {alert.action}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

interface Props { projects: Project[] }

export function AlertsPanel({ projects }: Props) {
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState<"all" | "critical" | "warning">("all");
  const [collapsed, setCollapsed] = useState(false);

  const allAlerts = useMemo(() => generateAlerts(projects), [projects]);
  const alerts = allAlerts
    .filter(a => !dismissed.has(a.id))
    .filter(a => filter === "all" || a.severity === filter);

  const critical = allAlerts.filter(a => a.severity === "critical" && !dismissed.has(a.id)).length;
  const warning  = allAlerts.filter(a => a.severity === "warning"  && !dismissed.has(a.id)).length;

  const dismiss = (id: string) => setDismissed(prev => new Set([...prev, id]));
  const dismissAll = () => setDismissed(new Set(allAlerts.map(a => a.id)));

  if (allAlerts.length === 0 || (alerts.length === 0 && dismissed.size === allAlerts.length)) {
    return (
      <div className="bg-surface border border-border rounded-lg p-6 flex items-center gap-4">
        <CheckCircle2 size={28} className="text-recovery flex-shrink-0" />
        <div>
          <div className="text-recovery text-sm font-medium">All signals nominal</div>
          <div className="text-foreground-subtle text-xs mt-0.5">No stale data, reversals, or confidence drops detected.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface border border-border rounded-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div className="flex items-center gap-3">
          <div>
            <div className="text-[10px] text-foreground-subtle uppercase tracking-widest font-mono mb-0.5">Signal Intelligence</div>
            <div className="font-semibold text-foreground text-sm flex items-center gap-2">
              Anomaly Detection
              {critical > 0 && (
                <span className="flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded border border-reversal/20 bg-reversal-dim text-reversal font-mono">
                  <div className="w-1 h-1 rounded-full bg-reversal animate-pulse" />
                  {critical} critical
                </span>
              )}
              {warning > 0 && (
                <span className="text-[10px] px-1.5 py-0.5 rounded border border-watch/20 bg-watch-dim text-watch font-mono">
                  {warning} warning
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Filter */}
          <div className="flex rounded border border-border overflow-hidden">
            {(["all", "critical", "warning"] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`text-[9px] px-2 py-1 font-mono capitalize transition-colors ${
                  filter === f ? "bg-surface-raised text-foreground" : "text-foreground-subtle hover:text-foreground"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          <button
            onClick={dismissAll}
            className="text-[10px] text-foreground-subtle hover:text-foreground px-2 py-1 rounded border border-border transition-colors font-mono"
          >
            Dismiss all
          </button>
          <button onClick={() => setCollapsed(!collapsed)} className="text-foreground-subtle hover:text-foreground">
            {collapsed ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
          </button>
        </div>
      </div>

      {!collapsed && (
        <div className="p-4 space-y-2 max-h-[420px] overflow-y-auto">
          {alerts.length === 0 ? (
            <div className="text-center text-foreground-subtle text-xs py-4 font-mono">No alerts matching filter.</div>
          ) : (
            alerts.map(alert => <AlertRow key={alert.id} alert={alert} onDismiss={dismiss} />)
          )}
        </div>
      )}
    </div>
  );
}
