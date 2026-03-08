import { useState } from "react";
import { X, Satellite, FlaskConical, Users, Brain, AlertTriangle, TrendingUp, ExternalLink } from "lucide-react";
import type { MapZone } from "@/data/mockData";
import { mapZones } from "@/data/mockData";

const typeColors: Record<string, string> = {
  forest: "#34d399",
  watershed: "#60a5fa",
  biodiversity: "#a78bfa",
  health: "#f97316",
  employment: "#2dd4bf",
  carbon: "#86efac",
};

const statusOpacity: Record<string, number> = {
  recovering: 0.7,
  stable: 0.5,
  stalling: 0.35,
  reversing: 0.25,
  accelerating: 0.9,
};

const sizeMap = { sm: 8, md: 13, lg: 18 };

interface ZonePanelProps {
  zone: MapZone;
  onClose: () => void;
}

function ZonePanel({ zone, onClose }: ZonePanelProps) {
  return (
    <div className="absolute top-0 right-0 h-full w-72 bg-surface-overlay border-l border-border flex flex-col animate-fade-in-up z-20">
      <div className="flex items-start justify-between p-4 border-b border-border">
        <div>
          <div className="text-xs font-mono text-foreground-subtle uppercase tracking-widest mb-1">{zone.country} / {zone.region}</div>
          <div className="font-semibold text-foreground text-sm leading-snug">{zone.name}</div>
        </div>
        <button onClick={onClose} className="text-foreground-subtle hover:text-foreground p-1 rounded hover:bg-surface-raised">
          <X size={14} />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-sm">
        {/* Status */}
        <div className="flex items-center justify-between">
          <span className="text-foreground-subtle text-xs uppercase tracking-widest">Status</span>
          <span className={`text-xs font-mono px-2 py-0.5 rounded border ${
            zone.status === "recovering" || zone.status === "stable" ? "border-recovery/30 text-recovery bg-recovery-dim" :
            zone.status === "stalling" ? "border-watch/30 text-watch bg-watch-dim" :
            "border-reversal/30 text-reversal bg-reversal-dim"
          }`}>{zone.status}</span>
        </div>

        {/* Primary metric */}
        <div className="bg-surface rounded p-3 border border-border">
          <div className="text-foreground-subtle text-xs uppercase tracking-widest mb-1">{zone.primaryMetric}</div>
          <div className="font-mono text-recovery text-base font-semibold">{zone.primaryValue}</div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-2">
          {zone.hectares && (
            <div className="bg-surface rounded p-2 border border-border">
              <div className="text-foreground-subtle text-[10px] uppercase tracking-widest">Hectares</div>
              <div className="font-mono text-foreground font-semibold">{zone.hectares.toLocaleString()}</div>
            </div>
          )}
          <div className="bg-surface rounded p-2 border border-border">
            <div className="text-foreground-subtle text-[10px] uppercase tracking-widest">Projects</div>
            <div className="font-mono text-foreground font-semibold">{zone.projects}</div>
          </div>
          <div className="bg-surface rounded p-2 border border-border">
            <div className="text-foreground-subtle text-[10px] uppercase tracking-widest">Confidence</div>
            <div className={`font-mono font-semibold ${zone.confidence >= 0.8 ? "text-recovery" : zone.confidence >= 0.6 ? "text-watch" : "text-reversal"}`}>
              {zone.confidence.toFixed(2)}
            </div>
          </div>
          <div className="bg-surface rounded p-2 border border-border">
            <div className="text-foreground-subtle text-[10px] uppercase tracking-widest">Type</div>
            <div className="font-mono text-foreground capitalize font-semibold">{zone.type}</div>
          </div>
        </div>

        {/* Verification */}
        <div>
          <div className="text-foreground-subtle text-xs uppercase tracking-widest mb-2">Verification</div>
          <div className="flex flex-wrap gap-1.5">
            {zone.confidence >= 0.8 && (
              <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full border border-recovery/30 text-recovery bg-recovery-dim">
                <Satellite size={9} /> Satellite
              </span>
            )}
            {zone.confidence >= 0.7 && (
              <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full border border-water/30 text-water bg-water-dim">
                <FlaskConical size={9} /> Field Sampled
              </span>
            )}
            {zone.confidence < 0.65 && (
              <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full border border-watch/30 text-watch bg-watch-dim">
                <AlertTriangle size={9} /> Limited Data
              </span>
            )}
            <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full border border-border text-foreground-subtle">
              <Brain size={9} /> AI Inferred
            </span>
          </div>
        </div>

        {/* Filtering note */}
        <div className="border border-recovery/20 rounded p-2.5 bg-recovery-dim text-xs text-recovery flex items-center gap-2">
          <TrendingUp size={11} />
          Dashboard filtered to <strong>{zone.region}</strong>
        </div>

        {/* RVE link */}
        <div className="border-t border-border pt-3">
          <button className="w-full flex items-center justify-between text-xs text-foreground-muted hover:text-recovery transition-colors py-1.5 px-3 rounded border border-border hover:border-recovery/30 bg-surface hover:bg-recovery-dim">
            <span className="flex items-center gap-2"><TrendingUp size={11} /> View RVE Instruments</span>
            <ExternalLink size={10} />
          </button>
        </div>
      </div>
    </div>
  );
}

const AFRICA_PATH = "M 200 30 L 230 25 L 270 30 L 300 50 L 320 80 L 330 120 L 335 160 L 340 200 L 345 240 L 335 280 L 310 310 L 280 340 L 250 370 L 230 395 L 210 410 L 190 395 L 170 370 L 150 340 L 120 310 L 95 280 L 85 240 L 90 200 L 95 160 L 100 120 L 110 80 L 130 50 L 165 30 Z";

interface RegenerationMapProps {
  selectedRegion: string;
  onRegionSelect: (region: string) => void;
}

export function RegenerationMap({ selectedRegion, onRegionSelect }: RegenerationMapProps) {
  const [selectedZone, setSelectedZone] = useState<MapZone | null>(null);
  const [activeLayer, setActiveLayer] = useState<string[]>(["forest", "watershed", "biodiversity", "health", "employment", "carbon"]);
  const [viewMode, setViewMode] = useState<"heatmap" | "polygon">("heatmap");

  const toggleLayer = (type: string) => {
    setActiveLayer(prev =>
      prev.includes(type) ? prev.filter(l => l !== type) : [...prev, type]
    );
  };

  const visibleZones = mapZones.filter(z => activeLayer.includes(z.type));

  const handleZoneClick = (zone: MapZone) => {
    if (selectedZone?.id === zone.id) {
      // Deselect — reset to all regions
      setSelectedZone(null);
      onRegionSelect("All Regions");
    } else {
      setSelectedZone(zone);
      // Map region to FilterBar format
      const regionLabel = zone.country === "Kenya"
        ? `Kenya — ${zone.region}`
        : zone.country === "DRC"
        ? `DRC — ${zone.region}`
        : zone.country === "Niger"
        ? `Niger — Sahel`
        : zone.country === "Botswana"
        ? `Botswana — Ngamiland`
        : "All Regions";
      onRegionSelect(regionLabel);
    }
  };

  const closePanel = () => {
    setSelectedZone(null);
    onRegionSelect("All Regions");
  };

  return (
    <div className="bg-surface border border-border rounded-lg overflow-hidden">
      {/* Map header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div>
          <div className="text-xs text-foreground-subtle uppercase tracking-widest font-mono">Spatial Impact</div>
          <div className="font-semibold text-foreground flex items-center gap-2">
            Regeneration Map
            {selectedRegion !== "All Regions" && (
              <span className="text-xs font-normal px-2 py-0.5 rounded border border-recovery/30 text-recovery bg-recovery-dim font-mono">
                Filtering: {selectedRegion}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {selectedRegion !== "All Regions" && (
            <button
              onClick={closePanel}
              className="text-xs px-2.5 py-1 rounded border border-border text-foreground-subtle hover:text-foreground hover:border-watch/40 transition-colors"
            >
              Clear filter
            </button>
          )}
          {(["heatmap", "polygon"] as const).map(m => (
            <button
              key={m}
              onClick={() => setViewMode(m)}
              className={`text-xs px-2.5 py-1 rounded border transition-colors ${viewMode === m ? "border-recovery/40 text-recovery bg-recovery-dim" : "border-border text-foreground-subtle hover:text-foreground"}`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* Layer toggles */}
      <div className="px-4 py-2 border-b border-border flex flex-wrap gap-1.5">
        {Object.entries(typeColors).map(([type, color]) => (
          <button
            key={type}
            onClick={() => toggleLayer(type)}
            className={`flex items-center gap-1.5 text-[11px] px-2.5 py-0.5 rounded-full border transition-all
              ${activeLayer.includes(type) ? "opacity-100 border-current" : "opacity-40 border-border"}`}
            style={{ color: activeLayer.includes(type) ? color : undefined }}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
            {type}
          </button>
        ))}
        <span className="ml-auto text-[10px] text-foreground-subtle self-center font-mono">Click a zone to filter dashboard</span>
      </div>

      {/* Map body */}
      <div className="relative overflow-hidden" style={{ height: "460px" }}>
        <svg
          viewBox="0 0 440 440"
          className="w-full h-full"
          style={{ background: "hsl(160 20% 4%)" }}
        >
          {/* Grid lines */}
          {[0, 1, 2, 3, 4, 5, 6].map(i => (
            <line key={`h${i}`} x1="0" y1={i * 73} x2="440" y2={i * 73} stroke="hsl(160 12% 12%)" strokeWidth="0.5" />
          ))}
          {[0, 1, 2, 3, 4, 5, 6].map(i => (
            <line key={`v${i}`} x1={i * 73} y1="0" x2={i * 73} y2="440" stroke="hsl(160 12% 12%)" strokeWidth="0.5" />
          ))}

          {/* Continent silhouette */}
          <path
            d={AFRICA_PATH}
            fill="hsl(160 15% 8%)"
            stroke="hsl(160 18% 16%)"
            strokeWidth="1.5"
          />

          {/* Zone markers */}
          {visibleZones.map((zone) => {
            const x = (zone.coordinates.x / 100) * 440;
            const y = (zone.coordinates.y / 100) * 440;
            const r = sizeMap[zone.size];
            const color = typeColors[zone.type];
            const alpha = statusOpacity[zone.status] || 0.5;
            const isSelected = selectedZone?.id === zone.id;
            // Dim zones not in selected region
            const regionKey = zone.country === "Kenya" ? `Kenya — ${zone.region}` : zone.country === "DRC" ? `DRC — ${zone.region}` : zone.country === "Niger" ? "Niger — Sahel" : "Botswana — Ngamiland";
            const isDimmed = selectedRegion !== "All Regions" && regionKey !== selectedRegion;

            return (
              <g
                key={zone.id}
                onClick={() => handleZoneClick(zone)}
                style={{ cursor: "pointer", opacity: isDimmed ? 0.2 : 1, transition: "opacity 0.3s" }}
              >
                {/* Outer pulse ring for recovering/accelerating */}
                {(zone.status === "recovering" || (zone.status as string) === "accelerating") && !isDimmed && (
                  <circle cx={x} cy={y} r={r + 6} fill="none" stroke={color} strokeWidth="1" opacity={0.2} />
                )}
                {/* Heatmap glow */}
                {viewMode === "heatmap" ? (
                  <circle cx={x} cy={y} r={r + 8} fill={color} opacity={alpha * 0.25} />
                ) : null}
                {/* Main dot */}
                <circle
                  cx={x} cy={y} r={r}
                  fill={color}
                  opacity={isSelected ? 1 : alpha}
                  stroke={isSelected ? "white" : color}
                  strokeWidth={isSelected ? 2.5 : 0.5}
                />
                {/* Selected label */}
                {isSelected && (
                  <text x={x + r + 5} y={y + 4} fill="white" fontSize="9" fontFamily="DM Mono" fontWeight="500">{zone.name}</text>
                )}
                {/* Hover hit area */}
                <circle cx={x} cy={y} r={r + 8} fill="transparent" />
              </g>
            );
          })}

          {/* Compass */}
          <text x="410" y="430" fill="hsl(160 8% 30%)" fontSize="9" fontFamily="DM Mono">N↑</text>
          {/* Scale */}
          <line x1="20" y1="425" x2="80" y2="425" stroke="hsl(160 8% 30%)" strokeWidth="1" />
          <text x="20" y="420" fill="hsl(160 8% 30%)" fontSize="8" fontFamily="DM Mono">0</text>
          <text x="65" y="420" fill="hsl(160 8% 30%)" fontSize="8" fontFamily="DM Mono">500km</text>
        </svg>

        {/* Selected zone panel */}
        {selectedZone && (
          <ZonePanel zone={selectedZone} onClose={closePanel} />
        )}

        {/* Status bar */}
        <div className="absolute bottom-3 left-3 bg-background/80 backdrop-blur-sm px-3 py-1.5 rounded border border-border text-xs text-foreground-muted font-mono">
          {visibleZones.length} active zones · {visibleZones.filter(z => z.status === "recovering").length} recovering
        </div>
      </div>
    </div>
  );
}
