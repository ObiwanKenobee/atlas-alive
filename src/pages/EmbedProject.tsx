import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { dbToProject } from "@/hooks/useProjects";
import { ShieldCheck, TrendingUp, TrendingDown, Minus, AlertTriangle } from "lucide-react";

const trendIcon = {
  accelerating: <TrendingUp size={14} className="text-recovery" />,
  stable: <Minus size={14} className="text-foreground-subtle" />,
  stalling: <TrendingDown size={14} className="text-watch" />,
  reversing: <TrendingDown size={14} className="text-reversal" />,
};

const statusBg = {
  active: "bg-recovery",
  watch: "bg-watch",
  critical: "bg-reversal",
};

const statusLabel = {
  active: "Active",
  watch: "Watch",
  critical: "Critical",
};

const riskColor = {
  low: "text-recovery border-recovery/20 bg-recovery-dim",
  medium: "text-watch border-watch/20 bg-watch-dim",
  high: "text-reversal border-reversal/20 bg-reversal-dim",
};

function ConfidenceMeter({ value }: { value: number }) {
  const pct = Math.round(value * 100);
  const color = value >= 0.75 ? "bg-recovery" : value >= 0.55 ? "bg-watch" : "bg-reversal";
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-surface-overlay rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color} transition-all`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs font-mono text-foreground-subtle tabular-nums">{pct}%</span>
    </div>
  );
}

export default function EmbedProject() {
  const { id } = useParams<{ id: string }>();

  const { data: project, isLoading } = useQuery({
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

  const { data: latestMetrics = [] } = useQuery({
    queryKey: ["embed_metrics", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("impact_metrics")
        .select("*")
        .eq("project_id", id!)
        .order("created_at", { ascending: false })
        .limit(6);
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-5 h-5 border-2 border-recovery border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <p className="text-foreground-subtle text-sm font-mono">Project not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-5 font-sans">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-5">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <div className={`w-2 h-2 rounded-full ${statusBg[project.status]} flex-shrink-0`} />
            <span className="text-[10px] font-mono text-foreground-subtle uppercase tracking-widest">
              {project.country} · {project.region}
            </span>
          </div>
          <h1 className="text-base font-semibold text-foreground leading-snug truncate">{project.name}</h1>
          <div className="flex flex-wrap items-center gap-2 mt-1.5">
            <span className="text-[10px] px-2 py-0.5 rounded border border-border bg-surface text-foreground-subtle font-mono">
              {project.type}
            </span>
            <div className="flex items-center gap-1">
              {trendIcon[project.trend]}
              <span className="text-[10px] font-mono capitalize text-foreground-muted">{project.trend}</span>
            </div>
            <span className={`text-[10px] px-2 py-0.5 rounded border font-mono ${riskColor[project.riskLevel]}`}>
              {project.riskLevel} risk
            </span>
          </div>
        </div>
        <div className="text-right flex-shrink-0">
          <div className="text-xl font-mono font-bold text-recovery">{project.valueEstimate}</div>
          <div className="text-[10px] text-foreground-subtle font-mono">Est. value</div>
        </div>
      </div>

      {/* Confidence */}
      <div className="bg-surface border border-border rounded-lg p-4 mb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <ShieldCheck size={13} className="text-foreground-subtle" />
            <span className="text-[10px] font-mono text-foreground-subtle uppercase tracking-widest">Confidence Score</span>
          </div>
          <span className="text-xs font-mono text-foreground">{project.lastVerified}</span>
        </div>
        <ConfidenceMeter value={project.confidence} />
        <div className="text-[10px] text-foreground-subtle mt-1">
          {project.confidence >= 0.75
            ? "High confidence — third-party or satellite verified"
            : project.confidence >= 0.55
            ? "Moderate confidence — field or community data"
            : "Low confidence — model estimate, verification needed"}
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-surface border border-border rounded-lg p-3">
          <div className="text-[10px] font-mono text-foreground-subtle uppercase tracking-widest mb-1">Baseline</div>
          <div className="text-sm font-semibold text-foreground font-mono">{project.baseline}</div>
        </div>
        <div className="bg-surface border border-border rounded-lg p-3">
          <div className="text-[10px] font-mono text-foreground-subtle uppercase tracking-widest mb-1">Current</div>
          <div className="text-sm font-semibold text-recovery font-mono">{project.current}</div>
        </div>
      </div>

      {/* Latest impact metrics */}
      {latestMetrics.length > 0 && (
        <div className="bg-surface border border-border rounded-lg overflow-hidden mb-4">
          <div className="px-3 py-2 border-b border-border">
            <span className="text-[10px] font-mono text-foreground-subtle uppercase tracking-widest">Recent Impact Readings</span>
          </div>
          <div className="divide-y divide-border">
            {latestMetrics.slice(0, 4).map((m) => (
              <div key={m.id} className="flex items-center justify-between px-3 py-2">
                <span className="text-xs text-foreground-muted capitalize">{m.metric_type}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-semibold text-recovery">{m.value.toLocaleString()} {m.unit}</span>
                  <div className="w-8 h-1 bg-surface-overlay rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${m.confidence >= 0.75 ? "bg-recovery" : m.confidence >= 0.55 ? "bg-watch" : "bg-reversal"}`}
                      style={{ width: `${m.confidence * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Atlas branding */}
      <div className="flex items-center justify-between">
        <div className="text-[10px] text-foreground-subtle font-mono">
          Atlas Regenerative OS · Public Signal
        </div>
        <div className={`flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded border ${
          project.status === "active" ? "border-recovery/20 text-recovery bg-recovery-dim" :
          project.status === "watch" ? "border-watch/20 text-watch bg-watch-dim" :
          "border-reversal/20 text-reversal bg-reversal-dim"
        }`}>
          <div className={`w-1.5 h-1.5 rounded-full ${statusBg[project.status]}`} />
          {statusLabel[project.status]}
        </div>
      </div>
    </div>
  );
}
