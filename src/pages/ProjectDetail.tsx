import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { dbToProject } from "@/hooks/useProjects";
import { useAuth } from "@/hooks/useAuth";
import { TrendChart } from "@/components/dashboard/TrendChart";
import {
  ArrowLeft, TrendingUp, TrendingDown, Minus, ShieldCheck,
  AlertTriangle, ExternalLink, CheckCircle, Clock, FileText,
  Loader2, Pencil, X, Save,
} from "lucide-react";
import type { TimeSeriesPoint } from "@/data/mockData";
import { rveAssets } from "@/data/mockData";

const trendIcon = {
  accelerating: <TrendingUp size={12} className="text-recovery" />,
  stable:       <Minus size={12} className="text-foreground-subtle" />,
  stalling:     <TrendingDown size={12} className="text-watch" />,
  reversing:    <TrendingDown size={12} className="text-reversal" />,
};

const riskColor = {
  low:    "border-recovery/20 text-recovery bg-recovery-dim",
  medium: "border-watch/20 text-watch bg-watch-dim",
  high:   "border-reversal/20 text-reversal bg-reversal-dim",
};

const statusDot = {
  active:   "bg-recovery",
  watch:    "bg-watch",
  critical: "bg-reversal",
};

const verificationIcon: Record<string, React.ReactNode> = {
  satellite: <span className="text-[9px] font-mono">SAT</span>,
  field:     <span className="text-[9px] font-mono">FLD</span>,
  community: <span className="text-[9px] font-mono">COM</span>,
  model:     <span className="text-[9px] font-mono">MDL</span>,
  audited:   <span className="text-[9px] font-mono">AUD</span>,
};

function SectionHeader({ num, title }: { num: string; title: string }) {
  return (
    <div className="text-[10px] font-mono text-foreground-subtle uppercase tracking-widest mb-3 flex items-center gap-2">
      <span className="w-3 h-px bg-foreground-subtle" />
      {num} · {title}
    </div>
  );
}

function StatCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="bg-surface border border-border rounded-lg p-4">
      <div className="text-[10px] font-mono text-foreground-subtle uppercase tracking-widest mb-1">{label}</div>
      <div className="text-lg font-semibold text-foreground font-mono">{value}</div>
      {sub && <div className="text-[10px] text-foreground-subtle mt-0.5">{sub}</div>}
    </div>
  );
}

// ─── Inline edit types ────────────────────────────────────────────────────────
type EditableFields = {
  name: string;
  status: "active" | "watch" | "critical";
  trend: "accelerating" | "stable" | "stalling" | "reversing";
  notes: string;
};

// ─── Inline field components ─────────────────────────────────────────────────
function InlineInput({ value, onChange, className = "" }: { value: string; onChange: (v: string) => void; className?: string }) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`bg-surface-overlay border border-recovery/40 rounded px-2 py-1 text-foreground text-sm font-semibold focus:outline-none focus:ring-1 focus:ring-recovery/50 ${className}`}
    />
  );
}

function InlineSelect<T extends string>({
  value, onChange, options,
}: {
  value: T; onChange: (v: T) => void; options: { value: T; label: string }[];
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as T)}
      className="bg-surface-overlay border border-recovery/40 rounded px-2 py-1 text-foreground text-xs font-mono focus:outline-none focus:ring-1 focus:ring-recovery/50"
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  );
}

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { role } = useAuth();
  const qc = useQueryClient();

  const canEdit = role === "operator" || role === "admin";

  const [editing, setEditing] = useState(false);
  const [editFields, setEditFields] = useState<EditableFields | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  // ─── Queries ────────────────────────────────────────────────────────────────
  const { data: project, isLoading: loadingProject } = useQuery({
    queryKey: ["project", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("id", id!)
        .single();
      if (error) throw error;
      return dbToProject(data);
    },
    enabled: !!id,
  });

  const { data: metrics = [] } = useQuery({
    queryKey: ["impact_metrics", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("impact_metrics")
        .select("*")
        .eq("project_id", id!)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!id,
  });

  const { data: verifications = [] } = useQuery({
    queryKey: ["verification_records", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("verification_records")
        .select("*")
        .eq("project_id", id!)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!id,
  });

  const { data: timeSeries = [] } = useQuery({
    queryKey: ["time_series", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("time_series")
        .select("*")
        .eq("project_id", id!)
        .order("period_date", { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!id,
  });

  // ─── Save mutation ───────────────────────────────────────────────────────────
  const saveMutation = useMutation({
    mutationFn: async (fields: EditableFields) => {
      const { error } = await supabase
        .from("projects")
        .update({
          name: fields.name,
          status: fields.status,
          trend: fields.trend,
          notes: fields.notes || null,
        })
        .eq("id", id!);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["project", id] });
      qc.invalidateQueries({ queryKey: ["projects"] });
      setEditing(false);
      setSaveError(null);
    },
    onError: (err: Error) => {
      setSaveError(err.message);
    },
  });

  // ─── Enter / exit edit ───────────────────────────────────────────────────────
  const startEdit = () => {
    if (!project) return;
    setEditFields({
      name: project.name,
      status: project.status as "active" | "watch" | "critical",
      trend: project.trend as "accelerating" | "stable" | "stalling" | "reversing",
      notes: project.notes ?? "",
    });
    setEditing(true);
    setSaveError(null);
  };

  const cancelEdit = () => {
    setEditing(false);
    setEditFields(null);
    setSaveError(null);
  };

  // ─── Group time series ───────────────────────────────────────────────────────
  const timeSeriesByMetric = timeSeries.reduce<Record<string, TimeSeriesPoint[]>>((acc, row) => {
    if (!acc[row.metric_type]) acc[row.metric_type] = [];
    acc[row.metric_type].push({
      period: row.period,
      actual: row.actual ?? (undefined as unknown as number),
      target: row.target ?? 0,
      forecast: row.forecast ?? undefined,
      lower: row.lower_bound ?? undefined,
      upper: row.upper_bound ?? undefined,
    });
    return acc;
  }, {});

  // ─── Loading / not found ─────────────────────────────────────────────────────
  if (loadingProject) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center gap-2 text-foreground-subtle">
        <Loader2 size={16} className="animate-spin" />
        <span className="text-sm font-mono">Loading project…</span>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <div className="text-foreground-subtle text-sm">Project not found.</div>
        <button onClick={() => navigate("/")} className="text-recovery text-xs flex items-center gap-1.5 hover:underline">
          <ArrowLeft size={12} /> Back to dashboard
        </button>
      </div>
    );
  }

  const relatedRVE = rveAssets.filter(
    (a) =>
      a.name.toLowerCase().includes(project.region.toLowerCase().split(" ")[0]) ||
      a.type.toLowerCase().includes(project.type.toLowerCase().split(" ")[0])
  );

  const ef = editFields;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Top nav */}
      <div className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-md px-4 sm:px-6 py-3 flex items-center gap-3">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-1.5 text-xs text-foreground-subtle hover:text-foreground transition-colors font-mono"
        >
          <ArrowLeft size={12} />
          Dashboard
        </button>
        <span className="text-foreground-subtle">/</span>
        {editing && ef ? (
          <InlineInput
            value={ef.name}
            onChange={(v) => setEditFields({ ...ef, name: v })}
            className="text-xs font-medium max-w-[260px]"
          />
        ) : (
          <span className="text-xs text-foreground font-medium truncate">{project.name}</span>
        )}
        <div className={`ml-auto w-1.5 h-1.5 rounded-full ${statusDot[project.status]}`} />
        {/* Edit / Save / Cancel controls */}
        {canEdit && !editing && (
          <button
            onClick={startEdit}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded border border-border bg-surface hover:bg-surface-raised text-xs text-foreground-subtle hover:text-foreground transition-colors font-mono"
          >
            <Pencil size={11} /> Edit
          </button>
        )}
        {editing && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => ef && saveMutation.mutate(ef)}
              disabled={saveMutation.isPending}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded border border-recovery/40 bg-recovery-dim text-recovery hover:bg-recovery hover:text-background text-xs font-semibold transition-colors"
            >
              {saveMutation.isPending ? <Loader2 size={11} className="animate-spin" /> : <Save size={11} />}
              Save
            </button>
            <button
              onClick={cancelEdit}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded border border-border bg-surface hover:bg-surface-raised text-xs text-foreground-subtle transition-colors"
            >
              <X size={11} /> Cancel
            </button>
          </div>
        )}
      </div>

      <div className="px-4 sm:px-6 py-6 space-y-8 max-w-[1400px] mx-auto">

        {/* Error banner */}
        {saveError && (
          <div className="bg-reversal-dim border border-reversal/20 rounded px-4 py-3 text-xs text-reversal flex items-center gap-2">
            <AlertTriangle size={12} />
            {saveError}
          </div>
        )}

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <div className="text-[10px] font-mono text-foreground-subtle uppercase tracking-widest mb-1">
              {project.country} · {project.region}
            </div>
            {editing && ef ? (
              <div className="space-y-3">
                <InlineInput
                  value={ef.name}
                  onChange={(v) => setEditFields({ ...ef, name: v })}
                  className="text-2xl font-semibold w-full max-w-lg"
                />
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-foreground-subtle uppercase tracking-widest">Status</span>
                    <InlineSelect
                      value={ef.status}
                      onChange={(v) => setEditFields({ ...ef, status: v })}
                      options={[
                        { value: "active", label: "Active" },
                        { value: "watch", label: "Watch" },
                        { value: "critical", label: "Critical" },
                      ]}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-foreground-subtle uppercase tracking-widest">Trend</span>
                    <InlineSelect
                      value={ef.trend}
                      onChange={(v) => setEditFields({ ...ef, trend: v })}
                      options={[
                        { value: "accelerating", label: "Accelerating" },
                        { value: "stable", label: "Stable" },
                        { value: "stalling", label: "Stalling" },
                        { value: "reversing", label: "Reversing" },
                      ]}
                    />
                  </div>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-foreground-subtle uppercase tracking-widest block mb-1">Notes</span>
                  <textarea
                    value={ef.notes}
                    onChange={(e) => setEditFields({ ...ef, notes: e.target.value })}
                    rows={3}
                    placeholder="Add notes…"
                    className="w-full max-w-lg bg-surface-overlay border border-recovery/40 rounded px-3 py-2 text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-recovery/50 resize-none"
                  />
                </div>
              </div>
            ) : (
              <>
                <h1 className="text-2xl font-semibold text-foreground">{project.name}</h1>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-xs text-foreground-subtle px-2 py-0.5 rounded border border-border bg-surface">{project.type}</span>
                  <div className="flex items-center gap-1">
                    {trendIcon[project.trend]}
                    <span className="text-xs font-mono capitalize text-foreground-muted">{project.trend}</span>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded border ${riskColor[project.riskLevel]}`}>
                    {project.riskLevel} risk
                  </span>
                </div>
                {project.notes && (
                  <p className="text-xs text-foreground-muted mt-2 max-w-lg">{project.notes}</p>
                )}
              </>
            )}
          </div>
          <div className="text-right">
            <div className="text-2xl font-mono font-bold text-recovery">{project.valueEstimate}</div>
            <div className="text-[10px] text-foreground-subtle font-mono mt-0.5">Estimated value</div>
          </div>
        </div>

        {/* ── KPI row ───────────────────────────────────────────────────── */}
        <section>
          <SectionHeader num="01" title="Key Indicators" />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <StatCard label="Baseline" value={project.baseline} />
            <StatCard label="Current State" value={project.current} />
            <StatCard
              label="Confidence Score"
              value={project.confidence.toFixed(2)}
              sub={project.confidence >= 0.75 ? "High confidence" : project.confidence >= 0.55 ? "Moderate" : "Low — needs verification"}
            />
            <StatCard label="Last Verified" value={project.lastVerified} />
          </div>
        </section>

        {/* ── Time Series Charts ────────────────────────────────────────── */}
        {Object.keys(timeSeriesByMetric).length > 0 && (
          <section>
            <SectionHeader num="02" title="Time Series" />
            <div className="grid md:grid-cols-2 gap-4">
              {Object.entries(timeSeriesByMetric).map(([metricType, series]) => (
                <TrendChart
                  key={metricType}
                  title={metricType.charAt(0).toUpperCase() + metricType.slice(1)}
                  subtitle={`${project.name} — ${metricType}`}
                  unit=""
                  data={series}
                  color="hsl(155, 65%, 45%)"
                  target
                  forecast
                  band
                />
              ))}
            </div>
          </section>
        )}

        {/* ── Impact Metrics ────────────────────────────────────────────── */}
        <section>
          <SectionHeader num="03" title="Impact Metrics History" />
          {metrics.length === 0 ? (
            <div className="bg-surface border border-border rounded-lg p-6 text-center text-foreground-subtle text-sm">
              No impact readings submitted yet for this project.
            </div>
          ) : (
            <div className="bg-surface border border-border rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-surface-raised">
                      {["Metric", "Value", "Unit", "Source", "Confidence", "Period", "Submitted"].map((h) => (
                        <th key={h} className="py-2 px-3 text-left text-[10px] text-foreground-subtle uppercase tracking-widest font-medium whitespace-nowrap">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {metrics.map((m) => (
                      <tr key={m.id} className="border-b border-border hover:bg-surface-raised transition-colors">
                        <td className="py-2.5 px-3">
                          <span className="text-xs font-medium text-foreground capitalize">{m.metric_type}</span>
                        </td>
                        <td className="py-2.5 px-3">
                          <span className="font-mono text-sm text-recovery font-semibold">{m.value.toLocaleString()}</span>
                        </td>
                        <td className="py-2.5 px-3">
                          <span className="text-xs text-foreground-muted font-mono">{m.unit}</span>
                        </td>
                        <td className="py-2.5 px-3">
                          <span className="text-[10px] text-foreground-subtle px-1.5 py-0.5 rounded border border-border bg-surface font-mono capitalize">
                            {m.source_type}
                          </span>
                        </td>
                        <td className="py-2.5 px-3">
                          <div className="flex items-center gap-1.5">
                            <div className="w-10 h-1 bg-surface-overlay rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${m.confidence >= 0.75 ? "bg-recovery" : m.confidence >= 0.55 ? "bg-watch" : "bg-reversal"}`}
                                style={{ width: `${m.confidence * 100}%` }}
                              />
                            </div>
                            <span className="text-[10px] font-mono text-foreground-subtle">{m.confidence.toFixed(2)}</span>
                          </div>
                        </td>
                        <td className="py-2.5 px-3 hidden lg:table-cell">
                          <span className="text-[10px] text-foreground-subtle font-mono">
                            {m.period_start ? new Date(m.period_start).toLocaleDateString() : "—"}
                          </span>
                        </td>
                        <td className="py-2.5 px-3">
                          <span className="text-[10px] text-foreground-subtle font-mono">
                            {new Date(m.created_at).toLocaleDateString()}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>

        {/* ── Verification Records ─────────────────────────────────────── */}
        <section>
          <SectionHeader num="04" title="Verification Records" />
          {verifications.length === 0 ? (
            <div className="bg-surface border border-border rounded-lg p-6 text-center text-foreground-subtle text-sm">
              No verification records submitted yet.
            </div>
          ) : (
            <div className="space-y-3">
              {verifications.map((v) => (
                <div key={v.id} className="bg-surface border border-border rounded-lg p-4">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded bg-surface-overlay flex items-center justify-center text-foreground-subtle">
                        {verificationIcon[v.verification_type] ?? <FileText size={11} />}
                      </div>
                      <div>
                        <div className="text-xs font-medium text-foreground capitalize">{v.verification_type} Verification</div>
                        {v.verifier_name && (
                          <div className="text-[10px] text-foreground-subtle font-mono">{v.verifier_name}</div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 flex-wrap">
                      {v.coverage !== null && (
                        <div className="text-[10px] text-foreground-subtle font-mono">
                          Coverage: <span className="text-foreground">{(v.coverage * 100).toFixed(0)}%</span>
                        </div>
                      )}
                      {v.methodology_version && (
                        <span className="text-[10px] text-foreground-subtle px-1.5 py-0.5 rounded border border-border bg-surface font-mono">
                          {v.methodology_version}
                        </span>
                      )}
                      {v.last_verified_at && (
                        <div className="flex items-center gap-1 text-[10px] text-foreground-subtle font-mono">
                          <CheckCircle size={9} className="text-recovery" />
                          {new Date(v.last_verified_at).toLocaleDateString()}
                        </div>
                      )}
                      {v.next_review_at && (
                        <div className="flex items-center gap-1 text-[10px] text-watch font-mono">
                          <Clock size={9} />
                          Review: {new Date(v.next_review_at).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </div>
                  {v.notes && (
                    <p className="text-[11px] text-foreground-subtle mt-3 leading-relaxed border-t border-border pt-3">
                      {v.notes}
                    </p>
                  )}
                  {v.evidence_urls && v.evidence_urls.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {v.evidence_urls.map((url, i) => (
                        <a
                          key={i}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-[10px] text-water hover:text-water-bright font-mono"
                        >
                          <ExternalLink size={9} />
                          Evidence {i + 1}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ── RVE Assets ───────────────────────────────────────────────── */}
        {relatedRVE.length > 0 && (
          <section>
            <SectionHeader num="05" title="RVE Asset Breakdown" />
            <div className="grid md:grid-cols-2 gap-4">
              {relatedRVE.map((asset) => (
                <div key={asset.id} className="bg-surface border border-border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="text-xs font-medium text-foreground leading-snug">{asset.name}</div>
                      <div className="text-[10px] text-foreground-subtle font-mono mt-0.5">{asset.type}</div>
                    </div>
                    <span className="font-mono text-base font-bold text-recovery">{asset.estimatedValue}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-center border-t border-border pt-3">
                    <div>
                      <div className="text-[10px] text-foreground-subtle font-mono">Uplift</div>
                      <div className="text-sm font-mono font-semibold text-foreground">{asset.ecologicalUplift.toFixed(2)}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-foreground-subtle font-mono">Biodiversity ×</div>
                      <div className="text-sm font-mono font-semibold text-water">{asset.biodiversityMultiplier}×</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-foreground-subtle font-mono">Yield / yr</div>
                      <div className="text-sm font-mono font-semibold text-recovery">{asset.yieldProjection}</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                    <span className="text-[10px] text-foreground-subtle font-mono">{asset.carbonEquivalent}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded border font-mono ${
                      asset.permanenceRisk === "low" ? "border-recovery/20 text-recovery bg-recovery-dim" :
                      asset.permanenceRisk === "medium" ? "border-watch/20 text-watch bg-watch-dim" :
                      "border-reversal/20 text-reversal bg-reversal-dim"
                    }`}>
                      {asset.permanenceRisk} permanence risk
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Footer */}
        <footer className="border-t border-border pt-6 pb-8">
          <div className="text-xs text-foreground-subtle font-mono">
            Atlas Regenerative OS · Project Detail · ID: {id}
          </div>
        </footer>
      </div>
    </div>
  );
}
