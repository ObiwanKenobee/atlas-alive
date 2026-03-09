import { useState } from "react";
import {
  Filter, ChevronDown, Globe2, Clock, CheckCircle, BarChart2,
  ClipboardList, WifiOff, Layers, TrendingUp, FolderOpen, GitCompare,
  X
} from "lucide-react";
import { AuthPanel } from "@/components/dashboard/AuthPanel";
import { useAuth } from "@/hooks/useAuth";
import type { RealtimeStatus } from "@/hooks/useRealtimeProjects";

export const REGIONS = [
  "All Regions",
  "Kenya — Rift Valley", "Kenya — Eastern", "Kenya — Western",
  "DRC — Équateur", "Niger — Sahel", "Botswana — Ngamiland",
];
export const SECTORS = [
  "All Sectors", "Forest", "Water", "Health", "Biodiversity", "Jobs", "Carbon",
];
export const VERIFICATION = [
  "All Sources", "Satellite Verified", "Field Verified", "Third-Party Audited", "Model Estimated",
];
export const TIME_MODES = ["30d", "12m", "5y", "Inception"];
const PORTFOLIOS = ["All Projects", "Active", "Watch", "High-Confidence", "At-Risk"];
const BASELINE_MODES = ["vs Baseline", "vs Target", "vs Counterfactual", "vs Prior Period"];

export interface FilterState {
  region: string;
  sector: string;
  verification: string;
  time: string;
  portfolio: string;
  baselineMode: string;
}

export interface FilterBarProps {
  selectedRegion: string;
  setSelectedRegion: (v: string) => void;
  selectedSector: string;
  setSelectedSector: (v: string) => void;
  selectedVerification: string;
  setSelectedVerification: (v: string) => void;
  selectedTime: string;
  setSelectedTime: (v: string) => void;
  selectedPortfolio?: string;
  setSelectedPortfolio?: (v: string) => void;
  selectedBaselineMode?: string;
  setSelectedBaselineMode?: (v: string) => void;
  exportMenu?: React.ReactNode;
  onOpenOperatorForm: () => void;
  onOpenAdmin?: () => void;
  realtimeStatus?: RealtimeStatus;
}

function DropdownSelect({
  label, icon: Icon, value, options, onChange, compact,
}: {
  label: string; icon: React.ElementType; value: string; options: string[];
  onChange: (v: string) => void; compact?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const isDefault = value === options[0];
  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded border transition-colors text-xs group
          ${isDefault
            ? "border-border bg-surface text-foreground-muted hover:bg-surface-raised hover:text-foreground"
            : "border-primary/40 bg-primary/10 text-primary"
          }`}
      >
        <Icon size={12} className={isDefault ? "text-foreground-subtle group-hover:text-primary transition-colors" : "text-primary"} />
        {!compact && (
          <span className="hidden sm:inline text-[10px] uppercase tracking-widest opacity-60">{label}:</span>
        )}
        <span className="font-medium max-w-[100px] truncate">{compact && !isDefault ? value : isDefault ? label : value}</span>
        <ChevronDown size={10} className={`transition-transform flex-shrink-0 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute top-full mt-1 left-0 z-50 min-w-[200px] bg-surface-overlay border border-border rounded shadow-lg py-1">
            {options.map((opt) => (
              <button
                key={opt}
                onClick={() => { onChange(opt); setOpen(false); }}
                className={`w-full text-left px-4 py-2 text-sm transition-colors hover:bg-surface-raised flex items-center justify-between gap-2
                  ${value === opt ? "text-primary font-medium" : "text-foreground-muted"}`}
              >
                {opt}
                {value === opt && <div className="w-1 h-1 rounded-full bg-primary" />}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function ActiveFiltersStrip({
  region, sector, verification, portfolio, baselineMode,
  onClearRegion, onClearSector, onClearVerification, onClearPortfolio, onClearBaseline,
}: {
  region: string; sector: string; verification: string; portfolio: string; baselineMode: string;
  onClearRegion: () => void; onClearSector: () => void; onClearVerification: () => void;
  onClearPortfolio: () => void; onClearBaseline: () => void;
}) {
  const chips: { label: string; onClear: () => void }[] = [];
  if (region !== "All Regions") chips.push({ label: region, onClear: onClearRegion });
  if (sector !== "All Sectors") chips.push({ label: sector, onClear: onClearSector });
  if (verification !== "All Sources") chips.push({ label: verification, onClear: onClearVerification });
  if (portfolio !== "All Projects") chips.push({ label: portfolio, onClear: onClearPortfolio });
  if (baselineMode !== "vs Baseline") chips.push({ label: baselineMode, onClear: onClearBaseline });

  if (chips.length === 0) return null;

  return (
    <div className="px-4 sm:px-6 py-1.5 border-b border-border bg-background/80 flex items-center gap-2 flex-wrap">
      <span className="text-[10px] font-mono text-foreground-subtle uppercase tracking-widest">Active filters:</span>
      {chips.map((chip) => (
        <button
          key={chip.label}
          onClick={chip.onClear}
          className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full border border-primary/30 bg-primary/10 text-primary font-mono hover:bg-primary/20 transition-colors"
        >
          {chip.label}
          <X size={9} />
        </button>
      ))}
    </div>
  );
}

function RealtimeIndicator({ status }: { status: RealtimeStatus }) {
  const { connected, updateCount, lastUpdate } = status;
  const ago = lastUpdate
    ? (() => {
        const s = Math.floor((Date.now() - lastUpdate.getTime()) / 1000);
        if (s < 60) return `${s}s ago`;
        return `${Math.floor(s / 60)}m ago`;
      })()
    : null;

  return (
    <div
      title={connected
        ? `Live — ${updateCount} update${updateCount !== 1 ? "s" : ""} this session${ago ? ` · last ${ago}` : ""}`
        : "Connecting to realtime feed…"}
      className="flex items-center gap-1.5 px-2 py-1 rounded border border-border bg-surface text-xs font-mono select-none"
    >
      {connected ? (
        <>
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-recovery opacity-60" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-recovery" />
          </span>
          <span className="text-recovery hidden sm:inline">Live</span>
          {updateCount > 0 && (
            <span className="text-foreground-subtle hidden md:inline">· {updateCount}</span>
          )}
        </>
      ) : (
        <>
          <WifiOff size={11} className="text-foreground-subtle" />
          <span className="text-foreground-subtle hidden sm:inline">Connecting</span>
        </>
      )}
    </div>
  );
}

export function FilterBar({
  selectedRegion, setSelectedRegion,
  selectedSector, setSelectedSector,
  selectedVerification, setSelectedVerification,
  selectedTime, setSelectedTime,
  selectedPortfolio = "All Projects",
  setSelectedPortfolio,
  selectedBaselineMode = "vs Baseline",
  setSelectedBaselineMode,
  exportMenu,
  onOpenOperatorForm,
  onOpenAdmin,
  realtimeStatus,
}: FilterBarProps) {
  const { role } = useAuth();
  const isOperator = role === "operator" || role === "admin";

  const hasActiveFilters = (
    selectedRegion !== "All Regions" ||
    selectedSector !== "All Sectors" ||
    selectedVerification !== "All Sources" ||
    selectedPortfolio !== "All Projects" ||
    selectedBaselineMode !== "vs Baseline"
  );

  return (
    <div className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-md">
      {/* ── Primary command row ─────────────────────────────── */}
      <div className="px-4 sm:px-6 py-2.5 flex flex-wrap items-center gap-2">
        {/* Brand mark */}
        <div className="flex items-center gap-2 mr-1 flex-shrink-0">
          <div className="w-2 h-2 rounded-full bg-recovery animate-pulse-glow" />
          <span className="text-[10px] font-mono uppercase tracking-widest text-foreground-subtle hidden sm:inline">Atlas</span>
        </div>

        {/* Separator */}
        <div className="h-4 w-px bg-border hidden sm:block" />

        {/* Geography */}
        <DropdownSelect label="Region" icon={Globe2} value={selectedRegion} options={REGIONS} onChange={setSelectedRegion} />

        {/* Sector */}
        <DropdownSelect label="Sector" icon={BarChart2} value={selectedSector} options={SECTORS} onChange={setSelectedSector} />

        {/* Verification */}
        <DropdownSelect label="Source" icon={CheckCircle} value={selectedVerification} options={VERIFICATION} onChange={setSelectedVerification} compact />

        {/* Portfolio */}
        <DropdownSelect label="Portfolio" icon={FolderOpen} value={selectedPortfolio} options={PORTFOLIOS}
          onChange={(v) => setSelectedPortfolio?.(v)} compact />

        {/* Baseline comparison mode */}
        <DropdownSelect label="Compare" icon={GitCompare} value={selectedBaselineMode} options={BASELINE_MODES}
          onChange={(v) => setSelectedBaselineMode?.(v)} compact />

        {/* Time range */}
        <div className="flex items-center gap-1 ml-auto">
          <Clock size={11} className="text-foreground-subtle mr-0.5" />
          {TIME_MODES.map((t) => (
            <button
              key={t}
              onClick={() => setSelectedTime(t)}
              className={`px-2 py-1 rounded text-[11px] font-mono transition-colors ${
                selectedTime === t
                  ? "bg-recovery-dim text-recovery font-semibold border border-recovery/30"
                  : "text-foreground-subtle hover:text-foreground hover:bg-surface"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Scenario compare button */}
        <button className="flex items-center gap-1.5 px-2.5 py-1.5 rounded border border-border text-[11px] text-foreground-subtle hover:text-foreground hover:border-primary/40 transition-colors">
          <Layers size={11} />
          <span className="hidden md:inline">Layers</span>
        </button>

        {/* Submit Data (operator+) */}
        {isOperator && (
          <button
            onClick={onOpenOperatorForm}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded border border-recovery/30 bg-recovery-dim text-recovery text-xs font-semibold hover:bg-recovery hover:text-background transition-colors"
          >
            <ClipboardList size={11} />
            <span className="hidden sm:inline">Submit</span>
          </button>
        )}

        {/* Realtime indicator */}
        {realtimeStatus && <RealtimeIndicator status={realtimeStatus} />}

        {/* Export */}
        {exportMenu}

        {/* Auth */}
        <AuthPanel onOpenOperatorForm={onOpenOperatorForm} onOpenAdmin={onOpenAdmin} />
      </div>

      {/* ── Active filter chips ─────────────────────────────── */}
      {hasActiveFilters && (
        <ActiveFiltersStrip
          region={selectedRegion}
          sector={selectedSector}
          verification={selectedVerification}
          portfolio={selectedPortfolio}
          baselineMode={selectedBaselineMode}
          onClearRegion={() => setSelectedRegion("All Regions")}
          onClearSector={() => setSelectedSector("All Sectors")}
          onClearVerification={() => setSelectedVerification("All Sources")}
          onClearPortfolio={() => setSelectedPortfolio?.("All Projects")}
          onClearBaseline={() => setSelectedBaselineMode?.("vs Baseline")}
        />
      )}
    </div>
  );
}
