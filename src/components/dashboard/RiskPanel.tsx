import { useState } from "react";
import { AlertTriangle, TrendingDown, Zap, CloudRain, DollarSign, Activity, BarChart3, Info } from "lucide-react";

// Risk & Fragility indicators — per-project and portfolio-level
// Shows: Reversal Risk, Drought/Flood exposure, Funding dependency,
// Biodiversity collapse sensitivity, Verification gaps, Permanence risk, Leakage risk

interface RiskIndicator {
  id: string;
  label: string;
  value: number;        // 0–1 normalised
  rawLabel: string;
  status: "low" | "medium" | "high" | "critical";
  description: string;
  trend: "improving" | "stable" | "worsening";
}

interface ProjectRisk {
  id: string;
  name: string;
  type: string;
  fragilityIndex: number;    // 0–1
  reversalProbability: number; // 0–1
  recoveryDurability: number; // 0–1
  risks: RiskIndicator[];
}

const PORTFOLIO_RISKS: RiskIndicator[] = [
  {
    id: "reversal",
    label: "Reversal Risk",
    value: 0.18,
    rawLabel: "Low (0.18)",
    status: "low",
    description: "Probability that current restoration progress regresses below baseline in 12 months.",
    trend: "improving",
  },
  {
    id: "climate",
    label: "Climate Exposure",
    value: 0.52,
    rawLabel: "Moderate (0.52)",
    status: "medium",
    description: "Drought or flood event probability affecting ≥25% of portfolio area in 24 months.",
    trend: "worsening",
  },
  {
    id: "funding",
    label: "Funding Dependency",
    value: 0.64,
    rawLabel: "Elevated (0.64)",
    status: "medium",
    description: "Share of active restoration dependent on single-source external funding commitments.",
    trend: "stable",
  },
  {
    id: "biodiversity",
    label: "Biodiversity Collapse Sensitivity",
    value: 0.31,
    rawLabel: "Low-Medium (0.31)",
    status: "low",
    description: "Sensitivity of ecosystem recovery to keystone species loss or corridor fragmentation.",
    trend: "improving",
  },
  {
    id: "verification",
    label: "Verification Gaps",
    value: 0.22,
    rawLabel: "22% unverified",
    status: "low",
    description: "Share of portfolio by hectare-value with no satellite, field, or audited verification.",
    trend: "improving",
  },
  {
    id: "permanence",
    label: "Permanence Risk",
    value: 0.29,
    rawLabel: "Low (0.29)",
    status: "low",
    description: "Probability of carbon or ecological uplift reversal due to land tenure or land-use change.",
    trend: "stable",
  },
  {
    id: "leakage",
    label: "Leakage Risk",
    value: 0.12,
    rawLabel: "Low (0.12)",
    status: "low",
    description: "Risk that restoration in one area displaces degradation pressure to adjacent regions.",
    trend: "stable",
  },
  {
    id: "community",
    label: "Community Participation",
    value: 0.71,
    rawLabel: "Strong (0.71)",
    status: "low",
    description: "Depth of local community engagement in monitoring and stewardship activities.",
    trend: "improving",
  },
];

const PROJECT_RISKS: ProjectRisk[] = [
  {
    id: "p5",
    name: "Nairobi Urban Health Initiative",
    type: "Health",
    fragilityIndex: 0.68,
    reversalProbability: 0.44,
    recoveryDurability: 0.41,
    risks: [
      { id: "funding", label: "Funding dependency", value: 0.82, rawLabel: "Critical", status: "critical", description: "Single-donor structure", trend: "worsening" },
      { id: "verification", label: "Verification gap", value: 0.72, rawLabel: "High", status: "high", description: "90-day stale data", trend: "worsening" },
    ],
  },
  {
    id: "p6",
    name: "Amboseli Biodiversity Corridor",
    type: "Biodiversity",
    fragilityIndex: 0.44,
    reversalProbability: 0.28,
    recoveryDurability: 0.62,
    risks: [
      { id: "biodiversity", label: "Corridor fragmentation", value: 0.55, rawLabel: "Medium", status: "medium", description: "Encroachment pressure detected", trend: "stable" },
    ],
  },
  {
    id: "p3",
    name: "Congo Basin Carbon Sink",
    type: "Carbon",
    fragilityIndex: 0.36,
    reversalProbability: 0.21,
    recoveryDurability: 0.74,
    risks: [
      { id: "permanence", label: "Land tenure instability", value: 0.41, rawLabel: "Medium", status: "medium", description: "Contested land rights zone", trend: "stable" },
    ],
  },
];

const statusColor = {
  low:      { text: "text-recovery",      bg: "bg-recovery-dim",  border: "border-recovery/20",  bar: "bg-recovery" },
  medium:   { text: "text-watch",         bg: "bg-watch-dim",     border: "border-watch/20",     bar: "bg-watch" },
  high:     { text: "text-reversal",      bg: "bg-reversal-dim",  border: "border-reversal/20",  bar: "bg-reversal" },
  critical: { text: "text-reversal",      bg: "bg-reversal-dim",  border: "border-reversal/20",  bar: "bg-reversal animate-pulse" },
};

const trendIcon = {
  improving: <TrendingDown size={10} className="text-recovery rotate-180" />,
  stable:    <Activity size={10} className="text-foreground-subtle" />,
  worsening: <TrendingDown size={10} className="text-watch" />,
};

const indicatorIcons: Record<string, React.ElementType> = {
  reversal:      TrendingDown,
  climate:       CloudRain,
  funding:       DollarSign,
  biodiversity:  Zap,
  verification:  BarChart3,
  permanence:    AlertTriangle,
  leakage:       Activity,
  community:     Info,
};

function PortfolioRiskRow({ indicator }: { indicator: RiskIndicator }) {
  const cfg = statusColor[indicator.status];
  const Icon = indicatorIcons[indicator.id] || AlertTriangle;
  return (
    <div className="flex items-center gap-3 py-2.5 px-4 border-b border-border last:border-0 hover:bg-surface-raised transition-colors group">
      <div className={`p-1.5 rounded flex-shrink-0 ${cfg.bg}`}>
        <Icon size={11} className={cfg.text} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs text-foreground-muted">{indicator.label}</span>
          <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${cfg.border} ${cfg.bg} ${cfg.text} flex-shrink-0`}>
            {indicator.rawLabel}
          </span>
        </div>
        <div className="mt-1 flex items-center gap-2">
          <div className="flex-1 h-1 bg-surface-overlay rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${cfg.bar} transition-all`}
              style={{ width: `${indicator.value * 100}%` }}
            />
          </div>
          <div className="flex items-center gap-1 text-[9px] text-foreground-subtle">
            {trendIcon[indicator.trend]}
            <span className="hidden md:inline">{indicator.trend}</span>
          </div>
        </div>
        <p className="text-[9px] text-foreground-subtle mt-0.5 leading-relaxed hidden group-hover:block">{indicator.description}</p>
      </div>
    </div>
  );
}

function ProjectRiskCard({ project }: { project: ProjectRisk }) {
  const fragilityColor = project.fragilityIndex >= 0.6
    ? "text-reversal" : project.fragilityIndex >= 0.4
    ? "text-watch" : "text-recovery";
  const durabilityColor = project.recoveryDurability >= 0.7
    ? "text-recovery" : project.recoveryDurability >= 0.5
    ? "text-watch" : "text-reversal";

  return (
    <div className="bg-surface rounded border border-border p-3 space-y-2">
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="text-xs font-medium text-foreground leading-snug">{project.name}</div>
          <div className="text-[10px] text-foreground-subtle font-mono mt-0.5">{project.type}</div>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <div className="text-center">
          <div className="text-[9px] text-foreground-subtle uppercase tracking-widest">Fragility</div>
          <div className={`font-mono text-sm font-bold ${project.fragilityIndex >= 0.6 ? "text-reversal" : project.fragilityIndex >= 0.4 ? "text-watch" : "text-recovery"}`}>
            {project.fragilityIndex.toFixed(2)}
          </div>
        </div>
        <div className="text-center">
          <div className="text-[9px] text-foreground-subtle uppercase tracking-widest">Reversal %</div>
          <div className={`font-mono text-sm font-bold ${project.reversalProbability >= 0.4 ? "text-reversal" : project.reversalProbability >= 0.25 ? "text-watch" : "text-recovery"}`}>
            {(project.reversalProbability * 100).toFixed(0)}%
          </div>
        </div>
        <div className="text-center">
          <div className="text-[9px] text-foreground-subtle uppercase tracking-widest">Durability</div>
          <div className={`font-mono text-sm font-bold ${durabilityColor}`}>
            {project.recoveryDurability.toFixed(2)}
          </div>
        </div>
      </div>
      {project.risks.map(r => {
        const cfg = statusColor[r.status];
        return (
          <div key={r.id} className={`flex items-center gap-2 text-[10px] px-2 py-1 rounded border ${cfg.border} ${cfg.bg}`}>
            <AlertTriangle size={9} className={cfg.text} />
            <span className={`font-medium ${cfg.text}`}>{r.label}</span>
            <span className="text-foreground-subtle ml-auto">{r.description}</span>
          </div>
        );
      })}
    </div>
  );
}

export function RiskPanel() {
  const [view, setView] = useState<"portfolio" | "projects">("portfolio");

  const avgFragility = PROJECT_RISKS.reduce((a, b) => a + b.fragilityIndex, 0) / PROJECT_RISKS.length;
  const highRiskCount = PORTFOLIO_RISKS.filter(r => r.status === "high" || r.status === "critical").length;

  return (
    <div className="bg-surface border border-border rounded-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-start justify-between px-4 py-3 border-b border-border">
        <div>
          <div className="text-[10px] text-foreground-subtle uppercase tracking-widest font-mono mb-1">Resilience Intelligence</div>
          <div className="font-semibold text-foreground text-sm">Risk & Fragility Indicators</div>
        </div>
        <div className="flex items-center gap-3">
          {highRiskCount > 0 && (
            <div className="flex items-center gap-1.5 text-[10px] px-2 py-0.5 rounded border border-watch/20 bg-watch-dim text-watch font-mono">
              <AlertTriangle size={9} />
              {highRiskCount} elevated
            </div>
          )}
          <div className="flex rounded border border-border overflow-hidden">
            {(["portfolio", "projects"] as const).map(v => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`text-[10px] px-2.5 py-1 font-mono capitalize transition-colors ${
                  view === v ? "bg-surface-raised text-foreground" : "text-foreground-subtle hover:text-foreground"
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-3 divide-x divide-border border-b border-border bg-surface-raised/50">
        <div className="px-4 py-2.5">
          <div className="text-[9px] text-foreground-subtle uppercase tracking-widest">Portfolio Fragility</div>
          <div className={`font-mono text-xl font-bold ${avgFragility >= 0.5 ? "text-watch" : "text-recovery"}`}>
            {avgFragility.toFixed(2)}
          </div>
        </div>
        <div className="px-4 py-2.5">
          <div className="text-[9px] text-foreground-subtle uppercase tracking-widest">Reversal Probability</div>
          <div className="font-mono text-xl font-bold text-recovery">18%</div>
        </div>
        <div className="px-4 py-2.5">
          <div className="text-[9px] text-foreground-subtle uppercase tracking-widest">Recovery Durability</div>
          <div className="font-mono text-xl font-bold text-recovery">0.74</div>
        </div>
      </div>

      {/* Content */}
      {view === "portfolio" ? (
        <div className="divide-y divide-border">
          {PORTFOLIO_RISKS.map(indicator => (
            <PortfolioRiskRow key={indicator.id} indicator={indicator} />
          ))}
        </div>
      ) : (
        <div className="p-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {PROJECT_RISKS.map(project => (
            <ProjectRiskCard key={project.id} project={project} />
          ))}
          <div className="bg-surface-raised rounded border border-border p-4 flex flex-col items-center justify-center gap-2 text-center">
            <div className="text-2xl">✅</div>
            <div className="text-xs font-medium text-foreground">5 projects nominal</div>
            <div className="text-[10px] text-foreground-subtle">No elevated risk indicators detected.</div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="px-4 py-2 border-t border-border bg-surface-raised/30 text-[9px] text-foreground-subtle font-mono">
        Risk scores are model-estimated using IPCC Tier 2 methodology, cross-referenced against satellite signals and community monitoring.
        Confidence discount applied for projects with verification gaps &gt;30 days.
      </div>
    </div>
  );
}
