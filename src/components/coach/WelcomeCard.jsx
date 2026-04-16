"use client";
import { IcoActivity, IcoTarget, IcoLayers, IcoFlag, IcoGrid, IcoZap } from "@/components/icons";

const CATEGORIES = [
  { icon: IcoActivity, label: "Health & Diagnostics", examples: ["Full health check", "Compare squads"], color: "bg-sky-50 text-sky-600 border-sky-200" },
  { icon: IcoTarget, label: "OKRs & Epics", examples: ["OKR status", "Epic portfolio status"], color: "bg-emerald-50 text-emerald-600 border-emerald-200" },
  { icon: IcoLayers, label: "Flow Metrics", examples: ["Flow time trend", "Flow efficiency"], color: "bg-amber-50 text-amber-600 border-amber-200" },
  { icon: IcoFlag, label: "Work & WIP", examples: ["WIP load", "Work type breakdown"], color: "bg-rose-50 text-rose-600 border-rose-200" },
  { icon: IcoGrid, label: "Coaching", examples: ["Give me coaching recs", "Ageing items"], color: "bg-violet-50 text-violet-600 border-violet-200" },
  { icon: IcoZap, label: "Planning & Simulation", examples: ["Plan next sprint", "What-if simulator"], color: "bg-[#FFF4CC] text-[#1a1a1a] border-[#FFE066]" },
];

export default function WelcomeCard({ onAsk, scopeName }) {
  return (
    <div className="mb-6">
      <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-5">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-9 h-9 rounded-xl bg-[#FFCC00] flex items-center justify-center shadow">
            <IcoZap size={16} className="text-[#1a1a1a]" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-neutral-800">Welcome to Agent Coach</h3>
            <p className="text-xs text-neutral-400 mt-0.5">AI-powered coaching for {scopeName}</p>
          </div>
        </div>

        <p className="text-xs text-neutral-500 mb-4">
          Diagnose delivery bottlenecks, track squad health across flow metrics,
          OKRs, and epics, then act on evidence-based recommendations from the Playbook.
          Use the What-If simulator to model changes before committing, and track
          intervention outcomes over time.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5">
          {CATEGORIES.map(({ icon: Icon, label, examples, color }) => (
            <div key={label} className={`rounded-xl border p-3 ${color}`}>
              <div className="flex items-center gap-2 mb-2">
                <Icon size={13} />
                <span className="text-xs font-semibold">{label}</span>
              </div>
              <div className="space-y-1">
                {examples.map(ex => (
                  <button key={ex} onClick={() => onAsk(ex)}
                    className="block text-xs opacity-80 hover:opacity-100 hover:underline transition-opacity text-left leading-snug">
                    &ldquo;{ex}&rdquo;
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
