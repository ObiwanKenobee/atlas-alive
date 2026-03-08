import { useState, useCallback } from "react";
import { Sliders, RefreshCw, TrendingUp, Leaf, Droplets, Zap, ChevronDown, ChevronUp, Info } from "lucide-react";

// Scenario modeling: pure client-side simulation
// Inputs: extra hectares, region, type, confidence
// Outputs: projected RVE uplift, carbon delta, biodiversity multiplier

interface ScenarioInputs {
  extraHectares: number;
  region: string;
  ecosystemType: "forest" | "wetland" | "savanna" | "mangrove";
  confidenceLevel: "high" | "medium" | "low";
  timeHorizon: 1 | 3 | 5 | 10;
}

interface ScenarioOutputs {
  carbonDelta: number;         // t CO₂e
  biodiversityMultiplier: number;
  rveValueUplift: number;      // USD
  ecologicalUplift: number;    // 0-1
  jobsCreated: number;
  waterUplift: number;         // m³/yr
  permanenceRisk: string;
  confidenceNote: string;
}

// Ecosystem-specific coefficients (simplified credible model)
const ECOSYSTEM_PARAMS = {
  forest: { carbonPerHa: 12.4, biodiv: 1.35, water: 4200, jobs: 0.18, rveBase: 1400 },
  wetland: { carbonPerHa: 8.1, biodiv: 1.6, water: 9800, jobs: 0.12, rveBase: 1800 },
  savanna: { carbonPerHa: 5.8, biodiv: 1.2, water: 1800, jobs: 0.22, rveBase: 900 },
  mangrove: { carbonPerHa: 18.2, biodiv: 1.8, water: 6200, jobs: 0.09, rveBase: 2400 },
};

const CONFIDENCE_DISCOUNT = { high: 1.0, medium: 0.78, low: 0.55 };
const TIME_MULTIPLIER = { 1: 0.6, 3: 1.0, 5: 1.4, 10: 2.1 };
const PERMANENCE = {
  high: "Low risk — strong permanence (0.88 score)",
  medium: "Moderate risk — reversibility possible",
  low: "High risk — significant permanence discount applied",
};

function computeScenario(inputs: ScenarioInputs): ScenarioOutputs {
  const p = ECOSYSTEM_PARAMS[inputs.ecosystemType];
  const disc = CONFIDENCE_DISCOUNT[inputs.confidenceLevel];
  const tmul = TIME_MULTIPLIER[inputs.timeHorizon];

  const carbonDelta = Math.round(inputs.extraHectares * p.carbonPerHa * disc * tmul);
  const biodiversityMultiplier = +(p.biodiv * (0.8 + 0.2 * disc)).toFixed(2);
  const ecologicalUplift = +(0.45 + disc * 0.4).toFixed(2);
  const rveValueUplift = Math.round(inputs.extraHectares * p.rveBase * disc * tmul);
  const jobsCreated = Math.round(inputs.extraHectares * p.jobs * disc);
  const waterUplift = Math.round(inputs.extraHectares * p.water * disc);

  return {
    carbonDelta,
    biodiversityMultiplier,
    rveValueUplift,
    ecologicalUplift,
    jobsCreated,
    waterUplift,
    permanenceRisk: PERMANENCE[inputs.confidenceLevel],
    confidenceNote: disc < 1
      ? `${((1 - disc) * 100).toFixed(0)}% confidence discount applied to all projections`
      : "Full confidence — satellite + field verification assumed",
  };
}

function SliderRow({
  label, value, min, max, step, unit, onChange, info,
}: {
  label: string; value: number; min: number; max: number; step: number; unit: string;
  onChange: (v: number) => void; info?: string;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-foreground-muted">{label}</span>
          {info && <span title={info}><Info size={10} className="text-foreground-subtle" /></span>}
        </div>
        <span className="font-mono text-sm text-recovery font-semibold">
          {value.toLocaleString()} {unit}
        </span>
      </div>
      <div className="relative h-2">
        <div className="absolute inset-0 rounded-full bg-surface-overlay" />
        <div
          className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-primary to-primary-glow"
          style={{ width: `${pct}%` }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={e => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full opacity-0 cursor-pointer"
          style={{ height: "100%" }}
        />
      </div>
      <div className="flex justify-between text-[9px] text-foreground-subtle font-mono">
        <span>{min.toLocaleString()}</span>
        <span>{max.toLocaleString()}</span>
      </div>
    </div>
  );
}

function OutputCard({
  icon: Icon, label, value, unit, note, color = "text-recovery",
}: {
  icon: React.ElementType; label: string; value: string; unit: string; note?: string; color?: string;
}) {
  return (
    <div className="bg-surface rounded-lg border border-border p-3 space-y-1">
      <div className="flex items-center gap-1.5 text-foreground-subtle">
        <Icon size={11} />
        <span className="text-[10px] uppercase tracking-widest">{label}</span>
      </div>
      <div className={`font-mono text-lg font-bold ${color}`}>{value}</div>
      <div className="text-[10px] text-foreground-subtle">{unit}</div>
      {note && <div className="text-[10px] text-foreground-subtle italic border-t border-border pt-1 mt-1">{note}</div>}
    </div>
  );
}

const REGIONS = ["Congo Basin", "Rift Valley", "Sahel", "East African Coast", "Okavango", "Nairobi Watershed"];
const ECO_TYPES: { key: ScenarioInputs["ecosystemType"]; label: string; icon: string }[] = [
  { key: "forest", label: "Tropical Forest", icon: "🌿" },
  { key: "wetland", label: "Wetland", icon: "💧" },
  { key: "savanna", label: "Savanna", icon: "🌾" },
  { key: "mangrove", label: "Mangrove", icon: "🌊" },
];

export function ScenarioPanel() {
  const [inputs, setInputs] = useState<ScenarioInputs>({
    extraHectares: 5000,
    region: "Congo Basin",
    ecosystemType: "forest",
    timeHorizon: 5,
    confidenceLevel: "medium",
  });
  const [expanded, setExpanded] = useState(true);

  const outputs = computeScenario(inputs);

  const update = useCallback(<K extends keyof ScenarioInputs>(key: K, val: ScenarioInputs[K]) => {
    setInputs(prev => ({ ...prev, [key]: val }));
  }, []);

  const reset = () => setInputs({
    extraHectares: 5000,
    region: "Congo Basin",
    ecosystemType: "forest",
    timeHorizon: 5,
    confidenceLevel: "medium",
  });

  return (
    <div className="bg-surface border border-border rounded-lg overflow-hidden">
      {/* Header */}
      <button
        className="w-full flex items-center justify-between px-4 py-3 border-b border-border hover:bg-surface-raised transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-3 text-left">
          <div className="p-1.5 rounded bg-recovery-dim">
            <Sliders size={14} className="text-recovery" />
          </div>
          <div>
            <div className="text-xs text-foreground-subtle uppercase tracking-widest font-mono mb-0.5">What-If Analysis</div>
            <div className="font-semibold text-foreground text-sm">Scenario Modeling</div>
          </div>
          <span className="text-xs text-foreground-subtle italic ml-2 hidden sm:inline">
            "{inputs.extraHectares.toLocaleString()} ha restored in {inputs.region}" →
            <span className="text-recovery ml-1 font-mono">${(outputs.rveValueUplift / 1000000).toFixed(1)}M RVE uplift</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={e => { e.stopPropagation(); reset(); }}
            className="text-foreground-subtle hover:text-foreground text-xs flex items-center gap-1 px-2 py-1 rounded border border-border hover:bg-surface-raised"
          >
            <RefreshCw size={10} />
            Reset
          </button>
          {expanded ? <ChevronUp size={14} className="text-foreground-subtle" /> : <ChevronDown size={14} className="text-foreground-subtle" />}
        </div>
      </button>

      {expanded && (
        <div className="grid md:grid-cols-2 gap-0 divide-y md:divide-y-0 md:divide-x divide-border">
          {/* ── Left: Inputs ── */}
          <div className="p-5 space-y-5">
            <div className="text-[10px] uppercase tracking-widest text-foreground-subtle font-mono">Scenario Inputs</div>

            {/* Hectares slider */}
            <SliderRow
              label="Additional hectares to restore"
              value={inputs.extraHectares}
              min={500}
              max={50000}
              step={500}
              unit="ha"
              onChange={v => update("extraHectares", v)}
              info="Simulated new restoration area on top of current baseline"
            />

            {/* Region */}
            <div>
              <div className="text-xs text-foreground-muted mb-2">Target Region</div>
              <div className="flex flex-wrap gap-2">
                {REGIONS.map(r => (
                  <button
                    key={r}
                    onClick={() => update("region", r)}
                    className={`text-xs px-2.5 py-1 rounded border transition-colors ${
                      inputs.region === r
                        ? "border-recovery/40 text-recovery bg-recovery-dim"
                        : "border-border text-foreground-subtle hover:text-foreground"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* Ecosystem type */}
            <div>
              <div className="text-xs text-foreground-muted mb-2">Ecosystem Type</div>
              <div className="grid grid-cols-2 gap-2">
                {ECO_TYPES.map(eco => (
                  <button
                    key={eco.key}
                    onClick={() => update("ecosystemType", eco.key)}
                    className={`flex items-center gap-2 text-xs px-3 py-2 rounded border transition-colors text-left ${
                      inputs.ecosystemType === eco.key
                        ? "border-recovery/40 text-recovery bg-recovery-dim"
                        : "border-border text-foreground-subtle hover:text-foreground hover:bg-surface-raised"
                    }`}
                  >
                    <span>{eco.icon}</span> {eco.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Time horizon */}
            <div>
              <div className="text-xs text-foreground-muted mb-2">Time Horizon</div>
              <div className="flex gap-2">
                {([1, 3, 5, 10] as const).map(t => (
                  <button
                    key={t}
                    onClick={() => update("timeHorizon", t)}
                    className={`flex-1 text-xs py-1.5 rounded border font-mono transition-colors ${
                      inputs.timeHorizon === t
                        ? "border-recovery/40 text-recovery bg-recovery-dim"
                        : "border-border text-foreground-subtle hover:text-foreground"
                    }`}
                  >
                    {t}yr
                  </button>
                ))}
              </div>
            </div>

            {/* Confidence level */}
            <div>
              <div className="text-xs text-foreground-muted mb-2">Assumption Confidence</div>
              <div className="flex gap-2">
                {(["high", "medium", "low"] as const).map(c => (
                  <button
                    key={c}
                    onClick={() => update("confidenceLevel", c)}
                    className={`flex-1 text-xs py-1.5 rounded border font-mono capitalize transition-colors ${
                      inputs.confidenceLevel === c
                        ? c === "high" ? "border-recovery/40 text-recovery bg-recovery-dim"
                          : c === "medium" ? "border-watch/40 text-watch bg-watch-dim"
                          : "border-reversal/40 text-reversal bg-reversal-dim"
                        : "border-border text-foreground-subtle hover:text-foreground"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ── Right: Outputs ── */}
          <div className="p-5 space-y-4">
            <div className="text-[10px] uppercase tracking-widest text-foreground-subtle font-mono">Projected Outcomes</div>

            <div className="grid grid-cols-2 gap-3">
              <OutputCard
                icon={TrendingUp}
                label="RVE Value Uplift"
                value={`$${(outputs.rveValueUplift / 1000000).toFixed(1)}M`}
                unit="estimated asset value"
                color="text-recovery"
              />
              <OutputCard
                icon={Leaf}
                label="Carbon Delta"
                value={(outputs.carbonDelta / 1000).toFixed(1) + "K"}
                unit="t CO₂e sequestered"
                color="text-recovery-bright"
              />
              <OutputCard
                icon={Zap}
                label="Biodiv. Multiplier"
                value={`${outputs.biodiversityMultiplier}×`}
                unit="ecosystem uplift factor"
                color="text-accent"
              />
              <OutputCard
                icon={Droplets}
                label="Water Uplift"
                value={`${(outputs.waterUplift / 1000000).toFixed(1)}M`}
                unit="m³ / year improved"
                color="text-water"
              />
            </div>

            {/* Secondary outputs */}
            <div className="border border-border rounded p-3 space-y-2 bg-surface-raised">
              <div className="flex justify-between text-xs">
                <span className="text-foreground-subtle">Ecological Uplift Score</span>
                <span className="font-mono font-semibold text-recovery">{outputs.ecologicalUplift.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-foreground-subtle">Regenerative Jobs Created</span>
                <span className="font-mono font-semibold text-accent">{outputs.jobsCreated.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-foreground-subtle">Permanence Assessment</span>
                <span className={`font-mono text-xs ${inputs.confidenceLevel === "high" ? "text-recovery" : inputs.confidenceLevel === "medium" ? "text-watch" : "text-reversal"}`}>
                  {inputs.confidenceLevel === "high" ? "Low" : inputs.confidenceLevel === "medium" ? "Moderate" : "High"} risk
                </span>
              </div>
            </div>

            {/* Confidence note */}
            <div className="text-[10px] text-foreground-subtle border-t border-border pt-3 italic leading-relaxed">
              ⚠️ {outputs.confidenceNote}. All projections use ecosystem-calibrated coefficients.
              Not investment advice — for planning and due diligence only.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
