import { useState } from "react";
import { Filter, ChevronDown, Globe2, Clock, CheckCircle, BarChart2, ClipboardList, Wifi, WifiOff } from "lucide-react";
import { AuthPanel } from "@/components/dashboard/AuthPanel";
import { useAuth } from "@/hooks/useAuth";
import type { RealtimeStatus } from "@/hooks/useRealtimeProjects";

const REGIONS = ["All Regions", "Kenya — Rift Valley", "Kenya — Eastern", "Kenya — Western", "DRC — Équateur", "Niger — Sahel", "Botswana — Ngamiland"];
const SECTORS = ["All Sectors", "Forest", "Water", "Health", "Biodiversity", "Jobs", "Carbon"];
const VERIFICATION = ["All Sources", "Satellite Verified", "Field Verified", "Third-Party Audited", "Model Estimated"];
const TIME_MODES = ["30d", "12m", "5y", "Inception"];

export interface FilterBarProps {
  selectedRegion: string;
  setSelectedRegion: (v: string) => void;
  selectedSector: string;
  setSelectedSector: (v: string) => void;
  selectedVerification: string;
  setSelectedVerification: (v: string) => void;
  selectedTime: string;
  setSelectedTime: (v: string) => void;
  exportMenu?: React.ReactNode;
  onOpenOperatorForm: () => void;
  onOpenAdmin?: () => void;
  realtimeStatus?: RealtimeStatus;
}

function DropdownSelect({
  label, icon: Icon, value, options, onChange,
}: {
  label: string; icon: React.ElementType; value: string; options: string[]; onChange: (v: string) => void;
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
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute top-full mt-1 left-0 z-50 min-w-[200px] bg-surface-overlay border border-border rounded shadow-lg py-1">
            {options.map((opt) => (
              <button
                key={opt}
                onClick={() => { onChange(opt); setOpen(false); }}
                className={`w-full text-left px-4 py-2 text-sm transition-colors hover:bg-surface-raised ${value === opt ? "text-recovery font-medium" : "text-foreground-muted"}`}
              >
                {opt}
              </button>
            ))}
          </div>
        </>
      )}
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
      title={connected ? `Live — ${updateCount} update${updateCount !== 1 ? "s" : ""} this session${ago ? ` · last ${ago}` : ""}` : "Connecting to realtime feed…"}
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
  exportMenu,
  onOpenOperatorForm,
  onOpenAdmin,
  realtimeStatus,
}: FilterBarProps) {
  const { role } = useAuth();
  const isOperator = role === "operator" || role === "admin";

  return (
    <div className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-md">
      <div className="px-4 sm:px-6 py-3 flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-2 mr-2">
          <div className="w-2 h-2 rounded-full bg-recovery animate-pulse-glow" />
          <span className="text-xs font-mono uppercase tracking-widest text-foreground-subtle">Atlas / Impact</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <DropdownSelect label="Region" icon={Globe2} value={selectedRegion} options={REGIONS} onChange={setSelectedRegion} />
          <DropdownSelect label="Sector" icon={BarChart2} value={selectedSector} options={SECTORS} onChange={setSelectedSector} />
          <DropdownSelect label="Source" icon={CheckCircle} value={selectedVerification} options={VERIFICATION} onChange={setSelectedVerification} />
        </div>
        <div className="flex items-center gap-1 ml-auto">
          <Clock size={12} className="text-foreground-subtle mr-1" />
          {TIME_MODES.map((t) => (
            <button
              key={t}
              onClick={() => setSelectedTime(t)}
              className={`px-2.5 py-1 rounded text-xs font-mono transition-colors ${selectedTime === t ? "bg-recovery-dim text-recovery font-semibold border border-recovery/30" : "text-foreground-subtle hover:text-foreground hover:bg-surface"}`}
            >
              {t}
            </button>
          ))}
        </div>
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-border text-xs text-foreground-subtle hover:text-foreground hover:border-primary/40 transition-colors">
          <Filter size={12} />
          Compare
        </button>
        {isOperator && (
          <button
            onClick={onOpenOperatorForm}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-recovery/30 bg-recovery-dim text-recovery text-xs font-semibold hover:bg-recovery hover:text-background transition-colors"
          >
            <ClipboardList size={12} />
            Submit Data
          </button>
        )}
        {realtimeStatus && <RealtimeIndicator status={realtimeStatus} />}
        {exportMenu}
        <AuthPanel onOpenOperatorForm={onOpenOperatorForm} onOpenAdmin={onOpenAdmin} />
      </div>
    </div>
  );
}
