import { TrendingUp, TrendingDown, Minus, AlertTriangle, ExternalLink } from "lucide-react";
import type { Project } from "@/data/mockData";
import { projects } from "@/data/mockData";

const trendIcon = {
  accelerating: <TrendingUp size={12} className="text-recovery" />,
  stable: <Minus size={12} className="text-foreground-subtle" />,
  stalling: <TrendingDown size={12} className="text-watch" />,
  reversing: <TrendingDown size={12} className="text-reversal" />,
};

const trendColor = {
  accelerating: "text-recovery",
  stable: "text-foreground-muted",
  stalling: "text-watch",
  reversing: "text-reversal",
};

const riskBadge = {
  low: "border-recovery/20 text-recovery bg-recovery-dim",
  medium: "border-watch/20 text-watch bg-watch-dim",
  high: "border-reversal/20 text-reversal bg-reversal-dim",
};

const statusDot = {
  active: "bg-recovery",
  watch: "bg-watch",
  critical: "bg-reversal",
};

function ConfidenceBar({ score }: { score: number }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="w-12 h-1.5 bg-surface-overlay rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${score >= 0.75 ? "bg-recovery" : score >= 0.55 ? "bg-watch" : "bg-reversal"}`}
          style={{ width: `${score * 100}%` }}
        />
      </div>
      <span className="font-mono text-[10px] text-foreground-subtle">{score.toFixed(2)}</span>
    </div>
  );
}

function ProjectRow({ project }: { project: Project }) {
  return (
    <tr className="border-b border-border hover:bg-surface-raised transition-colors group">
      {/* Status + name */}
      <td className="py-3 px-4">
        <div className="flex items-start gap-2">
          <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${statusDot[project.status]}`} />
          <div>
            <div className="text-foreground text-xs font-medium leading-snug">{project.name}</div>
            <div className="text-foreground-subtle text-[10px] font-mono mt-0.5">{project.country} · {project.region}</div>
          </div>
        </div>
      </td>
      {/* Type */}
      <td className="py-3 px-3">
        <span className="text-[10px] text-foreground-subtle px-2 py-0.5 rounded border border-border bg-surface">
          {project.type}
        </span>
      </td>
      {/* Baseline → Current */}
      <td className="py-3 px-3 hidden md:table-cell">
        <div className="text-xs">
          <span className="text-foreground-subtle font-mono">{project.baseline}</span>
          <span className="text-foreground-subtle mx-1.5">→</span>
          <span className="text-foreground font-mono font-medium">{project.current}</span>
        </div>
      </td>
      {/* Confidence */}
      <td className="py-3 px-3 hidden lg:table-cell">
        <ConfidenceBar score={project.confidence} />
      </td>
      {/* Value */}
      <td className="py-3 px-3">
        <span className="font-mono text-sm text-recovery font-semibold">{project.valueEstimate}</span>
      </td>
      {/* Trend */}
      <td className="py-3 px-3">
        <div className="flex items-center gap-1.5">
          {trendIcon[project.trend]}
          <span className={`text-xs font-mono capitalize ${trendColor[project.trend]}`}>{project.trend}</span>
        </div>
      </td>
      {/* Risk */}
      <td className="py-3 px-3 hidden sm:table-cell">
        <span className={`text-[10px] px-2 py-0.5 rounded border ${riskBadge[project.riskLevel]}`}>
          {project.riskLevel}
        </span>
      </td>
      {/* Last verified */}
      <td className="py-3 px-3 hidden xl:table-cell">
        <div className="flex items-center gap-1 text-foreground-subtle text-[10px] font-mono">
          {project.lastVerified.includes("90") && <AlertTriangle size={10} className="text-watch" />}
          {project.lastVerified}
        </div>
      </td>
      {/* Action */}
      <td className="py-3 px-3">
        <button className="opacity-0 group-hover:opacity-100 transition-opacity text-foreground-subtle hover:text-recovery">
          <ExternalLink size={12} />
        </button>
      </td>
    </tr>
  );
}

export function ProjectTable() {
  return (
    <div className="bg-surface border border-border rounded-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-start justify-between px-4 py-3 border-b border-border">
        <div>
          <div className="text-xs text-foreground-subtle uppercase tracking-widest font-mono mb-1">Project Intelligence</div>
          <div className="font-semibold text-foreground text-sm">Project Impact Explorer</div>
        </div>
        <div className="text-xs text-foreground-subtle font-mono">{projects.length} projects</div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-surface-raised">
              {["Project / Location", "Type", "Baseline → Current", "Confidence", "Est. Value", "Trend", "Risk", "Last Verified", ""].map((h) => (
                <th key={h} className="py-2 px-3 text-left text-[10px] text-foreground-subtle uppercase tracking-widest font-medium whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {projects.map(project => (
              <ProjectRow key={project.id} project={project} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
