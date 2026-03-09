import { TrendingUp, TrendingDown, Minus, Satellite, FlaskConical, Users, Brain, ShieldCheck, Clock, AlertTriangle } from "lucide-react";
import type { HeroMetric } from "@/data/mockData";

const colorMap = {
  recovery: {
    text: "text-recovery", border: "border-recovery/20", glow: "shadow-glow",
    bg: "bg-recovery-dim", dot: "bg-recovery", accent: "hsl(155, 65%, 40%)",
  },
  water: {
    text: "text-water", border: "border-water/20", glow: "",
    bg: "bg-water-dim", dot: "bg-water", accent: "hsl(210, 70%, 48%)",
  },
  watch: {
    text: "text-watch", border: "border-watch/20", glow: "",
    bg: "bg-watch-dim", dot: "bg-watch", accent: "hsl(42, 85%, 52%)",
  },
  reversal: {
    text: "text-reversal", border: "border-reversal/20", glow: "",
    bg: "bg-reversal-dim", dot: "bg-reversal", accent: "hsl(5, 75%, 50%)",
  },
  accent: {
    text: "text-accent", border: "border-accent/20", glow: "",
    bg: "bg-surface-raised", dot: "bg-accent", accent: "hsl(175, 55%, 35%)",
  },
};

const sourceIcons = {
  satellite: Satellite, field: FlaskConical, community: Users, model: Brain, audited: ShieldCheck,
};
const sourceLabels = {
  satellite: "Satellite", field: "Field Verified", community: "Community", model: "AI Model", audited: "Audited",
};
const freshnessData: Record<string, { label: string; stale: boolean }> = {
  hectares:     { label: "Updated 48h ago", stale: false },
  carbon:       { label: "Updated 7d ago",  stale: false },
  water:        { label: "Updated 14d ago", stale: false },
  lives:        { label: "Updated 90d ago", stale: true  },
  biodiversity: { label: "Updated 30d ago", stale: false },
  jobs:         { label: "Updated 3d ago",  stale: false },
};

function MiniSparkline({ data, color, accent }: { data: number[]; color: string; accent: string }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const h = 32;
  const w = 80;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * (h - 2) - 1;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });
  const area = `0,${h} ${pts.join(" ")} ${w},${h}`;

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="overflow-visible flex-shrink-0">
      <defs>
        <linearGradient id={`grad-${color}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={accent} stopOpacity="0.18" />
          <stop offset="100%" stopColor={accent} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <polygon points={area} fill={`url(#grad-${color})`} />
      <polyline
        points={pts.join(" ")}
        fill="none"
        stroke={accent}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Last data point dot */}
      {pts[pts.length - 1] && (
        <circle
          cx={parseFloat(pts[pts.length - 1].split(",")[0])}
          cy={parseFloat(pts[pts.length - 1].split(",")[1])}
          r="2.5"
          fill={accent}
        />
      )}
    </svg>
  );
}

function ConfidenceBar({ score }: { score: number }) {
  const color = score >= 0.8 ? "bg-recovery" : score >= 0.6 ? "bg-watch" : "bg-reversal";
  const label = score >= 0.8 ? "High" : score >= 0.6 ? "Medium" : "Low";
  return (
    <div className="flex items-center gap-1.5 flex-1">
      <div className="flex-1 h-1 bg-surface-overlay rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color} transition-all`} style={{ width: `${score * 100}%` }} />
      </div>
      <span className="font-mono text-[9px] text-foreground-subtle w-6 text-right">{(score * 100).toFixed(0)}%</span>
    </div>
  );
}

export function MetricCard({ metric }: { metric: HeroMetric }) {
  const c = colorMap[metric.color];
  const SourceIcon = sourceIcons[metric.sourceType];
  const isPositiveDelta = metric.delta > 0;
  const isNeutral = metric.delta === 0;
  const freshness = freshnessData[metric.id];

  return (
    <div className={`relative bg-surface border ${c.border} rounded-lg p-3.5 flex flex-col gap-2.5 ${c.glow} hover:bg-surface-raised transition-all duration-300 group overflow-hidden`}>
      {/* Top accent bar */}
      <div className={`absolute top-0 left-0 right-0 h-[2px] ${c.dot} opacity-60 rounded-t-lg`} />

      {/* Header: label + source badge */}
      <div className="flex items-start justify-between gap-1">
        <div className="flex items-center gap-1.5">
          <span className="text-sm leading-none">{metric.icon}</span>
          <span className="text-[10px] text-foreground-subtle uppercase tracking-widest font-medium leading-tight">{metric.label}</span>
        </div>
        <div className={`flex items-center gap-1 text-[9px] px-1.5 py-0.5 rounded border ${c.border} ${c.bg} ${c.text} flex-shrink-0`}>
          <SourceIcon size={9} />
          <span className="hidden lg:inline">{sourceLabels[metric.sourceType]}</span>
        </div>
      </div>

      {/* Value row + sparkline */}
      <div className="flex items-end justify-between gap-2">
        <div className="min-w-0">
          <div className={`font-mono text-2xl font-bold ${c.text} leading-none`}>
            {metric.displayValue}
          </div>
          <div className="text-[10px] text-foreground-subtle font-mono mt-0.5">{metric.unit}</div>
        </div>
        <MiniSparkline data={metric.sparkline} color={metric.color} accent={c.accent} />
      </div>

      {/* Delta badge */}
      <div className={`flex items-center gap-1.5 px-2 py-1 rounded ${isNeutral ? "bg-surface-raised" : isPositiveDelta ? "bg-recovery-dim" : "bg-reversal-dim"} self-start`}>
        {isNeutral
          ? <Minus size={11} className="text-foreground-subtle" />
          : isPositiveDelta
          ? <TrendingUp size={11} className="text-recovery" />
          : <TrendingDown size={11} className="text-reversal" />
        }
        <span className={`font-mono text-xs font-bold ${isNeutral ? "text-foreground-subtle" : isPositiveDelta ? "text-recovery" : "text-reversal"}`}>
          {isPositiveDelta ? "+" : ""}{metric.delta}%
        </span>
        <span className="text-foreground-subtle text-[9px]">{metric.deltaLabel}</span>
      </div>

      {/* Footer: confidence + freshness */}
      <div className="pt-2 border-t border-border space-y-1.5">
        <div className="flex items-center gap-2">
          <span className="text-[9px] text-foreground-subtle uppercase tracking-widest w-14 flex-shrink-0">Confidence</span>
          <ConfidenceBar score={metric.confidence} />
        </div>
        <div className={`flex items-center gap-1 text-[9px] font-mono ${freshness?.stale ? "text-watch" : "text-foreground-subtle"}`}>
          {freshness?.stale
            ? <AlertTriangle size={9} className="text-watch" />
            : <Clock size={9} />
          }
          {freshness?.label ?? "—"}
        </div>
      </div>
    </div>
  );
}
