import { useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, Area, ComposedChart,
} from "recharts";
import type { TimeSeriesPoint } from "@/data/mockData";
import { TrendingDown, AlertTriangle } from "lucide-react";

interface TrendChartProps {
  title: string;
  subtitle: string;
  unit: string;
  data: TimeSeriesPoint[];
  color: string;
  target?: boolean;
  forecast?: boolean;
  band?: boolean;
  showReversalDetection?: boolean;
}

function formatValue(val: number, unit: string): string {
  if (unit === "ha") return `${(val / 1000).toFixed(1)}K ha`;
  if (unit === "t CO₂e") return `${(val / 1000).toFixed(0)}K t`;
  return `${val} ${unit}`;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload, label, unit }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-surface-overlay border border-border rounded px-3 py-2 shadow-lg text-xs font-mono">
      <div className="text-foreground-subtle mb-1.5">{label}</div>
      {payload.map((p: { name: string; value: number; color: string }, i: number) => (
        p.value !== undefined && p.value !== null && (
          <div key={i} className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: p.color }} />
            <span className="text-foreground-muted capitalize">{p.name}:</span>
            <span className="text-foreground font-semibold">{formatValue(p.value, unit)}</span>
          </div>
        )
      ))}
    </div>
  );
}

// Detect slowdowns: two consecutive periods where growth < 5% of prior growth
function detectReversal(data: TimeSeriesPoint[]): string | null {
  const actuals = data.filter(d => d.actual != null).map(d => d.actual!);
  if (actuals.length < 3) return null;
  const last3 = actuals.slice(-3);
  const growth1 = last3[1] - last3[0];
  const growth2 = last3[2] - last3[1];
  if (growth2 < 0) return "Reversal detected in last period";
  if (growth2 < growth1 * 0.3 && growth1 > 0) return "Momentum decelerating";
  return null;
}

type ChartMode = "line" | "cumulative" | "target-gap";

export function TrendChart({
  title, subtitle, unit, data, color,
  target = true, forecast = true, band = true, showReversalDetection = true,
}: TrendChartProps) {
  const [mode, setMode] = useState<ChartMode>("line");
  const hasActual = data.some(d => d.actual !== undefined && d.actual !== null);
  const hasForecast = data.some(d => d.forecast !== undefined);
  const reversalSignal = showReversalDetection ? detectReversal(data) : null;

  // Build cumulative data
  const chartData = mode === "cumulative"
    ? data.map((d, i) => {
        const prev = i > 0 ? data[i - 1].actual ?? 0 : 0;
        return {
          ...d,
          actual: d.actual != null ? d.actual : undefined,
          cumDelta: d.actual != null ? d.actual - (data[0].actual ?? 0) : undefined,
        };
      })
    : mode === "target-gap"
    ? data.map(d => ({
        ...d,
        gap: d.actual != null && d.target != null ? d.actual - d.target : undefined,
      }))
    : data;

  const actualKey = mode === "target-gap" ? "gap" : "actual";
  const gapColor = mode === "target-gap" ? "hsl(155, 65%, 40%)" : color;

  return (
    <div className="bg-surface border border-border rounded-lg p-4">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="text-[10px] text-foreground-subtle uppercase tracking-widest font-mono mb-1">{subtitle}</div>
          <div className="font-semibold text-foreground text-sm">{title}</div>
        </div>
        <div className="flex flex-col items-end gap-1.5">
          {/* Mode switcher */}
          <div className="flex rounded border border-border overflow-hidden">
            {(["line", "cumulative", "target-gap"] as ChartMode[]).map(m => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`text-[9px] px-2 py-0.5 font-mono transition-colors ${
                  mode === m ? "bg-surface-raised text-foreground" : "text-foreground-subtle hover:text-foreground"
                }`}
              >
                {m === "line" ? "trend" : m === "cumulative" ? "cumul." : "gap"}
              </button>
            ))}
          </div>
          {/* Legend */}
          <div className="flex flex-col items-end gap-0.5">
            {hasActual && (
              <div className="flex items-center gap-1.5 text-[9px] text-foreground-subtle">
                <div className="w-3 h-0.5 rounded" style={{ background: color }} />
                Actual
              </div>
            )}
            {target && mode === "line" && (
              <div className="flex items-center gap-1.5 text-[9px] text-foreground-subtle">
                <div className="w-3 h-px border-t border-dashed border-foreground-subtle" />
                Target
              </div>
            )}
            {forecast && hasForecast && mode === "line" && (
              <div className="flex items-center gap-1.5 text-[9px] text-foreground-subtle">
                <div className="w-3 h-0.5 rounded opacity-50" style={{ background: color }} />
                Forecast
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Reversal detection banner */}
      {reversalSignal && mode === "line" && (
        <div className="flex items-center gap-2 text-[10px] px-2.5 py-1.5 rounded border border-watch/20 bg-watch-dim text-watch mb-3">
          <AlertTriangle size={10} />
          {reversalSignal}
        </div>
      )}

      {/* Target gap mode label */}
      {mode === "target-gap" && (
        <div className="text-[9px] text-foreground-subtle font-mono mb-2 italic">
          Showing actual vs target gap (positive = ahead of target)
        </div>
      )}

      <ResponsiveContainer width="100%" height={170}>
        <ComposedChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
          <CartesianGrid strokeDasharray="2 4" stroke="hsl(160 12% 14%)" vertical={false} />
          <XAxis
            dataKey="period"
            tick={{ fill: "hsl(150 8% 40%)", fontSize: 9, fontFamily: "DM Mono" }}
            tickLine={false}
            axisLine={false}
            interval={2}
          />
          <YAxis
            tick={{ fill: "hsl(150 8% 40%)", fontSize: 9, fontFamily: "DM Mono" }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => {
              if (unit === "ha") return `${(v / 1000).toFixed(0)}K`;
              if (unit === "t CO₂e") return `${(v / 1000).toFixed(0)}K`;
              return String(v);
            }}
            width={34}
          />
          <Tooltip content={<CustomTooltip unit={unit} />} />

          {/* Zero reference line for gap mode */}
          {mode === "target-gap" && (
            <ReferenceLine y={0} stroke="hsl(150 8% 40%)" strokeDasharray="3 2" strokeWidth={1} />
          )}

          {/* Uncertainty band */}
          {band && mode === "line" && (
            <>
              <Area dataKey="upper" fill={color} fillOpacity={0.07} stroke="none" legendType="none" activeDot={false} />
              <Area dataKey="lower" fill="hsl(160 20% 4%)" fillOpacity={1} stroke="none" legendType="none" activeDot={false} />
            </>
          )}

          {/* Target line (line mode only) */}
          {target && mode === "line" && (
            <Line dataKey="target" stroke="hsl(150 8% 40%)" strokeDasharray="4 3" strokeWidth={1} dot={false} name="target" />
          )}

          {/* Forecast */}
          {forecast && hasForecast && mode === "line" && (
            <Line dataKey="forecast" stroke={color} strokeWidth={1.5} strokeDasharray="3 2" dot={false} strokeOpacity={0.6} name="forecast" />
          )}

          {/* Actual / gap line */}
          <Line
            dataKey={actualKey}
            stroke={gapColor}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 3, fill: gapColor, strokeWidth: 0 }}
            connectNulls={false}
            name={mode === "target-gap" ? "gap" : "actual"}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
