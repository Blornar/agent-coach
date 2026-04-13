"use client";
import { useState } from "react";
import { IcoFlag, IcoWarn, IcoOk, IcoCheck, IcoX } from "@/components/icons";
import { ALL_TARGETS, METRIC_OPTIONS, SPRINT_LIST } from "@/data/constants";
import { getChartData } from "@/data/helpers";
import { useCoach } from "@/context/CoachContext";

export default function InlineInterventionForm({ playbook, targetId, onComplete, onCancel }) {
  const { addIntervention } = useCoach();

  const [form, setForm] = useState({
    targetId: targetId || "phoenix",
    metric: "flowTime",
    startSprint: SPRINT_LIST[SPRINT_LIST.length - 1],
    name: playbook?.title || "",
    description: playbook?.description || "",
  });
  const [saved, setSaved] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const canSave = form.name.trim().length > 0;
  const hasData = !!getChartData(form.targetId, form.metric);

  const handleSave = () => {
    if (!canSave) return;
    const target = ALL_TARGETS.find(t => t.id === form.targetId);
    const intervention = {
      id: `int-${Date.now()}`,
      name: form.name.trim(),
      description: form.description.trim(),
      targetId: form.targetId,
      targetName: target?.name ?? form.targetId,
      targetType: target?.type ?? "squad",
      startSprint: form.startSprint,
      metric: form.metric,
    };
    addIntervention(intervention);
    setSaved(true);
    onComplete?.(intervention);
  };

  if (saved) {
    return (
      <div className="mt-3 rounded-xl border-2 border-emerald-200 bg-emerald-50 p-4">
        <div className="flex items-center gap-2 mb-2">
          <IcoCheck size={14} className="text-emerald-600" />
          <p className="text-sm font-semibold text-emerald-700">Intervention Created</p>
        </div>
        <p className="text-xs text-emerald-800 leading-relaxed">
          "{form.name}" has been saved for {ALL_TARGETS.find(t => t.id === form.targetId)?.name || form.targetId}, tracking {METRIC_OPTIONS.find(m => m.id === form.metric)?.label || form.metric} from {form.startSprint}.
        </p>
        <p className="text-xs text-emerald-600 mt-2">
          I'll monitor this intervention and factor it into future analysis. You can view and manage it in the Interventions tab. Check back in 2 sprints and I'll tell you whether the metrics are responding.
        </p>
      </div>
    );
  }

  const labelCls = "block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide";
  const inputCls = "w-full text-sm text-slate-800 border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-[#FFCC00] focus:ring-2 focus:ring-[#FFF4CC] transition-all bg-white";

  return (
    <div className="mt-3 rounded-xl border-2 border-[#FFE066] bg-[#FFF9E0] p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#FFCC00] flex items-center justify-center flex-shrink-0">
            <IcoFlag size={14} className="text-[#1a1a1a]" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-800">Create Intervention</p>
            <p className="text-xs text-slate-500 mt-0.5">Customise and save to start tracking</p>
          </div>
        </div>
        {onCancel && (
          <button onClick={onCancel} className="text-slate-400 hover:text-slate-600 transition-colors">
            <IcoX size={14} />
          </button>
        )}
      </div>

      <div className="space-y-3">
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

        <div>
          <label className={labelCls}>Start sprint</label>
          <select value={form.startSprint} onChange={e => set("startSprint", e.target.value)} className={inputCls}>
            {SPRINT_LIST.slice(1).map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        {!hasData ? (
          <div className="flex items-start gap-2 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
            <IcoWarn size={13} className="flex-shrink-0 mt-0.5" />
            <span>No preset data for this combination — intervention will be saved but before/after chart won't render.</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2">
            <IcoOk size={13} className="flex-shrink-0" />
            <span>Data available — before/after analysis will render after saving.</span>
          </div>
        )}

        <div>
          <label className={labelCls}>Intervention name <span className="text-rose-400 normal-case tracking-normal">*</span></label>
          <input value={form.name} onChange={e => set("name", e.target.value)} className={inputCls} placeholder="e.g. WIP cap — limit active items to 6" />
        </div>

        <div>
          <label className={labelCls}>Description <span className="text-slate-300 normal-case font-normal tracking-normal">(optional)</span></label>
          <textarea value={form.description} onChange={e => set("description", e.target.value)} rows={3} className={`${inputCls} resize-none`} placeholder="Describe the coaching action..." />
        </div>

        <div className="flex gap-2 pt-1">
          <button onClick={handleSave} disabled={!canSave}
            className="flex items-center gap-1.5 text-sm font-medium bg-[#FFCC00] text-[#1a1a1a] px-4 py-2 rounded-lg hover:bg-[#e6b800] disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm">
            <IcoFlag size={13} /> Save Intervention
          </button>
          {onCancel && (
            <button onClick={onCancel} className="text-sm font-medium text-slate-500 px-4 py-2 rounded-lg hover:bg-white/50 transition-colors">
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
