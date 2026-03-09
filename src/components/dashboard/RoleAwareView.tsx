import { useState } from "react";
import type { AppRole } from "@/hooks/useAuth";
import { heroMetrics, projects } from "@/data/mockData";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { RVEPanel } from "@/components/dashboard/RVEPanel";
import { ProjectTable } from "@/components/dashboard/ProjectTable";
import { AlertsPanel } from "@/components/dashboard/AlertsPanel";
import { TrendChart } from "@/components/dashboard/TrendChart";
import { RiskPanel } from "@/components/dashboard/RiskPanel";
import { VerificationPanel } from "@/components/dashboard/VerificationPanel";
import { ImpactCategoryTabs } from "@/components/dashboard/ImpactCategoryTabs";
import { hectaresTimeSeries, carbonTimeSeries, waterTimeSeries } from "@/data/mockData";
import type { Project } from "@/data/mockData";
import {
  Building2, BarChart3, Wrench, Globe2, Eye,
  TrendingUp, Droplets, Users, Briefcase
} from "lucide-react";

// ── District breakdown (government view) ──────────────────────────────────────

const DISTRICT_DATA = [
  { district: "Rift Valley",      country: "Kenya",    jobs: 2840, waterAccess: 74, healthCoverage: 61, projects: 4, status: "recovering" as const },
  { district: "Eastern",          country: "Kenya",    jobs: 820,  waterAccess: 58, healthCoverage: 48, projects: 2, status: "stable" as const },
  { district: "Western",          country: "Kenya",    jobs: 1240, waterAccess: 82, healthCoverage: 74, projects: 3, status: "recovering" as const },
  { district: "Nairobi",          country: "Kenya",    jobs: 1680, waterAccess: 44, healthCoverage: 38, projects: 8, status: "watch" as const },
  { district: "Équateur Province",country: "DRC",      jobs: 940,  waterAccess: 31, healthCoverage: 28, projects: 7, status: "recovering" as const },
  { district: "Zinder Region",    country: "Niger",    jobs: 1200, waterAccess: 52, healthCoverage: 42, projects: 5, status: "recovering" as const },
  { district: "Ngamiland",        country: "Botswana", jobs: 200,  waterAccess: 91, healthCoverage: 88, projects: 2, status: "stable" as const },
];

type DistrictStatus = "recovering" | "stable" | "watch";

const districtStatusStyle: Record<DistrictStatus, string> = {
  recovering: "text-recovery border-recovery/20 bg-recovery-dim",
  stable:     "text-foreground-muted border-border bg-surface-raised",
  watch:      "text-watch border-watch/20 bg-watch-dim",
};

function GovernmentView({ filteredProjects }: { filteredProjects: Project[] }) {
  return (
    <div className="space-y-8">
      {/* District Table */}
      <section>
        <div className="text-[10px] font-mono text-foreground-subtle uppercase tracking-widest mb-3 flex items-center gap-2">
          <span className="w-3 h-px bg-foreground-subtle" />
          District Outcomes
        </div>
        <div className="bg-surface border border-border rounded-lg overflow-hidden">
          <div className="px-4 py-3 border-b border-border flex items-start justify-between">
            <div>
              <div className="text-[10px] font-mono text-foreground-subtle uppercase tracking-widest mb-0.5">Government View</div>
              <div className="font-semibold text-foreground text-sm">District-Level Impact Breakdown</div>
            </div>
            <div className="text-[10px] font-mono text-foreground-subtle">{DISTRICT_DATA.length} districts</div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-surface-raised">
                  {["District", "Country", "Regen. Jobs", "Water Access", "Health Coverage", "Projects", "Status"].map(h => (
                    <th key={h} className="py-2 px-3 text-left text-[10px] text-foreground-subtle uppercase tracking-widest font-medium whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {DISTRICT_DATA.map(d => (
                  <tr key={d.district} className="border-b border-border hover:bg-surface-raised transition-colors">
                    <td className="py-3 px-3">
                      <div className="text-xs font-medium text-foreground">{d.district}</div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="text-[10px] text-foreground-subtle font-mono">{d.country}</span>
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1.5">
                        <Briefcase size={10} className="text-accent" />
                        <span className="font-mono text-sm text-accent font-semibold">{d.jobs.toLocaleString()}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-surface-overlay rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${d.waterAccess >= 70 ? "bg-water" : d.waterAccess >= 50 ? "bg-watch" : "bg-reversal"}`} style={{ width: `${d.waterAccess}%` }} />
                        </div>
                        <span className="font-mono text-[11px] text-foreground-muted">{d.waterAccess}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-surface-overlay rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${d.healthCoverage >= 70 ? "bg-recovery" : d.healthCoverage >= 50 ? "bg-watch" : "bg-reversal"}`} style={{ width: `${d.healthCoverage}%` }} />
                        </div>
                        <span className="font-mono text-[11px] text-foreground-muted">{d.healthCoverage}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-mono text-xs text-foreground-muted">{d.projects}</span>
                    </td>
                    <td className="py-3 px-3">
                      <span className={`text-[10px] px-2 py-0.5 rounded border font-mono capitalize ${districtStatusStyle[d.status]}`}>
                        {d.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Policy-level KPIs */}
      <section>
        <div className="text-[10px] font-mono text-foreground-subtle uppercase tracking-widest mb-3 flex items-center gap-2">
          <span className="w-3 h-px bg-foreground-subtle" />
          Key Policy Outcomes
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { icon: Briefcase, label: "Regenerative Jobs",  val: "8,920",  unit: "direct jobs", color: "text-accent",    border: "border-accent/20" },
            { icon: Droplets,  label: "Water Access",       val: "74%",    unit: "avg coverage", color: "text-water",    border: "border-water/20" },
            { icon: Users,     label: "Lives Improved",     val: "128.4K", unit: "beneficiaries", color: "text-watch",  border: "border-watch/20" },
            { icon: Globe2,    label: "Districts Covered",  val: "7",      unit: "active regions", color: "text-recovery", border: "border-recovery/20" },
          ].map(kpi => {
            const KpiIcon = kpi.icon;
            return (
              <div key={kpi.label} className={`bg-surface border ${kpi.border} rounded-lg p-4 space-y-2`}>
                <div className="flex items-center gap-2">
                  <KpiIcon size={14} className={kpi.color} />
                  <span className="text-[10px] text-foreground-subtle uppercase tracking-widest">{kpi.label}</span>
                </div>
                <div className={`font-mono text-2xl font-bold ${kpi.color}`}>{kpi.val}</div>
                <div className="text-[10px] text-foreground-subtle">{kpi.unit}</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Alerts for government */}
      {filteredProjects.length > 0 && (
        <section>
          <div className="text-[10px] font-mono text-foreground-subtle uppercase tracking-widest mb-3 flex items-center gap-2">
            <span className="w-3 h-px bg-foreground-subtle" />
            Monitoring Alerts
          </div>
          <AlertsPanel projects={filteredProjects} />
        </section>
      )}
    </div>
  );
}

// ── Executive view ─────────────────────────────────────────────────────────────
function ExecutiveView() {
  return (
    <div className="space-y-8">
      <section>
        <div className="text-[10px] font-mono text-foreground-subtle uppercase tracking-widest mb-3 flex items-center gap-2">
          <span className="w-3 h-px bg-foreground-subtle" />
          01 · Portfolio Health Delta
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3">
          {heroMetrics.map(m => <MetricCard key={m.id} metric={m} />)}
        </div>
      </section>
      <section>
        <div className="text-[10px] font-mono text-foreground-subtle uppercase tracking-widest mb-3 flex items-center gap-2">
          <span className="w-3 h-px bg-foreground-subtle" />
          02 · Economic Value Translation
        </div>
        <RVEPanel />
      </section>
      <section>
        <div className="text-[10px] font-mono text-foreground-subtle uppercase tracking-widest mb-3 flex items-center gap-2">
          <span className="w-3 h-px bg-foreground-subtle" />
          03 · Recovery Trajectory
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <TrendChart title="Hectares Restored" subtitle="Land Recovery" unit="ha" data={hectaresTimeSeries} color="hsl(155, 65%, 45%)" target forecast band />
          <TrendChart title="Net Carbon Removed" subtitle="Carbon Sequestration" unit="t CO₂e" data={carbonTimeSeries} color="hsl(155, 60%, 38%)" target forecast={false} band />
        </div>
      </section>
    </div>
  );
}

// ── Operator view ──────────────────────────────────────────────────────────────
function OperatorView({ filteredProjects }: { filteredProjects: Project[] }) {
  return (
    <div className="space-y-8">
      {filteredProjects.length > 0 && (
        <section>
          <div className="text-[10px] font-mono text-foreground-subtle uppercase tracking-widest mb-3 flex items-center gap-2">
            <span className="w-3 h-px bg-foreground-subtle" />
            01 · Active Alerts
          </div>
          <AlertsPanel projects={filteredProjects} />
        </section>
      )}
      <section>
        <div className="text-[10px] font-mono text-foreground-subtle uppercase tracking-widest mb-3 flex items-center gap-2">
          <span className="w-3 h-px bg-foreground-subtle" />
          02 · Project Diagnostics
        </div>
        <ProjectTable projects={filteredProjects} />
      </section>
      <section>
        <div className="text-[10px] font-mono text-foreground-subtle uppercase tracking-widest mb-3 flex items-center gap-2">
          <span className="w-3 h-px bg-foreground-subtle" />
          03 · Risk & Fragility
        </div>
        <RiskPanel />
      </section>
      <section>
        <div className="text-[10px] font-mono text-foreground-subtle uppercase tracking-widest mb-3 flex items-center gap-2">
          <span className="w-3 h-px bg-foreground-subtle" />
          04 · Category Breakdown
        </div>
        <ImpactCategoryTabs />
      </section>
      <section>
        <div className="text-[10px] font-mono text-foreground-subtle uppercase tracking-widest mb-3 flex items-center gap-2">
          <span className="w-3 h-px bg-foreground-subtle" />
          05 · Verification Status
        </div>
        <VerificationPanel />
      </section>
    </div>
  );
}

// ── View switcher UI ───────────────────────────────────────────────────────────

type ViewMode = "full" | "executive" | "operator" | "government";

interface ViewOption {
  id: ViewMode;
  label: string;
  icon: React.ElementType;
  desc: string;
  role?: AppRole;
}

const VIEW_OPTIONS: ViewOption[] = [
  { id: "full",       icon: Eye,       label: "Full View",     desc: "All sections" },
  { id: "executive",  icon: Building2, label: "Executive",     desc: "KPIs + RVE",           role: "executive" },
  { id: "government", icon: Globe2,    label: "Government",    desc: "District outcomes",    role: "government" },
  { id: "operator",   icon: Wrench,    label: "Operator",      desc: "Project diagnostics",  role: "operator" },
];

interface RoleViewProps {
  role: AppRole | null;
  filteredProjects: Project[];
  children: React.ReactNode; // full view
}

export function RoleAwareView({ role, filteredProjects, children }: RoleViewProps) {
  // Default view mode based on role
  const defaultView: ViewMode =
    role === "executive" ? "executive"
    : role === "government" ? "government"
    : role === "operator" ? "operator"
    : "full";

  const [viewMode, setViewMode] = useState<ViewMode>(defaultView);

  return (
    <div>
      {/* View switcher */}
      <div className="flex items-center gap-2 mb-6 flex-wrap">
        <span className="text-[10px] text-foreground-subtle font-mono uppercase tracking-widest">View:</span>
        {VIEW_OPTIONS.map(opt => {
          const Icon = opt.icon;
          return (
            <button
              key={opt.id}
              onClick={() => setViewMode(opt.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded border text-xs font-mono transition-all ${
                viewMode === opt.id
                  ? "border-primary/40 bg-primary/10 text-primary"
                  : "border-border text-foreground-subtle hover:text-foreground hover:bg-surface-raised"
              }`}
            >
              <Icon size={11} />
              {opt.label}
              <span className="text-[9px] opacity-60 hidden sm:inline">{opt.desc}</span>
            </button>
          );
        })}
        {role && (
          <span className="ml-auto text-[10px] text-foreground-subtle font-mono">
            Role: <span className="text-primary">{role}</span>
          </span>
        )}
      </div>

      {/* Render based on view */}
      {viewMode === "full"       && children}
      {viewMode === "executive"  && <ExecutiveView />}
      {viewMode === "government" && <GovernmentView filteredProjects={filteredProjects} />}
      {viewMode === "operator"   && <OperatorView filteredProjects={filteredProjects} />}
    </div>
  );
}
