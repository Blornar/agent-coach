"use client";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from "recharts";
import ChartShell from "./ChartShell";
import { C } from "@/data/palette";
import { FLOW_TIME_DATA, tt } from "@/data/constants";

export default function FlowTimeChart({ data, squadName }) {
  const chartData = data || FLOW_TIME_DATA;
  const title = `Flow Time \u2014 ${squadName || "Squad Phoenix"}`;
  return (
    <ChartShell title={title} sub="Median and p85 \u00B7 days \u00B7 last 6 sprints">
      <ResponsiveContainer width="100%" height={180}>
        <LineChart data={chartData} margin={{ top: 8, right: 20, bottom: 0, left: -10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis dataKey="sprint" tick={{ fontSize: 11, fill: "#94a3b8" }} />
          <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} unit="d" />
          <Tooltip contentStyle={tt} formatter={(v) => [`${v} days`]} />
          <Legend wrapperStyle={{ fontSize: 11, paddingTop: 4 }} />
          <ReferenceLine y={4} stroke={C.emerald} strokeDasharray="4 3" label={{ value: "crew median", fill: C.emerald, fontSize: 9, position: "insideTopRight" }} />
          <Line type="monotone" dataKey="median" stroke={C.navy} strokeWidth={2.5} dot={{ r: 3, fill: C.navy }} activeDot={{ r: 5 }} name="Median" />
          <Line type="monotone" dataKey="p85"    stroke={C.coral}   strokeWidth={2}   dot={{ r: 3, fill: C.coral   }} strokeDasharray="5 3" name="p85" />
        </LineChart>
      </ResponsiveContainer>
    </ChartShell>
  );
}
