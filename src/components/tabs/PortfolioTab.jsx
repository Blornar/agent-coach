"use client";
import { IcoWarn } from "@/components/icons";
import { EPICS, STATUS } from "@/data/constants";

export default function PortfolioTab() {
  return (
    <div className="p-5 overflow-y-auto h-full">
      <div className="mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-[#FFF4CC] flex items-center justify-center flex-shrink-0">
            <span className="text-lg">📦</span>
          </div>
          <div>
            <h2 className="text-base font-semibold text-neutral-800">Epic Portfolio</h2>
            <p className="text-xs text-neutral-400 mt-0.5">5 active epics · Q2 2026 · Payments Platform · Forecasts via Monte Carlo (P70)</p>
          </div>
        </div>
      </div>
      <div className="rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              {["Epic", "Squad", "Progress", "Target", "Forecast P70", "Status", "OKR"].map((h) => (
                <th key={h} className="px-4 py-2.5 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {EPICS.map((e) => {
              const s = STATUS[e.status];
              return (
                <tr key={e.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3">
                    <p className="text-sm font-medium text-slate-800">{e.name}</p>
                    <p className="text-xs text-slate-400 font-mono mt-0.5">{e.id}</p>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-600">{e.squad}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${s.bar}`} style={{ width: `${e.pct}%` }} />
                      </div>
                      <span className="text-xs font-semibold text-slate-600">{e.pct}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-600">{e.target}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-medium ${e.status === "at-risk" ? "text-amber-600" : "text-slate-600"}`}>{e.p70}</span>
                    {e.status === "at-risk" && <IcoWarn size={11} className="inline ml-1 text-amber-400" />}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${s.badge}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />{s.label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-400 font-mono">{e.okr}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
