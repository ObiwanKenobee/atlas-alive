import { useMemo } from "react";
import { AlertTriangle, Clock, TrendingDown, ShieldAlert, RefreshCw } from "lucide-react";
import type { Project } from "@/data/mockData";

export type Alert = {
  id: string;
  type: "stale_data" | "confidence_drop" | "trend_reversal" | "permanence_risk" | "stalling";
  severity: "critical" | "warning" | "info";
  title: string;
  description: string;
  projectId: string;
  projectName: string;
  timestamp: string;
};

const severityConfig = {
  critical: {
    border: "border-reversal/30",
    bg: "bg-reversal-dim",
    icon: "text-reversal",
    badge: "bg-reversal-dim text-reversal border-reversal/20",
    dot: "bg-reversal",
  },
  warning: {
    border: "border-watch/30",
    bg: "bg-watch-dim",
    icon: "text-watch",
    badge: "bg-watch-dim text-watch border-watch/20",
    dot: "bg-watch",
  },
  info: {
    border: "border-border",
    bg: "bg-surface-raised",
    icon: "text-foreground-subtle",
    badge: "bg-surface-raised text-foreground-muted border-border",
    dot: "bg-foreground-subtle",
  },
};

const typeIcon = {
  stale_data:      Clock,
  confidence_drop: ShieldAlert,
  trend_reversal:  TrendingDown,
  permanence_risk: AlertTriangle,
  stalling:        RefreshCw,
};

const typeLabel = {
  stale_data:      "Stale Data",
  confidence_drop: "Confidence Drop",
  trend_reversal:  "Trend Reversal",
  permanence_risk: "Permanence Risk",
  stalling:        "Stalling Recovery",
};

function generateAlerts(projects: Project[]): Alert[] {
  const alerts: Alert[] = [];
  const now = Date.now();

  projects.forEach((p) => {
    // Parse days from lastVerified string
    const match = p.lastVerified.match(/^(\d+) days? ago$/);
    const days = match ? parseInt(match[1]) : null;

    // Stale data alert (>30 days)
    if (days && days > 30) {
      alerts.push({
        id: `stale-${p.id}`,
        type: "stale_data",
        severity: days > 60 ? "critical" : "warning",
        title: `Data stale — ${days} days`,
        description: `Last verified ${p.lastVerified}. Confidence scores may be degraded.`,
        projectId: p.id,
        projectName: p.name,
        timestamp: new Date(now - days * 86400000).toISOString(),
      });
    }

    // Confidence drop alert (<0.60)
    if (p.confidence < 0.60) {
      alerts.push({
        id: `conf-${p.id}`,
        type: "confidence_drop",
        severity: p.confidence < 0.50 ? "critical" : "warning",
        title: `Low confidence score — ${p.confidence.toFixed(2)}`,
        description: `Confidence below threshold. Verification evidence is insufficient for asset conversion.`,
        projectId: p.id,
        projectName: p.name,
        timestamp: new Date().toISOString(),
      });
    }

    // Trend reversal
    if (p.trend === "reversing") {
      alerts.push({
        id: `rev-${p.id}`,
        type: "trend_reversal",
        severity: "critical",
        title: "Recovery reversing",
        description: `${p.type} indicators are regressing from baseline. Intervention required.`,
        projectId: p.id,
        projectName: p.name,
        timestamp: new Date().toISOString(),
      });
    }

    // Stalling
    if (p.trend === "stalling") {
      alerts.push({
        id: `stall-${p.id}`,
        type: "stalling",
        severity: "warning",
        title: "Recovery stalling",
        description: `Recovery progress has plateaued. Review constraints and funding allocation.`,
        projectId: p.id,
        projectName: p.name,
        timestamp: new Date().toISOString(),
      });
    }

    // High risk = permanence risk flag
    if (p.riskLevel === "high") {
      alerts.push({
        id: `risk-${p.id}`,
        type: "permanence_risk",
        severity: "warning",
        title: "High permanence risk",
        description: `Asset valuation discounted. Permanence risk may affect RVE instrument eligibility.`,
        projectId: p.id,
        projectName: p.name,
        timestamp: new Date().toISOString(),
      });
    }
  });

  // Sort: critical first, then by project
  return alerts.sort((a, b) => {
    const order = { critical: 0, warning: 1, info: 2 };
    return order[a.severity] - order[b.severity];
  });
}

function AlertRow({ alert }: { alert: Alert }) {
  const cfg = severityConfig[alert.severity];
  const Icon = typeIcon[alert.type];

  return (
    <div className={`flex items-start gap-3 p-3 rounded border ${cfg.border} group hover:bg-surface-raised transition-colors`}>
      <div className={`p-1.5 rounded flex-shrink-0 ${cfg.bg}`}>
        <Icon size={12} className={cfg.icon} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="text-xs font-medium text-foreground leading-snug">{alert.title}</div>
          <span className={`text-[9px] px-1.5 py-0.5 rounded border font-mono uppercase tracking-widest flex-shrink-0 ${cfg.badge}`}>
            {alert.severity}
          </span>
        </div>
        <div className="text-[10px] text-foreground-subtle mt-0.5 font-mono">{alert.projectName}</div>
        <div className="text-[10px] text-foreground-subtle mt-1 leading-relaxed">{alert.description}</div>
      </div>
    </div>
  );
}

interface Props {
  projects: Project[];
}

export function AlertsPanel({ projects }: Props) {
  const alerts = useMemo(() => generateAlerts(projects), [projects]);
  const critical = alerts.filter((a) => a.severity === "critical").length;
  const warning = alerts.filter((a) => a.severity === "warning").length;

  if (alerts.length === 0) {
    return (
      <div className="bg-surface border border-border rounded-lg p-6 text-center">
        <div className="text-recovery text-sm font-medium mb-1">All signals nominal</div>
        <div className="text-foreground-subtle text-xs">No stale data, reversals, or confidence drops detected.</div>
      </div>
    );
  }

  return (
    <div className="bg-surface border border-border rounded-lg overflow-hidden">
      <div className="flex items-start justify-between px-4 py-3 border-b border-border">
        <div>
          <div className="text-xs text-foreground-subtle uppercase tracking-widest font-mono mb-1">Signal Intelligence</div>
          <div className="font-semibold text-foreground text-sm">At-Risk Alerts</div>
        </div>
        <div className="flex items-center gap-2">
          {critical > 0 && (
            <div className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded border border-reversal/20 bg-reversal-dim text-reversal font-mono">
              <div className="w-1 h-1 rounded-full bg-reversal" />
              {critical} critical
            </div>
          )}
          {warning > 0 && (
            <div className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded border border-watch/20 bg-watch-dim text-watch font-mono">
              <div className="w-1 h-1 rounded-full bg-watch" />
              {warning} warning
            </div>
          )}
        </div>
      </div>
      <div className="p-4 space-y-2 max-h-[400px] overflow-y-auto">
        {alerts.map((alert) => (
          <AlertRow key={alert.id} alert={alert} />
        ))}
      </div>
    </div>
  );
}
