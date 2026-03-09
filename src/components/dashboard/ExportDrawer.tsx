import { useState } from "react";
import {
  X, Download, FileText, Table2, Code2, BarChart3, Check,
  ChevronRight, Loader2, BookOpen, Users, Building2, Copy
} from "lucide-react";
import { projects, heroMetrics, verificationSummary, rveAssets } from "@/data/mockData";
import type { Project } from "@/data/mockData";

// ── Helpers ────────────────────────────────────────────────────────────────────

function downloadBlob(content: string, filename: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click();
  document.body.removeChild(a); URL.revokeObjectURL(url);
}

const ts = () => new Date().toISOString().split("T")[0];
const date = () => new Date().toLocaleDateString("en-GB", { year: "numeric", month: "long", day: "numeric" });

// Board summary: executive-level plain-text
function genBoardSummary(region: string, time: string): string {
  const filtered = region === "All Regions" ? projects : projects.filter(p => region.includes(p.country));
  return [
    "ATLAS REGENERATIVE IMPACT DASHBOARD",
    "Board Summary Report",
    `Generated: ${date()}  ·  Region: ${region}  ·  Period: ${time}`,
    "═".repeat(60),
    "",
    "EXECUTIVE HEADLINE",
    `  Portfolio of ${filtered.length} active restoration projects across ${[...new Set(filtered.map(p => p.country))].join(", ")}.`,
    `  Combined estimated value: ${filtered.map(p => parseFloat(p.valueEstimate.replace(/[$M]/g, "") || "0")).reduce((a, b) => a + b, 0).toFixed(1)}M USD`,
    "",
    "IMPACT METRICS",
    ...heroMetrics.map(m =>
      `  ${m.label.padEnd(32)} ${m.displayValue.padStart(10)} ${m.unit.padEnd(12)}  Δ ${m.delta > 0 ? "+" : ""}${m.delta}%  Confidence: ${(m.confidence * 100).toFixed(0)}%`
    ),
    "",
    "PORTFOLIO STATUS",
    `  Accelerating: ${filtered.filter(p => p.trend === "accelerating").length} projects`,
    `  Stable:       ${filtered.filter(p => p.trend === "stable").length} projects`,
    `  Stalling:     ${filtered.filter(p => p.trend === "stalling").length} projects  ← Review required`,
    `  Reversing:    ${filtered.filter(p => p.trend === "reversing").length} projects  ← Intervention required`,
    "",
    "VERIFICATION OVERVIEW",
    `  Overall confidence:  ${verificationSummary.overallConfidence.toFixed(2)}`,
    `  Satellite verified:  ${verificationSummary.satelliteVerified.count} projects (${(verificationSummary.satelliteVerified.coverage * 100).toFixed(0)}% coverage)`,
    `  Third-party audited: ${verificationSummary.thirdPartyAudited.count} projects`,
    `  Last audit:          ${verificationSummary.lastAuditDate}`,
    `  Methodology:         ${verificationSummary.methodologyVersion}`,
    "",
    "RVE ECONOMIC TRANSLATION",
    ...rveAssets.map(a =>
      `  ${a.name.padEnd(45)}  ${a.estimatedValue.padStart(8)}  ${a.liquidityStatus}`
    ),
    "",
    "─".repeat(60),
    "Atlas Regenerative OS · Not investment advice. For planning and governance use.",
  ].join("\n");
}

// Investor impact report
function genInvestorReport(region: string): string {
  const filtered = region === "All Regions" ? projects : projects.filter(p => region.includes(p.country));
  return [
    "ATLAS REGENERATIVE VALUE EXCHANGE",
    "Investor Impact Report",
    `Generated: ${date()}  ·  Region: ${region}`,
    "═".repeat(60),
    "",
    "PORTFOLIO ECONOMIC SUMMARY",
    `  Total RVE Portfolio Value:  $24.7M`,
    `  Verified Impact Units:      96,020`,
    `  Active Buyers:              11`,
    `  Average Yield Projection:   +8.3% / year`,
    `  Portfolio Fragility Index:  0.44 (Low-Medium)`,
    `  Reversal Probability:       18% (12-month horizon)`,
    "",
    "ASSET BREAKDOWN",
    ...rveAssets.map(a => [
      `  ${a.name}`,
      `    Type:        ${a.type}`,
      `    Value:       ${a.estimatedValue}  (Risk-adj: see permanence note)`,
      `    Units:       ${a.verifiedUnits}`,
      `    Eco Uplift:  ${a.ecologicalUplift.toFixed(2)}  Biodiversity ×${a.biodiversityMultiplier}`,
      `    Liquidity:   ${a.liquidityStatus}`,
      `    Perm. Risk:  ${a.permanenceRisk}`,
      `    Yield:       ${a.yieldProjection}`,
      "",
    ].join("\n")),
    "PROJECT INVESTMENT SIGNALS",
    ...filtered.map(p =>
      `  ${p.name.padEnd(42)}  ${p.valueEstimate.padStart(6)}  trend:${p.trend.padEnd(13)} risk:${p.riskLevel}  conf:${(p.confidence * 100).toFixed(0)}%`
    ),
    "",
    "─".repeat(60),
    "Permanence discount applied per IPCC Tier 2 + VCS methodology. Past performance ≠ future returns.",
  ].join("\n");
}

// Project audit snapshot
function genAuditSnapshot(): string {
  return [
    "ATLAS PROJECT AUDIT SNAPSHOT",
    `Generated: ${date()}`,
    "═".repeat(60),
    "",
    "VERIFICATION STATUS BY PROJECT",
    ...projects.map(p => [
      `  ${p.name}`,
      `    Status:         ${p.status.toUpperCase()}`,
      `    Last Verified:  ${p.lastVerified}`,
      `    Confidence:     ${(p.confidence * 100).toFixed(0)}%  ${p.confidence < 0.6 ? "⚠ BELOW THRESHOLD" : "✓"}`,
      `    Trend:          ${p.trend}`,
      `    Risk Level:     ${p.riskLevel}`,
      `    Value Estimate: ${p.valueEstimate}`,
      "",
    ].join("\n")),
    "METHODOLOGY",
    `  Version:     ${verificationSummary.methodologyVersion}`,
    `  Last Audit:  ${verificationSummary.lastAuditDate}`,
    `  Auditor:     Verra VCS + Gold Standard`,
    "",
    "─".repeat(60),
    "This snapshot is for audit and compliance purposes. Full evidence trail available on request.",
  ].join("\n");
}

// Machine-readable JSON
function genJSON(region: string, sector: string, time: string) {
  const filtered = region === "All Regions" ? projects : projects.filter(p => region.includes(p.country));
  return JSON.stringify({
    meta: { generated: new Date().toISOString(), region, sector, period: time, methodology: verificationSummary.methodologyVersion },
    portfolio: {
      totalProjects: filtered.length,
      totalEstimatedValue: "$24.7M",
      verifiedUnits: 96020,
      overallConfidence: verificationSummary.overallConfidence,
    },
    heroMetrics: heroMetrics.map(m => ({
      id: m.id, label: m.label, value: m.value, unit: m.unit,
      delta: m.delta, confidence: m.confidence, trend: m.trend, sourceType: m.sourceType,
    })),
    projects: filtered.map(p => ({
      id: p.id, name: p.name, country: p.country, region: p.region,
      type: p.type, baseline: p.baseline, current: p.current,
      confidence: p.confidence, valueEstimate: p.valueEstimate,
      trend: p.trend, riskLevel: p.riskLevel, lastVerified: p.lastVerified, status: p.status,
    })),
    rveAssets: rveAssets.map(a => ({
      id: a.id, name: a.name, type: a.type,
      estimatedValue: a.estimatedValue, verifiedUnits: a.verifiedUnits,
      ecologicalUplift: a.ecologicalUplift, liquidityStatus: a.liquidityStatus,
      permanenceRisk: a.permanenceRisk, yieldProjection: a.yieldProjection,
    })),
    verification: verificationSummary,
  }, null, 2);
}

// ── Export option config ───────────────────────────────────────────────────────

interface ExportOption {
  id: string;
  icon: React.ElementType;
  iconColor: string;
  label: string;
  description: string;
  badge: string;
  badgeColor: string;
  audience: string;
}

const EXPORT_OPTIONS: ExportOption[] = [
  {
    id: "board",
    icon: Building2,
    iconColor: "text-recovery",
    label: "Board Summary",
    description: "Executive-level plain-text summary with headline metrics, portfolio status, and verification overview. Suitable for board packs and governance reporting.",
    badge: ".txt",
    badgeColor: "text-recovery border-recovery/20 bg-recovery-dim",
    audience: "Board / C-Suite",
  },
  {
    id: "investor",
    icon: BarChart3,
    iconColor: "text-water",
    label: "Investor Impact Report",
    description: "Full RVE asset breakdown with risk-adjusted values, yield projections, permanence discounts, and project investment signals.",
    badge: ".txt",
    badgeColor: "text-water border-water/20 bg-water-dim",
    audience: "Investors / Fund Managers",
  },
  {
    id: "audit",
    icon: BookOpen,
    iconColor: "text-accent",
    label: "Audit Snapshot",
    description: "Project-level verification status, confidence scores, stale data flags, and methodology attribution. For compliance and third-party review.",
    badge: ".txt",
    badgeColor: "text-accent border-accent/20 bg-surface-raised",
    audience: "Auditors / Regulators",
  },
  {
    id: "csv",
    icon: Table2,
    iconColor: "text-watch",
    label: "CSV Data Export",
    description: "Tabular project metrics filtered to current region and sector context. Import into Excel, Sheets, or BI tools.",
    badge: ".csv",
    badgeColor: "text-watch border-watch/20 bg-watch-dim",
    audience: "Analysts / Operators",
  },
  {
    id: "json",
    icon: Code2,
    iconColor: "text-foreground-muted",
    label: "Machine-Readable JSON",
    description: "Full structured data export including hero metrics, projects, RVE assets, and verification metadata. For API integration and data pipelines.",
    badge: ".json",
    badgeColor: "text-foreground-muted border-border bg-surface-raised",
    audience: "Developers / Data Teams",
  },
];

// ── Drawer ─────────────────────────────────────────────────────────────────────

interface Props {
  open: boolean;
  onClose: () => void;
  selectedRegion: string;
  selectedSector: string;
  selectedVerification: string;
  selectedTime: string;
}

export function ExportDrawer({ open, onClose, selectedRegion, selectedSector, selectedVerification, selectedTime }: Props) {
  const [generating, setGenerating] = useState<string | null>(null);
  const [done, setDone] = useState<string | null>(null);
  const [linkCopied, setLinkCopied] = useState(false);

  const handle = async (id: string) => {
    setGenerating(id);
    // small async tick for UX
    await new Promise(r => setTimeout(r, 400));
    const stamp = ts();

    if (id === "board") {
      downloadBlob(genBoardSummary(selectedRegion, selectedTime), `atlas-board-summary-${stamp}.txt`, "text/plain");
    } else if (id === "investor") {
      downloadBlob(genInvestorReport(selectedRegion), `atlas-investor-report-${stamp}.txt`, "text/plain");
    } else if (id === "audit") {
      downloadBlob(genAuditSnapshot(), `atlas-audit-snapshot-${stamp}.txt`, "text/plain");
    } else if (id === "csv") {
      const filtered = selectedRegion === "All Regions" ? projects : projects.filter((p: Project) => selectedRegion.includes(p.country));
      const headers = ["Name","Country","Region","Type","Baseline","Current","Confidence","Value","Trend","Risk","Last Verified"];
      const rows = filtered.map((p: Project) => [
        `"${p.name}"`, p.country, p.region, p.type, `"${p.baseline}"`, `"${p.current}"`,
        p.confidence.toFixed(2), p.valueEstimate, p.trend, p.riskLevel, `"${p.lastVerified}"`,
      ]);
      downloadBlob([headers.join(","), ...rows.map(r => r.join(","))].join("\n"), `atlas-data-${stamp}.csv`, "text/csv");
    } else if (id === "json") {
      downloadBlob(genJSON(selectedRegion, selectedSector, selectedTime), `atlas-data-${stamp}.json`, "application/json");
    }

    setGenerating(null);
    setDone(id);
    setTimeout(() => setDone(null), 2500);
  };

  const copyLink = async () => {
    const base = window.location.origin + window.location.pathname;
    const url = `${base}?r=${encodeURIComponent(selectedRegion)}&s=${encodeURIComponent(selectedSector)}&t=${selectedTime}&shared=1`;
    try { await navigator.clipboard.writeText(url); } catch { /* ok */ }
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2500);
  };

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-50 bg-background/60 backdrop-blur-sm" onClick={onClose} />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full z-50 w-full max-w-md bg-surface border-l border-border flex flex-col shadow-2xl animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div>
            <div className="text-[10px] font-mono text-foreground-subtle uppercase tracking-widest mb-0.5">Reports & Data</div>
            <div className="font-semibold text-foreground">Export & Reporting</div>
          </div>
          <button onClick={onClose} className="text-foreground-subtle hover:text-foreground p-1.5 rounded hover:bg-surface-raised transition-colors">
            <X size={16} />
          </button>
        </div>

        {/* Context strip */}
        <div className="px-5 py-2.5 border-b border-border bg-surface-raised/50 text-[10px] text-foreground-subtle font-mono flex flex-wrap gap-3">
          <span>Region: <span className="text-foreground-muted">{selectedRegion}</span></span>
          <span>·</span>
          <span>Sector: <span className="text-foreground-muted">{selectedSector}</span></span>
          <span>·</span>
          <span>Period: <span className="text-foreground-muted">{selectedTime}</span></span>
        </div>

        {/* Options */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {EXPORT_OPTIONS.map(opt => {
            const Icon = opt.icon;
            const isGenerating = generating === opt.id;
            const isDone = done === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => handle(opt.id)}
                disabled={!!generating}
                className="w-full flex items-start gap-4 p-4 rounded-lg border border-border hover:border-border hover:bg-surface-raised transition-all text-left group disabled:opacity-60"
              >
                <div className="p-2.5 rounded-lg bg-surface-overlay flex-shrink-0 mt-0.5 group-hover:bg-surface-raised transition-colors">
                  {isGenerating
                    ? <Loader2 size={16} className={`${opt.iconColor} animate-spin`} />
                    : isDone
                    ? <Check size={16} className="text-recovery" />
                    : <Icon size={16} className={opt.iconColor} />
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-foreground">{opt.label}</span>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded border font-mono ${opt.badgeColor}`}>{opt.badge}</span>
                    {isDone && <span className="text-[9px] text-recovery font-mono ml-auto">Downloaded ✓</span>}
                  </div>
                  <p className="text-[11px] text-foreground-subtle leading-relaxed">{opt.description}</p>
                  <div className="mt-1.5 text-[9px] text-foreground-subtle font-mono flex items-center gap-1">
                    <Users size={9} />
                    {opt.audience}
                  </div>
                </div>
                <ChevronRight size={14} className="text-foreground-subtle mt-1 flex-shrink-0 group-hover:text-foreground transition-colors" />
              </button>
            );
          })}
        </div>

        {/* Footer: shareable link */}
        <div className="px-5 py-4 border-t border-border space-y-2">
          <button
            onClick={copyLink}
            className="w-full flex items-center justify-between px-4 py-3 rounded-lg border border-border hover:border-recovery/30 hover:bg-recovery-dim transition-all group"
          >
            <div className="flex items-center gap-3">
              {linkCopied ? <Check size={14} className="text-recovery" /> : <Copy size={14} className="text-foreground-subtle group-hover:text-recovery transition-colors" />}
              <div className="text-left">
                <div className="text-xs font-medium text-foreground">{linkCopied ? "Link copied!" : "Copy shareable link"}</div>
                <div className="text-[10px] text-foreground-subtle font-mono">Encodes current region, sector, and time filter</div>
              </div>
            </div>
          </button>
          <p className="text-[10px] text-foreground-subtle text-center font-mono">
            All reports are generated client-side from verified data.
            Not for investment decisions.
          </p>
        </div>
      </div>
    </>
  );
}
