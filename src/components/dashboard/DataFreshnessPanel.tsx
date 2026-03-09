import { useState } from "react";
import {
  Satellite, FlaskConical, Users, Brain, ShieldCheck,
  RefreshCw, Clock, AlertTriangle, CheckCircle2, X, Wifi
} from "lucide-react";

interface FeedSource {
  id: string;
  label: string;
  icon: React.ElementType;
  iconColor: string;
  lastUpdated: string;
  ageHours: number;
  staleThresholdHours: number;
  coverage: number;
  status: "current" | "stale" | "critical" | "refreshing";
  latency: string;
  syncMethod: string;
  nextScheduled: string;
}

const INITIAL_FEEDS: FeedSource[] = [
  {
    id: "satellite",
    label: "Sentinel-2 Satellite",
    icon: Satellite,
    iconColor: "text-recovery",
    lastUpdated: "2025-03-07 14:22 UTC",
    ageHours: 48,
    staleThresholdHours: 72,
    coverage: 0.82,
    status: "current",
    latency: "~4h processing delay",
    syncMethod: "ESA Sentinel Hub API · 16-day revisit",
    nextScheduled: "2025-03-09 14:00 UTC",
  },
  {
    id: "field",
    label: "Field Sensors & Surveys",
    icon: FlaskConical,
    iconColor: "text-water",
    lastUpdated: "2025-03-02 09:00 UTC",
    ageHours: 168,
    staleThresholdHours: 120,
    coverage: 0.61,
    status: "stale",
    latency: "Manual submission cycle",
    syncMethod: "KoboToolbox API · weekly field rounds",
    nextScheduled: "2025-03-10 09:00 UTC",
  },
  {
    id: "community",
    label: "Community Monitors",
    icon: Users,
    iconColor: "text-watch",
    lastUpdated: "2025-03-08 20:44 UTC",
    ageHours: 18,
    staleThresholdHours: 48,
    coverage: 0.44,
    status: "current",
    latency: "~2h aggregation lag",
    syncMethod: "ODK Collect · 1,240 monitors · weekly",
    nextScheduled: "2025-03-09 08:00 UTC",
  },
  {
    id: "model",
    label: "AI Inference Model",
    icon: Brain,
    iconColor: "text-foreground-muted",
    lastUpdated: "2025-03-09 06:00 UTC",
    ageHours: 6,
    staleThresholdHours: 24,
    coverage: 0.78,
    status: "current",
    latency: "Real-time inference on trigger",
    syncMethod: "EcoPulse v2.1 · event-driven retraining",
    nextScheduled: "Rolling",
  },
  {
    id: "audit",
    label: "Third-Party Audit",
    icon: ShieldCheck,
    iconColor: "text-accent",
    lastUpdated: "2024-11-15 00:00 UTC",
    ageHours: 2736,
    staleThresholdHours: 2160,
    coverage: 0.91,
    status: "critical",
    latency: "Annual cycle",
    syncMethod: "Verra VCS + Gold Standard · manual submission",
    nextScheduled: "Q1 2026",
  },
];

const statusConfig = {
  current:     { label: "Current",    color: "text-recovery", border: "border-recovery/20", bg: "bg-recovery-dim",   dot: "bg-recovery" },
  stale:       { label: "Stale",      color: "text-watch",    border: "border-watch/20",    bg: "bg-watch-dim",     dot: "bg-watch" },
  critical:    { label: "Overdue",    color: "text-reversal", border: "border-reversal/20", bg: "bg-reversal-dim",  dot: "bg-reversal animate-pulse" },
  refreshing:  { label: "Syncing…",   color: "text-water",    border: "border-water/20",    bg: "bg-water-dim",     dot: "bg-water animate-pulse" },
};

function formatAge(hours: number): string {
  if (hours < 1) return "< 1h ago";
  if (hours < 24) return `${hours}h ago`;
  const d = Math.floor(hours / 24);
  return `${d}d ago`;
}

interface Props {
  open: boolean;
  onClose: () => void;
}

export function DataFreshnessPanel({ open, onClose }: Props) {
  const [feeds, setFeeds] = useState<FeedSource[]>(INITIAL_FEEDS);
  const [refreshing, setRefreshing] = useState<string | null>(null);

  const triggerRefresh = async (id: string) => {
    setRefreshing(id);
    setFeeds(prev => prev.map(f => f.id === id ? { ...f, status: "refreshing" } : f));
    await new Promise(r => setTimeout(r, 1800));
    setFeeds(prev => prev.map(f =>
      f.id === id
        ? {
            ...f,
            status: f.ageHours > f.staleThresholdHours * 2 ? "stale" : "current",
            lastUpdated: new Date().toUTCString().replace("GMT", "UTC"),
            ageHours: Math.max(1, f.ageHours - 24),
          }
        : f
    ));
    setRefreshing(null);
  };

  const staleFeedsCount = feeds.filter(f => f.status === "stale" || f.status === "critical").length;

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 bg-background/60 backdrop-blur-sm" onClick={onClose} />

      <div className="fixed right-0 top-0 h-full z-50 w-full max-w-md bg-surface border-l border-border flex flex-col shadow-2xl animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div>
            <div className="text-[10px] font-mono text-foreground-subtle uppercase tracking-widest mb-0.5">Sync Status</div>
            <div className="font-semibold text-foreground flex items-center gap-2">
              Data Freshness
              {staleFeedsCount > 0 && (
                <span className="flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded border border-watch/20 bg-watch-dim text-watch font-mono">
                  <AlertTriangle size={8} />
                  {staleFeedsCount} stale
                </span>
              )}
            </div>
          </div>
          <button onClick={onClose} className="text-foreground-subtle hover:text-foreground p-1.5 rounded hover:bg-surface-raised transition-colors">
            <X size={16} />
          </button>
        </div>

        {/* Overall sync health */}
        <div className="px-5 py-3 border-b border-border bg-surface-raised/50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] text-foreground-subtle uppercase tracking-widest font-mono">Overall Freshness</span>
            <div className="flex items-center gap-1.5 text-[10px] font-mono">
              <Wifi size={10} className="text-recovery" />
              <span className="text-recovery">Realtime connected</span>
            </div>
          </div>
          <div className="h-1.5 bg-surface-overlay rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-recovery to-watch rounded-full transition-all"
              style={{ width: `${((feeds.filter(f => f.status === "current").length / feeds.length) * 100).toFixed(0)}%` }}
            />
          </div>
          <div className="flex justify-between text-[9px] text-foreground-subtle font-mono mt-1">
            <span>{feeds.filter(f => f.status === "current").length} of {feeds.length} sources current</span>
            <span>{((feeds.filter(f => f.status === "current").length / feeds.length) * 100).toFixed(0)}% freshness</span>
          </div>
        </div>

        {/* Feed list */}
        <div className="flex-1 overflow-y-auto">
          {feeds.map(feed => {
            const Icon = feed.icon;
            const cfg = statusConfig[feed.status];
            const isRefreshing = refreshing === feed.id;
            const isOverdue = feed.ageHours > feed.staleThresholdHours;

            return (
              <div key={feed.id} className={`border-b border-border p-5 ${isOverdue ? "bg-reversal-dim/10" : ""}`}>
                <div className="flex items-start gap-3">
                  {/* Icon */}
                <div className={`p-2 rounded-lg border ${cfg.border} ${cfg.bg} flex-shrink-0`}>
                    <Icon size={15} className={feed.iconColor} />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-sm font-medium text-foreground">{feed.label}</span>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded border font-mono flex items-center gap-1 ${cfg.border} ${cfg.bg} ${cfg.color}`}>
                        <span className={`w-1 h-1 rounded-full ${cfg.dot}`} />
                        {cfg.label}
                      </span>
                    </div>

                    {/* Last update */}
                    <div className="flex items-center gap-1.5 text-[10px] text-foreground-subtle font-mono mb-2">
                      <Clock size={9} />
                      <span>{formatAge(feed.ageHours)}</span>
                      <span className="opacity-50">·</span>
                      <span className="text-foreground-subtle opacity-70">{feed.lastUpdated}</span>
                    </div>

                    {/* Coverage bar */}
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex-1 h-1 bg-surface-overlay rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${feed.coverage >= 0.7 ? "bg-recovery" : feed.coverage >= 0.5 ? "bg-watch" : "bg-reversal"}`}
                          style={{ width: `${feed.coverage * 100}%` }}
                        />
                      </div>
                      <span className="text-[9px] text-foreground-subtle font-mono">{(feed.coverage * 100).toFixed(0)}% coverage</span>
                    </div>

                    {/* Metadata */}
                    <div className="space-y-0.5 text-[9px] text-foreground-subtle font-mono">
                      <div>Method: {feed.syncMethod}</div>
                      <div>Latency: {feed.latency}</div>
                      <div>Next: {feed.nextScheduled}</div>
                    </div>

                    {/* Stale warning */}
                    {isOverdue && feed.status !== "refreshing" && (
                      <div className={`mt-2 flex items-center gap-1.5 text-[10px] px-2 py-1 rounded border ${cfg.border} ${cfg.bg} ${cfg.color}`}>
                        <AlertTriangle size={9} />
                        {feed.status === "critical"
                          ? `Overdue by ${Math.floor((feed.ageHours - feed.staleThresholdHours) / 24)}d — asset issuance affected`
                          : `Stale by ${feed.ageHours - feed.staleThresholdHours}h — confidence degraded`
                        }
                      </div>
                    )}
                  </div>
                </div>

                {/* Refresh button */}
                {feed.id !== "audit" && (
                  <button
                    onClick={() => triggerRefresh(feed.id)}
                    disabled={isRefreshing || !!refreshing}
                    className={`mt-3 w-full flex items-center justify-center gap-2 py-1.5 rounded border text-[11px] font-mono transition-all
                      ${isRefreshing
                        ? "border-water/30 bg-water-dim text-water"
                        : "border-border text-foreground-subtle hover:text-foreground hover:border-recovery/30 hover:bg-recovery-dim"
                      } disabled:opacity-50`}
                  >
                    <RefreshCw size={11} className={isRefreshing ? "animate-spin" : ""} />
                    {isRefreshing ? "Syncing…" : "Request sync"}
                  </button>
                )}

                {feed.id === "audit" && (
                  <div className="mt-3 text-[10px] text-foreground-subtle font-mono text-center italic">
                    Manual audit process — contact verification@atlas.io to schedule renewal
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-border bg-surface-raised/50 flex items-center justify-between">
          <div className="text-[10px] text-foreground-subtle font-mono">
            Realtime DB: <span className="text-recovery">Connected</span>
          </div>
          <button
            onClick={() => feeds.forEach(f => f.id !== "audit" && triggerRefresh(f.id))}
            disabled={!!refreshing}
            className="flex items-center gap-1.5 text-[11px] text-foreground-subtle hover:text-recovery px-3 py-1.5 rounded border border-border hover:border-recovery/30 transition-colors font-mono"
          >
            <RefreshCw size={10} />
            Refresh all
          </button>
        </div>
      </div>
    </>
  );
}
