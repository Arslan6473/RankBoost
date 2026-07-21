"use client";

import {
  Bar,
  BarChart,
  Line,
  LineChart,
  Area,
  AreaChart,
  Pie,
  PieChart,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { ChartSpec } from "@/types/tool";
import { Card } from "@/components/ui/card";

const CHART_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value: number; name: string }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border bg-popover px-3 py-2 text-xs shadow-soft-lg">
      <div className="font-medium">{label ?? payload[0].name}</div>
      <div className="text-muted-foreground">{payload[0].value}</div>
    </div>
  );
}

export function ToolChart({ spec }: { spec: ChartSpec }) {
  return (
    <Card className="p-4">
      <div className="mb-3 text-sm font-medium">{spec.title}</div>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          {renderChart(spec)}
        </ResponsiveContainer>
      </div>
      {spec.caption && (
        <p className="mt-2 text-xs text-muted-foreground">{spec.caption}</p>
      )}
    </Card>
  );
}

function renderChart(spec: ChartSpec) {
  const axisProps = {
    stroke: "var(--muted-foreground)",
    fontSize: 11,
    tickLine: false,
    axisLine: false,
  };

  switch (spec.kind) {
    case "line":
      return (
        <LineChart data={spec.data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis dataKey="name" {...axisProps} />
          <YAxis {...axisProps} allowDecimals={false} />
          <Tooltip content={<ChartTooltip />} cursor={{ stroke: "var(--border)" }} />
          <Line
            type="monotone"
            dataKey="value"
            stroke="var(--chart-1)"
            strokeWidth={2.5}
            dot={{ r: 3, fill: "var(--chart-1)" }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      );
    case "area":
      return (
        <AreaChart data={spec.data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
          <defs>
            <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.35} />
              <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis dataKey="name" {...axisProps} />
          <YAxis {...axisProps} allowDecimals={false} />
          <Tooltip content={<ChartTooltip />} />
          <Area type="monotone" dataKey="value" stroke="var(--chart-1)" strokeWidth={2.5} fill="url(#areaFill)" />
        </AreaChart>
      );
    case "pie":
      return (
        <PieChart>
          <Tooltip content={<ChartTooltip />} />
          <Pie
            data={spec.data}
            dataKey="value"
            nameKey="name"
            innerRadius={48}
            outerRadius={90}
            paddingAngle={2}
            stroke="var(--card)"
            strokeWidth={2}
          >
            {spec.data.map((_, i) => (
              <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      );
    case "bar":
    default:
      return (
        <BarChart data={spec.data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis dataKey="name" {...axisProps} interval={0} angle={spec.data.length > 6 ? -35 : 0} textAnchor={spec.data.length > 6 ? "end" : "middle"} height={spec.data.length > 6 ? 56 : 24} />
          <YAxis {...axisProps} allowDecimals={false} />
          <Tooltip content={<ChartTooltip />} cursor={{ fill: "var(--secondary)" }} />
          <Bar dataKey="value" radius={[6, 6, 0, 0]} fill="var(--chart-1)" maxBarSize={48}>
            {spec.data.map((_, i) => (
              <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      );
  }
}
