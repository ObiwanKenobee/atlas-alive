import { useState } from "react";
import { X, BookOpen, ChevronDown, ChevronRight, FlaskConical, Satellite, Brain, AlertTriangle, Link2, FileText } from "lucide-react";

interface MetricMethodology {
  id: string;
  label: string;
  icon: string;
  category: string;
  formula: string;
  modelAssumptions: string[];
  dataSources: { label: string; detail: string }[];
  auditNotes: string;
  limitations: string[];
  confidenceNote: string;
  references: { label: string; url?: string }[];
}

const METHODOLOGIES: MetricMethodology[] = [
  {
    id: "hectares",
    label: "Hectares Restored",
    icon: "🌿",
    category: "Land",
    formula: "ΔHA = Σ(verified_area_polygon × survival_rate × canopy_threshold_crossing)",
    modelAssumptions: [
      "Restoration confirmed when NDVI crosses 0.45 threshold for ≥2 consecutive Sentinel-2 passes",
      "Survival rate applied: 81% of planted area achieves canopy threshold within 18 months",
      "Polygon verification requires satellite + field agreement within 5% margin",
      "Deforestation events within 500m buffer trigger automatic reversal flag",
    ],
    dataSources: [
      { label: "Primary", detail: "Sentinel-2 Level-2A NDVI composites (ESA)" },
      { label: "Secondary", detail: "Landsat-9 OLI cross-validation" },
      { label: "Field", detail: "240 in-situ vegetation plots (IPCC Tier 2 protocol)" },
      { label: "Community", detail: "1,240 trained monitor observations (KoboToolbox)" },
    ],
    auditNotes: "Last independently verified against Verra VCS VM0007 methodology v1.6. Auditor: South Pole Group. Audit date: 2024-11-15. Next review: Q1 2026.",
    limitations: [
      "Cloud cover in wet season reduces satellite revisit to 32-day effective period",
      "NDVI may overestimate in areas with high C4 grass competition",
      "Field sampling covers 61% of total project area — remaining 39% is satellite-only",
    ],
    confidenceNote: "Confidence: 0.87 (High). Satellite + field + audited triple-verification.",
    references: [
      { label: "IPCC GPG LULUCF 2003", url: "#" },
      { label: "Verra VCS VM0007 v1.6", url: "#" },
      { label: "ESA Sentinel-2 Product Spec v3.5", url: "#" },
    ],
  },
  {
    id: "carbon",
    label: "Net Carbon Removed",
    icon: "🌀",
    category: "Carbon",
    formula: "C_net = C_sequestered − C_baseline − C_leakage_adjustment × permanence_discount",
    modelAssumptions: [
      "Tier 2 IPCC biomass expansion factors (BEF) applied per ecosystem type",
      "Baseline scenario: continuation of land-use trend without project intervention",
      "Permanence discount: 8.4% applied for reversibility risk (Verra buffer pool standard)",
      "Leakage adjustment: 12% applied for activity-shifting displacement estimate",
      "Root-to-shoot ratio from IPCC Table 4.4 for tropical moist forest",
    ],
    dataSources: [
      { label: "Satellite", detail: "Global Forest Watch biomass proxy + Sentinel-2 NDVI" },
      { label: "Field", detail: "Soil carbon (LOI + dry combustion), 240 sampling points" },
      { label: "Model", detail: "SEPAL/GEE carbon estimation model v2.1" },
      { label: "Audited", detail: "Verra VCS + Gold Standard third-party verification" },
    ],
    auditNotes: "Verified under Verra VCS standard and Gold Standard for carbon accounting. Full MRV documentation available on request. Permanence buffer: 8.4% in Verra pooled buffer account.",
    limitations: [
      "Soil carbon estimates carry ±14% uncertainty interval from field sampling density",
      "AI inference model used for 22% of total area — higher uncertainty in these zones",
      "Future forest dieback risk not captured in current 5-year projection model",
    ],
    confidenceNote: "Confidence: 0.91 (Very High). Audited + satellite + field verified.",
    references: [
      { label: "IPCC AR6 AFOLU Chapter 7", url: "#" },
      { label: "Verra VCS Standard v4.5", url: "#" },
      { label: "Gold Standard GHG Methodology", url: "#" },
    ],
  },
  {
    id: "water",
    label: "Water Systems Recovered",
    icon: "💧",
    category: "Water",
    formula: "W_recovered = Σ(systems where flow_index_current / flow_index_baseline ≥ 1.15)",
    modelAssumptions: [
      "A 'water system' is defined as a watershed sub-unit with measurable gauge station or satellite altimetry coverage",
      "Recovery threshold: current flow index ≥ 115% of degraded baseline",
      "Wetland area contribution: 1,000 ha wetland = 1 ecosystem service unit in water accounting",
      "Groundwater recharge correlation: +1% surface cover → +0.18% recharge rate (regional coefficient)",
    ],
    dataSources: [
      { label: "Satellite", detail: "GRACE-FO groundwater anomaly + Sentinel-1 SAR flood mapping" },
      { label: "Sensors", detail: "38 river gauge stations (real-time telemetry)" },
      { label: "Field", detail: "Quarterly water quality grab samples (pH, turbidity, conductivity)" },
      { label: "Community", detail: "Weekly household water access surveys" },
    ],
    auditNotes: "Water accounting methodology follows WRI Aqueduct framework. Gauge station data cross-validated with GRACE satellite groundwater anomaly. Last field validation: 2025-02-28.",
    limitations: [
      "Gauge station coverage: only 61% of watershed area has in-situ measurement",
      "Seasonal flood events can temporarily inflate recovery signals — adjusted with 3-month rolling average",
      "Groundwater recharge inference carries high uncertainty (±22%) due to aquifer complexity",
    ],
    confidenceNote: "Confidence: 0.74 (Medium). Field-verified with satellite cross-check.",
    references: [
      { label: "WRI Aqueduct Water Risk Framework v3", url: "#" },
      { label: "FAO AQUASTAT Methodology", url: "#" },
    ],
  },
  {
    id: "biodiversity",
    label: "Biodiversity Recovery Index",
    icon: "🦋",
    category: "Biodiversity",
    formula: "BRI = 0.4×species_richness_delta + 0.35×habitat_connectivity + 0.25×ecosystem_integrity",
    modelAssumptions: [
      "Species richness proxy: acoustic bioacoustic monitoring + iNaturalist community observations",
      "Habitat connectivity: least-cost path analysis between restoration zones using CIRCUITSCAPE",
      "Ecosystem integrity scored against IUCN Red List Ecosystem Categories",
      "BRI is a composite index (0–1) where 1.0 = pre-disturbance reference condition",
    ],
    dataSources: [
      { label: "Satellite", detail: "Sentinel-2 habitat fragmentation analysis" },
      { label: "Field", detail: "Transect biodiversity surveys (eBird + iNaturalist protocols)" },
      { label: "Model", detail: "EcoPulse BRI inference model v2.1 (AI estimated)" },
      { label: "Community", detail: "Trained wildlife observer network (52 monitors)" },
    ],
    auditNotes: "BRI methodology peer-reviewed by University of Nairobi Faculty of Natural Sciences (2024). AI model component not independently audited — carries automatic 15% confidence discount.",
    limitations: [
      "AI inference used for 78% of total BRI calculation — highest uncertainty metric in the portfolio",
      "Acoustic monitoring only covers areas within 200m of sensors",
      "Pollinator return index based on limited (n=18) sampling transects",
    ],
    confidenceNote: "Confidence: 0.68 (Medium). AI-inferred with limited field verification.",
    references: [
      { label: "IUCN Red List Ecosystems Criteria v3.1", url: "#" },
      { label: "CIRCUITSCAPE v4 habitat connectivity", url: "#" },
    ],
  },
  {
    id: "lives",
    label: "Lives Improved",
    icon: "🫀",
    category: "Health",
    formula: "L_improved = Σ(beneficiaries where ≥2 of: clinic_access_improved, morbidity_reduced, water_access_improved, income_above_threshold)",
    modelAssumptions: [
      "A 'life improved' requires ≥2 concurrent positive indicators from the health outcome matrix",
      "Clinic access: < 5km walking distance to nearest functioning health facility",
      "Morbidity reduction: household-reported disease frequency, 3-month recall",
      "Income threshold: > 20% increase in reported weekly income vs. project start baseline",
    ],
    dataSources: [
      { label: "Community", detail: "Quarterly household surveys (1,240 monitor network)" },
      { label: "Health system", detail: "Facility-level outpatient register data (12 clinics)" },
      { label: "Model", detail: "Estimated 14% morbidity reduction — model only, not field-confirmed" },
    ],
    auditNotes: "Health outcomes are the least independently audited metric in the portfolio. Community-reported data is subject to reporting bias. External health system data covers only 38% of beneficiary population.",
    limitations: [
      "Most unreliable metric in the portfolio — confidence 0.61",
      "90-day stale data warning active — last community survey overdue",
      "Morbidity reduction is model-estimated only, not clinically confirmed",
      "Sanitation-linked outcomes currently under review (insufficient data)",
    ],
    confidenceNote: "Confidence: 0.61 (Low-Medium). Community-reported with model supplementation. STALE DATA — refresh required.",
    references: [
      { label: "WHO DALY Health Impact Assessment", url: "#" },
      { label: "IHME Global Burden of Disease Methodology", url: "#" },
    ],
  },
  {
    id: "jobs",
    label: "Regenerative Jobs Created",
    icon: "🤝",
    category: "Jobs",
    formula: "J = Σ(direct_employment_FTE × quality_multiplier) where quality_multiplier = 1.0 if income ≥ 1.5× regional_median",
    modelAssumptions: [
      "'Regenerative job' defined as: directly linked to restoration activity, ≥ 6-month tenure, income ≥ 1.5× regional median wage",
      "FTE conversion: 1 FTE = 40 hours/week for ≥ 26 weeks",
      "Quality multiplier applied: jobs below income threshold counted at 0.65 weighting",
      "Supply chain inclusion: indirect jobs counted at 0.3 weighting",
    ],
    dataSources: [
      { label: "Field", detail: "Operator payroll records + community income surveys" },
      { label: "Community", detail: "Employment status tracking via monitor network" },
      { label: "Partners", detail: "Enterprise participation self-reporting (312 enterprises)" },
    ],
    auditNotes: "Job counting methodology aligned with ILO decent work definition. Enterprise-reported data cross-checked against payroll sampling. Youth employment (34%) independently verified by 3 local NGO partners.",
    limitations: [
      "Income data relies partially on self-reporting — potential upward bias",
      "Supply chain inclusion count (41 suppliers) is self-reported, not independently verified",
      "Job durability beyond 18 months not yet assessed for early cohorts",
    ],
    confidenceNote: "Confidence: 0.82 (High). Field + payroll + partner verified.",
    references: [
      { label: "ILO Decent Work Indicators", url: "#" },
      { label: "Global Jobs Pact Monitoring Guidelines", url: "#" },
    ],
  },
];

// Category color
const catColor: Record<string, string> = {
  Land: "text-recovery border-recovery/20 bg-recovery-dim",
  Carbon: "text-recovery border-recovery/30 bg-recovery-dim",
  Water: "text-water border-water/20 bg-water-dim",
  Health: "text-watch border-watch/20 bg-watch-dim",
  Biodiversity: "text-accent border-accent/20 bg-surface-raised",
  Jobs: "text-accent border-accent/20 bg-surface-raised",
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-[9px] text-foreground-subtle uppercase tracking-widest font-mono mb-2">{title}</div>
      {children}
    </div>
  );
}

function MetricPanel({ m }: { m: MetricMethodology }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-surface-raised transition-colors text-left"
      >
        <span className="text-xl leading-none">{m.icon}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-foreground">{m.label}</span>
            <span className={`text-[9px] px-1.5 py-0.5 rounded border font-mono ${catColor[m.category] ?? "text-foreground-subtle border-border"}`}>
              {m.category}
            </span>
          </div>
          <div className="text-[10px] text-foreground-subtle font-mono mt-0.5 truncate">{m.confidenceNote}</div>
        </div>
        {open ? <ChevronDown size={14} className="text-foreground-subtle flex-shrink-0" /> : <ChevronRight size={14} className="text-foreground-subtle flex-shrink-0" />}
      </button>

      {open && (
        <div className="px-4 pb-4 space-y-4 border-t border-border bg-surface-raised/30">
          {/* Formula */}
          <Section title="Formula">
            <div className="bg-surface rounded border border-border px-3 py-2 font-mono text-[11px] text-recovery leading-relaxed">
              {m.formula}
            </div>
          </Section>

          {/* Model Assumptions */}
          <Section title="Model assumptions">
            <ul className="space-y-1">
              {m.modelAssumptions.map((a, i) => (
                <li key={i} className="flex items-start gap-2 text-[11px] text-foreground-subtle">
                  <span className="text-foreground-subtle mt-0.5 font-mono">→</span>
                  {a}
                </li>
              ))}
            </ul>
          </Section>

          {/* Data Sources */}
          <Section title="Data sources">
            <div className="space-y-1.5">
              {m.dataSources.map((s, i) => (
                <div key={i} className="flex items-start gap-3 text-[11px]">
                  <span className="text-foreground-subtle min-w-[70px] font-mono flex-shrink-0">{s.label}</span>
                  <span className="text-foreground-muted">{s.detail}</span>
                </div>
              ))}
            </div>
          </Section>

          {/* Audit Notes */}
          <Section title="Audit & verification notes">
            <div className="text-[11px] text-foreground-subtle leading-relaxed bg-surface rounded border border-border px-3 py-2">
              {m.auditNotes}
            </div>
          </Section>

          {/* Limitations */}
          <Section title="Known limitations">
            <div className="space-y-1">
              {m.limitations.map((l, i) => (
                <div key={i} className="flex items-start gap-2 text-[11px] text-watch">
                  <AlertTriangle size={10} className="flex-shrink-0 mt-0.5" />
                  {l}
                </div>
              ))}
            </div>
          </Section>

          {/* References */}
          <Section title="References">
            <div className="flex flex-wrap gap-2">
              {m.references.map((r, i) => (
                <span key={i} className="flex items-center gap-1 text-[10px] px-2 py-1 rounded border border-border text-foreground-subtle hover:text-foreground cursor-pointer font-mono">
                  <Link2 size={9} />
                  {r.label}
                </span>
              ))}
            </div>
          </Section>
        </div>
      )}
    </div>
  );
}

interface Props {
  open: boolean;
  onClose: () => void;
}

export function MethodologyDrawer({ open, onClose }: Props) {
  const [search, setSearch] = useState("");

  const filtered = METHODOLOGIES.filter(m =>
    search === "" ||
    m.label.toLowerCase().includes(search.toLowerCase()) ||
    m.category.toLowerCase().includes(search.toLowerCase())
  );

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 bg-background/70 backdrop-blur-sm" onClick={onClose} />

      <div className="fixed right-0 top-0 h-full z-50 w-full max-w-xl bg-surface border-l border-border flex flex-col shadow-2xl animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div>
            <div className="text-[10px] font-mono text-foreground-subtle uppercase tracking-widest mb-0.5">How are these numbers produced?</div>
            <div className="font-semibold text-foreground flex items-center gap-2">
              <BookOpen size={16} className="text-foreground-subtle" />
              Methodology & Evidence
            </div>
          </div>
          <button onClick={onClose} className="text-foreground-subtle hover:text-foreground p-1.5 rounded hover:bg-surface-raised transition-colors">
            <X size={16} />
          </button>
        </div>

        {/* Intro */}
        <div className="px-5 py-3 border-b border-border bg-surface-raised/50 text-[11px] text-foreground-subtle leading-relaxed">
          Every metric in the Atlas dashboard is produced by a documented, reproducible methodology.
          Expand any metric below to inspect its formula, model assumptions, data sources,
          audit trail, and known limitations.
        </div>

        {/* Search */}
        <div className="px-5 py-2.5 border-b border-border">
          <input
            type="text"
            placeholder="Search metric or category…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-surface-overlay border border-border rounded px-3 py-1.5 text-xs text-foreground placeholder:text-foreground-subtle font-mono focus:outline-none focus:border-primary/40"
          />
        </div>

        {/* Metric list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {filtered.map(m => <MetricPanel key={m.id} m={m} />)}
          {filtered.length === 0 && (
            <div className="text-center text-foreground-subtle text-sm py-8 font-mono">No metrics match "{search}"</div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-border bg-surface-raised/50 flex items-center gap-3">
          <FileText size={12} className="text-foreground-subtle flex-shrink-0" />
          <p className="text-[10px] text-foreground-subtle leading-relaxed">
            Methodology version: <span className="font-mono text-foreground-muted">v2.4.1</span> ·
            Last external audit: <span className="font-mono text-foreground-muted">2024-11-15</span> ·
            Full documentation available at atlas-docs.io
          </p>
        </div>
      </div>
    </>
  );
}
