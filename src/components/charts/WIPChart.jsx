"use client";
import ChartShell from "./ChartShell";
import { IcoWarn } from "@/components/icons";

export default function WIPChart({ wip: wipProp, limit: limitProp, squadName }) {
  const wip = wipProp ?? 9, limit = limitProp ?? 6, max = Math.max(12, wip + 2);
  const overPct = wip > limit ? Math.round(((wip - limit) / limit) * 100) : 0;
  const title = `Flow Load \u2014 ${squadName || "Squad Phoenix"}`;
  return (
    <ChartShell title={title} sub="Active items vs. WIP limit \u00B7 current sprint">
      <div className="px-3 pt-2 pb-1">
        <div className="flex items-end gap-4 mb-4">
          <div>
            <p className={`text-5xl font-black leading-none ${wip > limit ? "text-rose-500" : wip === limit ? "text-amber-500" : "text-emerald-500"}`}>{wip}</p>
            <p className="text-xs text-slate-400 mt-1">active items</p>
          </div>
          <p className="text-slate-200 text-3xl mb-2">/</p>
          <div>
            <p className="text-5xl font-black text-slate-300 leading-none">{limit}</p>
            <p className="text-xs text-slate-400 mt-1">WIP limit</p>
          </div>
          {overPct > 0 && (
            <div className="ml-auto flex items-center gap-1.5 bg-rose-50 text-rose-600 font-semibold text-sm px-3 py-2 rounded-xl border border-rose-200">
              <IcoWarn size={14} /> {overPct}% over limit
            </div>
          )}
          {wip <= limit && (
            <div className="ml-auto flex items-center gap-1.5 bg-emerald-50 text-emerald-600 font-semibold text-sm px-3 py-2 rounded-xl border border-emerald-200">
              Within limit
            </div>
          )}
        </div>
        <div className="relative h-4 bg-slate-100 rounded-full overflow-hidden">
          <div className={`h-full rounded-full ${wip > limit ? "bg-rose-400" : wip === limit ? "bg-amber-400" : "bg-emerald-400"}`} style={{ width: `${(wip / max) * 100}%` }} />
          <div className="absolute top-0 bottom-0 w-0.5 bg-emerald-500" style={{ left: `${(limit / max) * 100}%` }} />
        </div>
        <div className="flex justify-between mt-1.5 text-xs text-slate-400">
          <span>0</span>
          <span className="text-emerald-600 font-medium">limit: {limit}</span>
          <span>{max}</span>
        </div>
      </div>
    </ChartShell>
  );
}
