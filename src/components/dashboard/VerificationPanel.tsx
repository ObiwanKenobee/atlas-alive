import { useState } from "react";
import {
  Satellite, FlaskConical, Users, Brain, ShieldCheck,
  ChevronDown, ChevronRight, AlertCircle, Clock, Database,
  FileText, Link, BookOpen, Info
} from "lucide-react";
import { verificationSummary } from "@/data/mockData";

interface EvidenceItem { label: string; detail: string }

const verificationLayers = [
  {
    key: "satelliteVerified",
    icon: Satellite,
    label: "Satellite Verified",
    color: "text-recovery",
    borderColor: "border-recovery/20",
    bgColor: "bg-recovery-dim",
    dotColor: "bg-recovery",
    count: verificationSummary.satelliteVerified.count,
    coverage: verificationSummary.satelliteVerified.coverage,
    lastUpdate: verificationSummary.satelliteVerified.lastUpdate,
    freshness: "current",
    evidence: [
      { label: "Sensor",      detail: "Sentinel-2 multispectral (10m res.)" },
      { label: "Coverage",    detail: "82% of total project area" },
      { label: "Cadence",     detail: "16-day revisit, cloud-adjusted" },
      { label: "Algorithm",   detail: "NDVI change detection v3.1" },
      { label: "Validation",  detail: "Cross-validated with Landsat-9" },
    ] as EvidenceItem[],
    methodology: "ESA Sentinel Hub + Google Earth Engine pipeline. Temporal compositing over 32-day windows removes cloud artefacts. Change detected using Breaks For Additive Seasonal and Trend (BFAST) algorithm.",
  },
  {
    key: "fieldSampled",
    icon: FlaskConical,
    label: "Ground Sampled",
    color: "text-water",
    borderColor: "border-water/20",
    bgColor: "bg-water-dim",
    dotColor: "bg-water",
    count: verificationSummary.fieldSampled.count,
    coverage: verificationSummary.fieldSampled.coverage,
    lastUpdate: verificationSummary.fieldSampled.lastUpdate,
    freshness: "current",
    evidence: [
      { label: "Sample points", detail: "240 in-situ measurements" },
      { label: "Protocol",      detail: "IPCC Tier 2 soil carbon" },
      { label: "Validation",    detail: "87% match with satellite" },
      { label: "Lab method",    detail: "Loss-on-ignition (LOI) + dry combustion" },
    ] as EvidenceItem[],
    methodology: "Field crews use standardized IPCC Tier 2 soil sampling protocol. Samples are sent to accredited labs. Results are cross-validated against satellite NDVI and community reports. Spatial interpolation uses ordinary kriging.",
  },
  {
    key: "communityReported",
    icon: Users,
    label: "Community Reported",
    color: "text-watch",
    borderColor: "border-watch/20",
    bgColor: "bg-watch-dim",
    dotColor: "bg-watch",
    count: verificationSummary.communityReported.count,
    coverage: verificationSummary.communityReported.coverage,
    lastUpdate: verificationSummary.communityReported.lastUpdate,
    freshness: "current",
    evidence: [
      { label: "Reporters",   detail: "1,240 trained community monitors" },
      { label: "Frequency",   detail: "Weekly mobile submissions" },
      { label: "Bias check",  detail: "Cross-referenced with satellite" },
      { label: "Platform",    detail: "KoboToolbox + ODK Collect" },
    ] as EvidenceItem[],
    methodology: "Community monitors submit weekly observations via mobile app. Reports are automatically geocoded and cross-referenced against satellite NDVI and IoT sensor data. Outlier detection flags anomalous submissions for field review.",
  },
  {
    key: "aiInferred",
    icon: Brain,
    label: "AI Inferred",
    color: "text-foreground-muted",
    borderColor: "border-border",
    bgColor: "bg-surface-raised",
    dotColor: "bg-foreground-subtle",
    count: verificationSummary.aiInferred.count,
    coverage: verificationSummary.aiInferred.coverage,
    lastUpdate: verificationSummary.aiInferred.lastUpdate,
    freshness: "current",
    evidence: [
      { label: "Model",         detail: "EcoPulse v2.1 regression ensemble" },
      { label: "Training data", detail: "8 years satellite + field" },
      { label: "Uncertainty",   detail: "±14% prediction interval" },
      { label: "Limitations",   detail: "Not suitable for asset issuance alone" },
    ] as EvidenceItem[],
    methodology: "Ensemble of random forest and gradient boosting models trained on 8 years of satellite, field, and climate data. Used only where field verification is delayed. AI-only estimates carry an automatic 25% confidence discount.",
  },
  {
    key: "thirdPartyAudited",
    icon: ShieldCheck,
    label: "Third-Party Audited",
    color: "text-accent",
    borderColor: "border-accent/20",
    bgColor: "bg-surface-raised",
    dotColor: "bg-accent",
    count: verificationSummary.thirdPartyAudited.count,
    coverage: verificationSummary.thirdPartyAudited.coverage,
    lastUpdate: verificationSummary.thirdPartyAudited.lastUpdate,
    freshness: "stale",
    evidence: [
      { label: "Auditor",     detail: "Verra VCS + Gold Standard" },
      { label: "Last audit",  detail: verificationSummary.lastAuditDate },
      { label: "Methodology", detail: `Version ${verificationSummary.methodologyVersion}` },
      { label: "Coverage",    detail: "5 projects, 91% asset value" },
      { label: "Next review", detail: "Q1 2026" },
    ] as EvidenceItem[],
    methodology: "Independent third-party audit against Verra Verified Carbon Standard (VCS) and Gold Standard frameworks. Full chain-of-custody for carbon and biodiversity credits. Audit reports available on request.",
  },
];

function EvidenceDrawer({ items, methodology, open }: { items: EvidenceItem[]; methodology: string; open: boolean }) {
  const [showMethodology, setShowMethodology] = useState(false);
  if (!open) return null;
  return (
    <div className="mt-3 space-y-3">
      {/* Evidence items */}
      <div className="pl-3 space-y-1.5 border-l-2 border-border">
        {items.map((item, i) => (
          <div key={i} className="flex items-start gap-3 text-xs">
            <span className="text-foreground-subtle min-w-[110px] flex-shrink-0">{item.label}</span>
            <span className="text-foreground-muted">{item.detail}</span>
          </div>
        ))}
      </div>
      {/* Methodology drawer */}
      <button
        onClick={() => setShowMethodology(!showMethodology)}
        className="flex items-center gap-1.5 text-[10px] text-foreground-subtle hover:text-foreground transition-colors"
      >
        <BookOpen size={10} />
        {showMethodology ? "Hide" : "Show"} methodology
        <ChevronDown size={9} className={`transition-transform ${showMethodology ? "rotate-180" : ""}`} />
      </button>
      {showMethodology && (
        <div className="text-[10px] text-foreground-subtle leading-relaxed bg-surface-raised rounded p-3 border border-border">
          {methodology}
        </div>
      )}
    </div>
  );
}

// Chain-of-custody timeline
const CUSTODY_EVENTS = [
  { date: "2024-11-15", event: "Third-party audit completed", type: "audit" },
  { date: "2025-01-08", event: "Satellite coverage updated (82%)", type: "satellite" },
  { date: "2025-02-14", event: "240 field samples submitted", type: "field" },
  { date: "2025-03-01", event: "Community monitoring cycle 47", type: "community" },
  { date: "2025-03-07", event: "AI inference model v2.1 retrained", type: "model" },
];

function ChainOfCustody() {
  return (
    <div className="px-4 pb-4">
      <div className="text-[10px] text-foreground-subtle uppercase tracking-widest font-mono mb-3 flex items-center gap-1.5">
        <Link size={10} />
        Chain of Custody
      </div>
      <div className="relative pl-4">
        <div className="absolute left-1.5 top-0 bottom-0 w-px bg-border" />
        {CUSTODY_EVENTS.map((event, i) => (
          <div key={i} className="relative flex items-start gap-3 pb-2.5 last:pb-0">
            <div className="absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full bg-surface-overlay border border-border flex-shrink-0" />
            <div>
              <div className="text-[10px] text-foreground-muted">{event.event}</div>
              <div className="text-[9px] text-foreground-subtle font-mono">{event.date}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function VerificationPanel() {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [showChain, setShowChain] = useState(false);
  const overallScore = verificationSummary.overallConfidence;

  return (
    <div className="bg-surface border border-border rounded-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-start justify-between px-4 py-3 border-b border-border">
        <div>
          <div className="text-[10px] text-foreground-subtle uppercase tracking-widest font-mono mb-1">Trust Infrastructure</div>
          <div className="font-semibold text-foreground text-sm">Verification & Evidence</div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowChain(!showChain)}
            className={`text-[10px] px-2.5 py-1 rounded border font-mono flex items-center gap-1 transition-colors ${
              showChain ? "border-recovery/30 bg-recovery-dim text-recovery" : "border-border text-foreground-subtle hover:text-foreground"
            }`}
          >
            <Link size={9} />
            Chain of Custody
          </button>
          <div className="text-right">
            <div className="text-[10px] text-foreground-subtle font-mono mb-0.5">Overall Confidence</div>
            <div className={`font-mono text-xl font-semibold ${overallScore >= 0.75 ? "text-recovery" : "text-watch"}`}>
              {overallScore.toFixed(2)}
            </div>
          </div>
        </div>
      </div>

      {/* Metadata bar */}
      <div className="px-4 py-2 bg-surface-raised border-b border-border flex flex-wrap items-center gap-4 text-[10px] text-foreground-subtle">
        <div className="flex items-center gap-1.5">
          <FileText size={10} />
          Methodology: <span className="font-mono text-foreground-muted ml-1">{verificationSummary.methodologyVersion}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Clock size={10} />
          Last audit: <span className="font-mono text-foreground-muted ml-1">{verificationSummary.lastAuditDate}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Database size={10} />
          Sources: <span className="font-mono text-foreground-muted ml-1">5 active verification layers</span>
        </div>
        <div className="ml-auto flex items-center gap-1 text-[9px]">
          <Info size={9} />
          Click any layer to expand evidence details
        </div>
      </div>

      {/* Verification layers */}
      <div className="p-4 space-y-2">
        {verificationLayers.map((layer) => {
          const Icon = layer.icon;
          const isOpen = expanded === layer.key;
          return (
            <div key={layer.key} className={`border ${layer.borderColor} rounded p-3 transition-all`}>
              <button
                className="w-full flex items-center justify-between gap-3"
                onClick={() => setExpanded(isOpen ? null : layer.key)}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className={`p-1.5 rounded ${layer.bgColor} flex-shrink-0`}>
                    <Icon size={13} className={layer.color} />
                  </div>
                  <div className="text-left min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-medium ${layer.color}`}>{layer.label}</span>
                      {layer.freshness === "stale" && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded border border-watch/20 bg-watch-dim text-watch font-mono">stale</span>
                      )}
                    </div>
                    <div className="text-[10px] text-foreground-subtle font-mono mt-0.5">
                      {layer.count} projects · {(layer.coverage * 100).toFixed(0)}% coverage · {layer.lastUpdate}
                    </div>
                  </div>
                </div>
                {/* Coverage bar */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <div className="w-24 h-1.5 bg-surface-overlay rounded-full overflow-hidden hidden sm:block">
                    <div className={`h-full rounded-full ${layer.dotColor}`} style={{ width: `${layer.coverage * 100}%` }} />
                  </div>
                  <span className="text-[10px] font-mono text-foreground-subtle w-8 text-right hidden sm:block">
                    {(layer.coverage * 100).toFixed(0)}%
                  </span>
                  {isOpen
                    ? <ChevronDown size={12} className="text-foreground-subtle" />
                    : <ChevronRight size={12} className="text-foreground-subtle" />
                  }
                </div>
              </button>
              <EvidenceDrawer items={layer.evidence} methodology={layer.methodology} open={isOpen} />
            </div>
          );
        })}
      </div>

      {/* Chain of custody (toggleable) */}
      {showChain && <ChainOfCustody />}

      {/* Known limitations notice */}
      <div className="mx-4 mb-4 border border-border rounded p-3 bg-surface-raised text-[10px] text-foreground-subtle leading-relaxed">
        <strong className="text-foreground-muted">Known Limitations:</strong>{" "}
        Biodiversity and health outcome projections are partially model-estimated and carry higher uncertainty (±14–22%).
        Community-reported data may contain selection bias. Third-party audit is overdue for renewal (scheduled Q1 2026).
        AI-inferred metrics are not eligible for standalone RVE asset issuance.
      </div>
    </div>
  );
}
