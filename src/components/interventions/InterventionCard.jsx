"use client";
import { IcoFlag, IcoRight, IcoTrendUp, IcoTrendDn, IcoTrash } from "@/components/icons";
import { METRIC_OPTIONS, INT_STATUS_CFG } from "@/data/constants";
import { getChartData, computeBeforeAfter, intStatus } from "@/data/helpers";

export default function InterventionCard({ intervention, onClick, onDelete }) {
  const chartData  = getChartData(intervention.targetId, intervention.metric);
  const metricCfg  = METRIC_OPTIONS.find(m => m.id === intervention.metric);
  const stats      = chartData ? computeBeforeAfter(chartData, intervention.startSprint) : null;
  const status     = stats ? intStatus(stats.delta, metricCfg?.lowerIsBetter) : "unknown";
  const cfg        = INT_STATUS_CFG[status];
  const StatusIcon = cfg.Icon;

  const fmt  = (v) => v != null ? `${v.toFixed(1)}${metricCfg?.unit ?? ""}` : "\u2014";
  const sign = stats && stats.delta > 0 ? "+" : "";

  const deltaColor = status === "improving" ? "text-emerald-600" : status === "worsening" ? "text-rose-600" : "text-slate-400";

  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-white rounded-xl border border-slate-200 shadow-sm hover:border-[#FFE066] hover:shadow-md transition-all overflow-hidden"
    >
      <div className="px-4 py-3.5 flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-[#FFF4CC] flex items-center justify-center flex-shrink-0 mt-0.5">
          <IcoFlag size={14} className="text-amber-700" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-slate-800 leading-snug">{intervention.name}</p>
          <div className="flex flex-wrap items-center gap-1.5 mt-1">
            <span className="text-xs bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-medium">{intervention.targetName}</span>
            <span className="text-xs text-slate-300">·</span>
            <span className="text-xs text-slate-400">Started {intervention.startSprint}</span>
            <span className="text-xs text-slate-300">·</span>
            <span className="text-xs text-slate-400">{metricCfg?.label}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${cfg.bgCls} ${cfg.textCls} ${cfg.borderCls}`}>
            <StatusIcon size={10} />
            {cfg.label}
          </div>
          {onDelete && (
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(); }}
              title="Remove intervention"
              className="p-1.5 rounded-lg text-slate-300 hover:text-rose-500 hover:bg-rose-50 transition-colors"
            >
              <IcoTrash size={13} />
            </button>
          )}
        </div>
      </div>

      {stats ? (
        <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center gap-3">
          <div className="text-xs text-slate-500">
            Before <span className="font-bold text-slate-700">{fmt(stats.avgBefore)}</span>
          </div>
          <IcoRight size={10} className="text-slate-300 flex-shrink-0" />
          <div className="text-xs text-slate-500">
            After <span className="font-bold text-slate-700">{fmt(stats.avgAfter)}</span>
          </div>
          <div className="ml-auto flex items-center gap-1">
            <span className={`text-xs font-bold ${deltaColor}`}>
              {sign}{stats.delta.toFixed(1)}%
            </span>
            {status === "improving" && <IcoTrendUp size={11} className="text-emerald-500" />}
            {status === "worsening" && <IcoTrendDn size={11} className="text-rose-500" />}
          </div>
        </div>
      ) : (
        <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100">
          <span className="text-xs text-slate-400">No data available for this target + metric</span>
        </div>
      )}
    </button>
  );
}
