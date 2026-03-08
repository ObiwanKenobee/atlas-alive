import { useState } from "react";
import { X, Save, Loader2, CheckCircle2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAuth } from "@/hooks/useAuth";
import { useCreateProject } from "@/hooks/useProjects";
import { useSubmitImpactMetric, useSubmitVerification } from "@/hooks/useImpactMetrics";
import type { Database } from "@/integrations/supabase/types";

type Tab = "project" | "metric" | "verification";

const METRIC_TYPES = ["hectares", "carbon", "water", "biodiversity", "jobs", "health"];
const CONFIDENCE_LEVELS = ["satellite", "field", "community", "model", "audited"] as const;
const VERIFICATION_TYPES = CONFIDENCE_LEVELS;
const TREND_OPTIONS = ["accelerating", "stable", "stalling", "reversing"] as const;
const STATUS_OPTIONS = ["active", "watch", "critical"] as const;
const RISK_OPTIONS = ["low", "medium", "high"] as const;

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 text-xs font-mono uppercase tracking-widest transition-colors border-b-2 ${
        active
          ? "text-recovery border-recovery"
          : "text-foreground-subtle border-transparent hover:text-foreground-muted"
      }`}
    >
      {children}
    </button>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <label className="text-[10px] uppercase tracking-widest text-foreground-subtle font-mono">{label}</label>
      {children}
    </div>
  );
}

const inputCls =
  "w-full bg-surface-overlay border border-border rounded px-3 py-2 text-sm text-foreground placeholder:text-foreground-subtle focus:outline-none focus:ring-1 focus:ring-recovery/50 focus:border-recovery/40 transition-colors";

const selectCls = `${inputCls} cursor-pointer`;

interface Props {
  open: boolean;
  onClose: () => void;
  projectId?: string; // pre-select if opening from project row
  projectName?: string;
}

export function FieldOperatorModal({ open, onClose, projectId, projectName }: Props) {
  const { user, role } = useAuth();
  const [tab, setTab] = useState<Tab>("project");
  const [success, setSuccess] = useState(false);

  // Project form state
  const [projectForm, setProjectForm] = useState({
    name: "",
    region: "",
    country: "",
    type: "Forest",
    baseline: "",
    current_state: "",
    confidence: "0.70",
    value_estimate: "",
    trend: "stable" as const,
    risk_level: "medium" as const,
    status: "active" as const,
    district: "",
    notes: "",
    last_verified: new Date().toISOString().split("T")[0],
  });

  // Metric form state
  const [metricForm, setMetricForm] = useState({
    project_id: projectId ?? "",
    metric_type: "hectares",
    value: "",
    unit: "ha",
    confidence: "0.70",
    source_type: "field" as const,
    availability: "available" as const,
    period_start: "",
    period_end: "",
    notes: "",
  });

  // Verification form state
  const [verForm, setVerForm] = useState({
    project_id: projectId ?? "",
    verification_type: "field" as const,
    verifier_name: "",
    methodology_version: "v2.4.1",
    coverage: "0.80",
    last_verified_at: new Date().toISOString().split("T")[0],
    next_review_at: "",
    notes: "",
    evidence_urls: "",
  });

  const createProject = useCreateProject();
  const submitMetric = useSubmitImpactMetric();
  const submitVerification = useSubmitVerification();

  const isLoading =
    createProject.isPending || submitMetric.isPending || submitVerification.isPending;

  const handleSubmit = async () => {
    try {
      if (tab === "project") {
        const payload: Database["public"]["Tables"]["projects"]["Insert"] = {
          ...projectForm,
          confidence: parseFloat(projectForm.confidence),
          last_verified: projectForm.last_verified
            ? new Date(projectForm.last_verified).toISOString()
            : null,
          operator_id: user?.id ?? null,
        };
        await createProject.mutateAsync(payload);
      } else if (tab === "metric") {
        const payload: Database["public"]["Tables"]["impact_metrics"]["Insert"] = {
          project_id: metricForm.project_id,
          metric_type: metricForm.metric_type,
          value: parseFloat(metricForm.value),
          unit: metricForm.unit,
          confidence: parseFloat(metricForm.confidence),
          source_type: metricForm.source_type,
          availability: metricForm.availability,
          period_start: metricForm.period_start || null,
          period_end: metricForm.period_end || null,
          notes: metricForm.notes || null,
          submitted_by: user?.id ?? null,
        };
        await submitMetric.mutateAsync(payload);
      } else {
        const payload: Database["public"]["Tables"]["verification_records"]["Insert"] = {
          project_id: verForm.project_id,
          verification_type: verForm.verification_type,
          verifier_name: verForm.verifier_name || null,
          methodology_version: verForm.methodology_version || null,
          coverage: verForm.coverage ? parseFloat(verForm.coverage) : null,
          last_verified_at: verForm.last_verified_at
            ? new Date(verForm.last_verified_at).toISOString()
            : null,
          next_review_at: verForm.next_review_at
            ? new Date(verForm.next_review_at).toISOString()
            : null,
          notes: verForm.notes || null,
          evidence_urls: verForm.evidence_urls
            ? verForm.evidence_urls.split("\n").filter(Boolean)
            : null,
          submitted_by: user?.id ?? null,
        };
        await submitVerification.mutateAsync(payload);
      }
      setSuccess(true);
      setTimeout(() => { setSuccess(false); onClose(); }, 1500);
    } catch (err) {
      console.error("Submission error:", err);
    }
  };

  const canSubmit = role === "operator" || role === "admin";

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-2xl bg-surface border-border p-0 gap-0 overflow-hidden">
        <DialogHeader className="px-5 py-4 border-b border-border">
          <DialogTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-recovery" />
            Field Operator Data Entry
            {projectName && (
              <span className="text-foreground-subtle font-normal">— {projectName}</span>
            )}
          </DialogTitle>
        </DialogHeader>

        {!user ? (
          <div className="px-5 py-8 text-center text-foreground-subtle text-sm">
            <p className="mb-2">Sign in to submit field data.</p>
            <p className="text-xs text-foreground-subtle">
              You need an operator or admin account to submit readings.
            </p>
          </div>
        ) : success ? (
          <div className="px-5 py-12 flex flex-col items-center gap-3">
            <CheckCircle2 size={40} className="text-recovery" />
            <p className="text-foreground font-medium">Submitted successfully</p>
            <p className="text-xs text-foreground-subtle font-mono">Data is being processed</p>
          </div>
        ) : (
          <>
            {/* Tabs */}
            <div className="flex border-b border-border px-1">
              <TabButton active={tab === "project"} onClick={() => setTab("project")}>New Project</TabButton>
              <TabButton active={tab === "metric"} onClick={() => setTab("metric")}>Impact Reading</TabButton>
              <TabButton active={tab === "verification"} onClick={() => setTab("verification")}>Verification</TabButton>
            </div>

            {!canSubmit && (
              <div className="mx-5 mt-3 px-3 py-2 bg-watch-dim border border-watch/20 rounded text-xs text-watch">
                Your account role ({role ?? "unknown"}) doesn't have write access. Contact an admin.
              </div>
            )}

            <div className="px-5 py-4 space-y-4 max-h-[60vh] overflow-y-auto">

              {/* ── New Project ── */}
              {tab === "project" && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Project Name">
                      <input
                        className={inputCls}
                        placeholder="e.g. Mau Forest Restoration Phase III"
                        value={projectForm.name}
                        onChange={(e) => setProjectForm({ ...projectForm, name: e.target.value })}
                      />
                    </Field>
                    <Field label="Type">
                      <input
                        className={inputCls}
                        placeholder="e.g. Forest, Water, Carbon"
                        value={projectForm.type}
                        onChange={(e) => setProjectForm({ ...projectForm, type: e.target.value })}
                      />
                    </Field>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Country">
                      <input
                        className={inputCls}
                        placeholder="e.g. Kenya"
                        value={projectForm.country}
                        onChange={(e) => setProjectForm({ ...projectForm, country: e.target.value })}
                      />
                    </Field>
                    <Field label="Region / Province">
                      <input
                        className={inputCls}
                        placeholder="e.g. Rift Valley"
                        value={projectForm.region}
                        onChange={(e) => setProjectForm({ ...projectForm, region: e.target.value })}
                      />
                    </Field>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Baseline Condition">
                      <input
                        className={inputCls}
                        placeholder="e.g. 22% canopy cover"
                        value={projectForm.baseline}
                        onChange={(e) => setProjectForm({ ...projectForm, baseline: e.target.value })}
                      />
                    </Field>
                    <Field label="Current State">
                      <input
                        className={inputCls}
                        placeholder="e.g. 41% canopy cover"
                        value={projectForm.current_state}
                        onChange={(e) => setProjectForm({ ...projectForm, current_state: e.target.value })}
                      />
                    </Field>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <Field label="Confidence (0–1)">
                      <input
                        className={inputCls}
                        type="number"
                        min="0" max="1" step="0.01"
                        value={projectForm.confidence}
                        onChange={(e) => setProjectForm({ ...projectForm, confidence: e.target.value })}
                      />
                    </Field>
                    <Field label="Status">
                      <select
                        className={selectCls}
                        value={projectForm.status}
                        onChange={(e) => setProjectForm({ ...projectForm, status: e.target.value as typeof projectForm.status })}
                      >
                        {STATUS_OPTIONS.map((o) => <option key={o}>{o}</option>)}
                      </select>
                    </Field>
                    <Field label="Risk Level">
                      <select
                        className={selectCls}
                        value={projectForm.risk_level}
                        onChange={(e) => setProjectForm({ ...projectForm, risk_level: e.target.value as typeof projectForm.risk_level })}
                      >
                        {RISK_OPTIONS.map((o) => <option key={o}>{o}</option>)}
                      </select>
                    </Field>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Trend">
                      <select
                        className={selectCls}
                        value={projectForm.trend}
                        onChange={(e) => setProjectForm({ ...projectForm, trend: e.target.value as typeof projectForm.trend })}
                      >
                        {TREND_OPTIONS.map((o) => <option key={o}>{o}</option>)}
                      </select>
                    </Field>
                    <Field label="Last Verified (date)">
                      <input
                        className={inputCls}
                        type="date"
                        value={projectForm.last_verified}
                        onChange={(e) => setProjectForm({ ...projectForm, last_verified: e.target.value })}
                      />
                    </Field>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Est. Value (optional)">
                      <input
                        className={inputCls}
                        placeholder="e.g. $2.4M"
                        value={projectForm.value_estimate}
                        onChange={(e) => setProjectForm({ ...projectForm, value_estimate: e.target.value })}
                      />
                    </Field>
                    <Field label="District (optional)">
                      <input
                        className={inputCls}
                        placeholder="e.g. Nakuru District"
                        value={projectForm.district}
                        onChange={(e) => setProjectForm({ ...projectForm, district: e.target.value })}
                      />
                    </Field>
                  </div>
                  <Field label="Field Notes">
                    <textarea
                      className={`${inputCls} min-h-[70px] resize-none`}
                      placeholder="Observations, context, anomalies..."
                      value={projectForm.notes}
                      onChange={(e) => setProjectForm({ ...projectForm, notes: e.target.value })}
                    />
                  </Field>
                </>
              )}

              {/* ── Impact Reading ── */}
              {tab === "metric" && (
                <>
                  <Field label="Project ID (paste from project table)">
                    <input
                      className={inputCls}
                      placeholder="UUID or leave blank to submit globally"
                      value={metricForm.project_id}
                      onChange={(e) => setMetricForm({ ...metricForm, project_id: e.target.value })}
                    />
                  </Field>
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Metric Type">
                      <select
                        className={selectCls}
                        value={metricForm.metric_type}
                        onChange={(e) => setMetricForm({ ...metricForm, metric_type: e.target.value })}
                      >
                        {METRIC_TYPES.map((t) => <option key={t}>{t}</option>)}
                      </select>
                    </Field>
                    <Field label="Source Type">
                      <select
                        className={selectCls}
                        value={metricForm.source_type}
                        onChange={(e) => setMetricForm({ ...metricForm, source_type: e.target.value as typeof metricForm.source_type })}
                      >
                        {CONFIDENCE_LEVELS.map((t) => <option key={t}>{t}</option>)}
                      </select>
                    </Field>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Measured Value">
                      <input
                        className={inputCls}
                        type="number"
                        placeholder="e.g. 8400"
                        value={metricForm.value}
                        onChange={(e) => setMetricForm({ ...metricForm, value: e.target.value })}
                      />
                    </Field>
                    <Field label="Unit">
                      <input
                        className={inputCls}
                        placeholder="e.g. ha, t CO₂e, systems"
                        value={metricForm.unit}
                        onChange={(e) => setMetricForm({ ...metricForm, unit: e.target.value })}
                      />
                    </Field>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <Field label="Confidence (0–1)">
                      <input
                        className={inputCls}
                        type="number"
                        min="0" max="1" step="0.01"
                        value={metricForm.confidence}
                        onChange={(e) => setMetricForm({ ...metricForm, confidence: e.target.value })}
                      />
                    </Field>
                    <Field label="Period Start">
                      <input
                        className={inputCls}
                        type="date"
                        value={metricForm.period_start}
                        onChange={(e) => setMetricForm({ ...metricForm, period_start: e.target.value })}
                      />
                    </Field>
                    <Field label="Period End">
                      <input
                        className={inputCls}
                        type="date"
                        value={metricForm.period_end}
                        onChange={(e) => setMetricForm({ ...metricForm, period_end: e.target.value })}
                      />
                    </Field>
                  </div>
                  <Field label="Field Notes">
                    <textarea
                      className={`${inputCls} min-h-[70px] resize-none`}
                      placeholder="Measurement methodology, anomalies, context..."
                      value={metricForm.notes}
                      onChange={(e) => setMetricForm({ ...metricForm, notes: e.target.value })}
                    />
                  </Field>
                </>
              )}

              {/* ── Verification ── */}
              {tab === "verification" && (
                <>
                  <Field label="Project ID">
                    <input
                      className={inputCls}
                      placeholder="Paste project UUID"
                      value={verForm.project_id}
                      onChange={(e) => setVerForm({ ...verForm, project_id: e.target.value })}
                    />
                  </Field>
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Verification Type">
                      <select
                        className={selectCls}
                        value={verForm.verification_type}
                        onChange={(e) => setVerForm({ ...verForm, verification_type: e.target.value as typeof verForm.verification_type })}
                      >
                        {VERIFICATION_TYPES.map((t) => <option key={t}>{t}</option>)}
                      </select>
                    </Field>
                    <Field label="Verifier / Organisation">
                      <input
                        className={inputCls}
                        placeholder="e.g. Verra, field team name"
                        value={verForm.verifier_name}
                        onChange={(e) => setVerForm({ ...verForm, verifier_name: e.target.value })}
                      />
                    </Field>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <Field label="Coverage (0–1)">
                      <input
                        className={inputCls}
                        type="number"
                        min="0" max="1" step="0.01"
                        value={verForm.coverage}
                        onChange={(e) => setVerForm({ ...verForm, coverage: e.target.value })}
                      />
                    </Field>
                    <Field label="Methodology Version">
                      <input
                        className={inputCls}
                        placeholder="e.g. v2.4.1"
                        value={verForm.methodology_version}
                        onChange={(e) => setVerForm({ ...verForm, methodology_version: e.target.value })}
                      />
                    </Field>
                    <Field label="Last Verified">
                      <input
                        className={inputCls}
                        type="date"
                        value={verForm.last_verified_at}
                        onChange={(e) => setVerForm({ ...verForm, last_verified_at: e.target.value })}
                      />
                    </Field>
                  </div>
                  <Field label="Next Review Date">
                    <input
                      className={inputCls}
                      type="date"
                      value={verForm.next_review_at}
                      onChange={(e) => setVerForm({ ...verForm, next_review_at: e.target.value })}
                    />
                  </Field>
                  <Field label="Evidence URLs (one per line)">
                    <textarea
                      className={`${inputCls} min-h-[60px] resize-none`}
                      placeholder="https://example.com/report.pdf"
                      value={verForm.evidence_urls}
                      onChange={(e) => setVerForm({ ...verForm, evidence_urls: e.target.value })}
                    />
                  </Field>
                  <Field label="Notes">
                    <textarea
                      className={`${inputCls} min-h-[60px] resize-none`}
                      placeholder="Verification context, anomalies..."
                      value={verForm.notes}
                      onChange={(e) => setVerForm({ ...verForm, notes: e.target.value })}
                    />
                  </Field>
                </>
              )}
            </div>

            {/* Footer */}
            <div className="px-5 py-3 border-t border-border flex items-center justify-between gap-3">
              <div className="text-[10px] text-foreground-subtle font-mono">
                Submitting as: <span className="text-foreground-muted">{user?.email ?? "—"}</span>
                <span className="mx-2">·</span>
                Role: <span className="text-recovery">{role ?? "—"}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={onClose}
                  className="px-3 py-1.5 text-xs text-foreground-subtle hover:text-foreground transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isLoading || !canSubmit}
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded bg-recovery text-background text-xs font-semibold hover:bg-recovery-bright transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}
                  Submit Reading
                </button>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
