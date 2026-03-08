import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, Area, AreaChart, ComposedChart,
} from "recharts";
import type { TimeSeriesPoint } from "@/data/mockData";

interface TrendChartProps {
  title: string;
  subtitle: string;
  unit: string;
  data: TimeSeriesPoint[];
  color: string;
  target?: boolean;
  forecast?: boolean;
  band?: boolean;
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
      {payload.map((p: { name: string; value: number; color: string }) => (
        p.value !== undefined && p.value !== null && (
          <div key={p.name} className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: p.color }} />
            <span className="text-foreground-muted capitalize">{p.name}:</span>
            <span className="text-foreground font-semibold">{formatValue(p.value, unit)}</span>
          </div>
        )
      ))}
    </div>
  );
}

export function TrendChart({
  title, subtitle, unit, data, color, target = true, forecast = true, band = true,
}: TrendChartProps) {
  const hasActual = data.some(d => d.actual !== undefined && d.actual !== null);
  const hasForecast = data.some(d => d.forecast !== undefined);

  return (
    <div className="bg-surface border border-border rounded-lg p-4">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="text-xs text-foreground-subtle uppercase tracking-widest font-mono mb-1">{subtitle}</div>
          <div className="font-semibold text-foreground text-sm">{title}</div>
        </div>
        {/* Legend */}
        <div className="flex flex-col items-end gap-1">
          {hasActual && (
            <div className="flex items-center gap-1.5 text-[10px] text-foreground-subtle">
              <div className="w-4 h-0.5 rounded" style={{ background: color }} />
              Actual
            </div>
          )}
          {target && (
            <div className="flex items-center gap-1.5 text-[10px] text-foreground-subtle">
              <div className="w-4 h-px border-t border-dashed border-foreground-subtle" />
              Target
            </div>
          )}
          {forecast && hasForecast && (
            <div className="flex items-center gap-1.5 text-[10px] text-foreground-subtle">
              <div className="w-4 h-0.5 rounded opacity-50" style={{ background: color }} />
              Forecast
            </div>
          )}
          {band && (
            <div className="flex items-center gap-1.5 text-[10px] text-foreground-subtle">
              <div className="w-4 h-2 rounded opacity-20" style={{ background: color }} />
              Uncertainty
            </div>
          )}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={180}>
        <ComposedChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
          <CartesianGrid strokeDasharray="2 4" stroke="hsl(160 12% 14%)" vertical={false} />
          <XAxis
            dataKey="period"
            tick={{ fill: "hsl(150 8% 40%)", fontSize: 10, fontFamily: "DM Mono" }}
            tickLine={false}
            axisLine={false}
            interval={2}
          />
          <YAxis
            tick={{ fill: "hsl(150 8% 40%)", fontSize: 10, fontFamily: "DM Mono" }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => unit === "ha" ? `${(v / 1000).toFixed(0)}K` : unit === "t CO₂e" ? `${(v / 1000).toFixed(0)}K` : String(v)}
            width={36}
          />
          <Tooltip content={<CustomTooltip unit={unit} />} />

          {/* Uncertainty band */}
          {band && (
            <Area
              dataKey="upper"
              fill={color}
              fillOpacity={0.07}
              stroke="none"
              legendType="none"
              activeDot={false}
            />
          )}
          {band && (
            <Area
              dataKey="lower"
              fill="hsl(160 20% 4%)"
              fillOpacity={1}
              stroke="none"
              legendType="none"
              activeDot={false}
            />
          )}

          {/* Target line */}
          {target && (
            <Line
              dataKey="target"
              stroke="hsl(150 8% 40%)"
              strokeDasharray="4 3"
              strokeWidth={1}
              dot={false}
              name="target"
            />
          )}

          {/* Forecast */}
          {forecast && hasForecast && (
            <Line
              dataKey="forecast"
              stroke={color}
              strokeWidth={1.5}
              strokeDasharray="3 2"
              dot={false}
              strokeOpacity={0.6}
              name="forecast"
            />
          )}

          {/* Actual */}
          <Line
            dataKey="actual"
            stroke={color}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 3, fill: color, strokeWidth: 0 }}
            connectNulls={false}
            name="actual"
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
