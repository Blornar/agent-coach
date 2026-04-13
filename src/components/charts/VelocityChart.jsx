"use client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from "recharts";
import ChartShell from "./ChartShell";
import { C } from "@/data/palette";
import { VELOCITY_DATA, tt } from "@/data/constants";

export default function VelocityChart({ data, squadName, mode }) {
  /* mode === "line" renders a single-squad line chart from data=[{sprint,value}] */
  if (mode === "line" && data) {
    return (
      <ChartShell title={`Flow Velocity \u2014 ${squadName || "Squad"}`} sub="Items completed per sprint \u00B7 last 6 sprints">
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={data} margin={{ top: 8, right: 20, bottom: 0, left: -10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="sprint" tick={{ fontSize: 11, fill: "#94a3b8" }} />
            <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} />
            <Tooltip contentStyle={tt} />
            <Line type="monotone" dataKey="value" stroke={C.navy} strokeWidth={2.5} dot={{ r: 3, fill: C.navy }} activeDot={{ r: 5 }} name="Velocity" />
          </LineChart>
        </ResponsiveContainer>
      </ChartShell>
    );
  }

  /* Default: multi-squad bar chart (legacy) */
  const chartData = data || VELOCITY_DATA;
  return (
    <ChartShell title={`Flow Velocity \u2014 ${squadName || "Checkout Crew"}`} sub="Items completed per sprint \u00B7 last 4 sprints">
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={chartData} margin={{ top: 8, right: 20, bottom: 0, left: -10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis dataKey="sprint" tick={{ fontSize: 11, fill: "#94a3b8" }} />
          <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} />
          <Tooltip contentStyle={tt} />
          <Legend wrapperStyle={{ fontSize: 11, paddingTop: 4 }} />
          <Bar dataKey="Phoenix" fill={C.coral}   radius={[4, 4, 0, 0]} />
          <Bar dataKey="Orion"   fill={C.navy} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartShell>
  );
}
