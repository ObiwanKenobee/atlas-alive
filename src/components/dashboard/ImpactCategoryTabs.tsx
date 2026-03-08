import { useState } from "react";
import { TrendingUp, TrendingDown, Minus, AlertTriangle } from "lucide-react";
import { categoryData } from "@/data/mockData";

type CategoryKey = keyof typeof categoryData;
type StatusType = "recovery" | "watch" | "reversal";

const TABS: { key: CategoryKey; label: string; icon: string }[] = [
  { key: "land", label: "Land", icon: "🌿" },
  { key: "carbon", label: "Carbon", icon: "🌀" },
  { key: "water", label: "Water", icon: "💧" },
  { key: "health", label: "Health", icon: "🫀" },
  { key: "biodiversity", label: "Biodiversity", icon: "🦋" },
  { key: "jobs", label: "Jobs", icon: "🤝" },
];

const statusStyle: Record<StatusType, { text: string; dot: string; border: string; bg: string }> = {
  recovery: {
    text: "text-recovery",
    dot: "bg-recovery",
    border: "border-recovery/20",
    bg: "bg-recovery-dim",
  },
  watch: {
    text: "text-watch",
    dot: "bg-watch",
    border: "border-watch/20",
    bg: "bg-watch-dim",
  },
  reversal: {
    text: "text-reversal",
    dot: "bg-reversal",
    border: "border-reversal/20",
    bg: "bg-reversal-dim",
  },
};

interface MetricRow {
  label: string;
  value: string;
  change: string;
  status: StatusType;
  confidence: number;
}

function MetricRow({ item }: { item: MetricRow }) {
  const s = statusStyle[item.status];
  const changeStr = item.change;
  const isPositive = changeStr.startsWith("+");
  const isNegative = changeStr.startsWith("-");

  return (
    <div className={`flex items-center justify-between py-3 px-4 border-b border-border last:border-0 hover:bg-surface-raised transition-colors group`}>
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${s.dot}`} />
        <span className="text-foreground-muted text-sm truncate">{item.label}</span>
      </div>
      <div className="flex items-center gap-4 flex-shrink-0">
        {/* Value */}
        <span className="font-mono text-sm text-foreground font-medium">{item.value}</span>
        {/* Change */}
        <div className="flex items-center gap-1 min-w-[70px] justify-end">
          {isPositive ? (
            <TrendingUp size={11} className="text-recovery" />
          ) : isNegative ? (
            <TrendingDown size={11} className="text-reversal" />
          ) : item.change === "—" ? (
            <AlertTriangle size={11} className="text-watch" />
          ) : (
            <Minus size={11} className="text-foreground-subtle" />
          )}
          <span className={`font-mono text-xs ${isPositive ? "text-recovery" : isNegative ? "text-reversal" : "text-foreground-subtle"}`}>
            {item.change}
          </span>
        </div>
        {/* Confidence bar */}
        {item.confidence > 0 ? (
          <div className="flex items-center gap-1.5 w-16">
            <div className="flex-1 h-1 bg-surface-overlay rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${item.confidence >= 0.75 ? "bg-recovery" : item.confidence >= 0.5 ? "bg-watch" : "bg-reversal"}`}
                style={{ width: `${item.confidence * 100}%` }}
              />
            </div>
            <span className="font-mono text-[9px] text-foreground-subtle">{item.confidence.toFixed(2)}</span>
          </div>
        ) : (
          <div className="w-16 flex items-center gap-1">
            <span className="text-[10px] text-foreground-subtle italic">review</span>
          </div>
        )}
      </div>
    </div>
  );
}

export function ImpactCategoryTabs() {
  const [active, setActive] = useState<CategoryKey>("land");

  return (
    <div className="bg-surface border border-border rounded-lg overflow-hidden">
      {/* Header */}
      <div className="border-b border-border px-4 py-3">
        <div className="text-xs text-foreground-subtle uppercase tracking-widest font-mono mb-1">Outcomes by Category</div>
        <div className="font-semibold text-foreground text-sm">Domain-Specific Breakdown</div>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto border-b border-border">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActive(tab.key)}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium whitespace-nowrap border-r border-border transition-colors
              ${active === tab.key
                ? "text-recovery bg-recovery-dim border-b-2 border-b-recovery"
                : "text-foreground-muted hover:text-foreground hover:bg-surface-raised"
              }`}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="divide-y divide-border">
        {/* Column headers */}
        <div className="flex items-center justify-between py-2 px-4 bg-surface-raised">
          <span className="text-[10px] text-foreground-subtle uppercase tracking-widest">Metric</span>
          <div className="flex items-center gap-4 text-[10px] text-foreground-subtle uppercase tracking-widest">
            <span className="min-w-[80px] text-right">Current</span>
            <span className="min-w-[70px] text-right">Change</span>
            <span className="w-16 text-right">Confidence</span>
          </div>
        </div>
        {categoryData[active].map((item, i) => (
          <MetricRow key={i} item={item as MetricRow} />
        ))}
      </div>
    </div>
  );
}
