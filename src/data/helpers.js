import {
  FLOW_TIME_DATA, EFFICIENCY_DATA, ORION_VELOCITY_SERIES,
} from "./constants";

export function getChartData(targetId, metricId) {
  if (metricId === "flowTime"   && targetId === "phoenix")  return FLOW_TIME_DATA.map(d => ({ sprint: d.sprint, value: d.median }));
  if (metricId === "velocity"   && targetId === "orion")    return ORION_VELOCITY_SERIES;
  if (metricId === "efficiency" && targetId === "phoenix")  return EFFICIENCY_DATA.map(d => ({ sprint: d.sprint, value: d.efficiency }));
  return null;
}

export function computeBeforeAfter(chartData, startSprint) {
  const idx = chartData.findIndex(d => d.sprint === startSprint);
  if (idx <= 0) return null;
  const bv = chartData.slice(0, idx).map(d => d.value);
  const av = chartData.slice(idx).map(d => d.value);
  if (!bv.length || !av.length) return null;
  const avgBefore = bv.reduce((a, b) => a + b, 0) / bv.length;
  const avgAfter  = av.reduce((a, b) => a + b, 0) / av.length;
  const delta     = ((avgAfter - avgBefore) / avgBefore) * 100;
  return { avgBefore, avgAfter, delta, beforeCount: bv.length, afterCount: av.length };
}

export function intStatus(delta, lowerIsBetter) {
  if (delta == null) return "unknown";
  const improving = lowerIsBetter ? delta < -5  : delta > 5;
  const worsening = lowerIsBetter ? delta > 5   : delta < -5;
  return improving ? "improving" : worsening ? "worsening" : "neutral";
}

export function heatCell(metric, value, wipLimit) {
  if (metric === "flowTime")   return value <= 4 ? "bg-emerald-50 text-emerald-700" : value <= 7 ? "bg-amber-50 text-amber-700" : "bg-rose-50 text-rose-700";
  if (metric === "velocity")   return value >= 18 ? "bg-emerald-50 text-emerald-700" : value >= 12 ? "bg-amber-50 text-amber-700" : "bg-rose-50 text-rose-700";
  if (metric === "efficiency") return value >= 55 ? "bg-emerald-50 text-emerald-700" : value >= 35 ? "bg-amber-50 text-amber-700" : "bg-rose-50 text-rose-700";
  if (metric === "wip")        return value <= wipLimit ? "bg-emerald-50 text-emerald-700" : value <= wipLimit+1 ? "bg-amber-50 text-amber-700" : "bg-rose-50 text-rose-700";
  if (metric === "health")     return value >= 4 ? "bg-emerald-50 text-emerald-700" : value >= 3 ? "bg-amber-50 text-amber-700" : "bg-rose-50 text-rose-700";
  return "bg-slate-50 text-slate-600";
}

export function fmtTime(t = "09:00") {
  const [h] = t.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const h12  = h > 12 ? h - 12 : h === 0 ? 12 : h;
  return `${h12}:00 ${ampm}`;
}

export function scheduleLabel(s) {
  const t = fmtTime(s.time);
  if (s.type === "daily")    return `Daily \u00B7 ${t}`;
  if (s.type === "weekly")   return `Weekly \u00B7 ${s.day} \u00B7 ${t}`;
  if (s.type === "biweekly") return `Bi-weekly \u00B7 ${s.day} \u00B7 ${t}`;
  if (s.type === "monthly")  return `Monthly \u00B7 ${t}`;
  return t;
}

export function generateReportOutput(prompt) {
  const p = prompt.toLowerCase();

  if (p.includes("flow") || p.includes("phoenix") || p.includes("wip") || p.includes("efficiency")) {
    return {
      title: "Flow Health Report \u2014 Squad Phoenix",
      sections: [
        { heading: "Critical Issues", style: "danger", items: ["Flow Time: 6.4d median \u2014 doubled over 6 sprints (baseline 3.2d in S18)", "WIP Overload: 9 items active vs. configured limit of 6 \u2014 50% over capacity", "Flow Efficiency: 31% \u2014 crew median is 55%, diverging further each sprint"] },
        { heading: "Top Coaching Recommendations", style: "action", items: ["Cap WIP at 6 items immediately \u2014 agree with squad in next standup", "Assign a dedicated review rotation: max 3 items in review at once", "Flag PAY-243 (21d) and PAY-230 (28d) as blocked \u2014 two Jira actions awaiting approval"] },
        { heading: "Key Metrics Snapshot", style: "neutral", items: ["Flow Time: 6.4d \u25B2 (was 3.2d \u00B7 +100%)", "Flow Efficiency: 31% \u25BC (crew avg 55%)", "Velocity: 10 items \u25BC (was 18 \u00B7 \u221244%)", "WIP Load: 9 items \u26A0 (limit 6)"] },
        { heading: "OKR Impact", style: "warning", items: ["KR1 (Reduce payment failures): Low confidence \u2014 depends on Phoenix delivery", "KR2 (Reduce abandonment): Low confidence \u2014 epic only 12% complete"] },
      ],
    };
  }

  if (p.includes("okr") || p.includes("key result") || p.includes("objective") || p.includes("confidence")) {
    return {
      title: "OKR Confidence Report \u2014 Payments Platform",
      sections: [
        { heading: "Checkout Crew \u2014 Medium Confidence", style: "warning", items: ["KR1 Reduce payment failure rate: 34% progress \u00B7 Low confidence", "KR2 Reduce checkout abandonment: 12% progress \u00B7 Low confidence", "KR3 One-click checkout for returning users: 72% progress \u00B7 High confidence \u2713"] },
        { heading: "Wallet Crew \u2014 High Confidence", style: "success", items: ["KR4 Transaction reliability < 0.05%: 78% progress \u00B7 High confidence \u2713", "KR5 Real-time transaction status API: 55% progress \u00B7 Medium confidence"] },
        { heading: "Recommended Actions", style: "action", items: ["Escalate PAY-E001 \u2014 primary blocker for KR1 which is Low confidence", "Review KR2 target with Checkout Crew \u2014 Squad Phoenix flow health makes Q2 delivery unlikely without intervention", "Wallet Crew OKRs on track \u2014 no action required this week"] },
      ],
    };
  }

  if (p.includes("portfolio") || p.includes("epic") || p.includes("forecast") || p.includes("delivery")) {
    return {
      title: "Epic Portfolio Report \u2014 Payments Platform",
      sections: [
        { heading: "At Risk \u2014 2 epics", style: "danger", items: ["PAY-E001 Payment Failure Remediation: 34% \u00B7 P70 Apr 14 (target Mar 31 \u00B7 14d late) \u00B7 Squad Phoenix", "PAY-E003 Abandonment Analytics: 12% \u00B7 P70 May 10 (target Apr 30 \u00B7 10d late) \u00B7 Squad Phoenix"] },
        { heading: "On Track \u2014 3 epics", style: "success", items: ["PAY-E002 One-Click Checkout: 72% \u00B7 P70 Mar 28 \u00B7 Squad Orion \u2713", "WAL-E004 Transaction Reliability: 78% \u00B7 P70 Apr 12 \u00B7 Squad Nexus \u2713", "WAL-E005 Real-time Status API: 55% \u00B7 P70 Apr 28 \u00B7 Squad Atlas \u2713"] },
        { heading: "Recommended Actions", style: "action", items: ["Escalate PAY-E001 \u2014 14 days behind P70, blocking KR1 OKR target", "Review Squad Phoenix WIP and sprint scope to improve PAY-E003 forecast"] },
      ],
    };
  }

  return {
    title: "Weekly Delivery Summary \u2014 Payments Platform",
    sections: [
      { heading: "This Week's Alerts", style: "danger", items: ["Squad Phoenix flow health critical \u2014 WIP, Flow Time, and Efficiency all degrading", "2 epics forecast to miss target dates: PAY-E001 (\u221214d) and PAY-E003 (\u221210d)"] },
      { heading: "Healthy Signals", style: "success", items: ["Squad Orion performing well \u2014 velocity stable at 21 items/sprint", "Wallet Crew epics on track \u2014 WAL-E004 at 78% with solid P70"] },
      { heading: "Actions This Week", style: "action", items: ["Review WIP cap with Squad Phoenix in next standup", "Approve 3 pending Jira actions to reduce Phoenix WIP overload", "Check KR1 and KR2 confidence in weekly OKR review"] },
    ],
  };
}

let _id = 200;
export const uid = () => ++_id;

/* respond() has moved to src/data/respond.js — re-export for backward compat */
export { respond } from "./respond";
