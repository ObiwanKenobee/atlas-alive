import { useState } from "react";
import { TrendingUp, Droplets, Lock, Unlock, Users, AlertTriangle, ArrowRight, ShieldCheck, BarChart3 } from "lucide-react";
import type { RVEAsset } from "@/data/mockData";
import { rveAssets } from "@/data/mockData";

const liquidityConfig = {
  liquid:       { label: "Liquid",       icon: Unlock,   color: "text-recovery", bg: "bg-recovery-dim", border: "border-recovery/20" },
  "semi-liquid":{ label: "Semi-Liquid",  icon: Droplets, color: "text-watch",    bg: "bg-watch-dim",    border: "border-watch/20" },
  illiquid:     { label: "Illiquid",     icon: Lock,     color: "text-foreground-muted", bg: "bg-surface-raised", border: "border-border" },
};
const riskConfig = {
  low:    { label: "Low Risk",    color: "text-recovery", bg: "bg-recovery-dim", border: "border-recovery/20" },
  medium: { label: "Medium Risk", color: "text-watch",    bg: "bg-watch-dim",    border: "border-watch/20" },
  high:   { label: "High Risk",   color: "text-reversal", bg: "bg-reversal-dim", border: "border-reversal/20" },
};

// Simulated pipeline stages for the value conversion flow
const PIPELINE_STAGES = [
  { label: "Measurable Outcomes",   value: "10,240 ha",       sub: "land restored",        color: "text-foreground" },
  { label: "Ecological Uplift",     value: "+0.37 avg",       sub: "ecosystem uplift score",color: "text-recovery" },
  { label: "Verified Units",        value: "96,020",           sub: "verified impact units", color: "text-recovery" },
  { label: "Permanence Adjustment", value: "−8.4%",           sub: "permanence discount",   color: "text-watch" },
  { label: "Risk-Discounted Value", value: "$22.6M",          sub: "after risk discount",   color: "text-recovery" },
  { label: "Portfolio RVE Value",   value: "$24.7M",          sub: "total est. value",      color: "text-recovery" },
];

function ConversionPipeline() {
  return (
    <div className="px-4 py-3 border-b border-border">
      <div className="text-[10px] text-foreground-subtle uppercase tracking-widest font-mono mb-3">Outcome → Value Conversion Chain</div>
      <div className="flex items-start gap-0 overflow-x-auto pb-1">
        {PIPELINE_STAGES.map((stage, i) => (
          <div key={i} className="flex items-center flex-shrink-0">
            <div className="flex flex-col items-center gap-1 min-w-[90px]">
              <div className="bg-surface-raised border border-border rounded p-2 text-center w-full">
                <div className={`font-mono text-sm font-bold ${stage.color}`}>{stage.value}</div>
                <div className="text-[9px] text-foreground-subtle mt-0.5">{stage.sub}</div>
              </div>
              <div className="text-[9px] text-foreground-subtle text-center leading-tight px-1">{stage.label}</div>
            </div>
            {i < PIPELINE_STAGES.length - 1 && (
              <ArrowRight size={12} className="text-foreground-subtle mx-1 mt-[-14px] flex-shrink-0" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function PortfolioSummaryBar() {
  return (
    <div className="grid grid-cols-4 divide-x divide-border border-b border-border bg-surface-raised/50">
      {[
        { label: "Portfolio Value",  val: "$24.7M",  color: "text-recovery" },
        { label: "Verified Units",   val: "96,020",  color: "text-recovery" },
        { label: "Active Buyers",    val: "11",       color: "text-accent" },
        { label: "Avg Yield Proj.",  val: "+8.3%/yr", color: "text-recovery" },
      ].map(item => (
        <div key={item.label} className="px-4 py-2.5">
          <div className="text-[9px] text-foreground-subtle uppercase tracking-widest">{item.label}</div>
          <div className={`font-mono text-lg font-bold ${item.color}`}>{item.val}</div>
        </div>
      ))}
    </div>
  );
}

function AssetCard({ asset }: { asset: RVEAsset }) {
  const liq = liquidityConfig[asset.liquidityStatus];
  const risk = riskConfig[asset.permanenceRisk];
  const LiqIcon = liq.icon;

  // Derived permanence-adjusted value (mock)
  const raw = parseFloat(asset.estimatedValue.replace(/[$M]/g, "")) * 1000000;
  const adj = asset.permanenceRisk === "medium" ? raw * 0.92 : asset.permanenceRisk === "high" ? raw * 0.78 : raw;
  const adjStr = `$${(adj / 1000000).toFixed(1)}M`;

  return (
    <div className="bg-surface border border-border rounded-lg p-4 hover:border-recovery/20 transition-all hover:bg-surface-raised group flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-[9px] font-mono text-foreground-subtle uppercase tracking-widest mb-1">{asset.type}</div>
          <div className="font-medium text-foreground text-sm leading-snug">{asset.name}</div>
        </div>
        <div className={`flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full border ${liq.border} ${liq.bg} ${liq.color} flex-shrink-0`}>
          <LiqIcon size={9} />
          <span>{liq.label}</span>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-2">
        {asset.hectares && (
          <div className="bg-surface-raised rounded p-2 border border-border">
            <div className="text-[9px] text-foreground-subtle uppercase tracking-widest">Hectares</div>
            <div className="font-mono text-foreground text-sm font-semibold">{asset.hectares.toLocaleString()}</div>
          </div>
        )}
        <div className="bg-surface-raised rounded p-2 border border-border">
          <div className="text-[9px] text-foreground-subtle uppercase tracking-widest">Eco. Uplift</div>
          <div className={`font-mono text-sm font-semibold ${asset.ecologicalUplift >= 0.75 ? "text-recovery" : "text-watch"}`}>
            {asset.ecologicalUplift.toFixed(2)}
          </div>
        </div>
        <div className="bg-surface-raised rounded p-2 border border-border">
          <div className="text-[9px] text-foreground-subtle uppercase tracking-widest">Biodiv ×</div>
          <div className="font-mono text-foreground text-sm font-semibold">{asset.biodiversityMultiplier}×</div>
        </div>
        <div className="bg-surface-raised rounded p-2 border border-border">
          <div className="text-[9px] text-foreground-subtle uppercase tracking-widest">Buyers</div>
          <div className="font-mono text-foreground text-sm font-semibold flex items-center gap-1">
            <Users size={11} className="text-foreground-subtle" />{asset.buyers}
          </div>
        </div>
      </div>

      {/* Carbon + units */}
      <div className="text-[10px] text-foreground-subtle">
        <span className="font-mono text-foreground-muted">{asset.carbonEquivalent}</span>
        <span className="mx-1.5 text-border">·</span>
        <span className="font-mono text-foreground-muted">{asset.verifiedUnits}</span>
      </div>

      {/* Value block */}
      <div className="flex items-end justify-between pt-2 border-t border-border">
        <div>
          <div className="text-[9px] text-foreground-subtle uppercase tracking-widest">Est. RVE Value</div>
          <div className="font-mono text-recovery text-xl font-bold">{asset.estimatedValue}</div>
          {asset.permanenceRisk !== "low" && (
            <div className="text-[9px] text-foreground-subtle font-mono mt-0.5">
              Risk-adj: <span className="text-watch">{adjStr}</span>
            </div>
          )}
        </div>
        <div className="text-right">
          <div className="text-[9px] text-foreground-subtle uppercase tracking-widest">Yield proj.</div>
          <div className={`font-mono text-sm font-semibold flex items-center gap-1 ${asset.yieldProjection.startsWith("+") ? "text-recovery" : "text-reversal"}`}>
            <TrendingUp size={11} />{asset.yieldProjection}
          </div>
        </div>
      </div>

      {/* Permanence + verification badges */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className={`flex items-center gap-1 text-[9px] px-1.5 py-0.5 rounded border ${risk.border} ${risk.bg} ${risk.color}`}>
          {asset.permanenceRisk !== "low" && <AlertTriangle size={8} />}
          {risk.label}
        </div>
        <div className="flex items-center gap-1 text-[9px] px-1.5 py-0.5 rounded border border-accent/20 bg-surface text-accent">
          <ShieldCheck size={8} /> Verified
        </div>
        <div className="flex items-center gap-1 text-[9px] px-1.5 py-0.5 rounded border border-border text-foreground-subtle">
          <BarChart3 size={8} /> Tradable
        </div>
      </div>
    </div>
  );
}

export function RVEPanel() {
  const [showPipeline, setShowPipeline] = useState(false);

  return (
    <div className="bg-surface border border-border rounded-lg overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-border flex items-start justify-between">
        <div>
          <div className="text-[10px] text-foreground-subtle uppercase tracking-widest font-mono mb-1">Economic Translation</div>
          <div className="font-semibold text-foreground">Regenerative Value Exchange (RVE)</div>
        </div>
        <button
          onClick={() => setShowPipeline(!showPipeline)}
          className={`text-xs px-2.5 py-1 rounded border transition-colors font-mono ${showPipeline ? "border-recovery/30 bg-recovery-dim text-recovery" : "border-border text-foreground-subtle hover:text-foreground hover:border-recovery/30"}`}
        >
          {showPipeline ? "Hide" : "Show"} conversion chain
        </button>
      </div>

      {/* Portfolio totals */}
      <PortfolioSummaryBar />

      {/* Conversion pipeline (toggleable) */}
      {showPipeline && <ConversionPipeline />}

      {/* Explainer */}
      <div className="px-4 py-2.5 bg-surface-raised/30 border-b border-border text-xs text-foreground-subtle leading-relaxed">
        Regenerative outcomes are converted into verified economic instruments. Each asset below represents
        measurable ecological uplift with a credible confidence score — not a carbon offset narrative.
        Permanence discount and liquidity risk applied per IPCC Tier 2 + VCS methodology.
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
