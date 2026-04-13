"use client";
import { heatCell } from "@/data/helpers";

export default function ComparisonCard({ data }) {
  if (!data?.rows?.length) return null;
  return (
    <div className="mt-3 rounded-xl border border-slate-200 overflow-x-auto bg-white shadow-sm">
      <table className="w-full text-xs">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200">
            {["Squad", "Flow Time", "Velocity", "Efficiency", "WIP", "Health"].map(h => (
              <th key={h} className="px-3 py-2 text-left font-semibold text-slate-400 uppercase tracking-wide whitespace-nowrap">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {data.rows.map(r => (
            <tr key={r.id} className="hover:bg-slate-50 transition-colors">
              <td className="px-3 py-2 font-medium text-slate-700">{r.name}</td>
              <td className={`px-3 py-2 font-medium ${heatCell("flowTime", r.flowTime)}`}>{r.flowTime}d</td>
              <td className={`px-3 py-2 font-medium ${heatCell("velocity", r.velocity)}`}>{r.velocity}</td>
              <td className={`px-3 py-2 font-medium ${heatCell("efficiency", r.efficiency)}`}>{r.efficiency}%</td>
              <td className={`px-3 py-2 font-medium ${heatCell("wip", r.wip, r.wipLimit)}`}>{r.wip}/{r.wipLimit}</td>
              <td className="px-3 py-2">
                <div className="flex">
                  {Array(5).fill(0).map((_, i) => (
                    <span key={i} className={`text-sm ${heatCell("health", r.health)}`}>{i < r.health ? "\u25CF" : "\u25CB"}</span>
                  ))}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
