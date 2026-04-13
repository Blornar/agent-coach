"use client";
import { useState } from "react";
import { IcoBot } from "@/components/icons";
import RecCard from "./RecCard";
import FlowTimeChart from "@/components/charts/FlowTimeChart";
import VelocityChart from "@/components/charts/VelocityChart";
import EfficiencyChart from "@/components/charts/EfficiencyChart";
import DistributionChart from "@/components/charts/DistributionChart";
import WIPChart from "@/components/charts/WIPChart";
import ScatterAgeChart from "@/components/charts/ScatterAgeChart";

const CHARTS = {
  flowTime: FlowTimeChart, velocity: VelocityChart, efficiency: EfficiencyChart,
  distribution: DistributionChart, wip: WIPChart, scatter: ScatterAgeChart,
};

/* lazy-loaded rich cards (avoid circular deps) */
let ComparisonCard, AlertCard, EntityCard, PlaybookRefCard, HealthCheckCard, SprintPlanCard;
try { ComparisonCard = require("./ComparisonCard").default; } catch {}
try { AlertCard = require("./AlertCard").default; } catch {}
try { EntityCard = require("./EntityCard").default; } catch {}
try { PlaybookRefCard = require("./PlaybookRefCard").default; } catch {}
try { HealthCheckCard = require("./HealthCheckCard").default; } catch {}
try { SprintPlanCard = require("./SprintPlanCard").default; } catch {}

function CopyButton({ msg }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    const parts = [];
    if (msg.text) parts.push(msg.text);
    if (msg.rec) parts.push(`[${msg.rec.priority}] ${msg.rec.title}\nEvidence: ${msg.rec.metric}\nRoot Cause: ${msg.rec.rootCause}\nAction: ${msg.rec.action}\nImpact: ${msg.rec.impact}`);
    navigator.clipboard.writeText(parts.join("\n\n")).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };
  return (
    <button onClick={handleCopy} className="opacity-0 group-hover:opacity-100 absolute -top-2 right-2 text-xs bg-white border border-slate-200 text-slate-400 hover:text-slate-600 px-2 py-0.5 rounded-md shadow-sm transition-all" title="Copy">
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}

export default function Bubble({ msg, selected, onSelect }) {
  if (msg.role === "user") return (
    <div className={`flex justify-end mb-5 ${selected ? "ring-2 ring-[#FFCC00] rounded-2xl" : ""}`} onClick={() => onSelect?.(msg.id)}>
      <div className="max-w-md bg-[#1a1a1a] text-white rounded-2xl rounded-tr-sm px-4 py-2.5 shadow-sm">
        <p className="text-sm leading-relaxed">{msg.text}</p>
      </div>
    </div>
  );

  const Chart = msg.chart ? CHARTS[msg.chart] : null;
  return (
    <div className={`flex gap-3 mb-5 group relative ${selected ? "ring-2 ring-[#FFCC00] rounded-2xl p-1" : ""}`} onClick={() => onSelect?.(msg.id)}>
      <div className="flex-shrink-0 w-7 h-7 rounded-full bg-[#FFCC00] flex items-center justify-center mt-0.5 shadow">
        <IcoBot size={14} className="text-[#1a1a1a]" />
      </div>
      <div className="flex-1 min-w-0">
        <CopyButton msg={msg} />
        {msg.text && (
          <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 border border-neutral-200 shadow-sm">
            <p className="text-sm text-neutral-800 leading-relaxed whitespace-pre-line">{msg.text}</p>
          </div>
        )}
        {msg.rec && <RecCard rec={msg.rec} />}
        {Chart && <Chart {...(msg.chartProps || {})} />}
        {msg.comparison && ComparisonCard && <ComparisonCard data={msg.comparison} />}
        {msg.alert && AlertCard && <AlertCard data={msg.alert} />}
        {msg.entityCard && EntityCard && <EntityCard data={msg.entityCard} />}
        {msg.playbookRef && PlaybookRefCard && <PlaybookRefCard data={msg.playbookRef} />}
        {msg.healthCheck && HealthCheckCard && <HealthCheckCard data={msg.healthCheck} />}
        {msg.sprintPlan && SprintPlanCard && <SprintPlanCard data={msg.sprintPlan} />}
      </div>
    </div>
  );
}
