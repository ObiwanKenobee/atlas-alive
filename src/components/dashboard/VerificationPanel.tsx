import { useState } from "react";
import { Satellite, FlaskConical, Users, Brain, ShieldCheck, ChevronDown, ChevronRight, AlertCircle } from "lucide-react";
import { verificationSummary } from "@/data/mockData";

interface EvidenceItem {
  label: string;
  detail: string;
}

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
    evidence: [
      { label: "Sensor", detail: "Sentinel-2 multispectral (10m res.)" },
      { label: "Coverage", detail: "82% of total project area" },
      { label: "Cadence", detail: "16-day revisit, cloud-adjusted" },
      { label: "Algorithm", detail: "NDVI change detection v3.1" },
    ] as EvidenceItem[],
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
    evidence: [
      { label: "Sample points", detail: "240 in-situ measurements" },
      { label: "Protocol", detail: "IPCC Tier 2 soil carbon" },
      { label: "Validation rate", detail: "87% match with satellite" },
    ] as EvidenceItem[],
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
    evidence: [
      { label: "Reporters", detail: "1,240 trained community monitors" },
      { label: "Frequency", detail: "Weekly mobile submissions" },
      { label: "Bias check", detail: "Cross-referenced with satellite" },
    ] as EvidenceItem[],
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
    evidence: [
      { label: "Model", detail: "EcoPulse v2.1 regression ensemble" },
      { label: "Training data", detail: "8 years satellite + field" },
      { label: "Uncertainty", detail: "±14% prediction interval" },
    ] as EvidenceItem[],
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
    evidence: [
      { label: "Auditor", detail: "Verra VCS + Gold Standard" },
      { label: "Last audit", detail: verificationSummary.lastAuditDate },
      { label: "Methodology", detail: `Version ${verificationSummary.methodologyVersion}` },
      { label: "Coverage", detail: "5 projects, 91% asset value" },
    ] as EvidenceItem[],
  },
];

function EvidenceDrawer({ items, open }: { items: EvidenceItem[]; open: boolean }) {
  if (!open) return null;
  return (
    <div className="mt-2 pl-4 space-y-1.5 border-l border-border">
      {items.map((item, i) => (
        <div key={i} className="flex items-start gap-3 text-xs">
          <span className="text-foreground-subtle min-w-[90px]">{item.label}</span>
          <span className="text-foreground-muted">{item.detail}</span>
        </div>
      ))}
    </div>
  );
}

export function VerificationPanel() {
  const [expanded, setExpanded] = useState<string | null>(null);

  const overallScore = verificationSummary.overallConfidence;

  return (
    <div className="bg-surface border border-border rounded-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-start justify-between px-4 py-3 border-b border-border">
        <div>
          <div className="text-xs text-foreground-subtle uppercase tracking-widest font-mono mb-1">Trust Infrastructure</div>
          <div className="font-semibold text-foreground text-sm">Verification & Evidence</div>
        </div>
        <div className="text-right">
          <div className="text-xs text-foreground-subtle font-mono mb-0.5">Overall Confidence</div>
          <div className={`font-mono text-xl font-semibold ${overallScore >= 0.75 ? "text-recovery" : "text-watch"}`}>
            {overallScore.toFixed(2)}
          </div>
        </div>
      </div>

      {/* Methodology version */}
      <div className="px-4 py-2 bg-surface-raised border-b border-border flex items-center gap-2 text-xs text-foreground-subtle">
        <AlertCircle size={11} />
        <span>Methodology: <span className="font-mono text-foreground-muted">{verificationSummary.methodologyVersion}</span></span>
        <span className="mx-2 text-border">|</span>
        <span>Last audit: <span className="font-mono text-foreground-muted">{verificationSummary.lastAuditDate}</span></span>
      </div>

      {/* Verification layers */}
      <div className="p-4 space-y-2">
        {verificationLayers.map((layer) => {
          const Icon = layer.icon;
          const isOpen = expanded === layer.key;
          return (
            <div key={layer.key} className={`border ${layer.borderColor} rounded p-3`}>
              <button
                className="w-full flex items-center justify-between gap-3"
                onClick={() => setExpanded(isOpen ? null : layer.key)}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className={`p-1.5 rounded ${layer.bgColor}`}>
                    <Icon size={13} className={layer.color} />
                  </div>
                  <div className="text-left min-w-0">
                    <div className={`text-xs font-medium ${layer.color}`}>{layer.label}</div>
                    <div className="text-[10px] text-foreground-subtle font-mono">
                      {layer.count} projects · {(layer.coverage * 100).toFixed(0)}% coverage · {layer.lastUpdate}
                    </div>
                  </div>
                </div>
                {/* Coverage bar */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <div className="w-20 h-1 bg-surface-overlay rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${layer.dotColor}`}
                      style={{ width: `${layer.coverage * 100}%` }}
                    />
                  </div>
                  {isOpen ? <ChevronDown size={12} className="text-foreground-subtle" /> : <ChevronRight size={12} className="text-foreground-subtle" />}
                </div>
              </button>
              <EvidenceDrawer items={layer.evidence} open={isOpen} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
