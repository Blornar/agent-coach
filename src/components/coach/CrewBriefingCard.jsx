"use client";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from "recharts";
import { PieChart, Pie, Cell } from "recharts";
import { C } from "@/data/palette";
import { STATUS, tt } from "@/data/constants";

function MiniFlowTime({ data, narrative }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-3 overflow-hidden">
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Flow Time</p>
      <ResponsiveContainer width="100%" height={120}>
        <LineChart data={data} margin={{ top: 4, right: 10, bottom: 0, left: -20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis dataKey="sprint" tick={{ fontSize: 9, fill: "#94a3b8" }} />
          <YAxis tick={{ fontSize: 9, fill: "#94a3b8" }} unit="d" />
          <Tooltip contentStyle={tt} formatter={(v) => [`${v}d`]} />
          <ReferenceLine y={4} stroke={C.emerald} strokeDasharray="4 3" />
          <Line type="monotone" dataKey="median" stroke={C.navy} strokeWidth={2} dot={{ r: 2, fill: C.navy }} name="Median" />
          <Line type="monotone" dataKey="p85" stroke={C.coral} strokeWidth={1.5} dot={{ r: 2, fill: C.coral }} strokeDasharray="4 3" name="p85" />
        </LineChart>
      </ResponsiveContainer>
      <p className="text-xs text-slate-600 leading-relaxed mt-2">{narrative}</p>
    </div>
  );
}

function MiniVelocity({ data, narrative }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-3 overflow-hidden">
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Velocity</p>
      <ResponsiveContainer width="100%" height={120}>
        <BarChart data={data} margin={{ top: 4, right: 10, bottom: 0, left: -20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis dataKey="sprint" tick={{ fontSize: 9, fill: "#94a3b8" }} />
          <YAxis tick={{ fontSize: 9, fill: "#94a3b8" }} />
          <Tooltip contentStyle={tt} />
          <Legend wrapperStyle={{ fontSize: 9, paddingTop: 2 }} />
          <Bar dataKey="Phoenix" fill={C.coral} radius={[3, 3, 0, 0]} />
          <Bar dataKey="Orion" fill={C.navy} radius={[3, 3, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
      <p className="text-xs text-slate-600 leading-relaxed mt-2">{narrative}</p>
    </div>
  );
}

function MiniDistribution({ data, narrative }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-3 overflow-hidden">
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Unplanned Work</p>
      <div className="flex items-center gap-2">
        <ResponsiveContainer width={100} height={100}>
          <PieChart>
            <Pie data={data} cx="50%" cy="50%" innerRadius={28} outerRadius={44} dataKey="value" paddingAngle={2} stroke="none">
              {data.map((d) => <Cell key={d.name} fill={d.color} />)}
            </Pie>
            <Tooltip contentStyle={tt} formatter={(v) => [`${v}%`]} />
          </PieChart>
        </ResponsiveContainer>
        <div className="flex-1 space-y-1">
          {data.map((d) => (
            <div key={d.name} className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: d.color }} />
              <span className="text-xs text-slate-500 flex-1">{d.name}</span>
              <span className="text-xs font-bold" style={{ color: d.color }}>{d.value}%</span>
            </div>
          ))}
        </div>
      </div>
      <p className="text-xs text-slate-600 leading-relaxed mt-2">{narrative}</p>
    </div>
  );
}

function MiniEpics({ epics, narrative }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-3 overflow-hidden">
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Epic Delivery</p>
      <div className="space-y-2">
        {epics.map(e => {
          const st = STATUS[e.status] || STATUS["on-track"];
          return (
            <div key={e.id} className="flex items-center gap-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="text-xs font-medium text-slate-700 truncate">{e.id}</span>
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${st.badge}`}>{st.label}</span>
                </div>
                <p className="text-xs text-slate-400 truncate">{e.name}</p>
              </div>
              <div className="w-20 flex-shrink-0">
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${st.bar}`} style={{ width: `${e.pct}%` }} />
                </div>
                <p className="text-xs text-slate-400 text-right mt-0.5">{e.pct}%</p>
              </div>
            </div>
          );
        })}
      </div>
      <p className="text-xs text-slate-600 leading-relaxed mt-2">{narrative}</p>
    </div>
  );
}

export default function CrewBriefingCard({ data }) {
  if (!data) return null;
  const { flowTime, velocity, distribution, epics, summary } = data;

  return (
    <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 shadow-sm overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-200 bg-white">
        <p className="text-sm font-semibold text-slate-800">Crew Briefing &mdash; {data.crewName || "Checkout Crew"}</p>
        <p className="text-xs text-slate-400 mt-0.5">Key metrics across all dimensions</p>
      </div>
      <div className="p-3 grid grid-cols-2 gap-3">
        <MiniFlowTime data={flowTime.data} narrative={flowTime.narrative} />
        <MiniVelocity data={velocity.data} narrative={velocity.narrative} />
        <MiniDistribution data={distribution.data} narrative={distribution.narrative} />
        <MiniEpics epics={epics.data} narrative={epics.narrative} />
      </div>
      {summary && (
        <div className="px-4 py-3 border-t border-slate-200 bg-white">
          <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">{summary}</p>
        </div>
      )}
    </div>
  );
}
