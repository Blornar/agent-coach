"use client";
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from "recharts";
import ChartShell from "./ChartShell";
import { C } from "@/data/palette";
import { SCATTER_YOUNG, SCATTER_OLD, tt } from "@/data/constants";

export default function ScatterAgeChart({ youngData, oldData, squadName }) {
  const young = youngData || SCATTER_YOUNG;
  const old = oldData || SCATTER_OLD;
  const title = `Item Age Distribution \u2014 ${squadName || "Squad Phoenix"}`;
  const stageTick = (v) => (["", "Dev", "Review", "Test"][v] || "");
  const CustomTooltip = ({ payload }) => {
    if (!payload || !payload[0]) return null;
    const d = payload[0].payload;
    return (
      <div style={{ ...tt, padding: "8px 12px" }}>
        <p style={{ fontWeight: 600, margin: 0 }}>{d.id}</p>
        <p style={{ color: "#94a3b8", margin: 0 }}>{d.age} days \u00B7 {stageTick(d.stage)}</p>
      </div>
    );
  };
  return (
    <ChartShell title={title} sub="Days in progress vs. workflow stage \u00B7 current WIP">
      <ResponsiveContainer width="100%" height={190}>
        <ScatterChart margin={{ top: 8, right: 20, bottom: 20, left: -10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis type="number" dataKey="age"   name="Age"   tick={{ fontSize: 11, fill: "#94a3b8" }} label={{ value: "days in progress", position: "insideBottomRight", offset: -8, fontSize: 10, fill: "#94a3b8" }} />
          <YAxis type="number" dataKey="stage" name="Stage" tick={{ fontSize: 11, fill: "#94a3b8" }} ticks={[1, 2, 3]} tickFormatter={stageTick} />
          <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: "3 3" }} />
          <ReferenceLine x={14} stroke={C.cbaYellow} strokeDasharray="5 3" label={{ value: "14d threshold", fill: "#b45309", fontSize: 9, position: "insideTopLeft" }} />
          <Legend wrapperStyle={{ fontSize: 11, paddingTop: 4 }} />
          <Scatter name={"\u226414d"}  data={young} fill={C.navy} opacity={0.85} />
          <Scatter name={">14d"} data={old}   fill={C.coral}   opacity={0.85} />
        </ScatterChart>
      </ResponsiveContainer>
    </ChartShell>
  );
}
