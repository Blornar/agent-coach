"use client";
import { useState } from "react";
import { IcoFlag, IcoPlus } from "@/components/icons";
import { METRIC_OPTIONS } from "@/data/constants";
import { getChartData, computeBeforeAfter, intStatus } from "@/data/helpers";
import InterventionCard from "@/components/interventions/InterventionCard";
import InterventionDetail from "@/components/interventions/InterventionDetail";
import AddInterventionForm from "@/components/interventions/AddInterventionForm";

function InterventionsList({ interventions, onSelect, onAdd, onDelete }) {
  const improving = interventions.filter(i => {
    const cd = getChartData(i.targetId, i.metric);
    const mo = METRIC_OPTIONS.find(m => m.id === i.metric);
    const st = cd ? computeBeforeAfter(cd, i.startSprint) : null;
    return st ? intStatus(st.delta, mo?.lowerIsBetter) === "improving" : false;
  }).length;

  const worsening = interventions.filter(i => {
    const cd = getChartData(i.targetId, i.metric);
    const mo = METRIC_OPTIONS.find(m => m.id === i.metric);
    const st = cd ? computeBeforeAfter(cd, i.startSprint) : null;
    return st ? intStatus(st.delta, mo?.lowerIsBetter) === "worsening" : false;
  }).length;

  return (
    <div className="p-5 overflow-y-auto h-full">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-base font-semibold text-slate-800">Interventions</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {interventions.length} active
            {improving > 0 && <span className="text-emerald-600 font-medium"> · {improving} improving</span>}
            {worsening > 0 && <span className="text-rose-600 font-medium"> · {worsening} not working</span>}
          </p>
        </div>
        <button
          onClick={onAdd}
          className="flex items-center gap-1.5 text-sm font-medium bg-[#FFCC00] text-[#1a1a1a] px-3.5 py-2 rounded-lg hover:bg-[#e6b800] transition-colors shadow-sm flex-shrink-0"
        >
          <IcoPlus size={13} /> New Intervention
        </button>
      </div>

      {interventions.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-12 h-12 rounded-2xl bg-[#FFF4CC] flex items-center justify-center mx-auto mb-3">
            <IcoFlag size={22} className="text-[#FFCC00]" />
          </div>
          <p className="text-sm font-medium text-slate-500">No interventions yet</p>
          <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">Add an intervention to track whether your coaching actions are producing the expected metric improvements.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {interventions.map(i => (
            <InterventionCard key={i.id} intervention={i} onClick={() => onSelect(i)} onDelete={() => onDelete(i.id)} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function InterventionsTab({ interventions, onAddIntervention, onDeleteIntervention }) {
  const [view, setView] = useState("list");
  const [notesMap, setNotesMap] = useState({});
  const [selected, setSelected] = useState(null);

  const addNote = (interventionId, text) => {
    setNotesMap(prev => ({
      ...prev,
      [interventionId]: [...(prev[interventionId] || []), {
        id: Date.now(),
        text,
        timestamp: new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) + " \u00B7 " + new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })
      }]
    }));
  };

  const handleSave = (newInt) => {
    onAddIntervention(newInt);
    setView("list");
  };

  if (view === "detail" && selected) {
    return (
      <InterventionDetail
        intervention={selected}
        onBack={() => { setSelected(null); setView("list"); }}
        notes={notesMap[selected.id] || []}
        onAddNote={(text) => addNote(selected.id, text)}
      />
    );
  }
  if (view === "add") {
    return <AddInterventionForm onSave={handleSave} onCancel={() => setView("list")} />;
  }
  return (
    <InterventionsList
      interventions={interventions}
      onSelect={(i) => { setSelected(i); setView("detail"); }}
      onAdd={() => setView("add")}
      onDelete={onDeleteIntervention}
    />
  );
}
