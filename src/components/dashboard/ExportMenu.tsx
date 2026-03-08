import { useState, useRef } from "react";
import { Download, Link2, ChevronDown, FileText, Table2, Check, Copy } from "lucide-react";
import type { Project } from "@/data/mockData";
import { projects, heroMetrics } from "@/data/mockData";

interface ExportMenuProps {
  selectedRegion: string;
  selectedSector: string;
  selectedVerification: string;
  selectedTime: string;
}

function generateCSV(filteredProjects: Project[]): string {
  const headers = ["Name", "Country", "Region", "Type", "Baseline", "Current", "Confidence", "Est. Value", "Trend", "Risk", "Last Verified"];
  const rows = filteredProjects.map(p => [
    `"${p.name}"`, p.country, p.region, p.type, `"${p.baseline}"`, `"${p.current}"`,
    p.confidence.toFixed(2), p.valueEstimate, p.trend, p.riskLevel, `"${p.lastVerified}"`,
  ]);
  return [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
}

function generateShareableURL(params: {
  region: string; sector: string; verification: string; time: string;
}): string {
  const base = window.location.origin + window.location.pathname;
  const searchParams = new URLSearchParams({
    r: params.region,
    s: params.sector,
    v: params.verification,
    t: params.time,
    shared: "1",
    ts: new Date().toISOString().split("T")[0],
  });
  return `${base}?${searchParams.toString()}`;
}

function downloadBlob(content: string, filename: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function generateTextReport(params: ExportMenuProps): string {
  const date = new Date().toLocaleDateString("en-GB", { year: "numeric", month: "long", day: "numeric" });
  const lines = [
    "ATLAS REGENERATIVE IMPACT DASHBOARD",
    "Executive Briefing Report",
    `Generated: ${date}`,
    "═".repeat(50),
    "",
    "FILTER CONTEXT",
    `  Region:       ${params.selectedRegion}`,
    `  Sector:       ${params.selectedSector}`,
    `  Source:       ${params.selectedVerification}`,
    `  Time Range:   ${params.selectedTime}`,
    "",
    "HEADLINE METRICS",
    ...heroMetrics.map(m => `  ${m.label.padEnd(30)} ${m.displayValue.padStart(10)} ${m.unit}   Δ ${m.delta > 0 ? "+" : ""}${m.delta}%   Confidence: ${m.confidence.toFixed(2)}`),
    "",
    "PROJECT SUMMARY",
    `  Total Projects:    ${projects.length}`,
    `  Active:            ${projects.filter(p => p.status === "active").length}`,
    `  Under Watch:       ${projects.filter(p => p.status === "watch").length}`,
    `  Accelerating:      ${projects.filter(p => p.trend === "accelerating").length}`,
    "",
    "PROJECTS",
    ...projects.map(p => `  ${p.name.padEnd(40)} ${p.country.padEnd(12)} ${p.trend.padEnd(14)} Conf: ${p.confidence.toFixed(2)}  Est: ${p.valueEstimate}`),
    "",
    "─".repeat(50),
    "Atlas Regenerative OS · Methodology v2.4.1",
    "This report is for planning purposes. Verify all projections before investment decisions.",
  ];
  return lines.join("\n");
}

export function ExportMenu({ selectedRegion, selectedSector, selectedVerification, selectedTime }: ExportMenuProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const params = { region: selectedRegion, sector: selectedSector, verification: selectedVerification, time: selectedTime };

  const handleCSV = () => {
    const filtered = selectedRegion === "All Regions"
      ? projects
      : projects.filter(p => selectedRegion.includes(p.country));
    const csv = generateCSV(filtered);
    const ts = new Date().toISOString().split("T")[0];
    downloadBlob(csv, `atlas-impact-${selectedRegion.replace(/\s/g, "-").toLowerCase()}-${ts}.csv`, "text/csv");
    setOpen(false);
  };

  const handleReport = () => {
    const report = generateTextReport({ selectedRegion, selectedSector, selectedVerification, selectedTime });
    const ts = new Date().toISOString().split("T")[0];
    downloadBlob(report, `atlas-executive-briefing-${ts}.txt`, "text/plain");
    setOpen(false);
  };

  const handleShare = async () => {
    const url = generateShareableURL(params);
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback: show URL
      prompt("Copy this shareable URL:", url);
    }
    setOpen(false);
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-border text-xs text-foreground-subtle hover:text-foreground hover:border-primary/40 transition-colors bg-surface hover:bg-surface-raised"
      >
        <Download size={12} />
        Export
        <ChevronDown size={10} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {copied && (
        <div className="absolute top-full mt-1 right-0 z-50 bg-recovery-dim border border-recovery/30 rounded px-3 py-2 text-xs text-recovery flex items-center gap-2 whitespace-nowrap shadow-lg">
          <Check size={11} /> Link copied to clipboard
        </div>
      )}

      {open && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute top-full mt-1 right-0 z-50 w-60 bg-surface-overlay border border-border rounded-lg shadow-lg py-1 overflow-hidden">
            <div className="px-3 py-2 border-b border-border">
              <div className="text-[10px] font-mono text-foreground-subtle uppercase tracking-widest">Export & Report</div>
              <div className="text-xs text-foreground-subtle mt-0.5">
                Context: {selectedRegion} · {selectedTime}
              </div>
            </div>

            {/* CSV download */}
            <button
              onClick={handleCSV}
              className="w-full flex items-start gap-3 px-3 py-2.5 hover:bg-surface-raised transition-colors text-left"
            >
              <Table2 size={14} className="text-recovery mt-0.5 flex-shrink-0" />
              <div>
                <div className="text-xs text-foreground font-medium">Download CSV</div>
                <div className="text-[10px] text-foreground-subtle">Project metrics · filtered to current context</div>
              </div>
            </button>

            {/* Executive report */}
            <button
              onClick={handleReport}
              className="w-full flex items-start gap-3 px-3 py-2.5 hover:bg-surface-raised transition-colors text-left"
            >
              <FileText size={14} className="text-water mt-0.5 flex-shrink-0" />
              <div>
                <div className="text-xs text-foreground font-medium">Executive Briefing</div>
                <div className="text-[10px] text-foreground-subtle">Plain-text summary report with all KPIs</div>
              </div>
            </button>

            {/* Shareable link */}
            <button
              onClick={handleShare}
              className="w-full flex items-start gap-3 px-3 py-2.5 hover:bg-surface-raised transition-colors text-left"
            >
              <div className="flex-shrink-0 mt-0.5">
                {copied ? <Check size={14} className="text-recovery" /> : <Copy size={14} className="text-accent" />}
              </div>
              <div>
                <div className="text-xs text-foreground font-medium">Copy Shareable Link</div>
                <div className="text-[10px] text-foreground-subtle">Frozen filter state · region + time encoded</div>
              </div>
            </button>

            <div className="px-3 pt-1 pb-2 border-t border-border mt-1">
              <div className="flex items-center gap-1.5 text-[10px] text-foreground-subtle">
                <Link2 size={9} />
                PDF export available in enterprise tier
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
