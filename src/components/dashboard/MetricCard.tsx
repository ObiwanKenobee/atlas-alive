import { TrendingUp, TrendingDown, Minus, Satellite, FlaskConical, Users, Brain, ShieldCheck } from "lucide-react";
import type { HeroMetric } from "@/data/mockData";

const colorMap = {
  recovery: { text: "text-recovery", border: "border-recovery/20", glow: "shadow-glow", bg: "bg-recovery-dim", dot: "bg-recovery" },
  water: { text: "text-water", border: "border-water/20", glow: "", bg: "bg-water-dim", dot: "bg-water" },
  watch: { text: "text-watch", border: "border-watch/20", glow: "", bg: "bg-watch-dim", dot: "bg-watch" },
  reversal: { text: "text-reversal", border: "border-reversal/20", glow: "", bg: "bg-reversal-dim", dot: "bg-reversal" },
  accent: { text: "text-accent", border: "border-accent/20", glow: "", bg: "bg-surface-raised", dot: "bg-accent" },
};

const sourceIcons = {
  satellite: Satellite,
  field: FlaskConical,
  community: Users,
  model: Brain,
  audited: ShieldCheck,
};

const sourceLabels = {
  satellite: "Satellite",
  field: "Field",
  community: "Community",
  model: "AI Model",
  audited: "Audited",
};

function MiniSparkline({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const h = 28;
  const w = 72;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * h;
    return `${x},${y}`;
  });
  const area = `0,${h} ${pts.join(" ")} ${w},${h}`;

  const strokeColor = color === "recovery" ? "#34d399" : color === "water" ? "#60a5fa" : color === "watch" ? "#fbbf24" : color === "accent" ? "#2dd4bf" : "#f87171";
  const fillColor = color === "recovery" ? "#34d39920" : color === "water" ? "#60a5fa20" : color === "watch" ? "#fbbf2420" : color === "accent" ? "#2dd4bf20" : "#f8717120";

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="overflow-visible">
      <polygon points={area} fill={fillColor} />
      <polyline points={pts.join(" ")} fill="none" stroke={strokeColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ConfidenceDots({ score }: { score: number }) {
  const filled = Math.round(score * 5);
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className={`w-1.5 h-1.5 rounded-full transition-colors ${
            i < filled
              ? score >= 0.8 ? "bg-recovery" : score >= 0.6 ? "bg-watch" : "bg-reversal"
              : "bg-surface-overlay"
          }`}
        />
      ))}
      <span className="ml-1.5 text-foreground-subtle font-mono text-[10px]">{score.toFixed(2)}</span>
    </div>
  );
}

export function MetricCard({ metric }: { metric: HeroMetric }) {
  const c = colorMap[metric.color];
  const SourceIcon = sourceIcons[metric.sourceType];
  const isPositiveDelta = metric.delta > 0;
  const isNeutral = metric.delta === 0;

  return (
    <div className={`relative bg-surface border ${c.border} rounded-lg p-4 flex flex-col gap-3 ${c.glow} hover:bg-surface-raised transition-all duration-300 group`}>
      {/* Accent line */}
      <div className={`absolute top-0 left-0 right-0 h-px ${c.dot} opacity-40 rounded-t-lg`} />

      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <span className="text-base">{metric.icon}</span>
          <span className="text-xs text-foreground-subtle uppercase tracking-widest font-medium">{metric.label}</span>
        </div>
        <div className="flex items-center gap-1 text-foreground-subtle">
          <SourceIcon size={11} />
          <span className="text-[10px] font-mono">{sourceLabels[metric.sourceType]}</span>
        </div>
      </div>

      {/* Value */}
      <div className="flex items-end justify-between gap-2">
        <div>
          <div className={`font-mono text-2xl font-semibold ${c.text} leading-none`}>
            {metric.displayValue}
          </div>
          <div className="text-xs text-foreground-subtle font-mono mt-0.5">{metric.unit}</div>
        </div>
        <MiniSparkline data={metric.sparkline} color={metric.color} />
      </div>

      {/* Delta */}
      <div className="flex items-center gap-1.5">
        {isNeutral ? (
          <Minus size={12} className="text-foreground-subtle" />
        ) : isPositiveDelta ? (
          <TrendingUp size={12} className="text-recovery" />
        ) : (
          <TrendingDown size={12} className="text-reversal" />
        )}
        <span className={`font-mono text-xs font-semibold ${isNeutral ? "text-foreground-subtle" : isPositiveDelta ? "text-recovery" : "text-reversal"}`}>
          {isPositiveDelta ? "+" : ""}{metric.delta}%
        </span>
        <span className="text-foreground-subtle text-[10px]">{metric.deltaLabel}</span>
      </div>

      {/* Confidence */}
      <div className="pt-1 border-t border-border">
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-foreground-subtle uppercase tracking-widest">Confidence</span>
          <ConfidenceDots score={metric.confidence} />
        </div>
      </div>
    </div>
  );
}
