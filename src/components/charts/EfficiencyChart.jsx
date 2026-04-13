"use client";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import ChartShell from "./ChartShell";
import { C } from "@/data/palette";
import { EFFICIENCY_DATA, tt } from "@/data/constants";

export default function EfficiencyChart({ data, squadName }) {
  const chartData = data || EFFICIENCY_DATA;
  const title = `Flow Efficiency \u2014 ${squadName || "Squad Phoenix"}`;
  return (
    <ChartShell title={title} sub="Active time / total flow time \u00B7 last 6 sprints">
      <ResponsiveContainer width="100%" height={180}>
        <LineChart data={chartData} margin={{ top: 8, right: 20, bottom: 0, left: -10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis dataKey="sprint" tick={{ fontSize: 11, fill: "#94a3b8" }} />
          <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} unit="%" domain={[0, 100]} />
          <Tooltip contentStyle={tt} formatter={(v) => [`${v}%`]} />
          <ReferenceLine y={55} stroke={C.emerald} strokeDasharray="4 3" label={{ value: "crew median (55%)", fill: C.emerald, fontSize: 9, position: "insideTopRight" }} />
          <Line type="monotone" dataKey="efficiency" stroke={C.coral} strokeWidth={2.5} dot={{ r: 3, fill: C.coral }} activeDot={{ r: 5 }} name="Efficiency %" />
        </LineChart>
      </ResponsiveContainer>
    </ChartShell>
  );
}
