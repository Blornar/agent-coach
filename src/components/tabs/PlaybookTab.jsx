"use client";
import { useState, useRef, useEffect } from "react";
import { IcoCheck, IcoBook } from "@/components/icons";
import { PLAYBOOK } from "@/data/constants";

const CATEGORY_METRIC = {
  "WIP Overload": "flowTime",
  "Blocked Items": "flowTime",
  "Slow Review Cycle": "velocity",
  "Low Velocity": "velocity",
  "High Bug Load": "efficiency",
  "Knowledge Silos": "efficiency",
};

export default function PlaybookTab({ onAddIntervention, selectedPlaybookId, onPlaybookHighlighted }) {
  const [clicked, setClicked] = useState({});
  const [highlightId, setHighlightId] = useState(null);
  const cardRefs = useRef({});

  useEffect(() => {
    if (!selectedPlaybookId) return;
    const el = cardRefs.current[selectedPlaybookId];
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    setHighlightId(selectedPlaybookId);
    const t1 = setTimeout(() => setHighlightId(null), 1800);
    const t2 = setTimeout(() => onPlaybookHighlighted?.(), 1900);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [selectedPlaybookId, onPlaybookHighlighted]);

  const handleUsePlaybook = (pb) => {
    const metric = CATEGORY_METRIC[pb.category] || "flowTime";
    onAddIntervention({
      id: `int-pb-${Date.now()}`,
      name: pb.title,
      description: pb.description,
      targetId: "phoenix",
      targetName: "Squad Phoenix",
      targetType: "squad",
      startSprint: "S21",
      metric,
      playbookId: pb.id,
    });
    setClicked(prev => ({ ...prev, [pb.id]: true }));
  };

  const categoryColors = {
    rose: "bg-rose-100 text-rose-700",
    amber: "bg-amber-100 text-amber-700",
    sky: "bg-sky-100 text-sky-700",
    violet: "bg-violet-100 text-violet-700",
  };

  return (
    <div className="p-5 overflow-y-auto h-full">
      <div className="mb-6">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-[#FFF4CC] flex items-center justify-center flex-shrink-0">
            <span className="text-lg">📖</span>
          </div>
          <div>
            <h2 className="text-base font-semibold text-neutral-800">Coaching Playbook</h2>
            <p className="text-xs text-neutral-400 mt-0.5">Proven interventions — select one to pre-fill a new intervention</p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 max-w-4xl">
        {PLAYBOOK.map(pb => (
          <div
            key={pb.id}
            ref={el => { if (el) cardRefs.current[pb.id] = el; }}
            className={`bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-md transition-shadow ${highlightId === pb.id ? "ring-2 ring-[#FFCC00] ring-offset-2" : ""}`}
          >
            <div className="p-5">
              <div className="flex items-start gap-3 mb-3">
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${categoryColors[pb.categoryColor] || categoryColors.rose}`}>
                  {pb.category}
                </span>
                <h3 className="font-semibold text-slate-800 flex-1">{pb.title}</h3>
              </div>

              <p className="text-sm text-slate-600 mb-4 leading-relaxed">{pb.description}</p>

              <div className="mb-4">
                <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2">Steps</p>
                <ol className="space-y-1 text-xs text-slate-600">
                  {pb.steps.map((step, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="font-bold text-slate-400 flex-shrink-0">{i+1}.</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="flex items-center gap-4 text-xs text-slate-500 pb-4 border-b border-slate-100 mb-4">
                <span>Success rate: <span className="font-bold text-slate-700">{pb.successRate}%</span></span>
                <span>·</span>
                <span>Used <span className="font-bold text-slate-700">{pb.usedCount}</span> times</span>
                <span>·</span>
                <span>Avg improvement: <span className="font-bold text-slate-700">{pb.avgImprovementSprints}</span> sprints</span>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex-1">
                  {clicked[pb.id] ? (
                    <div className="flex items-center gap-2 text-xs text-emerald-600 font-medium">
                      <IcoCheck size={13} /> Intervention created — view in Interventions tab
                    </div>
                  ) : (
                    <button
                      onClick={() => handleUsePlaybook(pb)}
                      className="w-full bg-[#FFCC00] text-[#1a1a1a] py-2 rounded-lg hover:bg-[#e6b800] transition-colors font-medium text-sm"
                    >
                      Use this playbook
                    </button>
                  )}
                </div>
                <a
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="flex items-center gap-1.5 text-xs font-medium text-amber-700 hover:text-amber-800 px-3 py-2 rounded-lg hover:bg-[#FFF4CC] transition-colors flex-shrink-0"
                >
                  <IcoBook size={13} /> View playbook
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
