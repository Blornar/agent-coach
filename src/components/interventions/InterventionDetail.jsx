"use client";
import { IcoFlag, IcoActivity, IcoBook } from "@/components/icons";
import { METRIC_OPTIONS, INT_STATUS_CFG, PLAYBOOK } from "@/data/constants";
import { getChartData, computeBeforeAfter, intStatus } from "@/data/helpers";
import BeforeAfterChart from "@/components/charts/BeforeAfterChart";
import NotesInput from "./NotesInput";

const PLAYBOOK_CATEGORY_COLORS = {
  rose: "bg-rose-100 text-rose-700",
  amber: "bg-amber-100 text-amber-700",
  sky: "bg-sky-100 text-sky-700",
  violet: "bg-violet-100 text-violet-700",
};

export default function InterventionDetail({ intervention, onBack, notes = [], onAddNote = () => {}, onViewPlaybook, basic = false }) {
  const chartData  = getChartData(intervention.targetId, intervention.metric);
  const metricCfg  = METRIC_OPTIONS.find(m => m.id === intervention.metric);
  const stats      = chartData ? computeBeforeAfter(chartData, intervention.startSprint) : null;
  const status     = stats ? intStatus(stats.delta, metricCfg?.lowerIsBetter) : "unknown";
  const cfg        = INT_STATUS_CFG[status];
  const StatusIcon = cfg.Icon;
  const playbook   = intervention.playbookId ? PLAYBOOK.find(p => p.id === intervention.playbookId) : null;

  const fmt  = (v) => v != null ? `${v.toFixed(1)}${metricCfg?.unit ?? ""}` : "\u2014";
  const sign = stats && stats.delta > 0 ? "+" : "";

  const assessmentText = basic ? null : {
    improving: `${metricCfg?.label} has improved from ${fmt(stats?.avgBefore)} to ${fmt(stats?.avgAfter)} over ${stats?.afterCount} sprint${stats?.afterCount !== 1 ? "s" : ""} since the intervention \u2014 a ${Math.abs(stats?.delta ?? 0).toFixed(0)}% improvement. Continue monitoring over the next 2 sprints to confirm the trend is sustained before closing this intervention.`,
    worsening: `${metricCfg?.label} has worsened from ${fmt(stats?.avgBefore)} to ${fmt(stats?.avgAfter)} over ${stats?.afterCount} sprint${stats?.afterCount !== 1 ? "s" : ""} since the intervention \u2014 a ${Math.abs(stats?.delta ?? 0).toFixed(0)}% decline. The coaching action has not yet produced the expected outcome. Consider revisiting the root cause or introducing additional support measures this sprint.`,
    neutral:   `${metricCfg?.label} has been broadly unchanged since the intervention (${fmt(stats?.avgBefore)} \u2192 ${fmt(stats?.avgAfter)}). It may be too early to draw conclusions \u2014 flow changes often take 2\u20133 sprints to materialise. Review again next sprint.`,
    unknown:   "There is not enough data to assess the impact of this intervention yet. At least one sprint of baseline data is needed before the intervention start sprint.",
  };

  return (
    <div className="p-5 overflow-y-auto h-full">
      <button onClick={onBack} className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-700 mb-4 transition-colors font-medium">
        ← Back to Interventions
      </button>

      <div className="mb-5">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#FFF4CC] flex items-center justify-center flex-shrink-0 mt-0.5">
            <IcoFlag size={18} className="text-amber-700" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-base font-semibold text-slate-800 leading-snug">{intervention.name}</h2>
            <div className="flex flex-wrap items-center gap-2 mt-1.5">
              <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium">{intervention.targetName}</span>
              <span className="text-xs bg-[#FFF4CC] text-amber-700 px-2 py-0.5 rounded-full font-medium">{metricCfg?.label}</span>
              <span className="text-xs text-slate-400">Started {intervention.startSprint}</span>
            </div>
          </div>
          <div className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-full border flex-shrink-0 ${cfg.bgCls} ${cfg.textCls} ${cfg.borderCls}`}>
            <StatusIcon size={11} />
            {cfg.label}
          </div>
        </div>
        {intervention.description && (
          <p className="text-sm text-slate-500 leading-relaxed mt-3 pl-[52px]">{intervention.description}</p>
        )}
      </div>

      {stats ? (
        <div className="grid grid-cols-3 gap-3 mb-4">
          {[
            { label: "Before", sub: `${stats.beforeCount} sprint${stats.beforeCount !== 1 ? "s" : ""} \u00B7 avg`, value: fmt(stats.avgBefore), color: "text-slate-700" },
            { label: "After intervention", sub: `${stats.afterCount} sprint${stats.afterCount !== 1 ? "s" : ""} \u00B7 avg`, value: fmt(stats.avgAfter), color: "text-amber-700" },
            { label: "Change", sub: metricCfg?.lowerIsBetter ? "lower is better" : "higher is better", value: `${sign}${stats.delta.toFixed(1)}%`, color: status === "improving" ? "text-emerald-600" : status === "worsening" ? "text-rose-600" : "text-slate-500" },
          ].map(({ label, sub, value, color }) => (
            <div key={label} className="bg-white rounded-xl border border-slate-200 px-4 py-3 shadow-sm">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">{label}</p>
              <p className={`text-2xl font-black leading-none ${color}`}>{value}</p>
              <p className="text-xs text-slate-400 mt-1.5">{sub}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-slate-50 rounded-xl border border-slate-200 px-4 py-6 text-center mb-4">
          <IcoActivity size={22} className="mx-auto mb-2 text-slate-300" />
          <p className="text-sm text-slate-500 font-medium">Not enough data yet</p>
          <p className="text-xs text-slate-400 mt-1">Baseline and post-intervention sprint data is still being collected</p>
        </div>
      )}

      {!basic && (chartData ? (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mb-4">
          <div className="px-4 pt-3 pb-1">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">{metricCfg?.label} — {intervention.targetName} · all sprints</p>
            <div className="flex items-center gap-5 mt-1.5 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <span className="inline-block w-3 h-3 rounded border border-slate-300 bg-slate-100" />
                Before intervention
              </span>
              <span className="flex items-center gap-1.5">
                <span className="inline-block w-3 h-3 rounded border border-[#FFE066] bg-[#FFF4CC]" />
                After intervention
              </span>
              <span className="flex items-center gap-1.5">
                <span className="inline-block w-4 border-t-2 border-dashed border-[#FFCC00]" />
                Intervention start
              </span>
            </div>
          </div>
          <div className="px-1 pb-3">
            <BeforeAfterChart
              chartData={chartData}
              startSprint={intervention.startSprint}
              unit={metricCfg?.unit ?? ""}
              metricLabel={metricCfg?.label ?? "Value"}
            />
          </div>
        </div>
      ) : (
        <div className="bg-slate-50 rounded-xl border border-slate-200 px-4 py-5 text-center mb-4">
          <p className="text-xs text-slate-400">No chart data available for this target and metric combination</p>
        </div>
      ))}

      {!basic && (
        <div className={`rounded-xl border px-4 py-3.5 ${cfg.bgCls} ${cfg.borderCls}`}>
          <p className={`text-xs font-semibold uppercase tracking-wide mb-1.5 ${cfg.textCls}`}>Coach Assessment</p>
          <p className="text-sm text-slate-700 leading-relaxed">{assessmentText[status]}</p>
        </div>
      )}

      {playbook && (
        <div className="mt-4 rounded-xl border border-amber-200 bg-[#FFF4CC]/60 px-4 py-3.5">
          <p className="text-xs font-semibold uppercase tracking-wide text-amber-700 mb-2">From Playbook</p>
          <div className="flex items-start gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${PLAYBOOK_CATEGORY_COLORS[playbook.categoryColor] || PLAYBOOK_CATEGORY_COLORS.rose}`}>
                  {playbook.category}
                </span>
                <h4 className="text-sm font-semibold text-slate-800">{playbook.title}</h4>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">{playbook.description}</p>
            </div>
            <button
              type="button"
              onClick={() => onViewPlaybook?.(playbook.id)}
              className="flex items-center gap-1.5 text-xs font-medium text-amber-700 hover:text-amber-800 bg-white/70 hover:bg-white px-3 py-2 rounded-lg border border-amber-200 transition-colors flex-shrink-0"
            >
              <IcoBook size={13} /> View playbook
            </button>
          </div>
        </div>
      )}

      <div className="mt-5">
        <div className="flex items-center gap-2 mb-4">
          <IcoActivity size={14} className="text-slate-600" />
          <h3 className="font-semibold text-slate-800">Coaching Notes</h3>
        </div>

        {notes.length === 0 ? (
          <p className="text-xs text-slate-400 mb-4 italic">No notes yet — use this space to log observations, decisions, and follow-ups.</p>
        ) : (
          <div className="space-y-3 mb-4">
            {notes.map(note => (
              <div key={note.id} className="flex gap-3 text-xs">
                <div className="w-2 h-2 rounded-full bg-slate-300 flex-shrink-0 mt-1.5" />
                <div className="flex-1">
                  <p className="text-slate-500 text-xs">{note.timestamp}</p>
                  <p className="text-slate-700 mt-1">{note.text}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
          <NotesInput onAdd={onAddNote} />
        </div>
      </div>
    </div>
  );
}
