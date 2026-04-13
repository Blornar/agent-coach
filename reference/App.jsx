import { useState, useRef, useEffect } from "react";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, ReferenceLine, ReferenceArea,
} from "recharts";

// ─── SVG ICONS ────────────────────────────────────────────────────────────────
const Svg = ({ size = 16, className = "", style = {}, children }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
    className={className} style={{ display: "inline-block", flexShrink: 0, ...style }}>
    {children}
  </svg>
);
const IcoChat      = (p) => <Svg {...p}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></Svg>;
const IcoTarget    = (p) => <Svg {...p}><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></Svg>;
const IcoLayers    = (p) => <Svg {...p}><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></Svg>;
const IcoGit       = (p) => <Svg {...p}><circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><path d="M6 21V9a9 9 0 0 0 9 9"/></Svg>;
const IcoSend      = (p) => <Svg {...p}><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></Svg>;
const IcoCheck     = (p) => <Svg {...p}><polyline points="20 6 9 17 4 12"/></Svg>;
const IcoX         = (p) => <Svg {...p}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></Svg>;
const IcoWarn      = (p) => <Svg {...p}><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></Svg>;
const IcoZap       = (p) => <Svg {...p}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></Svg>;
const IcoActivity  = (p) => <Svg {...p}><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></Svg>;
const IcoDown      = (p) => <Svg {...p}><polyline points="6 9 12 15 18 9"/></Svg>;
const IcoRight     = (p) => <Svg {...p}><polyline points="9 18 15 12 9 6"/></Svg>;
const IcoBot       = (p) => <Svg {...p}><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/><line x1="12" y1="7" x2="12" y2="11"/><line x1="8" y1="15" x2="8.01" y2="15"/><line x1="16" y1="15" x2="16.01" y2="15"/></Svg>;
const IcoStar      = (p) => <Svg {...p}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></Svg>;
const IcoOk        = (p) => <Svg {...p}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></Svg>;
const IcoUsers     = (p) => <Svg {...p}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></Svg>;
const IcoFlag      = (p) => <Svg {...p}><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></Svg>;
const IcoPlus      = (p) => <Svg {...p}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></Svg>;
const IcoTrendUp   = (p) => <Svg {...p}><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></Svg>;
const IcoTrendDn   = (p) => <Svg {...p}><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/></Svg>;
const IcoMinus     = (p) => <Svg {...p}><line x1="5" y1="12" x2="19" y2="12"/></Svg>;
const IcoMail      = (p) => <Svg {...p}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></Svg>;
const IcoClock     = (p) => <Svg {...p}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></Svg>;
const IcoPlay      = (p) => <Svg {...p}><polygon points="5 3 19 12 5 21 5 3"/></Svg>;
const IcoPause     = (p) => <Svg {...p}><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></Svg>;
const IcoTrash     = (p) => <Svg {...p}><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></Svg>;
const IcoBell      = (p) => <Svg {...p}><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></Svg>;
const IcoBook      = (p) => <Svg {...p}><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></Svg>;
const IcoGrid      = (p) => <Svg {...p}><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></Svg>;
const IcoSliders   = (p) => <Svg {...p}><line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/></Svg>;

// ─── PALETTE ─────────────────────────────────────────────────────────────────
const C = {
  indigo: "#6366f1", rose: "#f43f5e", amber: "#f59e0b",
  emerald: "#10b981", violet: "#8b5cf6", sky: "#0ea5e9",
};

// ─── MOCK DATA ────────────────────────────────────────────────────────────────
const ORG = {
  name: "Payments Platform",
  crews: [
    { id: "checkout", name: "Checkout Crew", squads: [{ id: "phoenix", name: "Squad Phoenix" }, { id: "orion", name: "Squad Orion" }] },
    { id: "wallet",   name: "Wallet Crew",   squads: [{ id: "nexus",   name: "Squad Nexus"   }, { id: "atlas",  name: "Squad Atlas"  }] },
  ],
};

const FLOW_TIME_DATA = [
  { sprint: "S18", median: 3.2, p85: 6.1  },
  { sprint: "S19", median: 3.5, p85: 6.8  },
  { sprint: "S20", median: 4.1, p85: 8.2  },
  { sprint: "S21", median: 5.2, p85: 9.8  },
  { sprint: "S22", median: 5.8, p85: 11.2 },
  { sprint: "S23", median: 6.4, p85: 12.1 },
];
const VELOCITY_DATA = [
  { sprint: "S20", Phoenix: 18, Orion: 22 },
  { sprint: "S21", Phoenix: 15, Orion: 20 },
  { sprint: "S22", Phoenix: 12, Orion: 19 },
  { sprint: "S23", Phoenix: 10, Orion: 21 },
];
const EFFICIENCY_DATA = [
  { sprint: "S18", efficiency: 68 },
  { sprint: "S19", efficiency: 65 },
  { sprint: "S20", efficiency: 58 },
  { sprint: "S21", efficiency: 47 },
  { sprint: "S22", efficiency: 38 },
  { sprint: "S23", efficiency: 31 },
];
const DISTRIBUTION_DATA = [
  { name: "Features",  value: 32, color: C.indigo  },
  { name: "Bugs",      value: 41, color: C.amber   },
  { name: "Tech Debt", value: 18, color: C.violet  },
  { name: "Risk",      value:  9, color: C.rose    },
];
const SCATTER_YOUNG = [
  { age: 2, stage: 1, id: "PAY-301" }, { age: 3, stage: 2, id: "PAY-289" },
  { age: 5, stage: 1, id: "PAY-312" }, { age: 7, stage: 2, id: "PAY-298" },
  { age: 12, stage: 3, id: "PAY-274" },
];
const SCATTER_OLD = [
  { age: 15, stage: 2, id: "PAY-261" },
  { age: 21, stage: 1, id: "PAY-243" },
  { age: 28, stage: 2, id: "PAY-230" },
];
const OKRS = [
  {
    id: "okr1", confidence: "medium",
    objective: "Improve checkout conversion by 15%", owner: "Checkout Crew",
    keyResults: [
      { id: "kr1", text: "Reduce payment failure rate from 3.2% to 1.5%", progress: 34, confidence: "low",    epics: ["PAY-E001"] },
      { id: "kr2", text: "Reduce checkout abandonment by 20%",             progress: 12, confidence: "low",    epics: ["PAY-E003"] },
      { id: "kr3", text: "Ship one-click checkout for returning users",     progress: 72, confidence: "high",   epics: ["PAY-E002"] },
    ],
  },
  {
    id: "okr2", confidence: "high",
    objective: "Achieve 99.9% wallet transaction reliability", owner: "Wallet Crew",
    keyResults: [
      { id: "kr4", text: "Reduce wallet transaction failures to < 0.05%", progress: 78, confidence: "high",   epics: ["WAL-E004"] },
      { id: "kr5", text: "Ship real-time transaction status API",          progress: 55, confidence: "medium", epics: ["WAL-E005"] },
    ],
  },
];
const EPICS = [
  { id: "PAY-E001", name: "Payment Failure Remediation", squad: "Squad Phoenix", target: "Mar 31", p70: "Apr 14", status: "at-risk",  pct: 34, okr: "KR1" },
  { id: "PAY-E002", name: "One-Click Checkout",          squad: "Squad Orion",   target: "Mar 31", p70: "Mar 28", status: "on-track", pct: 72, okr: "KR3" },
  { id: "PAY-E003", name: "Abandonment Analytics",       squad: "Squad Phoenix", target: "Apr 30", p70: "May 10", status: "at-risk",  pct: 12, okr: "KR2" },
  { id: "WAL-E004", name: "Transaction Reliability",     squad: "Squad Nexus",   target: "Apr 15", p70: "Apr 12", status: "on-track", pct: 78, okr: "KR4" },
  { id: "WAL-E005", name: "Real-time Status API",        squad: "Squad Atlas",   target: "Apr 30", p70: "Apr 28", status: "on-track", pct: 55, okr: "KR5" },
];
const JIRA_ACTIONS = [
  { id: "ja1", icon: "🏃", type: "Sprint move", risk: "low",    status: "pending", description: "Move 3 items to Sprint 24 to reduce WIP overload",          issues: ["PAY-318", "PAY-319", "PAY-321"], reason: "Squad Phoenix is carrying 9 active items against a WIP limit of 6. Moving lower-priority items reduces load and is expected to improve Flow Efficiency within 2 sprints." },
  { id: "ja2", icon: "🏷️", type: "Add label",   risk: "low",    status: "pending", description: "Add 'blocked' label to 2 ageing items",                      issues: ["PAY-298", "PAY-230"],             reason: "These items have been in active WIP states for 28 and 21 days respectively without a status change, suggesting they are blocked without being flagged." },
  { id: "ja3", icon: "⬆️", type: "Priority",    risk: "medium", status: "pending", description: "Update PAY-E001 epic priority from Medium to High",          issues: ["PAY-E001"],                       reason: "PAY-E001 is linked to a Low-confidence Key Result. Elevating its priority increases visibility and helps ensure it receives appropriate resourcing this sprint." },
  { id: "ja4", icon: "📋", type: "Sprint plan", risk: "medium", status: "pending", description: "Propose sprint backlog trimmed to 6 items aligned with WIP limit", issues: ["PAY-289", "PAY-274", "PAY-301", "PAY-312", "PAY-298", "PAY-318"], reason: "Current sprint has 9 items against a WIP limit of 6. I've identified the 6 highest-value items by OKR contribution and current progress. The remaining 3 (PAY-319, PAY-321, PAY-315) are proposed for Sprint 24. Accepting this will update sprint assignments in Jira." },
  { id: "ja5", icon: "🔃", type: "Backlog order", risk: "low", status: "pending", description: "Reorder PAY-E001 sub-tasks by dependency to unblock parallel progress", issues: ["PAY-E001"], reason: "Current task order in PAY-E001 has dependent tasks blocking parallel work. Reordering to surface independent tasks will allow 2 developers to work simultaneously and improve the epic's P70 forecast by approximately 5 days." },
];
// ─── ALERTS DATA ──────────────────────────────────────────────────────────────
const ALERTS_DATA = [
  { id: "al1", severity: "critical", squad: "Squad Phoenix", metric: "Flow Efficiency", message: "Dropped below 30% for a second consecutive sprint — immediate intervention recommended", time: "2h ago", read: false },
  { id: "al2", severity: "warning",  squad: "Squad Phoenix", metric: "WIP Load",        message: "9 items active vs. limit of 6 — WIP has exceeded limit for 3 consecutive sprints", time: "1d ago", read: false },
  { id: "al3", severity: "info",     squad: "Squad Orion",   metric: "Velocity",        message: "Velocity improved 14% since pair programming intervention started in S21", time: "2d ago", read: true },
  { id: "al4", severity: "warning",  squad: "Squad Atlas",   metric: "Velocity",        message: "Velocity at 14 items — below crew average of 17.5. New joiner ramp-up may be a factor", time: "3d ago", read: true },
];

// ─── SQUAD HEALTH DATA ────────────────────────────────────────────────────────
const SQUAD_HEALTH = [
  { id: "phoenix", squad: "Squad Phoenix", crew: "Checkout Crew", flowTime: 6.4, velocity: 10, efficiency: 31, wip: 9, wipLimit: 6, health: 2, healthNote: "Team reported feeling overwhelmed in last retro. Three members flagged unclear priorities." },
  { id: "orion",   squad: "Squad Orion",   crew: "Checkout Crew", flowTime: 3.1, velocity: 21, efficiency: 62, wip: 5, wipLimit: 6, health: 4, healthNote: "Good momentum since pair programming. Team confident about sprint goal." },
  { id: "nexus",   squad: "Squad Nexus",   crew: "Wallet Crew",   flowTime: 4.2, velocity: 16, efficiency: 54, wip: 6, wipLimit: 7, health: 4, healthNote: "Solid delivery culture. Minor dependency risk on Atlas for WAL-E005." },
  { id: "atlas",   squad: "Squad Atlas",   crew: "Wallet Crew",   flowTime: 3.8, velocity: 14, efficiency: 58, wip: 5, wipLimit: 6, health: 3, healthNote: "Two new joiners in ramp-up. Velocity suppressed but improving." },
];

// ─── COACHING PLAYBOOK DATA ──────────────────────────────────────────────────
const PLAYBOOK = [
  { id: "pb1", category: "WIP Overload", categoryColor: "rose", title: "Hard WIP Cap with Completion Gate", description: "Introduce a rule that no new work can be pulled into active until an existing item is completed. Hard WIP caps address the root cause of flow time inflation.", steps: ["Agree a WIP limit with the squad (typically team size ÷ 2, rounded up)", "Configure Jira column constraints to enforce the limit", "In the next sprint planning, remove items until below the cap", "Review the limit every 2 sprints and adjust based on flow time trend"], successRate: 78, usedCount: 12, avgImprovementSprints: 2 },
  { id: "pb2", category: "Slow Review Cycle", categoryColor: "amber", title: "Review Rotation with Daily Slot", description: "Assign a daily 30-minute review rotation slot to ensure items don't sit waiting. This breaks the batch review pattern that inflates flow time.", steps: ["Identify the number of daily review slots needed (items in review ÷ 2)", "Assign team members to a weekly review rotation", "Create a calendar event — 30 min per day per reviewer", "Track items in review > 2 days as a standup blocker"], successRate: 71, usedCount: 8, avgImprovementSprints: 3 },
  { id: "pb3", category: "High Bug Load", categoryColor: "amber", title: "Bug Reduction Sprint", description: "Dedicate a full sprint to root-cause fixing of the top bug drivers. Trading short-term velocity for long-term flow health.", steps: ["Run a bug taxonomy session — categorise by root cause not symptom", "Identify the top 3 root causes generating 80% of bugs", "Dedicate 1 sprint to fixing root causes (not symptoms)", "Define a bug threshold (e.g. max 20% of flow distribution) and monitor weekly"], successRate: 65, usedCount: 5, avgImprovementSprints: 4 },
  { id: "pb4", category: "Blocked Items", categoryColor: "rose", title: "Daily Blocker Escalation Ritual", description: "Add a specific blocker escalation ritual to the daily standup. Aged items are the most visible symptom of unresolved blockers.", steps: ["Add 'blocked items' as a standing standup agenda item", "Any item > 5 days without a status change is automatically raised", "Assign an owner to resolve each blocker within 24 hours", "Escalate unresolved blockers to the Engineering Manager after 48 hours"], successRate: 84, usedCount: 15, avgImprovementSprints: 1 },
  { id: "pb5", category: "Low Velocity", categoryColor: "sky", title: "Single Sprint Goal Focus", description: "Replace multi-theme sprints with a single shared sprint goal. Squads with multiple competing priorities consistently deliver less overall.", steps: ["Define one sprint goal the whole squad can articulate in one sentence", "Reject sprint backlog items that don't contribute to the goal", "Use the goal as the acceptance criterion at sprint review", "Track goal attainment rate over 3 sprints and adjust scope discipline"], successRate: 69, usedCount: 7, avgImprovementSprints: 2 },
  { id: "pb6", category: "Knowledge Silos", categoryColor: "violet", title: "Cross-training Pairing Programme", description: "Structured pairing rotations to distribute knowledge and reduce single points of failure that slow reviews and create bottlenecks.", steps: ["Map knowledge domains and identify who can review what", "Create a pairing schedule: pair with someone outside your domain once per sprint", "Track review coverage (% of items any team member can review)", "Aim for 80% cross-coverage within 4 sprints"], successRate: 72, usedCount: 9, avgImprovementSprints: 3 },
];

// Heat map cell colour function
function heatCell(metric, value, wipLimit) {
  if (metric === "flowTime")   return value <= 4 ? "bg-emerald-50 text-emerald-700" : value <= 7 ? "bg-amber-50 text-amber-700" : "bg-rose-50 text-rose-700";
  if (metric === "velocity")   return value >= 18 ? "bg-emerald-50 text-emerald-700" : value >= 12 ? "bg-amber-50 text-amber-700" : "bg-rose-50 text-rose-700";
  if (metric === "efficiency") return value >= 55 ? "bg-emerald-50 text-emerald-700" : value >= 35 ? "bg-amber-50 text-amber-700" : "bg-rose-50 text-rose-700";
  if (metric === "wip")        return value <= wipLimit ? "bg-emerald-50 text-emerald-700" : value <= wipLimit+1 ? "bg-amber-50 text-amber-700" : "bg-rose-50 text-rose-700";
  if (metric === "health")     return value >= 4 ? "bg-emerald-50 text-emerald-700" : value >= 3 ? "bg-amber-50 text-amber-700" : "bg-rose-50 text-rose-700";
  return "bg-slate-50 text-slate-600";
}


// ─── INTERVENTIONS DATA ───────────────────────────────────────────────────────
// Separate time-series for Squad Orion velocity — shows improvement post-intervention
const ORION_VELOCITY_SERIES = [
  { sprint: "S18", value: 18 },
  { sprint: "S19", value: 20 },
  { sprint: "S20", value: 19 },
  { sprint: "S21", value: 21 },
  { sprint: "S22", value: 23 },
  { sprint: "S23", value: 24 },
];

const SPRINT_LIST = ["S18", "S19", "S20", "S21", "S22", "S23"];

const ALL_TARGETS = [
  { id: "phoenix",  name: "Squad Phoenix",  type: "squad" },
  { id: "orion",    name: "Squad Orion",    type: "squad" },
  { id: "nexus",    name: "Squad Nexus",    type: "squad" },
  { id: "atlas",    name: "Squad Atlas",    type: "squad" },
  { id: "checkout", name: "Checkout Crew",  type: "crew"  },
  { id: "wallet",   name: "Wallet Crew",    type: "crew"  },
];

const METRIC_OPTIONS = [
  { id: "flowTime",   label: "Flow Time",       unit: "d",      lowerIsBetter: true  },
  { id: "velocity",   label: "Velocity",        unit: " items", lowerIsBetter: false },
  { id: "efficiency", label: "Flow Efficiency", unit: "%",      lowerIsBetter: false },
];

// Returns a {sprint, value} series for a given target + metric combo
function getChartData(targetId, metricId) {
  if (metricId === "flowTime"   && targetId === "phoenix")  return FLOW_TIME_DATA.map(d => ({ sprint: d.sprint, value: d.median }));
  if (metricId === "velocity"   && targetId === "orion")    return ORION_VELOCITY_SERIES;
  if (metricId === "efficiency" && targetId === "phoenix")  return EFFICIENCY_DATA.map(d => ({ sprint: d.sprint, value: d.efficiency }));
  return null; // no preset data for other combinations
}

function computeBeforeAfter(chartData, startSprint) {
  const idx = chartData.findIndex(d => d.sprint === startSprint);
  if (idx <= 0) return null; // need at least one "before" point
  const bv = chartData.slice(0, idx).map(d => d.value);
  const av = chartData.slice(idx).map(d => d.value);
  if (!bv.length || !av.length) return null;
  const avgBefore = bv.reduce((a, b) => a + b, 0) / bv.length;
  const avgAfter  = av.reduce((a, b) => a + b, 0) / av.length;
  const delta     = ((avgAfter - avgBefore) / avgBefore) * 100;
  return { avgBefore, avgAfter, delta, beforeCount: bv.length, afterCount: av.length };
}

function intStatus(delta, lowerIsBetter) {
  if (delta == null) return "unknown";
  const improving = lowerIsBetter ? delta < -5  : delta > 5;
  const worsening = lowerIsBetter ? delta > 5   : delta < -5;
  return improving ? "improving" : worsening ? "worsening" : "neutral";
}

const INTERVENTIONS_SEED = [
  {
    id: "int1",
    name: "WIP cap — hard limit at 6 active items",
    targetId: "phoenix", targetName: "Squad Phoenix", targetType: "squad",
    startSprint: "S21", metric: "flowTime",
    description: "Agreed with Squad Phoenix to enforce a hard WIP cap of 6 items in the active Jira column. Any item pulled from the backlog requires a corresponding completion first. Implemented via Jira column constraints and reinforced in sprint planning.",
  },
  {
    id: "int2",
    name: "Pair programming rotation — 2 reviewers per item",
    targetId: "orion", targetName: "Squad Orion", targetType: "squad",
    startSprint: "S21", metric: "velocity",
    description: "Introduced a structured pair-programming rotation for Squad Orion to reduce review wait times and knowledge silos. Each item in review must have two reviewers assigned before it can merge, reducing back-and-forth rework cycles.",
  },
];

// ─── SCHEDULED REPORTS DATA ──────────────────────────────────────────────────
const FREQ_OPTIONS = [
  { id: "daily",    label: "Daily"     },
  { id: "weekly",   label: "Weekly"    },
  { id: "biweekly", label: "Bi-weekly" },
  { id: "monthly",  label: "Monthly"   },
];

const DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

const REPORT_TIMES = [
  "07:00", "08:00", "09:00", "10:00", "11:00", "12:00",
  "13:00", "14:00", "15:00", "16:00", "17:00", "18:00",
];

function fmtTime(t = "09:00") {
  const [h] = t.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const h12  = h > 12 ? h - 12 : h === 0 ? 12 : h;
  return `${h12}:00 ${ampm}`;
}

function scheduleLabel(s) {
  const t = fmtTime(s.time);
  if (s.type === "daily")    return `Daily · ${t}`;
  if (s.type === "weekly")   return `Weekly · ${s.day} · ${t}`;
  if (s.type === "biweekly") return `Bi-weekly · ${s.day} · ${t}`;
  if (s.type === "monthly")  return `Monthly · ${t}`;
  return t;
}

// Generates a realistic report payload based on prompt keywords
function generateReportOutput(prompt) {
  const p = prompt.toLowerCase();

  if (p.includes("flow") || p.includes("phoenix") || p.includes("wip") || p.includes("efficiency")) {
    return {
      title: "Flow Health Report — Squad Phoenix",
      sections: [
        {
          heading: "Critical Issues",
          style: "danger",
          items: [
            "Flow Time: 6.4d median — doubled over 6 sprints (baseline 3.2d in S18)",
            "WIP Overload: 9 items active vs. configured limit of 6 — 50% over capacity",
            "Flow Efficiency: 31% — crew median is 55%, diverging further each sprint",
          ],
        },
        {
          heading: "Top Coaching Recommendations",
          style: "action",
          items: [
            "Cap WIP at 6 items immediately — agree with squad in next standup",
            "Assign a dedicated review rotation: max 3 items in review at once",
            "Flag PAY-243 (21d) and PAY-230 (28d) as blocked — two Jira actions awaiting approval",
          ],
        },
        {
          heading: "Key Metrics Snapshot",
          style: "neutral",
          items: [
            "Flow Time: 6.4d ▲ (was 3.2d · +100%)",
            "Flow Efficiency: 31% ▼ (crew avg 55%)",
            "Velocity: 10 items ▼ (was 18 · −44%)",
            "WIP Load: 9 items ⚠ (limit 6)",
          ],
        },
        {
          heading: "OKR Impact",
          style: "warning",
          items: [
            "KR1 (Reduce payment failures): Low confidence — depends on Phoenix delivery",
            "KR2 (Reduce abandonment): Low confidence — epic only 12% complete",
          ],
        },
      ],
    };
  }

  if (p.includes("okr") || p.includes("key result") || p.includes("objective") || p.includes("confidence")) {
    return {
      title: "OKR Confidence Report — Payments Platform",
      sections: [
        {
          heading: "Checkout Crew — Medium Confidence",
          style: "warning",
          items: [
            "KR1 Reduce payment failure rate: 34% progress · Low confidence",
            "KR2 Reduce checkout abandonment: 12% progress · Low confidence",
            "KR3 One-click checkout for returning users: 72% progress · High confidence ✓",
          ],
        },
        {
          heading: "Wallet Crew — High Confidence",
          style: "success",
          items: [
            "KR4 Transaction reliability < 0.05%: 78% progress · High confidence ✓",
            "KR5 Real-time transaction status API: 55% progress · Medium confidence",
          ],
        },
        {
          heading: "Recommended Actions",
          style: "action",
          items: [
            "Escalate PAY-E001 — primary blocker for KR1 which is Low confidence",
            "Review KR2 target with Checkout Crew — Squad Phoenix flow health makes Q2 delivery unlikely without intervention",
            "Wallet Crew OKRs on track — no action required this week",
          ],
        },
      ],
    };
  }

  if (p.includes("portfolio") || p.includes("epic") || p.includes("forecast") || p.includes("delivery")) {
    return {
      title: "Epic Portfolio Report — Payments Platform",
      sections: [
        {
          heading: "At Risk — 2 epics",
          style: "danger",
          items: [
            "PAY-E001 Payment Failure Remediation: 34% · P70 Apr 14 (target Mar 31 · 14d late) · Squad Phoenix",
            "PAY-E003 Abandonment Analytics: 12% · P70 May 10 (target Apr 30 · 10d late) · Squad Phoenix",
          ],
        },
        {
          heading: "On Track — 3 epics",
          style: "success",
          items: [
            "PAY-E002 One-Click Checkout: 72% · P70 Mar 28 · Squad Orion ✓",
            "WAL-E004 Transaction Reliability: 78% · P70 Apr 12 · Squad Nexus ✓",
            "WAL-E005 Real-time Status API: 55% · P70 Apr 28 · Squad Atlas ✓",
          ],
        },
        {
          heading: "Recommended Actions",
          style: "action",
          items: [
            "Escalate PAY-E001 — 14 days behind P70, blocking KR1 OKR target",
            "Review Squad Phoenix WIP and sprint scope to improve PAY-E003 forecast",
          ],
        },
      ],
    };
  }

  // Default: general weekly summary
  return {
    title: "Weekly Delivery Summary — Payments Platform",
    sections: [
      {
        heading: "This Week's Alerts",
        style: "danger",
        items: [
          "Squad Phoenix flow health critical — WIP, Flow Time, and Efficiency all degrading",
          "2 epics forecast to miss target dates: PAY-E001 (−14d) and PAY-E003 (−10d)",
        ],
      },
      {
        heading: "Healthy Signals",
        style: "success",
        items: [
          "Squad Orion performing well — velocity stable at 21 items/sprint",
          "Wallet Crew epics on track — WAL-E004 at 78% with solid P70",
        ],
      },
      {
        heading: "Actions This Week",
        style: "action",
        items: [
          "Review WIP cap with Squad Phoenix in next standup",
          "Approve 3 pending Jira actions to reduce Phoenix WIP overload",
          "Check KR1 and KR2 confidence in weekly OKR review",
        ],
      },
    ],
  };
}

const SCHEDULED_REPORTS_SEED = [
  {
    id: "sr1",
    name: "Weekly Phoenix Flow Summary",
    prompt: "Give me a summary of Squad Phoenix's flow health this week, including critical issues and the top 3 coaching recommendations.",
    schedule: { type: "weekly", day: "Monday", time: "09:00" },
    delivery: { channel: "email", address: "ben@bclarke.co" },
    status: "active",
    lastSent: "17 Feb 2026",
    nextSend: "24 Feb 2026",
  },
  {
    id: "sr2",
    name: "Bi-weekly OKR Confidence Review",
    prompt: "Summarise the current OKR confidence levels across all crews and flag any key results at risk of not being achieved this quarter.",
    schedule: { type: "biweekly", day: "Friday", time: "16:00" },
    delivery: { channel: "teams", webhookUrl: "https://outlook.office.com/webhook/abc123..." },
    status: "active",
    lastSent: "14 Feb 2026",
    nextSend: "28 Feb 2026",
  },
];

// ─── SEED CONVERSATION ───────────────────────────────────────────────────────
const SEED = [
  { id: 1, role: "user", text: "What's happening with Squad Phoenix's flow time this sprint?" },
  { id: 2, role: "ai",   text: "Squad Phoenix has a serious flow time problem building over six sprints. Median flow time has doubled from 3.2 days in Sprint 18 to 6.4 days now — and the p85 has hit 12.1 days, meaning the slowest 15% of items are taking nearly two weeks.\n\nThe trend is consistently worsening with no sign of reversal. The primary driver appears to be items ageing in In Review and In Testing, compressing active work time and inflating total flow time.", chart: "flowTime" },
  { id: 3, role: "ai",   text: null, rec: { priority: "Critical", title: "Flow Time doubling — items ageing in review", metric: "Flow Time: 3.2 → 6.4 days (100% increase over 6 sprints)", rootCause: "Items are spending disproportionate time waiting in Review and Testing. More work is entering review than the squad has capacity to process, creating a backlog stuck mid-flow.", action: "1. Cap simultaneous items in review at 3 in the next sprint. 2. Assign a dedicated reviewer rotation. 3. Introduce a Definition of Ready for review to cut rework cycles.", impact: "Expected 30–40% reduction in median flow time within 2 sprints if review WIP is capped." } },
  { id: 4, role: "user", text: "How does their velocity compare to Squad Orion?" },
  { id: 5, role: "ai",   text: "Squad Orion is significantly outperforming Phoenix on velocity, and the gap is widening. Phoenix has dropped from 18 items/sprint to just 10 — a 44% decline over four sprints. Orion has held steady at 20–22 throughout the same period.\n\nBoth squads are in the same crew, working from a similar backlog. This divergence is almost certainly a process issue rather than a capacity or complexity difference.", chart: "velocity" },
];

// ─── CANNED RESPONSES ────────────────────────────────────────────────────────
let _id = 200;
const uid = () => ++_id;

function respond(input) {
  const q = input.toLowerCase();
  if (q.includes("effic"))
    return [{ role: "ai", chart: "efficiency", text: "Flow Efficiency for Squad Phoenix has collapsed from 68% to just 31% — well below the crew median of 55%. Items are spending less than a third of their total flow time in active work. The remaining 69% is queue time: waiting in backlogs, waiting for review, waiting for testing.\n\nThis is a strong signal that work is batching up somewhere in the system. The efficiency line crossed below the crew benchmark two sprints ago and is still diverging." }];
  if (q.includes("wip") || q.includes("load") || q.includes("overload"))
    return [{ role: "ai", chart: "wip", text: "Squad Phoenix is carrying 9 active items against a configured WIP limit of 6 — 50% over safe capacity. High WIP is the most common driver of Flow Efficiency deterioration. When teams take on more than the system can handle, everything slows because context switching increases and items wait longer between touches.\n\nI've already proposed three Jira actions to bring WIP within limit. You can review and approve them in the Jira Actions tab." }];
  if (q.includes("distrib") || (q.includes("bug") && !q.includes("debug")) || q.includes("mix") || q.includes("type"))
    return [{ role: "ai", chart: "distribution", text: "The Flow Distribution for Squad Phoenix tells a concerning story: 41% of completed items have been bugs — far above the typical healthy range of 15–20% for a feature-delivery squad. Only 32% of output has been planned feature work.\n\nThis suggests the squad is spending most of its time reacting to quality issues rather than delivering planned value. The pattern also correlates directly with the velocity decline — bug triage is unplanned, interrupt-driven work that disrupts sprint commitments." }];
  if (q.includes("age") || q.includes("stuck") || q.includes("block") || q.includes("scatter"))
    return [{ role: "ai", chart: "scatter", text: "Looking at items currently in progress, two stand out as critically aged: PAY-243 (21 days) and PAY-230 (28 days) have had no status changes in weeks — a strong indicator they are blocked without being flagged.\n\nItems above the 14-day threshold are shown in red. I've proposed adding a 'blocked' label to both items in Jira so they surface in the blocked items dashboard and can be escalated." }];
  if (q.includes("recommend") || q.includes("coach") || q.includes("what should") || q.includes("improve") || q.includes("recs"))
    return [{ role: "ai", text: "Here's the highest-priority intervention for Squad Phoenix this sprint:", rec: { priority: "Critical", title: "Cap WIP — squad is 50% over limit", metric: "Flow Load: 9 items active vs. limit of 6", rootCause: "Taking on more work than the system can handle is the root cause of both the Flow Time increase and Flow Efficiency decline. Every additional item beyond the limit increases wait time for all other items.", action: "Agree with the squad to move 3 items to Sprint 24. Focus the current sprint on completing in-progress work before pulling anything new in.", impact: "Expected 20–30% efficiency improvement within 1 sprint." } }];
  if (q.includes("okr") || q.includes("key result") || q.includes("objective"))
    return [{ role: "ai", text: "The Checkout Crew's Q2 OKR picture is concerning. Of three Key Results, two are Low confidence: KR1 (Reduce payment failure rate) and KR2 (Reduce abandonment). Both depend on Squad Phoenix's epic delivery — and given Phoenix's current flow health, hitting those targets without intervention is unlikely.\n\nKR3 (One-Click Checkout) is on track, driven by Squad Orion which is performing well. I'd recommend a conversation this week about whether KR1's target needs to be reset or the epic descoped." }];
  return [{ role: "ai", text: "I can analyse any aspect of Squad Phoenix's flow health. Try asking me about flow efficiency, WIP and load, velocity vs Orion, work type distribution, or items ageing in the system. I can also give you coaching recommendations focused on the highest-impact improvements this sprint." }];
}

// ─── CHART COMPONENTS ────────────────────────────────────────────────────────
const tt = { backgroundColor: "#1e293b", border: "none", borderRadius: 8, fontSize: 11, color: "#f8fafc" };

const ChartShell = ({ title, sub, children }) => (
  <div className="mt-3 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
    <div className="px-4 pt-3 pb-1">
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">{title}</p>
      {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
    </div>
    <div className="px-1 pb-3">{children}</div>
  </div>
);

const FlowTimeChart = () => (
  <ChartShell title="Flow Time — Squad Phoenix" sub="Median and p85 · days · last 6 sprints">
    <ResponsiveContainer width="100%" height={180}>
      <LineChart data={FLOW_TIME_DATA} margin={{ top: 8, right: 20, bottom: 0, left: -10 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
        <XAxis dataKey="sprint" tick={{ fontSize: 11, fill: "#94a3b8" }} />
        <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} unit="d" />
        <Tooltip contentStyle={tt} formatter={(v) => [`${v} days`]} />
        <Legend wrapperStyle={{ fontSize: 11, paddingTop: 4 }} />
        <ReferenceLine y={4} stroke={C.emerald} strokeDasharray="4 3" label={{ value: "crew median", fill: C.emerald, fontSize: 9, position: "insideTopRight" }} />
        <Line type="monotone" dataKey="median" stroke={C.indigo} strokeWidth={2.5} dot={{ r: 3, fill: C.indigo }} activeDot={{ r: 5 }} name="Median" />
        <Line type="monotone" dataKey="p85"    stroke={C.rose}   strokeWidth={2}   dot={{ r: 3, fill: C.rose   }} strokeDasharray="5 3" name="p85" />
      </LineChart>
    </ResponsiveContainer>
  </ChartShell>
);

const VelocityChart = () => (
  <ChartShell title="Flow Velocity — Checkout Crew" sub="Items completed per sprint · last 4 sprints">
    <ResponsiveContainer width="100%" height={180}>
      <BarChart data={VELOCITY_DATA} margin={{ top: 8, right: 20, bottom: 0, left: -10 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
        <XAxis dataKey="sprint" tick={{ fontSize: 11, fill: "#94a3b8" }} />
        <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} />
        <Tooltip contentStyle={tt} />
        <Legend wrapperStyle={{ fontSize: 11, paddingTop: 4 }} />
        <Bar dataKey="Phoenix" fill={C.rose}   radius={[4, 4, 0, 0]} />
        <Bar dataKey="Orion"   fill={C.indigo} radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  </ChartShell>
);

const EfficiencyChart = () => (
  <ChartShell title="Flow Efficiency — Squad Phoenix" sub="Active time / total flow time · last 6 sprints">
    <ResponsiveContainer width="100%" height={180}>
      <LineChart data={EFFICIENCY_DATA} margin={{ top: 8, right: 20, bottom: 0, left: -10 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
        <XAxis dataKey="sprint" tick={{ fontSize: 11, fill: "#94a3b8" }} />
        <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} unit="%" domain={[0, 100]} />
        <Tooltip contentStyle={tt} formatter={(v) => [`${v}%`]} />
        <ReferenceLine y={55} stroke={C.emerald} strokeDasharray="4 3" label={{ value: "crew median (55%)", fill: C.emerald, fontSize: 9, position: "insideTopRight" }} />
        <Line type="monotone" dataKey="efficiency" stroke={C.rose} strokeWidth={2.5} dot={{ r: 3, fill: C.rose }} activeDot={{ r: 5 }} name="Efficiency %" />
      </LineChart>
    </ResponsiveContainer>
  </ChartShell>
);

const DistributionChart = () => (
  <ChartShell title="Flow Distribution — Squad Phoenix" sub="Completed items by type · last 4 sprints">
    <div className="flex items-center gap-2 px-2">
      <ResponsiveContainer width={150} height={150}>
        <PieChart>
          <Pie data={DISTRIBUTION_DATA} cx="50%" cy="50%" innerRadius={40} outerRadius={66} dataKey="value" paddingAngle={2} stroke="none">
            {DISTRIBUTION_DATA.map((d) => <Cell key={d.name} fill={d.color} />)}
          </Pie>
          <Tooltip contentStyle={tt} formatter={(v) => [`${v}%`]} />
        </PieChart>
      </ResponsiveContainer>
      <div className="flex-1 space-y-2">
        {DISTRIBUTION_DATA.map((d) => (
          <div key={d.name} className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: d.color }} />
            <span className="text-xs text-slate-600 flex-1">{d.name}</span>
            <span className="text-xs font-bold" style={{ color: d.color }}>{d.value}%</span>
          </div>
        ))}
        <div className="pt-1 border-t border-slate-100">
          <p className="text-xs font-medium text-amber-600">⚠ Bug load 2× healthy level</p>
        </div>
      </div>
    </div>
  </ChartShell>
);

const WIPChart = () => {
  const wip = 9, limit = 6, max = 12;
  return (
    <ChartShell title="Flow Load — Squad Phoenix" sub="Active items vs. WIP limit · current sprint">
      <div className="px-3 pt-2 pb-1">
        <div className="flex items-end gap-4 mb-4">
          <div>
            <p className="text-5xl font-black text-rose-500 leading-none">{wip}</p>
            <p className="text-xs text-slate-400 mt-1">active items</p>
          </div>
          <p className="text-slate-200 text-3xl mb-2">/</p>
          <div>
            <p className="text-5xl font-black text-slate-300 leading-none">{limit}</p>
            <p className="text-xs text-slate-400 mt-1">WIP limit</p>
          </div>
          <div className="ml-auto flex items-center gap-1.5 bg-rose-50 text-rose-600 font-semibold text-sm px-3 py-2 rounded-xl border border-rose-200">
            <IcoWarn size={14} /> 50% over limit
          </div>
        </div>
        <div className="relative h-4 bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full rounded-full bg-rose-400" style={{ width: `${(wip / max) * 100}%` }} />
          <div className="absolute top-0 bottom-0 w-0.5 bg-emerald-500" style={{ left: `${(limit / max) * 100}%` }} />
        </div>
        <div className="flex justify-between mt-1.5 text-xs text-slate-400">
          <span>0</span>
          <span className="text-emerald-600 font-medium">limit: {limit}</span>
          <span>{max}</span>
        </div>
      </div>
    </ChartShell>
  );
};

const ScatterAgeChart = () => {
  const stageTick = (v) => (["", "Dev", "Review", "Test"][v] || "");
  const CustomTooltip = ({ payload }) => {
    if (!payload || !payload[0]) return null;
    const d = payload[0].payload;
    return (
      <div style={{ ...tt, padding: "8px 12px" }}>
        <p style={{ fontWeight: 600, margin: 0 }}>{d.id}</p>
        <p style={{ color: "#94a3b8", margin: 0 }}>{d.age} days · {stageTick(d.stage)}</p>
      </div>
    );
  };
  return (
    <ChartShell title="Item Age Distribution — Squad Phoenix" sub="Days in progress vs. workflow stage · current WIP">
      <ResponsiveContainer width="100%" height={190}>
        <ScatterChart margin={{ top: 8, right: 20, bottom: 20, left: -10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis type="number" dataKey="age"   name="Age"   tick={{ fontSize: 11, fill: "#94a3b8" }} label={{ value: "days in progress", position: "insideBottomRight", offset: -8, fontSize: 10, fill: "#94a3b8" }} />
          <YAxis type="number" dataKey="stage" name="Stage" tick={{ fontSize: 11, fill: "#94a3b8" }} ticks={[1, 2, 3]} tickFormatter={stageTick} />
          <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: "3 3" }} />
          <ReferenceLine x={14} stroke={C.amber} strokeDasharray="5 3" label={{ value: "14d threshold", fill: C.amber, fontSize: 9, position: "insideTopLeft" }} />
          <Legend wrapperStyle={{ fontSize: 11, paddingTop: 4 }} />
          <Scatter name="Normal (≤14d)"  data={SCATTER_YOUNG} fill={C.indigo} opacity={0.85} />
          <Scatter name="Overdue (>14d)" data={SCATTER_OLD}   fill={C.rose}   opacity={0.85} />
        </ScatterChart>
      </ResponsiveContainer>
    </ChartShell>
  );
};

const CHARTS = {
  flowTime: FlowTimeChart, velocity: VelocityChart, efficiency: EfficiencyChart,
  distribution: DistributionChart, wip: WIPChart, scatter: ScatterAgeChart,
};

// ─── RECOMMENDATION CARD ─────────────────────────────────────────────────────
const REC_P = {
  Critical: { wrap: "bg-rose-50 border-rose-200",  badge: "bg-rose-600",  text: "text-rose-700"  },
  High:     { wrap: "bg-amber-50 border-amber-200", badge: "bg-amber-500", text: "text-amber-700" },
  Medium:   { wrap: "bg-sky-50 border-sky-200",     badge: "bg-sky-500",   text: "text-sky-700"   },
};

function RecCard({ rec }) {
  const [state, setState] = useState("idle");
  const p = REC_P[rec.priority] || REC_P.Medium;
  return (
    <div className={`mt-3 rounded-xl border overflow-hidden ${p.wrap}`}>
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white border-opacity-50">
        <span className={`text-xs font-bold text-white px-2 py-0.5 rounded-full ${p.badge}`}>{rec.priority}</span>
        <IcoStar size={12} className={p.text} />
        <p className={`text-sm font-semibold ${p.text}`}>{rec.title}</p>
      </div>
      <div className="px-4 py-3 space-y-2.5 bg-white bg-opacity-60">
        {[["Evidence", rec.metric], ["Root Cause", rec.rootCause], ["Recommended Action", rec.action], ["Expected Impact", rec.impact]].map(([label, val]) => (
          <div key={label}>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-0.5">{label}</p>
            <p className="text-xs text-slate-700 leading-relaxed">{val}</p>
          </div>
        ))}
        {state === "idle" && (
          <div className="flex gap-2 pt-1">
            <button onClick={() => setState("actioned")} className="flex items-center gap-1.5 text-xs font-medium bg-white border border-slate-200 text-slate-700 px-3 py-1.5 rounded-lg hover:bg-slate-50 transition-colors shadow-sm">
              <IcoCheck size={12} /> Mark as actioned
            </button>
            <button onClick={() => setState("dismissed")} className="flex items-center gap-1.5 text-xs text-slate-400 px-2 py-1.5 rounded-lg hover:text-slate-600 transition-colors">
              <IcoX size={12} /> Dismiss
            </button>
          </div>
        )}
        {state === "actioned"  && <p className="flex items-center gap-1.5 text-xs font-medium text-emerald-600 pt-1"><IcoOk size={13} /> Actioned — I'll track this metric and report back in 2 sprints.</p>}
        {state === "dismissed" && <p className="text-xs text-slate-400 pt-1">Dismissed</p>}
      </div>
    </div>
  );
}

// ─── MESSAGE BUBBLE ───────────────────────────────────────────────────────────
function Bubble({ msg }) {
  if (msg.role === "user") return (
    <div className="flex justify-end mb-5">
      <div className="max-w-md bg-indigo-600 text-white rounded-2xl rounded-tr-sm px-4 py-2.5 shadow-sm">
        <p className="text-sm leading-relaxed">{msg.text}</p>
      </div>
    </div>
  );
  const Chart = msg.chart ? CHARTS[msg.chart] : null;
  return (
    <div className="flex gap-3 mb-5">
      <div className="flex-shrink-0 w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center mt-0.5 shadow">
        <IcoBot size={14} className="text-white" />
      </div>
      <div className="flex-1 min-w-0">
        {msg.text && (
          <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 border border-slate-200 shadow-sm">
            <p className="text-sm text-slate-800 leading-relaxed whitespace-pre-line">{msg.text}</p>
          </div>
        )}
        {msg.rec && <RecCard rec={msg.rec} />}
        {Chart && <Chart />}
      </div>
    </div>
  );
}

function Typing() {
  return (
    <div className="flex gap-3 mb-5">
      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center flex-shrink-0 shadow">
        <IcoBot size={14} className="text-white" />
      </div>
      <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 border border-slate-200 shadow-sm">
        <div className="flex gap-1 items-center h-4">
          {[0, 150, 300].map((d) => (
            <div key={d} className="w-2 h-2 rounded-full bg-slate-300 animate-bounce" style={{ animationDelay: `${d}ms` }} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── COACH TAB ────────────────────────────────────────────────────────────────

// ─── ALERT BELL COMPONENT ─────────────────────────────────────────────────────
function AlertBell({ alerts, onRead, onReadAll }) {
  const [open, setOpen] = useState(false);
  const unreadCount = alerts.filter(a => !a.read).length;
  
  const severityStyles = {
    critical: { dot: "bg-rose-500", text: "text-rose-700", bg: "bg-rose-50" },
    warning: { dot: "bg-amber-400", text: "text-amber-700", bg: "bg-amber-50" },
    info: { dot: "bg-sky-500", text: "text-sky-700", bg: "bg-sky-50" },
  };

  return (
    <div className="relative flex-shrink-0">
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 text-slate-400 hover:text-slate-600 transition-colors"
      >
        <IcoBell size={18} />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 w-5 h-5 bg-rose-500 text-white text-xs font-bold rounded-full flex items-center justify-center leading-none">
            {unreadCount}
          </span>
        )}
      </button>
      
      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl border border-slate-200 shadow-lg z-50 overflow-hidden">
          <div className="p-3 border-b border-slate-100 flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-600 uppercase">Alerts ({alerts.length})</p>
            {unreadCount > 0 && (
              <button onClick={onReadAll} className="text-xs text-indigo-600 hover:text-indigo-700 font-medium">
                Mark all read
              </button>
            )}
          </div>
          <div className="max-h-96 overflow-y-auto">
            {alerts.length === 0 ? (
              <div className="p-4 text-center text-xs text-slate-400">
                No alerts
              </div>
            ) : (
              alerts.map(alert => {
                const style = severityStyles[alert.severity];
                return (
                  <button
                    key={alert.id}
                    onClick={() => {
                      onRead(alert.id);
                    }}
                    className={`w-full text-left px-4 py-3 border-b border-slate-100 hover:bg-slate-50 transition-colors ${alert.read ? 'opacity-60' : ''}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-2 h-2 rounded-full flex-shrink-0 mt-1.5 ${style.dot}`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-slate-700">{alert.squad}</p>
                        <p className="text-xs text-slate-600 font-medium mt-0.5">{alert.metric}</p>
                        <p className="text-xs text-slate-500 leading-relaxed mt-1">{alert.message}</p>
                        <p className="text-xs text-slate-400 mt-1">{alert.time}</p>
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── WHAT-IF SIMULATOR PANEL ──────────────────────────────────────────────────
function WhatIfPanel({ onClose }) {
  const [wip, setWip] = useState(9);
  const currentWip = 9, currentFlowTime = 6.4, currentEfficiency = 31, currentVelocity = 10;
  
  // Little's Law projections
  const projFlowTime = +(currentFlowTime * (wip / currentWip)).toFixed(1);
  const projEfficiency = +Math.min(75, currentEfficiency * Math.pow(currentWip / wip, 1.2)).toFixed(0);
  const projVelocity = +Math.min(22, currentVelocity * (projEfficiency / currentEfficiency)).toFixed(0);
  
  const flowImprove = ((currentFlowTime - projFlowTime) / currentFlowTime * 100).toFixed(0);
  
  return (
    <div className="mt-4 p-4 rounded-xl border-2 border-indigo-200 bg-indigo-50">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-semibold text-slate-800">What-if Simulator — Squad Phoenix</h3>
          <p className="text-xs text-slate-600 mt-1">Adjust WIP limit to model predicted flow impact (Little's Law)</p>
        </div>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
          <IcoX size={14} />
        </button>
      </div>
      
      <div className="space-y-4">
        {/* Slider */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold text-slate-600">Target WIP limit</label>
            <span className="text-sm font-bold text-slate-800">{wip} items</span>
          </div>
          <input
            type="range"
            min="2"
            max="12"
            value={wip}
            onChange={(e) => setWip(+e.target.value)}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-slate-500 mt-1">
            <span>2</span>
            <span className="text-emerald-600 font-medium">current limit: 6</span>
            <span>12</span>
          </div>
        </div>
        
        {/* Stat cards */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Flow Time", before: currentFlowTime + "d", after: projFlowTime + "d" },
            { label: "Efficiency", before: currentEfficiency + "%", after: projEfficiency + "%" },
            { label: "Velocity", before: currentVelocity, after: projVelocity },
          ].map(({ label, before, after }) => (
            <div key={label} className="bg-white rounded-lg p-3 text-center border border-indigo-100">
              <p className="text-xs text-slate-600 font-medium mb-1">{label}</p>
              <p className="text-xs font-semibold text-slate-700">{before}</p>
              <p className="text-xs text-slate-400 my-1">→</p>
              <p className={`text-xs font-bold ${wip < currentWip ? 'text-emerald-600' : wip > currentWip ? 'text-rose-600' : 'text-slate-600'}`}>{after}</p>
            </div>
          ))}
        </div>
        
        {/* Summary */}
        {wip < currentWip && (
          <div className="bg-white rounded-lg p-3 border border-emerald-200 text-center">
            <p className="text-xs text-emerald-700">
              Reducing WIP from {currentWip} to {wip} is predicted to cut flow time by {flowImprove}% within 2–3 sprints.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── OVERVIEW TAB (Squad Health + Heat Map) ────────────────────────────────────
function OverviewTab() {
  const [squadHealth, setSquadHealth] = useState(SQUAD_HEALTH);
  const [selectedSquad, setSelectedSquad] = useState(null);
  const [health, setHealth] = useState(null);
  const [healthNote, setHealthNote] = useState("");
  
  const handleSaveHealth = () => {
    if (!selectedSquad || health == null) return;
    setSquadHealth(prev => prev.map(s =>
      s.id === selectedSquad ? { ...s, health, healthNote } : s
    ));
    setSelectedSquad(null);
    setHealth(null);
    setHealthNote("");
  };
  
  const crews = {};
  squadHealth.forEach(s => {
    if (!crews[s.crew]) crews[s.crew] = [];
    crews[s.crew].push(s);
  });
  
  return (
    <div className="p-5 overflow-y-auto h-full">
      <div className="mb-6">
        <h2 className="text-base font-semibold text-slate-800">Squad Health Overview</h2>
        <p className="text-xs text-slate-400 mt-0.5">Real-time metrics across all squads</p>
      </div>
      
      {/* Heat map */}
      <div className="rounded-xl border border-slate-200 overflow-x-auto mb-6">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              {["Squad", "Flow Time", "Velocity", "Efficiency", "WIP", "Team Health"].map(h => (
                <th key={h} className="px-4 py-2.5 text-left font-semibold text-slate-400 uppercase tracking-wide whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {Object.entries(crews).map(([crew, squads]) => (
              <React.Fragment key={crew}>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <td colSpan="6" className="px-4 py-2 text-xs font-semibold text-slate-600">{crew}</td>
                </tr>
                {squads.map(s => (
                  <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3"><span className="font-medium text-slate-700">{s.squad}</span></td>
                    <td className={`px-4 py-3 font-medium ${heatCell('flowTime', s.flowTime)}`}>{s.flowTime}d</td>
                    <td className={`px-4 py-3 font-medium ${heatCell('velocity', s.velocity)}`}>{s.velocity}</td>
                    <td className={`px-4 py-3 font-medium ${heatCell('efficiency', s.efficiency)}`}>{s.efficiency}%</td>
                    <td className={`px-4 py-3 font-medium ${heatCell('wip', s.wip, s.wipLimit)}`}>{s.wip}/{s.wipLimit}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-start gap-2">
                        <div className="flex">
                          {Array(5).fill(0).map((_, i) => (
                            <span key={i} className={`text-sm ${i < s.health ? '●' : '○'} ${heatCell('health', s.health)}`} />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-slate-500 mt-1 leading-tight">{s.healthNote}</p>
                    </td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Update Health Section */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h3 className="font-semibold text-slate-800 mb-4">Update Team Health</h3>
        <div className="space-y-4 max-w-md">
          <div>
            <label className="text-xs font-semibold text-slate-600 uppercase mb-2 block">Squad</label>
            <select
              value={selectedSquad || ""}
              onChange={(e) => {
                setSelectedSquad(e.target.value);
                const s = squadHealth.find(sq => sq.id === e.target.value);
                if (s) {
                  setHealth(s.health);
                  setHealthNote(s.healthNote);
                }
              }}
              className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2"
            >
              <option value="">Select a squad...</option>
              {squadHealth.map(s => (
                <option key={s.id} value={s.id}>{s.squad}</option>
              ))}
            </select>
          </div>
          
          {selectedSquad && (
            <>
              <div>
                <label className="text-xs font-semibold text-slate-600 uppercase mb-2 block">Health Score (1-5)</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(i => (
                    <button
                      key={i}
                      onClick={() => setHealth(i)}
                      className={`w-8 h-8 rounded-lg font-bold transition-colors ${
                        health === i ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {i}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="text-xs font-semibold text-slate-600 uppercase mb-2 block">Notes</label>
                <textarea
                  value={healthNote}
                  onChange={(e) => setHealthNote(e.target.value)}
                  rows={3}
                  placeholder="Observations about team health, morale, blockers..."
                  className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 resize-none"
                />
              </div>
              
              <button
                onClick={handleSaveHealth}
                className="w-full bg-indigo-600 text-white font-medium py-2 rounded-lg hover:bg-indigo-700 transition-colors text-sm"
              >
                Save Health Update
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── PLAYBOOK TAB ─────────────────────────────────────────────────────────────
function PlaybookTab() {
  const [clicked, setClicked] = useState({});
  
  const categoryColors = {
    rose: "bg-rose-100 text-rose-700",
    amber: "bg-amber-100 text-amber-700",
    sky: "bg-sky-100 text-sky-700",
    violet: "bg-violet-100 text-violet-700",
  };
  
  return (
    <div className="p-5 overflow-y-auto h-full">
      <div className="mb-6">
        <h2 className="text-base font-semibold text-slate-800">Coaching Playbook</h2>
        <p className="text-xs text-slate-400 mt-0.5">Proven interventions — select one to pre-fill a new intervention</p>
      </div>
      
      <div className="grid gap-4 max-w-4xl">
        {PLAYBOOK.map(pb => (
          <div key={pb.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
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
              
              <div>
                {clicked[pb.id] ? (
                  <div className="flex items-center gap-2 text-xs text-emerald-600 font-medium">
                    <IcoCheck size={13} /> Intervention created — view in Interventions tab
                  </div>
                ) : (
                  <button
                    onClick={() => setClicked(prev => ({ ...prev, [pb.id]: true }))}
                    className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors font-medium text-sm"
                  >
                    Use this playbook
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const CHIPS = ["Flow efficiency trend", "WIP load", "Work type breakdown", "Ageing items", "Give me coaching recs", "OKR status", "What-if simulator"];

function CoachTab{ alerts = [], onAlertRead = () => {}, onAlertReadAll = () => {}, setShowWhatIf: externalSetShowWhatIf = () => {} } {
  const [msgs, setMsgs]   = useState(SEED);
  const [showWhatIf, setShowWhatIf] = useState(false);
  const [input, setInput] = useState("");
  const [busy, setBusy]   = useState(false);
  const bottom = useRef(null);

  useEffect(() => { bottom.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs, busy]);

  const send = (text) => {
    if (!text.trim() || busy) return;
    setMsgs((m) => [...m, { id: uid(), role: "user", text }]);
    setInput("");
    setBusy(true);
    setTimeout(() => {
      setMsgs((m) => [...m, ...respond(text).map((r) => ({ id: uid(), ...r }))]);
      setBusy(false);
    }, 1100);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 border-b border-slate-100 text-xs text-slate-400 flex-shrink-0">
        <IcoActivity size={12} className="text-indigo-400" />
        <span className="font-medium text-slate-600">Squad Phoenix</span>
        <span>·</span><span>Checkout Crew</span>
        <span>·</span><span>Payments Platform</span>
        <span>·</span><span>Last 6 sprints</span>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pt-5 pb-2">
        {msgs.map((m) => <Bubble key={m.id} msg={m} />)}
        {busy && <Typing />}
        <div ref={bottom} />
      </div>

      <div className="px-4 py-2 flex gap-2 overflow-x-auto flex-shrink-0 border-t border-slate-100">
        {CHIPS.map((c) => (
          <button key={c} onClick={() => c === "What-if simulator" ? setShowWhatIf(true) : send(c)} disabled={busy}
            className="flex-shrink-0 text-xs text-indigo-600 bg-indigo-50 border border-indigo-100 hover:bg-indigo-100 disabled:opacity-40 px-3 py-1.5 rounded-full transition-colors whitespace-nowrap">
            {c}
          </button>
        ))}
      </div>

      <div className="px-4 pb-4 pt-2 flex-shrink-0">
        <div className="flex gap-2 items-center bg-white border border-slate-200 rounded-2xl px-4 py-2.5 shadow-sm focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send(input)}
            placeholder="Ask about flow metrics, OKRs, epics, or coaching…"
            className="flex-1 text-sm text-slate-800 placeholder-slate-400 bg-transparent outline-none"
          />
          <button onClick={() => send(input)} disabled={!input.trim() || busy}
            className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center flex-shrink-0 disabled:opacity-30 hover:bg-indigo-700 transition-colors shadow-sm">
            <IcoSend size={13} className="text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── OKR TAB ─────────────────────────────────────────────────────────────────
const CONF = {
  high:   { dot: "bg-emerald-500", bar: "bg-emerald-500", badge: "bg-emerald-50 text-emerald-700 border-emerald-200", ring: "border-emerald-200", label: "High" },
  medium: { dot: "bg-amber-400",   bar: "bg-amber-400",   badge: "bg-amber-50 text-amber-700 border-amber-200",       ring: "border-amber-200",   label: "Medium" },
  low:    { dot: "bg-rose-500",    bar: "bg-rose-500",     badge: "bg-rose-50 text-rose-700 border-rose-200",          ring: "border-rose-200",    label: "Low" },
};

function OKRTab() {
  return (
    <div className="p-5 space-y-4 overflow-y-auto h-full">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-slate-800">OKR Tracking</h2>
          <p className="text-xs text-slate-400 mt-0.5">Q2 2026 · Payments Platform · 2 objectives</p>
        </div>
        <div className="flex gap-3">
          {Object.entries({ high: "On track", medium: "At risk", low: "Low confidence" }).map(([k, l]) => (
            <div key={k} className="flex items-center gap-1.5 text-xs text-slate-500">
              <div className={`w-2 h-2 rounded-full ${CONF[k].dot}`} />{l}
            </div>
          ))}
        </div>
      </div>

      {OKRS.map((okr) => {
        const c = CONF[okr.confidence];
        return (
          <div key={okr.id} className={`rounded-xl border overflow-hidden ${c.ring}`}>
            <div className="flex items-start gap-3 px-4 py-3 bg-slate-50">
              <IcoTarget size={16} className={`flex-shrink-0 mt-0.5 ${c.badge.split(" ")[1]}`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-800">{okr.objective}</p>
                <p className="text-xs text-slate-400 mt-0.5">{okr.owner}</p>
              </div>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border flex-shrink-0 ${c.badge}`}>{c.label} confidence</span>
            </div>
            <div className="bg-white divide-y divide-slate-100">
              {okr.keyResults.map((kr) => {
                const kc = CONF[kr.confidence];
                return (
                  <div key={kr.id} className="px-4 py-3">
                    <div className="flex items-start gap-2 mb-2.5">
                      <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${kc.dot}`} />
                      <p className="text-sm text-slate-700 flex-1 leading-snug">{kr.text}</p>
                      <span className={`text-xs font-medium flex-shrink-0 ml-2 ${kc.badge.split(" ")[1]}`}>{kc.label}</span>
                    </div>
                    <div className="flex items-center gap-3 pl-4">
                      <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${kc.bar}`} style={{ width: `${kr.progress}%` }} />
                      </div>
                      <span className="text-xs font-bold text-slate-600 w-8 text-right">{kr.progress}%</span>
                      <div className="flex gap-1">
                        {kr.epics.map((e) => (
                          <span key={e} className="text-xs bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-mono">{e}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── PORTFOLIO TAB ────────────────────────────────────────────────────────────
const STATUS = {
  "on-track": { dot: "bg-emerald-500", bar: "bg-emerald-500", badge: "bg-emerald-50 text-emerald-700", label: "On Track"  },
  "at-risk":  { dot: "bg-amber-400",   bar: "bg-amber-400",   badge: "bg-amber-50 text-amber-700",     label: "At Risk"   },
  "off-track":{ dot: "bg-rose-500",    bar: "bg-rose-500",    badge: "bg-rose-50 text-rose-700",       label: "Off Track" },
};

function PortfolioTab() {
  return (
    <div className="p-5 overflow-y-auto h-full">
      <div className="mb-4">
        <h2 className="text-base font-semibold text-slate-800">Epic Portfolio</h2>
        <p className="text-xs text-slate-400 mt-0.5">5 active epics · Q2 2026 · Payments Platform · Forecasts via Monte Carlo (P70)</p>
      </div>
      <div className="rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              {["Epic", "Squad", "Progress", "Target", "Forecast P70", "Status", "OKR"].map((h) => (
                <th key={h} className="px-4 py-2.5 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {EPICS.map((e) => {
              const s = STATUS[e.status];
              return (
                <tr key={e.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3">
                    <p className="text-sm font-medium text-slate-800">{e.name}</p>
                    <p className="text-xs text-slate-400 font-mono mt-0.5">{e.id}</p>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-600">{e.squad}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${s.bar}`} style={{ width: `${e.pct}%` }} />
                      </div>
                      <span className="text-xs font-semibold text-slate-600">{e.pct}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-600">{e.target}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-medium ${e.status === "at-risk" ? "text-amber-600" : "text-slate-600"}`}>{e.p70}</span>
                    {e.status === "at-risk" && <IcoWarn size={11} className="inline ml-1 text-amber-400" />}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${s.badge}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />{s.label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-400 font-mono">{e.okr}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── ACTIONS TAB ─────────────────────────────────────────────────────────────
const RISK_C = {
  low:    "bg-emerald-50 text-emerald-700 border-emerald-200",
  medium: "bg-amber-50 text-amber-700 border-amber-200",
};

function ActionsTab() {
  const [actions, setActions] = useState(JIRA_ACTIONS);
  const act = (id, s) => setActions((a) => a.map((x) => x.id === id ? { ...x, status: s } : x));
  const pending = actions.filter((a) => a.status === "pending");
  const done    = actions.filter((a) => a.status !== "pending");

  return (
    <div className="p-5 overflow-y-auto h-full">
      <div className="mb-4">
        <h2 className="text-base font-semibold text-slate-800">Jira Action Queue</h2>
        <p className="text-xs text-slate-400 mt-0.5">{pending.length} pending — all require your approval before execution in Jira</p>
      </div>

      {pending.length === 0 && (
        <div className="text-center py-12">
          <IcoOk size={36} className="mx-auto mb-3 text-emerald-400" />
          <p className="text-sm text-slate-500 font-medium">All caught up</p>
          <p className="text-xs text-slate-400 mt-1">No pending Jira actions</p>
        </div>
      )}

      <div className="space-y-3">
        {pending.map((a) => (
          <div key={a.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-4 py-3">
              <div className="flex items-start gap-3">
                <span className="text-xl mt-0.5 flex-shrink-0">{a.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">{a.type}</span>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${RISK_C[a.risk]}`}>{a.risk} risk</span>
                  </div>
                  <p className="text-sm font-semibold text-slate-800 mb-1.5">{a.description}</p>
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {a.issues.map((i) => <span key={i} className="text-xs font-mono bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">{i}</span>)}
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">{a.reason}</p>
                </div>
              </div>
            </div>
            <div className="flex border-t border-slate-100">
              <button onClick={() => act(a.id, "approved")} className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-sm font-medium text-emerald-700 hover:bg-emerald-50 transition-colors">
                <IcoCheck size={14} /> Approve & execute
              </button>
              <div className="w-px bg-slate-100" />
              <button onClick={() => act(a.id, "rejected")} className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-sm font-medium text-slate-400 hover:bg-slate-50 transition-colors">
                <IcoX size={14} /> Reject
              </button>
            </div>
          </div>
        ))}

        {done.length > 0 && (
          <div className="space-y-2 pt-2">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Completed</p>
            {done.map((a) => (
              <div key={a.id} className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border text-sm opacity-60 ${a.status === "approved" ? "bg-emerald-50 border-emerald-200" : "bg-slate-50 border-slate-200"}`}>
                <span>{a.icon}</span>
                <p className="flex-1 text-slate-600 text-xs">{a.description}</p>
                {a.status === "approved"
                  ? <span className="flex items-center gap-1 text-xs font-medium text-emerald-600"><IcoCheck size={12} /> Executed</span>
                  : <span className="flex items-center gap-1 text-xs font-medium text-slate-400"><IcoX size={12} /> Rejected</span>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── INTERVENTIONS TAB ────────────────────────────────────────────────────────
const INT_STATUS_CFG = {
  improving: { label: "Improving",  bgCls: "bg-emerald-50", borderCls: "border-emerald-200", textCls: "text-emerald-700", dotCls: "bg-emerald-500", Icon: IcoTrendUp  },
  worsening: { label: "Worsening",  bgCls: "bg-rose-50",    borderCls: "border-rose-200",    textCls: "text-rose-700",    dotCls: "bg-rose-500",    Icon: IcoTrendDn  },
  neutral:   { label: "No change",  bgCls: "bg-slate-50",   borderCls: "border-slate-200",   textCls: "text-slate-500",   dotCls: "bg-slate-400",   Icon: IcoMinus    },
  unknown:   { label: "No data",    bgCls: "bg-slate-50",   borderCls: "border-slate-200",   textCls: "text-slate-400",   dotCls: "bg-slate-300",   Icon: IcoActivity },
};

// Chart showing metric over time with before/after shading and an intervention marker
function BeforeAfterChart({ chartData, startSprint, unit, metricLabel }) {
  const idx         = chartData.findIndex(d => d.sprint === startSprint);
  const firstSprint = chartData[0].sprint;
  const lastSprint  = chartData[chartData.length - 1].sprint;
  const lastBefore  = idx > 0 ? chartData[idx - 1].sprint : null;

  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={chartData} margin={{ top: 16, right: 24, bottom: 0, left: -10 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
        {/* Shade before period */}
        {lastBefore && (
          <ReferenceArea x1={firstSprint} x2={lastBefore} fill="#e2e8f0" fillOpacity={0.5} />
        )}
        {/* Shade after period */}
        <ReferenceArea x1={startSprint} x2={lastSprint} fill="#eef2ff" fillOpacity={0.6} />
        <XAxis dataKey="sprint" tick={{ fontSize: 11, fill: "#94a3b8" }} />
        <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} />
        <Tooltip contentStyle={tt} formatter={(v) => [`${v}${unit}`, metricLabel]} />
        {/* Vertical marker at intervention start */}
        <ReferenceLine
          x={startSprint}
          stroke={C.indigo}
          strokeWidth={2}
          strokeDasharray="5 3"
          label={{ value: "Intervention", position: "insideTopLeft", fill: C.indigo, fontSize: 9 }}
        />
        <Line
          type="monotone"
          dataKey="value"
          stroke={C.indigo}
          strokeWidth={2.5}
          dot={{ r: 3.5, fill: C.indigo, stroke: "white", strokeWidth: 1.5 }}
          activeDot={{ r: 5 }}
          name={metricLabel}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

function InterventionDetail({ intervention, onBack, notes = [], onAddNote = () => {} }) {
  const chartData  = getChartData(intervention.targetId, intervention.metric);
  const metricCfg  = METRIC_OPTIONS.find(m => m.id === intervention.metric);
  const stats      = chartData ? computeBeforeAfter(chartData, intervention.startSprint) : null;
  const status     = stats ? intStatus(stats.delta, metricCfg?.lowerIsBetter) : "unknown";
  const cfg        = INT_STATUS_CFG[status];
  const StatusIcon = cfg.Icon;

  const fmt  = (v) => v != null ? `${v.toFixed(1)}${metricCfg?.unit ?? ""}` : "—";
  const sign = stats && stats.delta > 0 ? "+" : "";

  const assessmentText = {
    improving: `${metricCfg?.label} has improved from ${fmt(stats?.avgBefore)} to ${fmt(stats?.avgAfter)} over ${stats?.afterCount} sprint${stats?.afterCount !== 1 ? "s" : ""} since the intervention — a ${Math.abs(stats?.delta ?? 0).toFixed(0)}% improvement. Continue monitoring over the next 2 sprints to confirm the trend is sustained before closing this intervention.`,
    worsening: `${metricCfg?.label} has worsened from ${fmt(stats?.avgBefore)} to ${fmt(stats?.avgAfter)} over ${stats?.afterCount} sprint${stats?.afterCount !== 1 ? "s" : ""} since the intervention — a ${Math.abs(stats?.delta ?? 0).toFixed(0)}% decline. The coaching action has not yet produced the expected outcome. Consider revisiting the root cause or introducing additional support measures this sprint.`,
    neutral:   `${metricCfg?.label} has been broadly unchanged since the intervention (${fmt(stats?.avgBefore)} → ${fmt(stats?.avgAfter)}). It may be too early to draw conclusions — flow changes often take 2–3 sprints to materialise. Review again next sprint.`,
    unknown:   "There is not enough data to assess the impact of this intervention yet. At least one sprint of baseline data is needed before the intervention start sprint.",
  };

  return (
    <div className="p-5 overflow-y-auto h-full">
      {/* Back */}
      <button onClick={onBack} className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-700 mb-4 transition-colors font-medium">
        ← Back to Interventions
      </button>

      {/* Header */}
      <div className="mb-5">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center flex-shrink-0 mt-0.5">
            <IcoFlag size={18} className="text-indigo-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-base font-semibold text-slate-800 leading-snug">{intervention.name}</h2>
            <div className="flex flex-wrap items-center gap-2 mt-1.5">
              <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium">{intervention.targetName}</span>
              <span className="text-xs bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full font-medium">{metricCfg?.label}</span>
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

      {/* Before / After stat cards */}
      {stats ? (
        <div className="grid grid-cols-3 gap-3 mb-4">
          {[
            {
              label: `Before`,
              sub: `${stats.beforeCount} sprint${stats.beforeCount !== 1 ? "s" : ""} · avg`,
              value: fmt(stats.avgBefore),
              color: "text-slate-700",
            },
            {
              label: `After intervention`,
              sub: `${stats.afterCount} sprint${stats.afterCount !== 1 ? "s" : ""} · avg`,
              value: fmt(stats.avgAfter),
              color: "text-indigo-600",
            },
            {
              label: "Change",
              sub: metricCfg?.lowerIsBetter ? "lower is better" : "higher is better",
              value: `${sign}${stats.delta.toFixed(1)}%`,
              color: status === "improving" ? "text-emerald-600" : status === "worsening" ? "text-rose-600" : "text-slate-500",
            },
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

      {/* Chart */}
      {chartData ? (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mb-4">
          <div className="px-4 pt-3 pb-1">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">{metricCfg?.label} — {intervention.targetName} · all sprints</p>
            <div className="flex items-center gap-5 mt-1.5 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <span className="inline-block w-3 h-3 rounded border border-slate-300 bg-slate-100" />
                Before intervention
              </span>
              <span className="flex items-center gap-1.5">
                <span className="inline-block w-3 h-3 rounded border border-indigo-200 bg-indigo-50" />
                After intervention
              </span>
              <span className="flex items-center gap-1.5">
                <span className="inline-block w-4 border-t-2 border-dashed border-indigo-400" />
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
      )}

      {/* Coach assessment */}
      <div className={`rounded-xl border px-4 py-3.5 ${cfg.bgCls} ${cfg.borderCls}`}>
        <p className={`text-xs font-semibold uppercase tracking-wide mb-1.5 ${cfg.textCls}`}>Coach Assessment</p>
        <p className="text-sm text-slate-700 leading-relaxed">{assessmentText[status]}</p>
      

      {/* Coaching Notes */}
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

function NotesInput({ onAdd }) {
  const [noteText, setNoteText] = useState("");
  
  const handleAdd = () => {
    if (noteText.trim()) {
      onAdd(noteText.trim());
      setNoteText("");
    }
  };
  
  return (
    <div className="space-y-2">
      <textarea
        value={noteText}
        onChange={(e) => setNoteText(e.target.value)}
        placeholder="Add a note..."
        rows={2}
        className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-400 resize-none"
      />
      <button
        onClick={handleAdd}
        disabled={!noteText.trim()}
        className="text-sm font-medium bg-indigo-600 text-white px-4 py-1.5 rounded-lg hover:bg-indigo-700 disabled:opacity-40 transition-colors"
      >
        Add note
      </button>
    </div>

    </div>
  );
}

function AddInterventionForm({ onSave, onCancel }) {
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
  const inputCls = "w-full text-sm text-slate-800 border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all bg-white";

  // Check if data will be available for the chosen combination
  const hasData = !!getChartData(form.targetId, form.metric);

  return (
    <div className="p-5 overflow-y-auto h-full">
      <button onClick={onCancel} className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-700 mb-4 transition-colors font-medium">
        ← Back
      </button>

      <div className="flex items-center gap-3 mb-5">
        <div className="w-9 h-9 rounded-xl bg-indigo-100 flex items-center justify-center flex-shrink-0">
          <IcoFlag size={16} className="text-indigo-600" />
        </div>
        <div>
          <h2 className="text-base font-semibold text-slate-800">New Intervention</h2>
          <p className="text-xs text-slate-400 mt-0.5">Track whether a coaching action is producing the expected impact</p>
        </div>
      </div>

      <div className="space-y-4 max-w-xl">
        {/* Target + Metric row */}
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

        {/* Data availability hint */}
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

        {/* Name */}
        <div>
          <label className={labelCls}>Intervention name <span className="text-rose-400 normal-case tracking-normal">*</span></label>
          <input
            value={form.name}
            onChange={e => set("name", e.target.value)}
            placeholder="e.g. WIP cap — limit active items to 6"
            className={inputCls}
          />
        </div>

        {/* Start sprint */}
        <div>
          <label className={labelCls}>Start sprint</label>
          <select value={form.startSprint} onChange={e => set("startSprint", e.target.value)} className={inputCls}>
            {SPRINT_LIST.slice(1).map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <p className="text-xs text-slate-400 mt-1.5">The sprint in which this coaching action was introduced. Sprints before this will form the baseline.</p>
        </div>

        {/* Description */}
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

        {/* Actions */}
        <div className="flex gap-2 pt-1">
          <button
            onClick={handleSave}
            disabled={!canSave}
            className="flex items-center gap-1.5 text-sm font-medium bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm"
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

function InterventionCard({ intervention, onClick }) {
  const chartData  = getChartData(intervention.targetId, intervention.metric);
  const metricCfg  = METRIC_OPTIONS.find(m => m.id === intervention.metric);
  const stats      = chartData ? computeBeforeAfter(chartData, intervention.startSprint) : null;
  const status     = stats ? intStatus(stats.delta, metricCfg?.lowerIsBetter) : "unknown";
  const cfg        = INT_STATUS_CFG[status];
  const StatusIcon = cfg.Icon;

  const fmt  = (v) => v != null ? `${v.toFixed(1)}${metricCfg?.unit ?? ""}` : "—";
  const sign = stats && stats.delta > 0 ? "+" : "";

  const deltaColor = status === "improving" ? "text-emerald-600" : status === "worsening" ? "text-rose-600" : "text-slate-400";

  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-white rounded-xl border border-slate-200 shadow-sm hover:border-indigo-200 hover:shadow-md transition-all overflow-hidden"
    >
      <div className="px-4 py-3.5 flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center flex-shrink-0 mt-0.5">
          <IcoFlag size={14} className="text-indigo-600" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-slate-800 leading-snug">{intervention.name}</p>
          <div className="flex flex-wrap items-center gap-1.5 mt-1">
            <span className="text-xs bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-medium">{intervention.targetName}</span>
            <span className="text-xs text-slate-300">·</span>
            <span className="text-xs text-slate-400">Started {intervention.startSprint}</span>
            <span className="text-xs text-slate-300">·</span>
            <span className="text-xs text-slate-400">{metricCfg?.label}</span>
          </div>
        </div>
        <div className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border flex-shrink-0 ${cfg.bgCls} ${cfg.textCls} ${cfg.borderCls}`}>
          <StatusIcon size={10} />
          {cfg.label}
        </div>
      </div>

      {/* Before → After footer */}
      {stats ? (
        <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center gap-3">
          <div className="text-xs text-slate-500">
            Before <span className="font-bold text-slate-700">{fmt(stats.avgBefore)}</span>
          </div>
          <IcoRight size={10} className="text-slate-300 flex-shrink-0" />
          <div className="text-xs text-slate-500">
            After <span className="font-bold text-slate-700">{fmt(stats.avgAfter)}</span>
          </div>
          <div className="ml-auto flex items-center gap-1">
            <span className={`text-xs font-bold ${deltaColor}`}>
              {sign}{stats.delta.toFixed(1)}%
            </span>
            {status === "improving" && <IcoTrendUp size={11} className="text-emerald-500" />}
            {status === "worsening" && <IcoTrendDn size={11} className="text-rose-500" />}
          </div>
        </div>
      ) : (
        <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100">
          <span className="text-xs text-slate-400">No data available for this target + metric</span>
        </div>
      )}
    </button>
  );
}

function InterventionsList({ interventions, onSelect, onAdd }) {
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
          className="flex items-center gap-1.5 text-sm font-medium bg-indigo-600 text-white px-3.5 py-2 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm flex-shrink-0"
        >
          <IcoPlus size={13} /> New Intervention
        </button>
      </div>

      {interventions.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center mx-auto mb-3">
            <IcoFlag size={22} className="text-indigo-400" />
          </div>
          <p className="text-sm font-medium text-slate-500">No interventions yet</p>
          <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">Add an intervention to track whether your coaching actions are producing the expected metric improvements.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {interventions.map(i => (
            <InterventionCard key={i.id} intervention={i} onClick={() => onSelect(i)} />
          ))}
        </div>
      )}
    </div>
  );
}

function InterventionsTab() {
  const [view,          setView]          = useState("list");   // "list" | "detail" | "add"
  const [notesMap, setNotesMap] = useState({});

  const addNote = (interventionId, text) => {
    setNotesMap(prev => ({
      ...prev,
      [interventionId]: [...(prev[interventionId] || []), {
        id: Date.now(),
        text,
        timestamp: new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) + " · " + new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })
      }]
    }));
  };

  const [selected,      setSelected]      = useState(null);
  const [interventions, setInterventions] = useState(INTERVENTIONS_SEED);

  const handleSave = (newInt) => {
    setInterventions(prev => [...prev, newInt]);
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
    />
  );
}

// ─── SCHEDULED REPORTS TAB ───────────────────────────────────────────────────
const SECTION_STYLE = {
  danger:  { dot: "bg-rose-500",    heading: "text-rose-700",    bg: "bg-rose-50",    border: "border-rose-100"    },
  warning: { dot: "bg-amber-400",   heading: "text-amber-700",   bg: "bg-amber-50",   border: "border-amber-100"   },
  success: { dot: "bg-emerald-500", heading: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-100" },
  action:  { dot: "bg-indigo-500",  heading: "text-indigo-700",  bg: "bg-indigo-50",  border: "border-indigo-100"  },
  neutral: { dot: "bg-slate-400",   heading: "text-slate-600",   bg: "bg-slate-50",   border: "border-slate-200"   },
};

// Renders the report output styled as an email preview
function EmailPreview({ output, report }) {
  const now = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  return (
    <div className="rounded-xl border border-slate-200 overflow-hidden shadow-sm bg-white">
      {/* Email chrome */}
      <div className="bg-indigo-600 px-5 py-3 flex items-center gap-2.5">
        <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center flex-shrink-0">
          <IcoZap size={12} className="text-indigo-600" />
        </div>
        <span className="text-white text-sm font-semibold">Agent Coach</span>
      </div>
      {/* Headers */}
      <div className="bg-slate-50 border-b border-slate-200 px-5 py-3 space-y-1.5 text-xs text-slate-500">
        <div className="flex gap-3"><span className="font-semibold w-12 text-slate-400">From</span><span>Agent Coach &lt;coach@agentcoach.ai&gt;</span></div>
        <div className="flex gap-3"><span className="font-semibold w-12 text-slate-400">To</span><span className="font-medium text-slate-700">{report.delivery.address}</span></div>
        <div className="flex gap-3"><span className="font-semibold w-12 text-slate-400">Subject</span><span className="font-medium text-slate-700">[{scheduleLabel(report.schedule).split(" · ")[0]}] {output.title} — {now}</span></div>
      </div>
      {/* Body */}
      <div className="px-5 py-4">
        <p className="text-xs text-slate-400 mb-3">{now} · Generated by Agent Coach · <span className="italic">"{report.prompt.slice(0, 60)}..."</span></p>
        <h3 className="text-base font-bold text-slate-900 mb-4">{output.title}</h3>
        <div className="space-y-4">
          {output.sections.map((sec) => {
            const s = SECTION_STYLE[sec.style] || SECTION_STYLE.neutral;
            return (
              <div key={sec.heading}>
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${s.dot}`} />
                  <p className={`text-xs font-bold uppercase tracking-wide ${s.heading}`}>{sec.heading}</p>
                </div>
                <ul className="space-y-1.5 pl-4">
                  {sec.items.map((item) => (
                    <li key={item} className="text-xs text-slate-700 leading-relaxed flex gap-2">
                      <span className="text-slate-300 flex-shrink-0">—</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-400">
          <IcoZap size={11} className="text-indigo-400" />
          Generated by Agent Coach · Payments Platform · {scheduleLabel(report.schedule)} ·
          <a href="#" className="text-indigo-500 hover:underline ml-0.5">Manage schedules</a>
        </div>
      </div>
    </div>
  );
}

// Renders the report output styled as a Microsoft Teams message card
function TeamsPreview({ output, report }) {
  const now = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  return (
    <div className="rounded-xl border border-slate-200 overflow-hidden shadow-sm bg-white">
      {/* Teams chrome bar */}
      <div className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 border-b border-slate-700">
        <div className="w-6 h-6 rounded bg-indigo-500 flex items-center justify-center flex-shrink-0">
          <span className="text-white text-xs font-black">T</span>
        </div>
        <span className="text-sm text-white font-semibold">Microsoft Teams</span>
        <span className="text-xs text-slate-500 ml-1">· #engineering-delivery</span>
      </div>
      {/* Message */}
      <div className="p-4">
        <div className="flex items-start gap-2.5 mb-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center flex-shrink-0">
            <IcoZap size={13} className="text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-slate-900">Agent Coach</span>
              <span className="text-xs text-slate-400">{now}</span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5 italic">"{report.prompt.slice(0, 70)}..."</p>
          </div>
        </div>
        {/* Adaptive card body */}
        <div className="ml-10 border-l-4 border-indigo-500 pl-4 rounded-sm">
          <p className="text-sm font-bold text-slate-900 mb-3">{output.title}</p>
          <div className="space-y-3">
            {output.sections.map((sec) => {
              const s = SECTION_STYLE[sec.style] || SECTION_STYLE.neutral;
              return (
                <div key={sec.heading} className={`rounded-lg px-3 py-2.5 border ${s.bg} ${s.border}`}>
                  <p className={`text-xs font-bold mb-1.5 ${s.heading}`}>{sec.heading}</p>
                  <ul className="space-y-1">
                    {sec.items.map((item) => (
                      <li key={item} className="text-xs text-slate-700 leading-relaxed flex gap-1.5">
                        <span className={`${s.dot} w-1 h-1 rounded-full mt-1.5 flex-shrink-0`} />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
          <p className="text-xs text-slate-400 mt-3 flex items-center gap-1">
            <IcoZap size={10} className="text-indigo-400" /> Scheduled by Agent Coach · {scheduleLabel(report.schedule)}
          </p>
        </div>
      </div>
    </div>
  );
}

function ReportPreviewPanel({ report, onBack }) {
  const [sent, setSent] = useState(false);
  const output = generateReportOutput(report.prompt);
  const isEmail = report.delivery.channel === "email";

  return (
    <div className="p-5 overflow-y-auto h-full">
      <button onClick={onBack} className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-700 mb-4 transition-colors font-medium">
        ← Back
      </button>

      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-5">
        <div>
          <h2 className="text-base font-semibold text-slate-800">{report.name}</h2>
          <div className="flex items-center gap-2 mt-1.5">
            <span className={`flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-full ${isEmail ? "bg-sky-50 text-sky-700 border border-sky-200" : "bg-indigo-50 text-indigo-700 border border-indigo-200"}`}>
              {isEmail ? <IcoMail size={10} /> : <span className="font-black text-xs">T</span>}
              {isEmail ? `Email · ${report.delivery.address}` : `Microsoft Teams`}
            </span>
            <span className="flex items-center gap-1 text-xs text-slate-400">
              <IcoClock size={10} /> {scheduleLabel(report.schedule)}
            </span>
          </div>
        </div>
        {sent ? (
          <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg flex-shrink-0">
            <IcoOk size={13} /> Sent successfully
          </div>
        ) : (
          <button
            onClick={() => setSent(true)}
            className="flex items-center gap-1.5 text-sm font-medium bg-indigo-600 text-white px-3.5 py-2 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm flex-shrink-0"
          >
            <IcoPlay size={12} /> Send now
          </button>
        )}
      </div>

      {/* Prompt used */}
      <div className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 mb-4 text-xs text-slate-500">
        <span className="font-semibold text-slate-600 uppercase tracking-wide text-xs">Prompt: </span>
        {report.prompt}
      </div>

      {/* Channel preview */}
      {isEmail
        ? <EmailPreview output={output} report={report} />
        : <TeamsPreview output={output} report={report} />
      }
    </div>
  );
}

function CreateReportForm({ onSave, onCancel }) {
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
  const inputCls = "w-full text-sm text-slate-800 border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all bg-white";

  // Fake report object for preview
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
        <div className="w-9 h-9 rounded-xl bg-indigo-100 flex items-center justify-center flex-shrink-0">
          <IcoClock size={16} className="text-indigo-600" />
        </div>
        <div>
          <h2 className="text-base font-semibold text-slate-800">New Scheduled Report</h2>
          <p className="text-xs text-slate-400 mt-0.5">Send an AI-generated report to email or Microsoft Teams on a schedule</p>
        </div>
      </div>

      <div className="space-y-5 max-w-xl">
        {/* ── Name ── */}
        <div>
          <label className={labelCls}>Report name <span className="text-rose-400 normal-case font-normal tracking-normal">*</span></label>
          <input
            value={form.name}
            onChange={e => set("name", e.target.value)}
            placeholder="e.g. Weekly Phoenix Flow Summary"
            className={inputCls}
          />
        </div>

        {/* ── Prompt ── */}
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

        {/* ── Schedule ── */}
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
                  <button
                    key={d}
                    onClick={() => set("day", d)}
                    className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-colors ${form.day === d ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-slate-500 border-slate-200 hover:border-indigo-300"}`}
                  >
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

        {/* ── Delivery ── */}
        <div>
          <label className={labelCls}>Delivery channel</label>
          {/* Toggle */}
          <div className="flex rounded-xl border border-slate-200 overflow-hidden mb-3 bg-slate-50">
            {[
              { id: "email", label: "Email",           Icon: IcoMail  },
              { id: "teams", label: "Microsoft Teams", Icon: IcoActivity },
            ].map(({ id, label, Icon }) => (
              <button
                key={id}
                onClick={() => set("channel", id)}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium transition-colors ${form.channel === id ? "bg-white text-indigo-700 shadow-sm border border-slate-200 rounded-xl mx-1 my-1" : "text-slate-400 hover:text-slate-600"}`}
              >
                <Icon size={14} /> {label}
              </button>
            ))}
          </div>

          {form.channel === "email" ? (
            <div>
              <p className="text-xs text-slate-400 mb-1.5">Email address <span className="text-rose-400">*</span></p>
              <input
                value={form.address}
                onChange={e => set("address", e.target.value)}
                placeholder="you@company.com"
                type="email"
                className={inputCls}
              />
            </div>
          ) : (
            <div>
              <p className="text-xs text-slate-400 mb-1.5">Teams Incoming Webhook URL <span className="text-rose-400">*</span></p>
              <input
                value={form.webhookUrl}
                onChange={e => set("webhookUrl", e.target.value)}
                placeholder="https://outlook.office.com/webhook/..."
                className={inputCls}
              />
              <p className="text-xs text-slate-400 mt-1.5">
                Create an Incoming Webhook connector in your Teams channel and paste the URL here.
              </p>
            </div>
          )}
        </div>

        {/* ── Actions ── */}
        <div className="flex gap-2 pt-1">
          <button
            onClick={() => form.prompt.trim() && setPreview(true)}
            disabled={!form.prompt.trim()}
            className="flex items-center gap-1.5 text-sm font-medium bg-white border border-slate-200 text-slate-600 px-4 py-2 rounded-lg hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm"
          >
            <IcoPlay size={13} /> Preview output
          </button>
          <button
            onClick={handleSave}
            disabled={!canSave}
            className="flex items-center gap-1.5 text-sm font-medium bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm"
          >
            <IcoClock size={13} /> Save & schedule
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

function ReportCard({ report, onPreview, onToggle, onDelete }) {
  const isEmail = report.delivery.channel === "email";
  const isActive = report.status === "active";

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-4 py-3.5">
        <div className="flex items-start gap-3">
          {/* Channel icon */}
          <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${isEmail ? "bg-sky-50" : "bg-indigo-50"}`}>
            {isEmail
              ? <IcoMail size={15} className="text-sky-600" />
              : <span className="text-indigo-700 font-black text-sm">T</span>
            }
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start gap-2">
              <p className="text-sm font-semibold text-slate-800 flex-1 leading-snug">{report.name}</p>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${isActive ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-400"}`}>
                {isActive ? "Active" : "Paused"}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed line-clamp-1 italic">"{report.prompt.slice(0, 80)}{report.prompt.length > 80 ? "…" : ""}"</p>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <span className="flex items-center gap-1 text-xs text-slate-500">
                <IcoClock size={10} className="text-slate-400" />
                {scheduleLabel(report.schedule)}
              </span>
              <span className="text-slate-200">·</span>
              <span className={`flex items-center gap-1 text-xs font-medium ${isEmail ? "text-sky-600" : "text-indigo-600"}`}>
                {isEmail ? <IcoMail size={10} /> : <span className="font-black text-xs">T</span>}
                {isEmail ? report.delivery.address : "Microsoft Teams"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer: last/next + actions */}
      <div className="flex items-center gap-3 px-4 py-2.5 bg-slate-50 border-t border-slate-100">
        <div className="flex-1 flex items-center gap-4 text-xs text-slate-400">
          {report.lastSent && (
            <span>Last sent <span className="font-medium text-slate-600">{report.lastSent}</span></span>
          )}
          {report.nextSend && (
            <span>Next <span className="font-medium text-slate-600">{report.nextSend}</span></span>
          )}
          {!report.lastSent && <span className="italic">Never sent</span>}
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onPreview(report)}
            title="Run now & preview"
            className="flex items-center gap-1 text-xs text-indigo-600 hover:bg-indigo-50 px-2 py-1.5 rounded-lg transition-colors font-medium"
          >
            <IcoPlay size={11} /> Run now
          </button>
          <button
            onClick={() => onToggle(report.id)}
            title={isActive ? "Pause" : "Resume"}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            {isActive ? <IcoPause size={13} /> : <IcoPlay size={13} />}
          </button>
          <button
            onClick={() => onDelete(report.id)}
            title="Delete"
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
          >
            <IcoTrash size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}

function ReportsTab() {
  const [view,     setView]    = useState("list"); // "list" | "create" | "preview"
  const [reports,  setReports] = useState(SCHEDULED_REPORTS_SEED);
  const [preview,  setPreview] = useState(null);   // report object being previewed

  const handleSave = (r) => {
    setReports(prev => [...prev, r]);
    setView("list");
  };
  const handleToggle = (id) => {
    setReports(prev => prev.map(r => r.id === id ? { ...r, status: r.status === "active" ? "paused" : "active" } : r));
  };
  const handleDelete = (id) => {
    setReports(prev => prev.filter(r => r.id !== id));
  };
  const handlePreview = (report) => {
    setPreview(report);
    setView("preview");
  };

  if (view === "preview" && preview) {
    return (
      <ReportPreviewPanel
        report={preview}
        onBack={() => { setPreview(null); setView("list"); }}
      />
    );
  }
  if (view === "create") {
    return <CreateReportForm onSave={handleSave} onCancel={() => setView("list")} />;
  }

  // List view
  const active = reports.filter(r => r.status === "active").length;
  return (
    <div className="p-5 overflow-y-auto h-full">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-base font-semibold text-slate-800">Scheduled Reports</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {reports.length} report{reports.length !== 1 ? "s" : ""}
            {active > 0 && <span className="text-emerald-600 font-medium"> · {active} active</span>}
            {" · "}delivered via email or Microsoft Teams
          </p>
        </div>
        <button
          onClick={() => setView("create")}
          className="flex items-center gap-1.5 text-sm font-medium bg-indigo-600 text-white px-3.5 py-2 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm flex-shrink-0"
        >
          <IcoPlus size={13} /> New Report
        </button>
      </div>

      {reports.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center mx-auto mb-3">
            <IcoClock size={22} className="text-indigo-400" />
          </div>
          <p className="text-sm font-medium text-slate-500">No scheduled reports yet</p>
          <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">Schedule a recurring AI coaching report and receive it in your inbox or Teams channel automatically.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {reports.map(r => (
            <ReportCard
              key={r.id}
              report={r}
              onPreview={handlePreview}
              onToggle={handleToggle}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── SIDEBAR ─────────────────────────────────────────────────────────────────
const NAV = [
  { id: "coach",         Icon: IcoChat,   label: "Coach",         badge: null },
  { id: "overview",      Icon: IcoGrid,   label: "Overview",      badge: null },
  { id: "okrs",          Icon: IcoTarget, label: "OKRs",          badge: null },
  { id: "portfolio",     Icon: IcoLayers, label: "Portfolio",     badge: null },
  { id: "interventions", Icon: IcoFlag,   label: "Interventions", badge: null },
  { id: "playbook",      Icon: IcoBook,   label: "Playbook",      badge: null },
  { id: "reports",       Icon: IcoClock,  label: "Reports",       badge: null },
  { id: "actions",       Icon: IcoGit,    label: "Jira Actions",  badge: 5    },
];

function Sidebar({ tab, setTab, squad, setSquad }) {
  const [open, setOpen] = useState({ checkout: true, wallet: false });
  const toggle = (id) => setOpen((o) => ({ ...o, [id]: !o[id] }));

  return (
    <div className="hidden md:flex w-56 flex-shrink-0 bg-slate-900 flex-col h-full">
      <div className="px-4 py-4 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow">
            <IcoZap size={15} className="text-white" />
          </div>
          <div>
            <p className="text-white font-bold text-sm leading-none">Agent Coach</p>
            <p className="text-slate-500 text-xs mt-0.5">AI Delivery Intelligence</p>
          </div>
        </div>
      </div>

      <div className="px-2 py-3 border-b border-slate-800 space-y-0.5">
        {NAV.map(({ id, Icon, label, badge }) => (
          <button key={id} onClick={() => setTab(id)}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${tab === id ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white hover:bg-slate-800"}`}>
            <Icon size={15} />
            <span className="flex-1 text-left">{label}</span>
            {badge && <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${tab === id ? "bg-white text-indigo-600" : "bg-slate-700 text-slate-400"}`}>{badge}</span>}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto px-2 py-3">
        <p className="px-3 mb-2 text-xs font-semibold text-slate-600 uppercase tracking-wide">Payments Platform</p>
        {ORG.crews.map((crew) => (
          <div key={crew.id} className="mb-1">
            <button onClick={() => toggle(crew.id)}
              className="w-full flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors">
              {open[crew.id] ? <IcoDown size={11} /> : <IcoRight size={11} />}
              <IcoUsers size={11} />
              <span>{crew.name}</span>
            </button>
            {open[crew.id] && (
              <div className="ml-5 mt-0.5 space-y-0.5">
                {crew.squads.map((sq) => (
                  <button key={sq.id} onClick={() => setSquad(sq.id)}
                    className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs transition-colors ${squad === sq.id ? "bg-slate-700 text-white" : "text-slate-500 hover:text-slate-300 hover:bg-slate-800"}`}>
                    <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${sq.id === "phoenix" ? "bg-amber-400" : "bg-emerald-400"}`} />
                    {sq.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="px-4 py-3 border-t border-slate-800">
        <p className="text-xs text-slate-500 font-medium">James</p>
        <p className="text-xs text-slate-700 mt-0.5">Last sync: 2 min ago · Enterprise</p>
      </div>
    </div>
  );
}

// ─── ROOT APP ─────────────────────────────────────────────────────────────────
const TABS = {
  coach: CoachTab, overview: OverviewTab, okrs: OKRTab, portfolio: PortfolioTab,
  interventions: InterventionsTab, playbook: PlaybookTab, reports: ReportsTab, actions: ActionsTab,
};
const TAB_LABELS = {
  coach: "Coach", overview: "Overview", okrs: "OKRs", portfolio: "Portfolio",
  interventions: "Interventions", playbook: "Playbook", reports: "Reports", actions: "Jira Actions",
};

export default function App() {
  const [tab,   setTab]   = useState("coach");
  const [alerts, setAlerts] = useState(ALERTS_DATA);
  const [squad, setSquad] = useState("phoenix");
  
  const handleAlertRead = (alertId) => {
    setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, read: true } : a));
  };
  
  const handleAlertReadAll = () => {
    setAlerts(prev => prev.map(a => ({ ...a, read: true })));
  };

  const Tab = TABS[tab];

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      <Sidebar tab={tab} setTab={setTab} squad={squad} setSquad={setSquad} />
      <div className="flex-1 flex flex-col min-w-0">
        <div className="hidden md:flex items-center gap-0.5 px-3 py-2 border-b border-slate-200 bg-white flex-shrink-0 overflow-x-auto">
          {Object.entries(TAB_LABELS).map(([id, label]) => (
            <button key={id} onClick={() => setTab(id)}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${tab === id ? "bg-slate-100 text-slate-900" : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"}`}>
              {label}
              {id === "actions" && <span className="text-xs bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full font-bold leading-none">3</span>}
            </button>
          ))}
        
        <div className="ml-auto flex-shrink-0 pl-4 border-l border-slate-200">
          <AlertBell alerts={alerts} onRead={onAlertRead} onReadAll={onAlertReadAll} />
        </div>
      </div>
        <div className="flex-1 overflow-hidden pb-14 md:pb-0">
          <Tab alerts={alerts} onAlertRead={handleAlertRead} onAlertReadAll={handleAlertReadAll} setShowWhatIf={typeof setShowWhatIf !== 'undefined' ? setShowWhatIf : undefined} />
        </div>
      </div>
    
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800 flex z-20">
        {NAV.slice(0, 5).map(({ id, Icon, label, badge }) => (
          <button key={id} onClick={() => setTab(id)}
            className={`flex-1 flex flex-col items-center justify-center py-2 gap-0.5 text-xs transition-colors ${tab === id ? "text-indigo-400" : "text-slate-500"}`}>
            <Icon size={18} />
            <span className="text-xs leading-none">{label.split(" ")[0]}</span>
            {badge && <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-rose-500 text-white text-xs font-bold rounded-full flex items-center justify-center leading-none" style={{fontSize:8}}>{badge}</span>}
          </button>
        ))}
      </nav>
</div>
  );
}      {showWhatIf && <WhatIfPanel onClose={() => setShowWhatIf(false)} />}

      
