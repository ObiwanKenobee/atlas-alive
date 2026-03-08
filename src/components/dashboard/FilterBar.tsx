import { useState } from "react";
import { Filter, ChevronDown, Globe2, Clock, CheckCircle, BarChart2 } from "lucide-react";

const REGIONS = ["All Regions", "Kenya — Rift Valley", "Kenya — Eastern", "Kenya — Western", "DRC — Équateur", "Niger — Sahel", "Botswana — Ngamiland"];
const SECTORS = ["All Sectors", "Forest", "Water", "Health", "Biodiversity", "Jobs", "Carbon"];
const VERIFICATION = ["All Sources", "Satellite Verified", "Field Verified", "Third-Party Audited", "Model Estimated"];
const TIME_MODES = ["30d", "12m", "5y", "Inception"];

interface FilterBarProps {
  selectedRegion: string;
  setSelectedRegion: (v: string) => void;
  selectedSector: string;
  setSelectedSector: (v: string) => void;
  selectedVerification: string;
  setSelectedVerification: (v: string) => void;
  selectedTime: string;
  setSelectedTime: (v: string) => void;
}

function DropdownSelect({
  label, icon: Icon, value, options, onChange,
}: {
  label: string;
  icon: React.ElementType;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-1.5 rounded border border-border bg-surface hover:bg-surface-raised transition-colors text-sm text-foreground-muted hover:text-foreground group"
      >
        <Icon size={13} className="text-foreground-subtle group-hover:text-primary transition-colors" />
        <span className="hidden sm:inline text-foreground-subtle text-xs uppercase tracking-widest">{label}:</span>
        <span className="font-medium text-foreground">{value}</span>
        <ChevronDown size={12} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute top-full mt-1 left-0 z-50 min-w-[200px] bg-surface-overlay border border-border rounded shadow-lg py-1">
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => { onChange(opt); setOpen(false); }}
              className={`w-full text-left px-4 py-2 text-sm transition-colors hover:bg-surface-raised
                ${value === opt ? "text-recovery font-medium" : "text-foreground-muted"}`}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function FilterBar({
  selectedRegion, setSelectedRegion,
  selectedSector, setSelectedSector,
  selectedVerification, setSelectedVerification,
  selectedTime, setSelectedTime,
}: FilterBarProps) {
  return (
    <div className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-md">
      <div className="px-4 sm:px-6 py-3 flex flex-wrap items-center gap-2">
        {/* Brand */}
        <div className="flex items-center gap-2 mr-2">
          <div className="w-2 h-2 rounded-full bg-recovery animate-pulse-glow" />
          <span className="text-xs font-mono uppercase tracking-widest text-foreground-subtle">Atlas / Impact</span>
        </div>

        <div className="flex-1 flex flex-wrap items-center gap-2">
          <DropdownSelect label="Region" icon={Globe2} value={selectedRegion} options={REGIONS} onChange={setSelectedRegion} />
          <DropdownSelect label="Sector" icon={BarChart2} value={selectedSector} options={SECTORS} onChange={setSel} onChange={setSelectedSector} />
          <DropdownSelect label="Source" icon={CheckCircle} value={selectedVerification} options={VERIFICATION} onChange={setSelectedVerification} />
        </div>

        {/* Time pills */}
        <div className="flex items-center gap-1 ml-auto">
          <Clock size={12} className="text-foreground-subtle mr-1" />
          {TIME_MODES.map((t) => (
            <button
              key={t}
              onClick={() => setSelectedTime(t)}
              className={`px-2.5 py-1 rounded text-xs font-mono transition-colors
                ${selectedTime === t
                  ? "bg-recovery-dim text-recovery font-semibold border border-recovery/30"
                  : "text-foreground-subtle hover:text-foreground hover:bg-surface"
                }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Comparison mode */}
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-border text-xs text-foreground-subtle hover:text-foreground hover:border-primary/40 transition-colors">
          <Filter size={12} />
          Compare
        </button>
      </div>
    </div>
  );
}
