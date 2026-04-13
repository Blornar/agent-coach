"use client";
import { heatCell } from "@/data/helpers";
import { IcoTrendUp, IcoTrendDn, IcoMinus } from "@/components/icons";

function TrendIcon({ current, threshold, lowerIsBetter }) {
  if (lowerIsBetter) {
    if (current < threshold * 0.9) return <IcoTrendDn size={11} className="text-emerald-500" />;
    if (current > threshold * 1.1) return <IcoTrendUp size={11} className="text-rose-500" />;
  } else {
    if (current > threshold * 1.1) return <IcoTrendUp size={11} className="text-emerald-500" />;
    if (current < threshold * 0.9) return <IcoTrendDn size={11} className="text-rose-500" />;
  }
  return <IcoMinus size={11} className="text-slate-400" />;
}

function MetricTile({ label, value, unit, metric, heatArgs, threshold, lowerIsBetter }) {
  return (
    <div className={`rounded-lg p-3 text-center border ${heatCell(metric, ...heatArgs)} border-current border-opacity-20`}>
      <p className="text-xs text-slate-500 font-medium mb-1">{label}</p>
      <div className="flex items-center justify-center gap-1">
        <span className="text-lg font-bold">{value}{unit}</span>
        <TrendIcon current={value} threshold={threshold} lowerIsBetter={lowerIsBetter} />
      </div>
    </div>
  );
}

export default function HealthCheckCard({ data }) {
  if (!data?.squads?.length) return null;

  return (
    <div className="mt-3 rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-100">
        <p className="text-sm font-semibold text-slate-800">Health Check &mdash; {data.scopeName}</p>
      </div>
      {data.squads.map(h => (
        <div key={h.id} className="px-4 py-3 border-b border-slate-50 last:border-b-0">
          {data.squads.length > 1 && <p className="text-xs font-semibold text-slate-600 mb-2">{h.squad}</p>}
          <div className="grid grid-cols-5 gap-2 mb-2">
            <MetricTile label="Flow Time" value={h.flowTime} unit="d" metric="flowTime" heatArgs={[h.flowTime]} threshold={4} lowerIsBetter />
            <MetricTile label="Velocity" value={h.velocity} unit="" metric="velocity" heatArgs={[h.velocity]} threshold={17} lowerIsBetter={false} />
            <MetricTile label="Efficiency" value={h.efficiency} unit="%" metric="efficiency" heatArgs={[h.efficiency]} threshold={55} lowerIsBetter={false} />
            <MetricTile label="WIP" value={`${h.wip}/${h.wipLimit}`} unit="" metric="wip" heatArgs={[h.wip, h.wipLimit]} threshold={h.wipLimit} lowerIsBetter />
            <div className={`rounded-lg p-3 text-center border ${heatCell("health", h.health)} border-current border-opacity-20`}>
              <p className="text-xs text-slate-500 font-medium mb-1">Health</p>
              <div className="flex items-center justify-center gap-0.5">
                {Array(5).fill(0).map((_, i) => (
                  <span key={i} className="text-sm">{i < h.health ? "\u25CF" : "\u25CB"}</span>
                ))}
              </div>
            </div>
          </div>
          {h.healthNote && <p className="text-xs text-slate-500 leading-relaxed">{h.healthNote}</p>}
        </div>
      ))}
    </div>
  );
}
