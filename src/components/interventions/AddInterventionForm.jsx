"use client";
import { useState } from "react";
import { IcoFlag, IcoWarn, IcoOk } from "@/components/icons";
import { ALL_TARGETS, METRIC_OPTIONS, SPRINT_LIST } from "@/data/constants";
import { getChartData } from "@/data/helpers";

export default function AddInterventionForm({ onSave, onCancel }) {
  const [form, setForm] = useState({
    targetId: "phoenix",
    metric: "flowTime",
    startSprint: "S21",
    name: "",
    description: "",
  });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const canSave = form.name.trim().length > 0;

  const handleSave = () => {
    if (!canSave) return;
    const target = ALL_TARGETS.find(t => t.id === form.targetId);
    onSave({
      id: `int-${Date.now()}`,
      name: form.name.trim(),
      description: form.description.trim(),
      targetId: form.targetId,
      targetName: target?.name ?? form.targetId,
      targetType: target?.type ?? "squad",
      startSprint: form.startSprint,
      metric: form.metric,
    });
  };

  const labelCls = "block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide";
  const inputCls = "w-full text-sm text-slate-800 border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-[#FFCC00] focus:ring-2 focus:ring-[#FFF4CC] transition-all bg-white";

  const hasData = !!getChartData(form.targetId, form.metric);

  return (
    <div className="p-5 overflow-y-auto h-full">
      <button onClick={onCancel} className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-700 mb-4 transition-colors font-medium">
        ← Back
      </button>

      <div className="flex items-center gap-3 mb-5">
        <div className="w-9 h-9 rounded-xl bg-[#FFF4CC] flex items-center justify-center flex-shrink-0">
          <IcoFlag size={16} className="text-amber-700" />
        </div>
        <div>
          <h2 className="text-base font-semibold text-slate-800">New Intervention</h2>
          <p className="text-xs text-slate-400 mt-0.5">Track whether a coaching action is producing the expected impact</p>
        </div>
      </div>

      <div className="space-y-4 max-w-xl">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelCls}>Target</label>
            <select value={form.targetId} onChange={e => set("targetId", e.target.value)} className={inputCls}>
              {ALL_TARGETS.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls}>Metric to track</label>
            <select value={form.metric} onChange={e => set("metric", e.target.value)} className={inputCls}>
              {METRIC_OPTIONS.map(m => <option key={m.id} value={m.id}>{m.label}</option>)}
            </select>
          </div>
        </div>

        {!hasData ? (
          <div className="flex items-start gap-2 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2.5">
            <IcoWarn size={13} className="flex-shrink-0 mt-0.5" />
            <span>No preset data available for this combination — the intervention will be saved but the before/after analysis chart won't render until data is connected.</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2.5">
            <IcoOk size={13} className="flex-shrink-0" />
            <span>Data available — before/after analysis will render immediately after saving.</span>
          </div>
        )}

        <div>
          <label className={labelCls}>Intervention name <span className="text-rose-400 normal-case tracking-normal">*</span></label>
          <input
            value={form.name}
            onChange={e => set("name", e.target.value)}
            placeholder="e.g. WIP cap — limit active items to 6"
            className={inputCls}
          />
        </div>

        <div>
          <label className={labelCls}>Start sprint</label>
          <select value={form.startSprint} onChange={e => set("startSprint", e.target.value)} className={inputCls}>
            {SPRINT_LIST.slice(1).map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <p className="text-xs text-slate-400 mt-1.5">The sprint in which this coaching action was introduced. Sprints before this will form the baseline.</p>
        </div>

        <div>
          <label className={labelCls}>Description <span className="text-slate-300 normal-case font-normal tracking-normal">(optional)</span></label>
          <textarea
            value={form.description}
            onChange={e => set("description", e.target.value)}
            rows={3}
            placeholder="Describe the coaching action taken and what change it was intended to drive…"
            className={`${inputCls} resize-none`}
          />
        </div>

        <div className="flex gap-2 pt-1">
          <button
            onClick={handleSave}
            disabled={!canSave}
            className="flex items-center gap-1.5 text-sm font-medium bg-[#FFCC00] text-[#1a1a1a] px-4 py-2 rounded-lg hover:bg-[#e6b800] disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm"
          >
            <IcoFlag size={13} /> Save Intervention
          </button>
          <button
            onClick={onCancel}
            className="text-sm font-medium text-slate-500 px-4 py-2 rounded-lg hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
