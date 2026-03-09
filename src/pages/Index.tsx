import { useState } from "react";
import { FilterBar } from "@/components/dashboard/FilterBar";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { RegenerationMap } from "@/components/dashboard/RegenerationMap";
import { TrendChart } from "@/components/dashboard/TrendChart";
import { ImpactCategoryTabs } from "@/components/dashboard/ImpactCategoryTabs";
import { VerificationPanel } from "@/components/dashboard/VerificationPanel";
import { RVEPanel } from "@/components/dashboard/RVEPanel";
import { ProjectTable } from "@/components/dashboard/ProjectTable";
import { ScenarioPanel } from "@/components/dashboard/ScenarioPanel";
import { ExportMenu } from "@/components/dashboard/ExportMenu";
import { FieldOperatorModal } from "@/components/dashboard/FieldOperatorModal";
import { AlertsPanel } from "@/components/dashboard/AlertsPanel";
import { AdminPanel } from "@/components/dashboard/AdminPanel";
import { RoleGate } from "@/components/dashboard/RoleGate";
import { RiskPanel } from "@/components/dashboard/RiskPanel";
import { useAuth } from "@/hooks/useAuth";
import { useProjects } from "@/hooks/useProjects";
import { useRealtimeProjects } from "@/hooks/useRealtimeProjects";
import {
  heroMetrics,
  hectaresTimeSeries,
  carbonTimeSeries,
  waterTimeSeries,
} from "@/data/mockData";

// Section header helper
function SectionHeader({ n, label, count }: { n: string; label: string; count?: number }) {
  return (
    <div className="text-[10px] font-mono text-foreground-subtle uppercase tracking-widest mb-3 flex items-center gap-2">
      <span className="w-3 h-px bg-foreground-subtle" />
      {n} · {label}
      {count !== undefined && (
        <span className="text-recovery font-mono">· {count}</span>
      )}
    </div>
  );
}

export default function Index() {
  const [region, setRegion]               = useState("All Regions");
  const [sector, setSector]               = useState("All Sectors");
  const [verification, setVerification]   = useState("All Sources");
  const [timeMode, setTimeMode]           = useState("12m");
  const [portfolio, setPortfolio]         = useState("All Projects");
  const [baselineMode, setBaselineMode]   = useState("vs Baseline");
  const [operatorModalOpen, setOperatorModalOpen] = useState(false);
  const [adminPanelOpen, setAdminPanelOpen]       = useState(false);

  const { role } = useAuth();
  const { data: filteredProjects = [], isLoading: projectsLoading } = useProjects(region);
  const realtimeStatus = useRealtimeProjects();

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ── Sticky command bar ────────────────────────────────── */}
      <FilterBar
        selectedRegion={region}          setSelectedRegion={setRegion}
        selectedSector={sector}          setSelectedSector={setSector}
        selectedVerification={verification} setSelectedVerification={setVerification}
        selectedTime={timeMode}          setSelectedTime={setTimeMode}
        selectedPortfolio={portfolio}    setSelectedPortfolio={setPortfolio}
        selectedBaselineMode={baselineMode} setSelectedBaselineMode={setBaselineMode}
        onOpenOperatorForm={() => setOperatorModalOpen(true)}
        onOpenAdmin={() => setAdminPanelOpen(true)}
        realtimeStatus={realtimeStatus}
        exportMenu={
          <ExportMenu
            selectedRegion={region}
            selectedSector={sector}
            selectedVerification={verification}
            selectedTime={timeMode}
          />
        }
      />

      {/* ── Dashboard body ────────────────────────────────────── */}
      <div className="px-4 sm:px-6 py-6 space-y-10 max-w-[1600px] mx-auto">

        {/* Page title */}
        <div className="flex items-end justify-between">
          <div>
            <div className="text-xs font-mono text-foreground-subtle uppercase tracking-widest mb-1">
              Regenerative Impact Dashboard
              {region !== "All Regions" && <span className="ml-2 text-recovery">· {region}</span>}
              {sector !== "All Sectors" && <span className="ml-2 text-water">· {sector}</span>}
              <span className="ml-2 opacity-50">· {baselineMode} · {timeMode}</span>
            </div>
            <h1 className="text-2xl font-semibold text-foreground leading-tight">
              Are we actually healing anything?
            </h1>
            <p className="text-foreground-muted text-sm mt-1 max-w-xl">
              Measuring restorative change, not activity. Every signal below represents measurable
              ecological, social, or economic recovery — verified, time-stamped, and source-attributed.
            </p>
          </div>
          <div className="hidden md:flex items-center gap-3 text-[10px] text-foreground-subtle font-mono">
            <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-recovery" />Recovering</div>
            <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-watch" />Watch</div>
            <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-reversal" />Reversing</div>
            <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-insufficient" />Insufficient data</div>
          </div>
        </div>

        {/* ── 01: Hero KPI Cards ────────────────────────────────── */}
        <section>
          <SectionHeader n="01" label="Planet Health Delta" />
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3">
            {heroMetrics.map((metric) => (
              <MetricCard key={metric.id} metric={metric} />
            ))}
          </div>
        </section>

        {/* ── 02: Anomaly Detection ────────────────────────────── */}
        {filteredProjects.length > 0 && (
          <section>
            <SectionHeader n="02" label="Anomaly Detection" />
            <AlertsPanel projects={filteredProjects} />
          </section>
        )}

        {/* ── 03: Spatial Impact (Map + 2 Trend Charts) ─────────── */}
        <section>
          <SectionHeader n="03" label="Spatial Impact" />
          <div className="grid lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2">
              <RegenerationMap selectedRegion={region} onRegionSelect={setRegion} />
            </div>
            <div className="space-y-4">
              <TrendChart
                title="Hectares Restored"
                subtitle="Land Recovery"
                unit="ha"
                data={hectaresTimeSeries}
                color="hsl(155, 65%, 45%)"
                target forecast band showReversalDetection
              />
              <TrendChart
                title="Net Carbon Removed"
                subtitle="Carbon Sequestration"
                unit="t CO₂e"
                data={carbonTimeSeries}
                color="hsl(155, 60%, 38%)"
                target forecast={false} band showReversalDetection
              />
            </div>
          </div>
        </section>

        {/* ── 04: Trend Deep-Dive + Category Breakdown ──────────── */}
        <section>
          <SectionHeader n="04" label="Trend & Category Analysis" />
          <div className="grid lg:grid-cols-3 gap-4">
            <div className="space-y-4">
              <TrendChart
                title="Water Systems Recovered"
                subtitle="Hydrological Recovery"
                unit="systems"
                data={waterTimeSeries}
                color="hsl(210, 70%, 52%)"
                target forecast band showReversalDetection
              />
              {/* Baseline comparison context */}
              <div className="bg-surface border border-border rounded-lg p-4">
                <div className="text-[10px] text-foreground-subtle uppercase tracking-widest font-mono mb-2">
                  Comparison Mode
                </div>
                <div className="font-medium text-foreground text-sm mb-3">{baselineMode}</div>
                <div className="space-y-2">
                  {[
                    { label: "Baseline Condition",  val: "22% avg canopy",  color: "text-foreground-subtle" },
                    { label: "Current State",        val: "41% avg canopy",  color: "text-recovery" },
                    { label: "Target (5yr)",         val: "60% avg canopy",  color: "text-watch" },
                    { label: "Counterfactual",       val: "19% (no action)", color: "text-foreground-subtle italic" },
                  ].map(row => (
                    <div key={row.label} className="flex justify-between items-center text-xs">
                      <span className="text-foreground-subtle">{row.label}</span>
                      <span className={`font-mono font-semibold ${row.color}`}>{row.val}</span>
                    </div>
                  ))}
                </div>
                {/* Progress bar toward target */}
                <div className="mt-3">
                  <div className="flex justify-between text-[9px] text-foreground-subtle font-mono mb-1">
                    <span>Baseline 22%</span>
                    <span className="text-recovery">Now: 41%</span>
                    <span>Target: 60%</span>
                  </div>
                  <div className="h-2 bg-surface-overlay rounded-full overflow-hidden relative">
                    <div className="h-full bg-recovery rounded-full" style={{ width: "49.5%" }} />
                    <div className="absolute top-0 left-0 h-full flex items-center pl-1 text-[8px] text-background font-mono font-bold">
                      {/* 49.5% = (41-22)/(60-22) progress */}
                    </div>
                  </div>
                  <div className="text-[9px] text-foreground-subtle font-mono mt-1">50% of the way to recovery target</div>
                </div>
              </div>
            </div>
            <div className="lg:col-span-2">
              <ImpactCategoryTabs />
            </div>
          </div>
        </section>

        {/* ── 05: Risk & Fragility ─────────────────────────────── */}
        <section>
          <SectionHeader n="05" label="Risk & Fragility Indicators" />
          <RiskPanel />
        </section>

        {/* ── 06: Verification & Trust ──────────────────────────── */}
        <section>
          <SectionHeader n="06" label="Verification & Trust Layer" />
          <VerificationPanel />
        </section>

        {/* ── 07: RVE Economic Translation ──────────────────────── */}
        <RoleGate
          role={role}
          allow={["investor", "executive", "government"]}
          fallback={
            !role
              ? <section>
                  <SectionHeader n="07" label="Regenerative Value Exchange" />
                  <RVEPanel />
                </section>
              : null
          }
        >
          <section>
            <SectionHeader n="07" label="Regenerative Value Exchange" />
            <RVEPanel />
          </section>
        </RoleGate>

        {/* ── 08: Scenario & Forecast ───────────────────────────── */}
        <section>
          <SectionHeader n="08" label="Scenario & Forecast Modeling" />
          <ScenarioPanel />
        </section>

        {/* ── 09: Project Explorer ──────────────────────────────── */}
        <section>
          <SectionHeader n="09" label="Project Intelligence Explorer" count={filteredProjects.length} />
          {projectsLoading ? (
            <div className="h-32 bg-surface border border-border rounded-lg flex items-center justify-center text-foreground-subtle text-sm font-mono">
              Loading project data…
            </div>
          ) : (
            <ProjectTable projects={filteredProjects} />
          )}
        </section>

        {/* Footer */}
        <footer className="border-t border-border pt-6 pb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="text-xs text-foreground-subtle font-mono">
            Atlas Regenerative OS · Impact Dashboard v1.0 · Lovable Cloud
          </div>
          <div className="flex flex-wrap gap-3 text-[10px] text-foreground-subtle font-mono">
            <span>Carbon: 7d</span>
            <span>·</span>
            <span>Biodiversity: 30d</span>
            <span>·</span>
            <span>Health: 90d</span>
            <span>·</span>
            <span>Land: 48h</span>
            <span>·</span>
            <span>Water: 14d</span>
          </div>
        </footer>
      </div>

      {/* Modals */}
      <FieldOperatorModal open={operatorModalOpen} onClose={() => setOperatorModalOpen(false)} />
      <AdminPanel open={adminPanelOpen} onClose={() => setAdminPanelOpen(false)} />
    </div>
  );
}
