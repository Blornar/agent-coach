"use client";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, ReferenceArea } from "recharts";
import { C } from "@/data/palette";
import { tt } from "@/data/constants";

export default function BeforeAfterChart({ chartData, startSprint, unit, metricLabel }) {
  const idx         = chartData.findIndex(d => d.sprint === startSprint);
  const firstSprint = chartData[0].sprint;
  const lastSprint  = chartData[chartData.length - 1].sprint;
  const lastBefore  = idx > 0 ? chartData[idx - 1].sprint : null;

  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={chartData} margin={{ top: 16, right: 24, bottom: 0, left: -10 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
        {lastBefore && (
          <ReferenceArea x1={firstSprint} x2={lastBefore} fill="#e2e8f0" fillOpacity={0.5} />
        )}
        <ReferenceArea x1={startSprint} x2={lastSprint} fill="#FFF9E0" fillOpacity={0.6} />
        <XAxis dataKey="sprint" tick={{ fontSize: 11, fill: "#94a3b8" }} />
        <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} />
        <Tooltip contentStyle={tt} labelStyle={{ color: "#f8fafc", fontWeight: 600, marginBottom: 2 }} itemStyle={{ color: "#94a3b8" }} formatter={(v) => [`${v}${unit}`, metricLabel]} />
        <ReferenceLine
          x={startSprint}
          stroke={C.cbaYellow}
          strokeWidth={2}
          strokeDasharray="5 3"
          label={{ value: "Intervention", position: "insideTopLeft", fill: "#b45309", fontSize: 9 }}
        />
        <Line
          type="monotone"
          dataKey="value"
          stroke={C.navy}
          strokeWidth={2.5}
          dot={{ r: 3.5, fill: C.navy, stroke: "white", strokeWidth: 1.5 }}
          activeDot={{ r: 5 }}
          name={metricLabel}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
