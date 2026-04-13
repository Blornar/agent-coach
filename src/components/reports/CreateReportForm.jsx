"use client";
import { useState } from "react";
import { IcoClock, IcoMail, IcoActivity, IcoPlay } from "@/components/icons";
import { FREQ_OPTIONS, DAYS_OF_WEEK, REPORT_TIMES } from "@/data/constants";
import { fmtTime, scheduleLabel } from "@/data/helpers";
import ReportPreviewPanel from "./ReportPreviewPanel";

export default function CreateReportForm({ onSave, onCancel }) {
  const [form, setForm] = useState({
    name: "",
    prompt: "",
    frequency: "weekly",
    day: "Monday",
    time: "09:00",
    channel: "email",
    address: "ben@bclarke.co",
    webhookUrl: "",
  });
  const [preview, setPreview] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const canSave = form.name.trim() && form.prompt.trim() && (form.channel === "email" ? form.address.trim() : form.webhookUrl.trim());
  const needsDay = form.frequency === "weekly" || form.frequency === "biweekly";

  const handleSave = () => {
    if (!canSave) return;
    onSave({
      id: `sr-${Date.now()}`,
      name: form.name.trim(),
      prompt: form.prompt.trim(),
      schedule: { type: form.frequency, day: form.day, time: form.time },
      delivery: form.channel === "email"
        ? { channel: "email", address: form.address.trim() }
        : { channel: "teams", webhookUrl: form.webhookUrl.trim() },
      status: "active",
      lastSent: null,
      nextSend: "Next scheduled run",
    });
  };

  const labelCls = "block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide";
  const inputCls = "w-full text-sm text-slate-800 border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-[#FFCC00] focus:ring-2 focus:ring-[#FFF4CC] transition-all bg-white";

  const previewReport = {
    name: form.name || "Untitled",
    prompt: form.prompt || "Weekly summary",
    schedule: { type: form.frequency, day: form.day, time: form.time },
    delivery: form.channel === "email"
      ? { channel: "email", address: form.address || "you@example.com" }
      : { channel: "teams", webhookUrl: form.webhookUrl },
  };

  if (preview) {
    return (
      <div className="h-full flex flex-col">
        <div className="flex-1 overflow-y-auto">
          <ReportPreviewPanel report={previewReport} onBack={() => setPreview(false)} />
        </div>
      </div>
    );
  }

  return (
    <div className="p-5 overflow-y-auto h-full">
      <button onClick={onCancel} className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-700 mb-4 transition-colors font-medium">
        ← Back
      </button>

      <div className="flex items-center gap-3 mb-5">
        <div className="w-9 h-9 rounded-xl bg-[#FFF4CC] flex items-center justify-center flex-shrink-0">
          <IcoClock size={16} className="text-amber-700" />
        </div>
        <div>
          <h2 className="text-base font-semibold text-slate-800">New Scheduled Report</h2>
          <p className="text-xs text-slate-400 mt-0.5">Send an AI-generated report to email or Microsoft Teams on a schedule</p>
        </div>
      </div>

      <div className="space-y-5 max-w-xl">
        <div>
          <label className={labelCls}>Report name <span className="text-rose-400 normal-case font-normal tracking-normal">*</span></label>
          <input value={form.name} onChange={e => set("name", e.target.value)} placeholder="e.g. Weekly Phoenix Flow Summary" className={inputCls} />
        </div>

        <div>
          <label className={labelCls}>Prompt <span className="text-rose-400 normal-case font-normal tracking-normal">*</span></label>
          <textarea
            value={form.prompt}
            onChange={e => set("prompt", e.target.value)}
            rows={4}
            placeholder={`What should the coach report on?\n\nExamples:\n"Summarise Squad Phoenix's flow health and give me the top 3 coaching actions."\n"Flag any OKRs at risk of not being achieved this quarter."\n"Show me the epic portfolio status and forecast risk."`}
            className={`${inputCls} resize-none`}
          />
          <p className="text-xs text-slate-400 mt-1.5">The coach will run this prompt against live data at each scheduled interval and deliver the output.</p>
        </div>

        <div>
          <label className={labelCls}>Schedule</label>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs text-slate-400 mb-1.5">Frequency</p>
              <select value={form.frequency} onChange={e => set("frequency", e.target.value)} className={inputCls}>
                {FREQ_OPTIONS.map(f => <option key={f.id} value={f.id}>{f.label}</option>)}
              </select>
            </div>
            <div>
              <p className="text-xs text-slate-400 mb-1.5">Time</p>
              <select value={form.time} onChange={e => set("time", e.target.value)} className={inputCls}>
                {REPORT_TIMES.map(t => <option key={t} value={t}>{fmtTime(t)}</option>)}
              </select>
            </div>
          </div>
          {needsDay && (
            <div className="mt-3">
              <p className="text-xs text-slate-400 mb-1.5">Day of week</p>
              <div className="flex gap-2 flex-wrap">
                {DAYS_OF_WEEK.map(d => (
                  <button key={d} onClick={() => set("day", d)}
                    className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-colors ${form.day === d ? "bg-[#FFCC00] text-[#1a1a1a] border-[#FFCC00]" : "bg-white text-slate-500 border-slate-200 hover:border-[#FFE066]"}`}>
                    {d.slice(0, 3)}
                  </button>
                ))}
              </div>
            </div>
          )}
          <div className="mt-2.5 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-500 flex items-center gap-1.5">
            <IcoClock size={11} className="text-slate-400" />
            Will run: <span className="font-medium text-slate-700 ml-0.5">{scheduleLabel({ type: form.frequency, day: form.day, time: form.time })}</span>
          </div>
        </div>

        <div>
          <label className={labelCls}>Delivery channel</label>
          <div className="flex rounded-xl border border-slate-200 overflow-hidden mb-3 bg-slate-50">
            {[
              { id: "email", label: "Email",           Icon: IcoMail  },
              { id: "teams", label: "Microsoft Teams", Icon: IcoActivity },
            ].map(({ id, label, Icon }) => (
              <button key={id} onClick={() => set("channel", id)}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium transition-colors ${form.channel === id ? "bg-white text-amber-800 shadow-sm border border-slate-200 rounded-xl mx-1 my-1" : "text-slate-400 hover:text-slate-600"}`}>
                <Icon size={14} /> {label}
              </button>
            ))}
          </div>

          {form.channel === "email" ? (
            <div>
              <p className="text-xs text-slate-400 mb-1.5">Email address <span className="text-rose-400">*</span></p>
              <input value={form.address} onChange={e => set("address", e.target.value)} placeholder="you@company.com" type="email" className={inputCls} />
            </div>
          ) : (
            <div>
              <p className="text-xs text-slate-400 mb-1.5">Teams Incoming Webhook URL <span className="text-rose-400">*</span></p>
              <input value={form.webhookUrl} onChange={e => set("webhookUrl", e.target.value)} placeholder="https://outlook.office.com/webhook/..." className={inputCls} />
              <p className="text-xs text-slate-400 mt-1.5">Create an Incoming Webhook connector in your Teams channel and paste the URL here.</p>
            </div>
          )}
        </div>

        <div className="flex gap-2 pt-1">
          <button onClick={() => form.prompt.trim() && setPreview(true)} disabled={!form.prompt.trim()}
            className="flex items-center gap-1.5 text-sm font-medium bg-white border border-slate-200 text-slate-600 px-4 py-2 rounded-lg hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm">
            <IcoPlay size={13} /> Preview output
          </button>
          <button onClick={handleSave} disabled={!canSave}
            className="flex items-center gap-1.5 text-sm font-medium bg-[#FFCC00] text-[#1a1a1a] px-4 py-2 rounded-lg hover:bg-[#e6b800] disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm">
            <IcoClock size={13} /> Save & schedule
          </button>
          <button onClick={onCancel} className="text-sm font-medium text-slate-500 px-4 py-2 rounded-lg hover:bg-slate-100 transition-colors">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
