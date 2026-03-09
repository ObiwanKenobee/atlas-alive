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
import { useAuth } from "@/hooks/useAuth";
import { useProjects } from "@/hooks/useProjects";
import { useRealtimeProjects } from "@/hooks/useRealtimeProjects";
import {
  heroMetrics,
  hectaresTimeSeries,
  carbonTimeSeries,
  waterTimeSeries,
} from "@/data/mockData";

export default function Index() {
  const [region, setRegion] = useState("All Regions");
  const [sector, setSector] = useState("All Sectors");
  const [verification, setVerification] = useState("All Sources");
  const [timeMode, setTimeMode] = useState("12m");
  const [operatorModalOpen, setOperatorModalOpen] = useState(false);
  const [adminPanelOpen, setAdminPanelOpen] = useState(false);

  const { role } = useAuth();

  // Live projects from Supabase, falling back to mock data
  const { data: filteredProjects = [], isLoading: projectsLoading } = useProjects(region);

  // Real-time subscriptions — invalidates queries on any DB change & returns live status
  const realtimeStatus = useRealtimeProjects();

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Sticky filter bar */}
      <FilterBar
        selectedRegion={region}
        setSelectedRegion={setRegion}
        selectedSector={sector}
        setSelectedSector={setSector}
        selectedVerification={verification}
        setSelectedVerification={setVerification}
        selectedTime={timeMode}
        setSelectedTime={setTimeMode}
        onOpenOperatorForm={() => setOperatorModalOpen(true)}
        onOpenAdmin={() => setAdminPanelOpen(true)}
        exportMenu={
          <ExportMenu
            selectedRegion={region}
            selectedSector={sector}
            selectedVerification={verification}
            selectedTime={timeMode}
          />
        }
      />

      {/* Dashboard body */}
      <div className="px-4 sm:px-6 py-6 space-y-8 max-w-[1600px] mx-auto">

        {/* ── Section 1: Page title ─────────────────────────────────────────── */}
        <div className="flex items-end justify-between">
          <div>
            <div className="text-xs font-mono text-foreground-subtle uppercase tracking-widest mb-1">
              Regenerative Impact Dashboard
              {region !== "All Regions" && (
                <span className="ml-2 text-recovery">· {region}</span>
              )}
            </div>
            <h1 className="text-2xl font-semibold text-foreground leading-tight">
              Are we actually healing anything?
            </h1>
            <p className="text-foreground-muted text-sm mt-1 max-w-xl">
              Measuring restorative change, not activity. Every signal below represents measurable
              ecological, social, or economic recovery — verified.
            </p>
          </div>
          <div className="hidden md:flex items-center gap-3 text-xs text-foreground-subtle font-mono">
            <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-recovery" />Recovering</div>
            <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-watch" />Watch</div>
            <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-reversal" />Reversing</div>
            <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-insufficient" />Insufficient data</div>
          </div>
        </div>

        {/* ── Section 2: Hero Metrics ───────────────────────────────────────── */}
        <section>
          <div className="text-[10px] font-mono text-foreground-subtle uppercase tracking-widest mb-3 flex items-center gap-2">
            <span className="w-3 h-px bg-foreground-subtle" />
            01 · Planet Health Delta
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3">
            {heroMetrics.map((metric) => (
              <MetricCard key={metric.id} metric={metric} />
            ))}
          </div>
        </section>

        {/* ── Section 3: At-Risk Alerts (conditionally shown) ──────────────── */}
        {filteredProjects.length > 0 && (
          <section>
            <div className="text-[10px] font-mono text-foreground-subtle uppercase tracking-widest mb-3 flex items-center gap-2">
              <span className="w-3 h-px bg-foreground-subtle" />
              02 · At-Risk Signal Monitor
            </div>
            <AlertsPanel projects={filteredProjects} />
          </section>
        )}

        {/* ── Section 4: Map + Trends ───────────────────────────────────────── */}
        <section>
          <div className="text-[10px] font-mono text-foreground-subtle uppercase tracking-widest mb-3 flex items-center gap-2">
            <span className="w-3 h-px bg-foreground-subtle" />
            03 · Spatial Impact
          </div>
          <div className="grid lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2">
              <RegenerationMap
                selectedRegion={region}
                onRegionSelect={setRegion}
              />
            </div>
            <div className="space-y-4">
              <TrendChart
                title="Hectares Restored"
                subtitle="Land Recovery"
                unit="ha"
                data={hectaresTimeSeries}
                color="hsl(155, 65%, 45%)"
                target
                forecast
                band
              />
              <TrendChart
                title="Net Carbon Removed"
                subtitle="Carbon Sequestration"
                unit="t CO₂e"
                data={carbonTimeSeries}
                color="hsl(155, 60%, 38%)"
                target
                forecast={false}
                band
              />
            </div>
          </div>
        </section>

        {/* ── Section 5: Trend deep-dive + categories ───────────────────────── */}
        <section>
          <div className="text-[10px] font-mono text-foreground-subtle uppercase tracking-widest mb-3 flex items-center gap-2">
            <span className="w-3 h-px bg-foreground-subtle" />
            04 · Trend & Category Analysis
          </div>
          <div className="grid lg:grid-cols-3 gap-4">
            <div className="space-y-4">
              <TrendChart
                title="Water Systems Recovered"
                subtitle="Hydrological Recovery"
                unit="systems"
                data={waterTimeSeries}
                color="hsl(210, 70%, 52%)"
                target
                forecast
                band
              />
            </div>
            <div className="lg:col-span-2">
              <ImpactCategoryTabs />
            </div>
          </div>
        </section>

        {/* ── Section 6: Verification ───────────────────────────────────────── */}
        <section>
          <div className="text-[10px] font-mono text-foreground-subtle uppercase tracking-widest mb-3 flex items-center gap-2">
            <span className="w-3 h-px bg-foreground-subtle" />
            05 · Verification & Trust
          </div>
          <VerificationPanel />
        </section>

        {/* ── Section 7: RVE Economic Translation (investors + execs) ──────── */}
        <RoleGate
          role={role}
          allow={["investor", "executive", "government"]}
          fallback={
            !role ? <section>
              <div className="text-[10px] font-mono text-foreground-subtle uppercase tracking-widest mb-3 flex items-center gap-2">
                <span className="w-3 h-px bg-foreground-subtle" />
                06 · Regenerative Value Exchange
              </div>
              <RVEPanel />
            </section> : null
          }
        >
          <section>
            <div className="text-[10px] font-mono text-foreground-subtle uppercase tracking-widest mb-3 flex items-center gap-2">
              <span className="w-3 h-px bg-foreground-subtle" />
              06 · Regenerative Value Exchange
            </div>
            <RVEPanel />
          </section>
        </RoleGate>

        {/* ── Section 8: Scenario Modeling ─────────────────────────────────── */}
        <section>
          <div className="text-[10px] font-mono text-foreground-subtle uppercase tracking-widest mb-3 flex items-center gap-2">
            <span className="w-3 h-px bg-foreground-subtle" />
            07 · What-If Analysis
          </div>
          <ScenarioPanel />
        </section>

        {/* ── Section 9: Project Table ──────────────────────────────────────── */}
        <section>
          <div className="text-[10px] font-mono text-foreground-subtle uppercase tracking-widest mb-3 flex items-center gap-2">
            <span className="w-3 h-px bg-foreground-subtle" />
            08 · Project Explorer
            {region !== "All Regions" && (
              <span className="text-recovery font-mono">
                · {filteredProjects.length} projects
              </span>
            )}
          </div>
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
            Atlas Regenerative OS · Impact Dashboard v0.3 · Lovable Cloud
          </div>
          <div className="text-[10px] text-foreground-subtle">
            Data freshness: Carbon 7d · Biodiversity 30d · Health 90d · Land 48h · Water 14d
          </div>
        </footer>
      </div>

      {/* Field operator data entry modal */}
      <FieldOperatorModal
        open={operatorModalOpen}
        onClose={() => setOperatorModalOpen(false)}
      />

      {/* Admin panel modal (admin only) */}
      <AdminPanel
        open={adminPanelOpen}
        onClose={() => setAdminPanelOpen(false)}
      />
    </div>
  );
}
