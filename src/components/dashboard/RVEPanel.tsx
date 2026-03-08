import { TrendingUp, Droplets, Lock, Unlock, Users, AlertTriangle } from "lucide-react";
import type { RVEAsset } from "@/data/mockData";
import { rveAssets } from "@/data/mockData";

const liquidityConfig = {
  liquid: { label: "Liquid", icon: Unlock, color: "text-recovery", bg: "bg-recovery-dim", border: "border-recovery/20" },
  "semi-liquid": { label: "Semi-Liquid", icon: Droplets, color: "text-watch", bg: "bg-watch-dim", border: "border-watch/20" },
  illiquid: { label: "Illiquid", icon: Lock, color: "text-foreground-muted", bg: "bg-surface-raised", border: "border-border" },
};

const riskConfig = {
  low: { label: "Low Risk", color: "text-recovery" },
  medium: { label: "Medium Risk", color: "text-watch" },
  high: { label: "High Risk", color: "text-reversal" },
};

function AssetCard({ asset }: { asset: RVEAsset }) {
  const liq = liquidityConfig[asset.liquidityStatus];
  const risk = riskConfig[asset.permanenceRisk];
  const LiqIcon = liq.icon;

  return (
    <div className="bg-surface border border-border rounded-lg p-4 hover:border-recovery/20 transition-all hover:bg-surface-raised group">
      {/* Type badge + name */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <div className="text-[10px] font-mono text-foreground-subtle uppercase tracking-widest mb-1">{asset.type}</div>
          <div className="font-medium text-foreground text-sm leading-snug">{asset.name}</div>
        </div>
        <div className={`flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full border ${liq.border} ${liq.bg} ${liq.color} flex-shrink-0`}>
          <LiqIcon size={9} />
          {liq.label}
        </div>
      </div>

      {/* Key stats grid */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        {asset.hectares && (
          <div className="bg-surface-raised rounded p-2 border border-border">
            <div className="text-[10px] text-foreground-subtle uppercase tracking-widest">Hectares</div>
            <div className="font-mono text-foreground text-sm font-semibold">{asset.hectares.toLocaleString()}</div>
          </div>
        )}
        <div className="bg-surface-raised rounded p-2 border border-border">
          <div className="text-[10px] text-foreground-subtle uppercase tracking-widest">Eco. Uplift</div>
          <div className={`font-mono text-sm font-semibold ${asset.ecologicalUplift >= 0.75 ? "text-recovery" : "text-watch"}`}>
            {asset.ecologicalUplift.toFixed(2)}
          </div>
        </div>
        <div className="bg-surface-raised rounded p-2 border border-border">
          <div className="text-[10px] text-foreground-subtle uppercase tracking-widest">Biodiv. ×</div>
          <div className="font-mono text-foreground text-sm font-semibold">{asset.biodiversityMultiplier}×</div>
        </div>
        <div className="bg-surface-raised rounded p-2 border border-border">
          <div className="text-[10px] text-foreground-subtle uppercase tracking-widest">Buyers</div>
          <div className="font-mono text-foreground text-sm font-semibold flex items-center gap-1">
            <Users size={11} className="text-foreground-subtle" />
            {asset.buyers}
          </div>
        </div>
      </div>

      {/* Carbon equivalent */}
      <div className="text-xs text-foreground-subtle mb-3">
        Carbon equiv: <span className="font-mono text-foreground-muted">{asset.carbonEquivalent}</span>
        <span className="mx-2 text-border">·</span>
        Units: <span className="font-mono text-foreground-muted">{asset.verifiedUnits}</span>
      </div>

      {/* Value + yield */}
      <div className="flex items-end justify-between pt-3 border-t border-border">
        <div>
          <div className="text-[10px] text-foreground-subtle uppercase tracking-widest">Est. RVE Value</div>
          <div className="font-mono text-recovery text-lg font-bold">{asset.estimatedValue}</div>
        </div>
        <div className="text-right">
          <div className="text-[10px] text-foreground-subtle uppercase tracking-widest">Yield proj.</div>
          <div className={`font-mono text-sm font-semibold flex items-center gap-1 ${asset.yieldProjection.startsWith("+") ? "text-recovery" : "text-reversal"}`}>
            <TrendingUp size={11} />
            {asset.yieldProjection}
          </div>
        </div>
      </div>

      {/* Permanence risk */}
      <div className="mt-2 flex items-center gap-1.5 text-[10px]">
        {asset.permanenceRisk !== "low" && <AlertTriangle size={10} className={risk.color} />}
        <span className={risk.color}>{risk.label}</span>
        {asset.permanenceRisk !== "low" && (
          <span className="text-foreground-subtle">— discount applied to valuation</span>
        )}
      </div>
    </div>
  );
}

export function RVEPanel() {
  const totalValue = "$24.7M";
  const totalUnits = "96,020";

  return (
    <div className="bg-surface border border-border rounded-lg overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-border flex items-start justify-between">
        <div>
          <div className="text-xs text-foreground-subtle uppercase tracking-widest font-mono mb-1">Economic Translation</div>
          <div className="font-semibold text-foreground">Regenerative Value Exchange (RVE)</div>
        </div>
        <div className="text-right">
          <div className="text-[10px] text-foreground-subtle font-mono">Portfolio Value</div>
          <div className="font-mono text-recovery text-xl font-bold">{totalValue}</div>
          <div className="text-[10px] text-foreground-subtle font-mono">{totalUnits} verified units</div>
        </div>
      </div>

      {/* Explainer */}
      <div className="px-4 py-2.5 bg-surface-raised border-b border-border text-xs text-foreground-subtle leading-relaxed">
        Regenerative outcomes are converted into verified economic instruments. Each asset below represents
        measurable ecological uplift with a credible confidence score — not a carbon offset narrative.
      </div>

      {/* Asset cards */}
      <div className="p-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {rveAssets.map(asset => (
          <AssetCard key={asset.id} asset={asset} />
        ))}
      </div>
    </div>
  );
}
