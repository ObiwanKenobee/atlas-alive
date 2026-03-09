import { useState } from "react";
import { TrendingUp, TrendingDown, Minus, AlertTriangle, Info } from "lucide-react";
import { categoryData } from "@/data/mockData";

type CategoryKey = keyof typeof categoryData;
type StatusType = "recovery" | "watch" | "reversal";

const TABS: { key: CategoryKey; label: string; icon: string; desc: string }[] = [
  { key: "land",         label: "Land",          icon: "🌿", desc: "Soil, vegetation, restoration survival" },
  { key: "carbon",       label: "Carbon",         icon: "🌀", desc: "Sequestration, avoided emissions, permanence" },
  { key: "water",        label: "Water",          icon: "💧", desc: "Recharge, quality, flood mitigation" },
  { key: "health",       label: "Health",         icon: "🫀", desc: "Access, disease reduction, continuity" },
  { key: "biodiversity", label: "Biodiversity",   icon: "🦋", desc: "Habitat, species richness, corridors" },
  { key: "jobs",         label: "Jobs",           icon: "🤝", desc: "Local jobs, enterprise, income uplift" },
];

const statusStyle: Record<StatusType, { text: string; dot: string; border: string; bg: string; bar: string }> = {
  recovery: { text: "text-recovery", dot: "bg-recovery", border: "border-recovery/20", bg: "bg-recovery-dim", bar: "bg-recovery" },
  watch:    { text: "text-watch",    dot: "bg-watch",    border: "border-watch/20",    bg: "bg-watch-dim",    bar: "bg-watch" },
  reversal: { text: "text-reversal", dot: "bg-reversal", border: "border-reversal/20", bg: "bg-reversal-dim", bar: "bg-reversal" },
};

// Mini sparkline per category metric (simulated)
const SPARKLINES: Record<CategoryKey, number[][]> = {
  land:         [[42,55,62,70,78,87,95,100],[30,38,48,55,65,72,80,100],[60,65,70,74,78,83,90,100],[30,40,55,65,75,88,95,100],[70,75,78,80,82,85,90,100]],
  carbon:       [[30,40,50,58,68,80,90,100],[40,48,56,63,70,78,88,100],[20,35,50,62,74,82,90,100],[80,82,83,85,86,87,88,88],[70,74,76,78,80,81,82,82]],
  water:        [[55,60,65,70,75,82,90,100],[40,50,58,66,74,80,88,100],[30,40,52,60,70,80,90,100],[50,58,64,70,76,83,88,100],[30,40,48,54,60,65,70,72]],
  health:       [[80,85,90,100,100,97,95,97],[50,58,65,72,78,84,88,100],[40,45,48,52,50,48,46,44],[60,65,68,71,73,76,78,100],[30,36,42,48,55,60,66,74]],
  biodiversity: [[30,38,48,57,65,74,83,100],[30,40,48,52,56,60,66,100],[30,38,44,50,58,66,74,100],[34,42,50,56,62,68,75,100]],
  jobs:         [[20,30,40,52,62,74,85,100],[30,40,50,60,70,80,88,100],[20,26,32,40,48,54,60,72],[30,40,52,65,74,82,90,100],[30,38,44,50,55,60,64,68]],
};

function MiniBar({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const h = 22;
  const w = 56;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * (h - 2) - 1;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });
  const colorHex = color === "bg-recovery" ? "#34d399" : color === "bg-watch" ? "#fbbf24" : color === "bg-reversal" ? "#f87171" : "#60a5fa";
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="overflow-visible opacity-70 flex-shrink-0">
      <polyline points={pts.join(" ")} fill="none" stroke={colorHex} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

interface MetricRowItem {
  label: string;
  value: string;
  change: string;
  status: StatusType;
  confidence: number;
}

function MetricRow({ item, sparkline }: { item: MetricRowItem; sparkline: number[] }) {
  const s = statusStyle[item.status];
  const isPositive = item.change.startsWith("+");
  const isNegative = item.change.startsWith("-");

  return (
    <div className="flex items-center justify-between py-2.5 px-4 border-b border-border last:border-0 hover:bg-surface-raised transition-colors group">
      <div className="flex items-center gap-2.5 flex-1 min-w-0">
        <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${s.dot}`} />
        <span className="text-foreground-muted text-xs truncate">{item.label}</span>
      </div>
      <div className="flex items-center gap-3 flex-shrink-0">
        {/* Sparkline */}
        <MiniBar data={sparkline} color={s.bar} />
        {/* Value */}
        <span className="font-mono text-xs text-foreground font-medium min-w-[80px] text-right">{item.value}</span>
        {/* Change */}
        <div className="flex items-center gap-1 min-w-[64px] justify-end">
          {isPositive
            ? <TrendingUp size={10} className="text-recovery" />
            : isNegative
            ? <TrendingDown size={10} className="text-reversal" />
            : item.change === "—"
            ? <AlertTriangle size={10} className="text-watch" />
            : <Minus size={10} className="text-foreground-subtle" />
          }
          <span className={`font-mono text-[11px] ${isPositive ? "text-recovery" : isNegative ? "text-reversal" : "text-foreground-subtle"}`}>
            {item.change}
          </span>
        </div>
        {/* Confidence bar */}
        {item.confidence > 0 ? (
          <div className="flex items-center gap-1.5 w-16">
            <div className="flex-1 h-1 bg-surface-overlay rounded-full overflow-hidden">
              <div className={`h-full rounded-full ${s.bar}`} style={{ width: `${item.confidence * 100}%` }} />
            </div>
            <span className="font-mono text-[9px] text-foreground-subtle">{(item.confidence * 100).toFixed(0)}%</span>
          </div>
        ) : (
          <div className="w-16 flex items-center">
            <span className="text-[10px] text-foreground-subtle italic">review</span>
          </div>
        )}
      </div>
    </div>
  );
}

function CategorySummary({ key: tabKey, data }: { key: CategoryKey; data: MetricRowItem[] }) {
  const avg = data.filter(d => d.confidence > 0).reduce((a, b) => a + b.confidence, 0) / (data.filter(d => d.confidence > 0).length || 1);
  const recovering = data.filter(d => d.status === "recovery").length;
  const watching = data.filter(d => d.status === "watch").length;
  return (
    <div className="px-4 py-2.5 bg-surface-raised border-b border-border flex items-center justify-between gap-4">
      <div className="flex items-center gap-4 text-[10px] text-foreground-subtle font-mono">
        <span className="text-recovery">{recovering} recovering</span>
        {watching > 0 && <span className="text-watch">{watching} watch</span>}
      </div>
      <div className="flex items-center gap-1.5 text-[10px] text-foreground-subtle font-mono">
        <span>Avg confidence:</span>
        <span className={avg >= 0.7 ? "text-recovery font-semibold" : avg >= 0.5 ? "text-watch font-semibold" : "text-reversal font-semibold"}>
          {(avg * 100).toFixed(0)}%
        </span>
      </div>
    </div>
  );
}

export function ImpactCategoryTabs() {
  const [active, setActive] = useState<CategoryKey>("land");
  const activeTab = TABS.find(t => t.key === active)!;

  return (
    <div className="bg-surface border border-border rounded-lg overflow-hidden">
      {/* Header */}
      <div className="border-b border-border px-4 py-3">
        <div className="text-[10px] text-foreground-subtle uppercase tracking-widest font-mono mb-1">Multi-Domain Outcomes</div>
        <div className="flex items-center justify-between">
          <div className="font-semibold text-foreground text-sm">Category Breakdown</div>
          <div className="flex items-center gap-1.5 text-[10px] text-foreground-subtle">
            <Info size={10} />
            <span className="hidden sm:inline">{activeTab.desc}</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto border-b border-border bg-surface-raised/50">
        {TABS.map((tab) => {
          const tabData = categoryData[tab.key] as MetricRowItem[];
          const hasWatch = tabData.some(d => d.status === "watch" || d.status === "reversal");
          return (
            <button
              key={tab.key}
              onClick={() => setActive(tab.key)}
              className={`relative flex items-center gap-1.5 px-3.5 py-2.5 text-[11px] font-medium whitespace-nowrap border-r border-border transition-colors
                ${active === tab.key
                  ? "text-recovery bg-recovery-dim border-b-2 border-b-recovery"
                  : "text-foreground-muted hover:text-foreground hover:bg-surface-raised"
                }`}
            >
              <span className="text-base leading-none">{tab.icon}</span>
              <span className="hidden sm:inline">{tab.label}</span>
              {hasWatch && active !== tab.key && (
                <span className="absolute top-1.5 right-1.5 w-1 h-1 rounded-full bg-watch" />
              )}
            </button>
          );
        })}
      </div>

      {/* Summary bar */}
      <CategorySummary key={active} data={categoryData[active] as MetricRowItem[]} />

      {/* Column headers */}
      <div className="flex items-center justify-between py-2 px-4 border-b border-border">
        <span className="text-[9px] text-foreground-subtle uppercase tracking-widest">Metric</span>
        <div className="flex items-center gap-3 text-[9px] text-foreground-subtle uppercase tracking-widest">
          <span className="w-14 text-center">Trend</span>
          <span className="min-w-[80px] text-right">Current</span>
          <span className="min-w-[64px] text-right">Δ Change</span>
          <span className="w-16 text-right">Confidence</span>
        </div>
      </div>

      {/* Rows */}
      <div className="divide-y divide-border">
        {(categoryData[active] as MetricRowItem[]).map((item, i) => (
          <MetricRow
            key={i}
            item={item}
            sparkline={(SPARKLINES[active] || [])[i] || [50, 60, 70, 80, 90, 100]}
          />
        ))}
      </div>
    </div>
  );
}
