"use client";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import ChartShell from "./ChartShell";
import { DISTRIBUTION_DATA, tt } from "@/data/constants";

export default function DistributionChart({ data, squadName }) {
  const chartData = data || DISTRIBUTION_DATA;
  const title = `Flow Distribution \u2014 ${squadName || "Squad Phoenix"}`;
  const bugPct = chartData.find(d => d.name === "Bugs")?.value || 0;
  return (
    <ChartShell title={title} sub="Completed items by type \u00B7 last 4 sprints">
      <div className="flex items-center gap-2 px-2">
        <ResponsiveContainer width={150} height={150}>
          <PieChart>
            <Pie data={chartData} cx="50%" cy="50%" innerRadius={40} outerRadius={66} dataKey="value" paddingAngle={2} stroke="none">
              {chartData.map((d) => <Cell key={d.name} fill={d.color} />)}
            </Pie>
            <Tooltip contentStyle={tt} formatter={(v) => [`${v}%`]} />
          </PieChart>
        </ResponsiveContainer>
        <div className="flex-1 space-y-2">
          {chartData.map((d) => (
            <div key={d.name} className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: d.color }} />
              <span className="text-xs text-slate-600 flex-1">{d.name}</span>
              <span className="text-xs font-bold" style={{ color: d.color }}>{d.value}%</span>
            </div>
          ))}
          {bugPct > 25 && (
            <div className="pt-1 border-t border-slate-100">
              <p className="text-xs font-medium text-amber-600">{"\u26A0"} Bug load {bugPct > 35 ? `${Math.round(bugPct / 20)}\u00D7` : "above"} healthy level</p>
            </div>
          )}
        </div>
      </div>
    </ChartShell>
  );
}
