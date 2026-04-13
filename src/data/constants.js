import { C } from "./palette";
import {
  IcoChat, IcoTarget, IcoLayers, IcoGit, IcoFlag,
  IcoBook, IcoClock, IcoGrid, IcoTrendUp, IcoTrendDn,
  IcoMinus, IcoActivity,
} from "@/components/icons";

export const ORG = {
  name: "Payments Platform",
  crews: [
    { id: "checkout", name: "Checkout Crew", squads: [{ id: "phoenix", name: "Squad Phoenix" }, { id: "orion", name: "Squad Orion" }] },
    { id: "wallet",   name: "Wallet Crew",   squads: [{ id: "nexus",   name: "Squad Nexus"   }, { id: "atlas",  name: "Squad Atlas"  }] },
  ],
};

/* ── Per-squad metric time-series ─────────────────────────────── */
export const SQUAD_METRICS = {
  phoenix: {
    flowTime: [
      { sprint: "S18", median: 3.2, p85: 6.1  },
      { sprint: "S19", median: 3.8, p85: 7.2  },
      { sprint: "S20", median: 4.6, p85: 8.8  },
      { sprint: "S21", median: 4.2, p85: 7.9  },
      { sprint: "S22", median: 3.6, p85: 6.8  },
      { sprint: "S23", median: 3.1, p85: 5.8  },
    ],
    velocity: [
      { sprint: "S18", value: 18 }, { sprint: "S19", value: 16 },
      { sprint: "S20", value: 13 }, { sprint: "S21", value: 15 },
      { sprint: "S22", value: 18 }, { sprint: "S23", value: 20 },
    ],
    efficiency: [
      { sprint: "S18", efficiency: 68 }, { sprint: "S19", efficiency: 60 },
      { sprint: "S20", efficiency: 48 }, { sprint: "S21", efficiency: 52 },
      { sprint: "S22", efficiency: 59 }, { sprint: "S23", efficiency: 64 },
    ],
    distribution: [
      { name: "Features",  value: 32, color: C.navy  },
      { name: "Bugs",      value: 41, color: C.cbaYellow },
      { name: "Tech Debt", value: 18, color: C.teal  },
      { name: "Risk",      value:  9, color: C.coral  },
    ],
    scatterYoung: [
      { age: 2, stage: 1, id: "PAY-301" }, { age: 3, stage: 2, id: "PAY-289" },
      { age: 5, stage: 1, id: "PAY-312" }, { age: 7, stage: 2, id: "PAY-298" },
      { age: 12, stage: 3, id: "PAY-274" },
    ],
    scatterOld: [
      { age: 15, stage: 2, id: "PAY-261" },
      { age: 21, stage: 1, id: "PAY-243" },
      { age: 28, stage: 2, id: "PAY-230" },
    ],
  },
  orion: {
    flowTime: [
      { sprint: "S18", median: 3.8, p85: 7.2 },
      { sprint: "S19", median: 3.5, p85: 6.5 },
      { sprint: "S20", median: 3.3, p85: 6.1 },
      { sprint: "S21", median: 3.2, p85: 5.8 },
      { sprint: "S22", median: 3.0, p85: 5.5 },
      { sprint: "S23", median: 3.1, p85: 5.4 },
    ],
    velocity: [
      { sprint: "S18", value: 18 }, { sprint: "S19", value: 20 },
      { sprint: "S20", value: 22 }, { sprint: "S21", value: 20 },
      { sprint: "S22", value: 19 }, { sprint: "S23", value: 21 },
    ],
    efficiency: [
      { sprint: "S18", efficiency: 55 }, { sprint: "S19", efficiency: 58 },
      { sprint: "S20", efficiency: 60 }, { sprint: "S21", efficiency: 62 },
      { sprint: "S22", efficiency: 61 }, { sprint: "S23", efficiency: 62 },
    ],
    distribution: [
      { name: "Features",  value: 52, color: C.navy  },
      { name: "Bugs",      value: 18, color: C.cbaYellow },
      { name: "Tech Debt", value: 22, color: C.teal  },
      { name: "Risk",      value:  8, color: C.coral  },
    ],
    scatterYoung: [
      { age: 1, stage: 1, id: "PAY-340" }, { age: 2, stage: 2, id: "PAY-335" },
      { age: 4, stage: 1, id: "PAY-338" }, { age: 6, stage: 3, id: "PAY-332" },
    ],
    scatterOld: [],
  },
  nexus: {
    flowTime: [
      { sprint: "S18", median: 4.5, p85: 8.0 },
      { sprint: "S19", median: 4.3, p85: 7.6 },
      { sprint: "S20", median: 4.4, p85: 7.8 },
      { sprint: "S21", median: 4.1, p85: 7.2 },
      { sprint: "S22", median: 4.3, p85: 7.5 },
      { sprint: "S23", median: 4.2, p85: 7.4 },
    ],
    velocity: [
      { sprint: "S18", value: 15 }, { sprint: "S19", value: 16 },
      { sprint: "S20", value: 15 }, { sprint: "S21", value: 17 },
      { sprint: "S22", value: 16 }, { sprint: "S23", value: 16 },
    ],
    efficiency: [
      { sprint: "S18", efficiency: 52 }, { sprint: "S19", efficiency: 53 },
      { sprint: "S20", efficiency: 55 }, { sprint: "S21", efficiency: 54 },
      { sprint: "S22", efficiency: 53 }, { sprint: "S23", efficiency: 54 },
    ],
    distribution: [
      { name: "Features",  value: 45, color: C.navy  },
      { name: "Bugs",      value: 20, color: C.cbaYellow },
      { name: "Tech Debt", value: 25, color: C.teal  },
      { name: "Risk",      value: 10, color: C.coral  },
    ],
    scatterYoung: [
      { age: 3, stage: 1, id: "WAL-210" }, { age: 5, stage: 2, id: "WAL-205" },
      { age: 7, stage: 1, id: "WAL-212" }, { age: 4, stage: 3, id: "WAL-208" },
      { age: 9, stage: 2, id: "WAL-201" },
    ],
    scatterOld: [
      { age: 16, stage: 2, id: "WAL-195" },
    ],
  },
  atlas: {
    flowTime: [
      { sprint: "S18", median: 5.0, p85: 9.2 },
      { sprint: "S19", median: 4.8, p85: 8.8 },
      { sprint: "S20", median: 4.5, p85: 8.2 },
      { sprint: "S21", median: 4.2, p85: 7.8 },
      { sprint: "S22", median: 4.0, p85: 7.4 },
      { sprint: "S23", median: 3.8, p85: 7.0 },
    ],
    velocity: [
      { sprint: "S18", value: 12 }, { sprint: "S19", value: 12 },
      { sprint: "S20", value: 13 }, { sprint: "S21", value: 13 },
      { sprint: "S22", value: 14 }, { sprint: "S23", value: 14 },
    ],
    efficiency: [
      { sprint: "S18", efficiency: 48 }, { sprint: "S19", efficiency: 50 },
      { sprint: "S20", efficiency: 52 }, { sprint: "S21", efficiency: 55 },
      { sprint: "S22", efficiency: 57 }, { sprint: "S23", efficiency: 58 },
    ],
    distribution: [
      { name: "Features",  value: 40, color: C.navy  },
      { name: "Bugs",      value: 22, color: C.cbaYellow },
      { name: "Tech Debt", value: 28, color: C.teal  },
      { name: "Risk",      value: 10, color: C.coral  },
    ],
    scatterYoung: [
      { age: 2, stage: 1, id: "WAL-250" }, { age: 3, stage: 1, id: "WAL-248" },
      { age: 6, stage: 2, id: "WAL-245" }, { age: 8, stage: 2, id: "WAL-242" },
    ],
    scatterOld: [
      { age: 18, stage: 1, id: "WAL-235" },
    ],
  },
};

/* ── Crew-level aggregates ─────────────────────────────── */
export const CREW_METRICS = {
  checkout: {
    flowTime: SQUAD_METRICS.phoenix.flowTime.map((d, i) => {
      const o = SQUAD_METRICS.orion.flowTime[i];
      return { sprint: d.sprint, median: +((d.median + o.median) / 2).toFixed(1), p85: +((d.p85 + o.p85) / 2).toFixed(1) };
    }),
    velocity: SQUAD_METRICS.phoenix.velocity.map((d, i) => {
      const o = SQUAD_METRICS.orion.velocity[i];
      return { sprint: d.sprint, value: Math.round((d.value + o.value) / 2) };
    }),
    efficiency: SQUAD_METRICS.phoenix.efficiency.map((d, i) => {
      const o = SQUAD_METRICS.orion.efficiency[i];
      return { sprint: d.sprint, efficiency: Math.round((d.efficiency + o.efficiency) / 2) };
    }),
  },
  wallet: {
    flowTime: SQUAD_METRICS.nexus.flowTime.map((d, i) => {
      const a = SQUAD_METRICS.atlas.flowTime[i];
      return { sprint: d.sprint, median: +((d.median + a.median) / 2).toFixed(1), p85: +((d.p85 + a.p85) / 2).toFixed(1) };
    }),
    velocity: SQUAD_METRICS.nexus.velocity.map((d, i) => {
      const a = SQUAD_METRICS.atlas.velocity[i];
      return { sprint: d.sprint, value: Math.round((d.value + a.value) / 2) };
    }),
    efficiency: SQUAD_METRICS.nexus.efficiency.map((d, i) => {
      const a = SQUAD_METRICS.atlas.efficiency[i];
      return { sprint: d.sprint, efficiency: Math.round((d.efficiency + a.efficiency) / 2) };
    }),
  },
};

/* ── Legacy aliases (used by non-coach tabs) ───────────── */
export const FLOW_TIME_DATA   = SQUAD_METRICS.phoenix.flowTime;
export const EFFICIENCY_DATA  = SQUAD_METRICS.phoenix.efficiency;
export const DISTRIBUTION_DATA = SQUAD_METRICS.phoenix.distribution;
export const SCATTER_YOUNG    = SQUAD_METRICS.phoenix.scatterYoung;
export const SCATTER_OLD      = SQUAD_METRICS.phoenix.scatterOld;

export const VELOCITY_DATA = [
  { sprint: "S20", Phoenix: 18, Orion: 22 },
  { sprint: "S21", Phoenix: 15, Orion: 20 },
  { sprint: "S22", Phoenix: 12, Orion: 19 },
  { sprint: "S23", Phoenix: 10, Orion: 21 },
];

export const OKRS = [
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

export const EPICS = [
  { id: "PAY-E001", name: "Payment Failure Remediation", squad: "Squad Phoenix", target: "Mar 31", p70: "Apr 14", status: "at-risk",  pct: 34, okr: "KR1" },
  { id: "PAY-E002", name: "One-Click Checkout",          squad: "Squad Orion",   target: "Mar 31", p70: "Mar 28", status: "on-track", pct: 72, okr: "KR3" },
  { id: "PAY-E003", name: "Abandonment Analytics",       squad: "Squad Phoenix", target: "Apr 30", p70: "May 10", status: "at-risk",  pct: 12, okr: "KR2" },
  { id: "WAL-E004", name: "Transaction Reliability",     squad: "Squad Nexus",   target: "Apr 15", p70: "Apr 12", status: "on-track", pct: 78, okr: "KR4" },
  { id: "WAL-E005", name: "Real-time Status API",        squad: "Squad Atlas",   target: "Apr 30", p70: "Apr 28", status: "on-track", pct: 55, okr: "KR5" },
];

export const JIRA_ACTIONS = [
  { id: "ja1", icon: "\u{1F3C3}", type: "Sprint move", risk: "low",    status: "pending", description: "Move 3 items to Sprint 24 to reduce WIP overload",          issues: ["PAY-318", "PAY-319", "PAY-321"], reason: "Squad Phoenix is carrying 9 active items against a WIP limit of 6. Moving lower-priority items reduces load and is expected to improve Flow Efficiency within 2 sprints." },
  { id: "ja2", icon: "\u{1F3F7}\uFE0F", type: "Add label",   risk: "low",    status: "pending", description: "Add 'blocked' label to 2 ageing items",                      issues: ["PAY-298", "PAY-230"],             reason: "These items have been in active WIP states for 28 and 21 days respectively without a status change, suggesting they are blocked without being flagged." },
  { id: "ja3", icon: "\u2B06\uFE0F", type: "Priority",    risk: "medium", status: "pending", description: "Update PAY-E001 epic priority from Medium to High",          issues: ["PAY-E001"],                       reason: "PAY-E001 is linked to a Low-confidence Key Result. Elevating its priority increases visibility and helps ensure it receives appropriate resourcing this sprint." },
  { id: "ja4", icon: "\u{1F4CB}", type: "Sprint plan", risk: "medium", status: "pending", description: "Propose sprint backlog trimmed to 6 items aligned with WIP limit", issues: ["PAY-289", "PAY-274", "PAY-301", "PAY-312", "PAY-298", "PAY-318"], reason: "Current sprint has 9 items against a WIP limit of 6. I've identified the 6 highest-value items by OKR contribution and current progress. The remaining 3 (PAY-319, PAY-321, PAY-315) are proposed for Sprint 24. Accepting this will update sprint assignments in Jira." },
  { id: "ja5", icon: "\u{1F503}", type: "Backlog order", risk: "low", status: "pending", description: "Reorder PAY-E001 sub-tasks by dependency to unblock parallel progress", issues: ["PAY-E001"], reason: "Current task order in PAY-E001 has dependent tasks blocking parallel work. Reordering to surface independent tasks will allow 2 developers to work simultaneously and improve the epic's P70 forecast by approximately 5 days." },
];

export const ALERTS_DATA = [
  { id: "al1", severity: "critical", squad: "Squad Phoenix", metric: "Flow Efficiency", message: "Dropped below 30% for a second consecutive sprint \u2014 immediate intervention recommended", time: "2h ago", read: false },
  { id: "al2", severity: "warning",  squad: "Squad Phoenix", metric: "WIP Load",        message: "9 items active vs. limit of 6 \u2014 WIP has exceeded limit for 3 consecutive sprints", time: "1d ago", read: false },
  { id: "al3", severity: "info",     squad: "Squad Orion",   metric: "Velocity",        message: "Velocity improved 14% since pair programming intervention started in S21", time: "2d ago", read: true },
  { id: "al4", severity: "warning",  squad: "Squad Atlas",   metric: "Velocity",        message: "Velocity at 14 items \u2014 below crew average of 17.5. New joiner ramp-up may be a factor", time: "3d ago", read: true },
];

export const SQUAD_HEALTH = [
  { id: "phoenix", squad: "Squad Phoenix", crew: "Checkout Crew", flowTime: 3.1, velocity: 20, efficiency: 64, wip: 5, wipLimit: 6, health: 4, healthNote: "Strong improvement since WIP cap intervention in S21. Team morale is up, flow time halved. Pair programming helping with review bottlenecks." },
  { id: "orion",   squad: "Squad Orion",   crew: "Checkout Crew", flowTime: 3.1, velocity: 21, efficiency: 62, wip: 5, wipLimit: 6, health: 4, healthNote: "Good momentum since pair programming. Team confident about sprint goal." },
  { id: "nexus",   squad: "Squad Nexus",   crew: "Wallet Crew",   flowTime: 4.2, velocity: 16, efficiency: 54, wip: 6, wipLimit: 7, health: 4, healthNote: "Solid delivery culture. Minor dependency risk on Atlas for WAL-E005." },
  { id: "atlas",   squad: "Squad Atlas",   crew: "Wallet Crew",   flowTime: 3.8, velocity: 14, efficiency: 58, wip: 5, wipLimit: 6, health: 3, healthNote: "Two new joiners in ramp-up. Velocity suppressed but improving." },
];

export const PLAYBOOK = [
  { id: "pb1", category: "WIP Overload", categoryColor: "rose", title: "Hard WIP Cap with Completion Gate", description: "Introduce a rule that no new work can be pulled into active until an existing item is completed. Hard WIP caps address the root cause of flow time inflation.", steps: ["Agree a WIP limit with the squad (typically team size \u00F7 2, rounded up)", "Configure Jira column constraints to enforce the limit", "In the next sprint planning, remove items until below the cap", "Review the limit every 2 sprints and adjust based on flow time trend"], successRate: 78, usedCount: 12, avgImprovementSprints: 2 },
  { id: "pb2", category: "Slow Review Cycle", categoryColor: "amber", title: "Review Rotation with Daily Slot", description: "Assign a daily 30-minute review rotation slot to ensure items don't sit waiting. This breaks the batch review pattern that inflates flow time.", steps: ["Identify the number of daily review slots needed (items in review \u00F7 2)", "Assign team members to a weekly review rotation", "Create a calendar event \u2014 30 min per day per reviewer", "Track items in review > 2 days as a standup blocker"], successRate: 71, usedCount: 8, avgImprovementSprints: 3 },
  { id: "pb3", category: "High Bug Load", categoryColor: "amber", title: "Bug Reduction Sprint", description: "Dedicate a full sprint to root-cause fixing of the top bug drivers. Trading short-term velocity for long-term flow health.", steps: ["Run a bug taxonomy session \u2014 categorise by root cause not symptom", "Identify the top 3 root causes generating 80% of bugs", "Dedicate 1 sprint to fixing root causes (not symptoms)", "Define a bug threshold (e.g. max 20% of flow distribution) and monitor weekly"], successRate: 65, usedCount: 5, avgImprovementSprints: 4 },
  { id: "pb4", category: "Blocked Items", categoryColor: "rose", title: "Daily Blocker Escalation Ritual", description: "Add a specific blocker escalation ritual to the daily standup. Aged items are the most visible symptom of unresolved blockers.", steps: ["Add 'blocked items' as a standing standup agenda item", "Any item > 5 days without a status change is automatically raised", "Assign an owner to resolve each blocker within 24 hours", "Escalate unresolved blockers to the Engineering Manager after 48 hours"], successRate: 84, usedCount: 15, avgImprovementSprints: 1 },
  { id: "pb5", category: "Low Velocity", categoryColor: "sky", title: "Single Sprint Goal Focus", description: "Replace multi-theme sprints with a single shared sprint goal. Squads with multiple competing priorities consistently deliver less overall.", steps: ["Define one sprint goal the whole squad can articulate in one sentence", "Reject sprint backlog items that don't contribute to the goal", "Use the goal as the acceptance criterion at sprint review", "Track goal attainment rate over 3 sprints and adjust scope discipline"], successRate: 69, usedCount: 7, avgImprovementSprints: 2 },
  { id: "pb6", category: "Knowledge Silos", categoryColor: "violet", title: "Cross-training Pairing Programme", description: "Structured pairing rotations to distribute knowledge and reduce single points of failure that slow reviews and create bottlenecks.", steps: ["Map knowledge domains and identify who can review what", "Create a pairing schedule: pair with someone outside your domain once per sprint", "Track review coverage (% of items any team member can review)", "Aim for 80% cross-coverage within 4 sprints"], successRate: 72, usedCount: 9, avgImprovementSprints: 3 },
];

export const ORION_VELOCITY_SERIES = [
  { sprint: "S18", value: 18 },
  { sprint: "S19", value: 20 },
  { sprint: "S20", value: 19 },
  { sprint: "S21", value: 21 },
  { sprint: "S22", value: 23 },
  { sprint: "S23", value: 24 },
];

export const SPRINT_LIST = ["S18", "S19", "S20", "S21", "S22", "S23"];

export const ALL_TARGETS = [
  { id: "phoenix",  name: "Squad Phoenix",  type: "squad" },
  { id: "orion",    name: "Squad Orion",    type: "squad" },
  { id: "nexus",    name: "Squad Nexus",    type: "squad" },
  { id: "atlas",    name: "Squad Atlas",    type: "squad" },
  { id: "checkout", name: "Checkout Crew",  type: "crew"  },
  { id: "wallet",   name: "Wallet Crew",    type: "crew"  },
];

export const METRIC_OPTIONS = [
  { id: "flowTime",   label: "Flow Time",       unit: "d",      lowerIsBetter: true  },
  { id: "velocity",   label: "Velocity",        unit: " items", lowerIsBetter: false },
  { id: "efficiency", label: "Flow Efficiency", unit: "%",      lowerIsBetter: false },
];

export const INTERVENTIONS_SEED = [
  {
    id: "int1",
    name: "WIP cap \u2014 hard limit at 6 active items",
    targetId: "phoenix", targetName: "Squad Phoenix", targetType: "squad",
    startSprint: "S21", metric: "flowTime",
    description: "Agreed with Squad Phoenix to enforce a hard WIP cap of 6 items in the active Jira column. Any item pulled from the backlog requires a corresponding completion first. Implemented via Jira column constraints and reinforced in sprint planning.",
  },
  {
    id: "int2",
    name: "Pair programming rotation \u2014 2 reviewers per item",
    targetId: "orion", targetName: "Squad Orion", targetType: "squad",
    startSprint: "S21", metric: "velocity",
    description: "Introduced a structured pair-programming rotation for Squad Orion to reduce review wait times and knowledge silos. Each item in review must have two reviewers assigned before it can merge, reducing back-and-forth rework cycles.",
  },
];

export const FREQ_OPTIONS = [
  { id: "daily",    label: "Daily"     },
  { id: "weekly",   label: "Weekly"    },
  { id: "biweekly", label: "Bi-weekly" },
  { id: "monthly",  label: "Monthly"   },
];

export const DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

export const REPORT_TIMES = [
  "07:00", "08:00", "09:00", "10:00", "11:00", "12:00",
  "13:00", "14:00", "15:00", "16:00", "17:00", "18:00",
];

export const SCHEDULED_REPORTS_SEED = [
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

export const SEED = [
  { id: 1, role: "user", text: "What's happening with Squad Phoenix's flow time this sprint?" },
  { id: 2, role: "ai",   text: "Squad Phoenix has a serious flow time problem building over six sprints. Median flow time has doubled from 3.2 days in Sprint 18 to 6.4 days now \u2014 and the p85 has hit 12.1 days, meaning the slowest 15% of items are taking nearly two weeks.\n\nThe trend is consistently worsening with no sign of reversal. The primary driver appears to be items ageing in In Review and In Testing, compressing active work time and inflating total flow time.", chart: "flowTime" },
  { id: 3, role: "ai",   text: null, rec: { priority: "Critical", title: "Flow Time doubling \u2014 items ageing in review", metric: "Flow Time: 3.2 \u2192 6.4 days (100% increase over 6 sprints)", rootCause: "Items are spending disproportionate time waiting in Review and Testing. More work is entering review than the squad has capacity to process, creating a backlog stuck mid-flow.", action: "1. Cap simultaneous items in review at 3 in the next sprint. 2. Assign a dedicated reviewer rotation. 3. Introduce a Definition of Ready for review to cut rework cycles.", impact: "Expected 30\u201340% reduction in median flow time within 2 sprints if review WIP is capped." } },
  { id: 4, role: "user", text: "How does their velocity compare to Squad Orion?" },
  { id: 5, role: "ai",   text: "Squad Orion is significantly outperforming Phoenix on velocity, and the gap is widening. Phoenix has dropped from 18 items/sprint to just 10 \u2014 a 44% decline over four sprints. Orion has held steady at 20\u201322 throughout the same period.\n\nBoth squads are in the same crew, working from a similar backlog. This divergence is almost certainly a process issue rather than a capacity or complexity difference.", chart: "velocity" },
];

export const CHIPS = ["Flow efficiency trend", "WIP load", "Work type breakdown", "Ageing items", "Give me coaching recs", "OKR status", "What-if simulator"];

export const NAV = [
  { id: "coach",         Icon: IcoChat,   label: "Coach",             badge: null },
  { id: "playbook",      Icon: IcoBook,   label: "Playbook",          badge: null },
  { id: "interventions", Icon: IcoFlag,   label: "Interventions",     badge: null },
  { id: "reports",       Icon: IcoClock,  label: "Scheduled Prompts", badge: null },
];

export const TAB_LABELS = {
  coach: "Coach", playbook: "Playbook",
  interventions: "Interventions", reports: "Scheduled Prompts",
};

export const CONF = {
  high:   { dot: "bg-emerald-500", bar: "bg-emerald-500", badge: "bg-emerald-50 text-emerald-700 border-emerald-200", ring: "border-emerald-200", label: "High" },
  medium: { dot: "bg-amber-400",   bar: "bg-amber-400",   badge: "bg-amber-50 text-amber-700 border-amber-200",       ring: "border-amber-200",   label: "Medium" },
  low:    { dot: "bg-rose-500",    bar: "bg-rose-500",     badge: "bg-rose-50 text-rose-700 border-rose-200",          ring: "border-rose-200",    label: "Low" },
};

export const STATUS = {
  "on-track": { dot: "bg-emerald-500", bar: "bg-emerald-500", badge: "bg-emerald-50 text-emerald-700", label: "On Track"  },
  "at-risk":  { dot: "bg-amber-400",   bar: "bg-amber-400",   badge: "bg-amber-50 text-amber-700",     label: "At Risk"   },
  "off-track":{ dot: "bg-rose-500",    bar: "bg-rose-500",    badge: "bg-rose-50 text-rose-700",       label: "Off Track" },
};

export const REC_P = {
  Critical: { wrap: "bg-rose-50 border-rose-200",  badge: "bg-rose-600",  text: "text-rose-700"  },
  High:     { wrap: "bg-amber-50 border-amber-200", badge: "bg-amber-500", text: "text-amber-700" },
  Medium:   { wrap: "bg-sky-50 border-sky-200",     badge: "bg-sky-500",   text: "text-sky-700"   },
};

export const tt = { backgroundColor: "#1a1a1a", border: "none", borderRadius: 8, fontSize: 11, color: "#f8fafc" };

export const INT_STATUS_CFG = {
  improving: { label: "Improving",  bgCls: "bg-emerald-50", borderCls: "border-emerald-200", textCls: "text-emerald-700", dotCls: "bg-emerald-500", Icon: IcoTrendUp  },
  worsening: { label: "Worsening",  bgCls: "bg-rose-50",    borderCls: "border-rose-200",    textCls: "text-rose-700",    dotCls: "bg-rose-500",    Icon: IcoTrendDn  },
  neutral:   { label: "No change",  bgCls: "bg-slate-50",   borderCls: "border-slate-200",   textCls: "text-slate-500",   dotCls: "bg-slate-400",   Icon: IcoMinus    },
  unknown:   { label: "No data",    bgCls: "bg-slate-50",   borderCls: "border-slate-200",   textCls: "text-slate-400",   dotCls: "bg-slate-300",   Icon: IcoActivity },
};

export const RISK_C = {
  low:    "bg-emerald-50 text-emerald-700 border-emerald-200",
  medium: "bg-amber-50 text-amber-700 border-amber-200",
};

export const SECTION_STYLE = {
  danger:  { dot: "bg-rose-500",    heading: "text-rose-700",    bg: "bg-rose-50",    border: "border-rose-100"    },
  warning: { dot: "bg-amber-400",   heading: "text-amber-700",   bg: "bg-amber-50",   border: "border-amber-100"   },
  success: { dot: "bg-emerald-500", heading: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-100" },
  action:  { dot: "bg-amber-500",  heading: "text-amber-800",  bg: "bg-amber-50",  border: "border-amber-100"  },
  neutral: { dot: "bg-slate-400",   heading: "text-slate-600",   bg: "bg-slate-50",   border: "border-slate-200"   },
};

/* ── Projects seed ────────────────────────────────────── */
export const PROJECTS_SEED = [
  { id: "proj-1", name: "Q2 Delivery Coaching", chats: [] },
];

/* ── Demo conversation script ─────────────────────────── */

/* Crew-level distribution (averaged Phoenix + Orion) */
const CHECKOUT_CREW_DISTRIBUTION = [
  { name: "Features",  value: 42, color: C.navy  },
  { name: "Bugs",      value: 30, color: C.cbaYellow },
  { name: "Tech Debt", value: 20, color: C.teal  },
  { name: "Risk",      value:  8, color: C.coral  },
];

export const DEMO_SCRIPT = [
  {
    user: "Tell me everything about the Checkout Crew",
    agent: {
      text: `Here's a comprehensive briefing on Checkout Crew for the current quarter.

Checkout Crew owns the checkout conversion pipeline and consists of two squads \u2014 Squad Phoenix and Squad Orion. Together they're responsible for 3 active epics tied to 2 OKRs, with a combined velocity of approximately 31 items per sprint.

The crew's delivery health is mixed. While Squad Orion is performing well and maintaining healthy flow metrics, Squad Phoenix is experiencing significant flow degradation that's putting two of the crew's three Key Results at risk. Here's the breakdown across four key dimensions:`,
      intent: "crewBriefing",
      crewBriefing: {
        crewName: "Checkout Crew",
        flowTime: {
          data: CREW_METRICS.checkout.flowTime,
          narrative: "Crew median flow time has increased from 3.5d to 4.8d over 6 sprints. This is being driven almost entirely by Squad Phoenix (6.4d) \u2014 Squad Orion is healthy at 3.1d. The divergence began in Sprint 20 and has widened every sprint since.",
        },
        velocity: {
          data: VELOCITY_DATA,
          narrative: "Combined crew velocity has declined from 40 items/sprint (S20) to 31 items/sprint (S23). Phoenix has dropped 44% (18 \u2192 10) while Orion has held steady at 19\u201321. The crew is increasingly reliant on a single squad for output.",
        },
        distribution: {
          data: CHECKOUT_CREW_DISTRIBUTION,
          narrative: "Unplanned work (bugs) accounts for 30% of the crew's output \u2014 nearly double the healthy benchmark of 15\u201320%. This is heavily skewed by Phoenix's 41% bug ratio. Orion's bug ratio is a healthy 18%. The imbalance suggests a quality problem concentrated in Phoenix's codebase.",
        },
        epics: {
          data: EPICS.filter(e => e.okr === "KR1" || e.okr === "KR2" || e.okr === "KR3"),
          narrative: "Of 3 active epics, 2 are at risk of missing their target dates. PAY-E001 (Payment Failure Remediation) is only 34% complete with a P70 forecast 14 days past target. PAY-E003 (Abandonment Analytics) is at just 12%. Only PAY-E002 (One-Click Checkout), owned by Orion, is on track.",
        },
        summary: "Bottom line: Checkout Crew's delivery health is being dragged down by Squad Phoenix. Two of three epics and two of three Key Results are at risk because of Phoenix's flow problems. Orion is carrying the crew \u2014 but if Orion takes on any of Phoenix's spillover, it could destabilise the one squad that's currently healthy.\n\nThe most urgent area to investigate is Phoenix's flow time and the factors driving it.",
      },
      chips: ["What's driving the flow time issue?", "Which squads need help?", "Compare Phoenix and Orion", "OKR impact"],
    },
  },
  {
    user: "Flow time looks concerning. What are the primary contributors to this issue, and which squads in this crew need the most help?",
    agent: {
      text: `You're right to focus on flow time \u2014 it's the metric that most directly reflects how long value takes to reach customers, and it's the one that's deteriorating fastest.

The flow time problem in Checkout Crew is almost entirely concentrated in Squad Phoenix. Let me break down what's happening and why.

Squad Phoenix vs Squad Orion \u2014 Flow Time:
\u2022 Phoenix: 6.4d median, 12.1d p85 \u2014 both well above healthy thresholds and worsening every sprint
\u2022 Orion: 3.1d median, 5.4d p85 \u2014 healthy, stable, and within benchmarks

So the crew-level flow time increase is not a systemic crew problem \u2014 it's a Phoenix-specific problem that's dragging the crew average up.

The primary contributors to Phoenix's flow time inflation are:

1. WIP Overload (root cause)
Phoenix is carrying 9 active items against a configured WIP limit of 6 \u2014 that's 50% over capacity. This is the single biggest driver. Little's Law tells us that Flow Time = WIP \u00F7 Throughput, so excess WIP directly inflates the time every item takes to complete. With 9 items active and capacity for 6, at least 3 items are effectively queued, waiting for attention while consuming mental overhead.

2. Review and Testing Bottlenecks (symptom of WIP overload)
Flow Efficiency has collapsed to 31%, meaning items spend 69% of their lifecycle waiting \u2014 in review queues, testing queues, or blocked. The p85 flow time at 12.1 days (nearly 2\u00D7 the median) tells us that some items are getting severely stuck at specific stages, likely Review and Testing.

3. High Bug Ratio (compounding factor)
41% of Phoenix's completed work has been bug fixes \u2014 more than double the healthy level. This means the squad is spending most of its time on unplanned reactive work rather than progressing planned epics. Bug investigation is interrupt-driven, fragments developer focus, and displaces sprint commitments.

4. Aged Items (hidden capacity drain)
Phoenix has 3 items past the 14-day age threshold: PAY-261 (15d), PAY-243 (21d), and PAY-230 (28d). These are almost certainly blocked but haven't been flagged as such. Each one occupies a WIP slot without producing output \u2014 effectively phantom capacity.

Squad Orion does not need intervention at this time. Their metrics are healthy across the board: 3.1d flow time, 62% efficiency, 21 items/sprint velocity, and WIP within limit (5/6). The pair programming intervention started in S21 appears to be working well.

My recommendation: focus all coaching attention on Squad Phoenix. The compounding nature of their problems (WIP \u2192 queue time \u2192 slow flow \u2192 more bugs \u2192 more WIP) means that without intervention, the situation will continue to deteriorate.`,
      intent: "comparison",
      comparison: {
        rows: [
          { id: "phoenix", name: "Squad Phoenix", flowTime: 6.4, velocity: 10, efficiency: 31, wip: 9, wipLimit: 6, health: 2 },
          { id: "orion",   name: "Squad Orion",   flowTime: 3.1, velocity: 21, efficiency: 62, wip: 5, wipLimit: 6, health: 4 },
        ],
      },
      chips: ["Are there any playbooks for this?", "What-if simulator", "Sprint planning help for Phoenix", "Show me coaching recs"],
    },
  },
  {
    user: "Are there any playbooks that could help with this?",
    agent: {
      text: `Yes \u2014 based on the diagnosis, there are two playbooks that are directly relevant to Phoenix's situation. Both have strong track records across similar teams in the organisation.

The first addresses the root cause (WIP overload), and the second addresses the most visible symptom (items getting stuck in the system without being flagged as blocked). I'd recommend implementing them in sequence \u2014 the WIP cap first, then the blocker escalation ritual in the following sprint, so the team isn't overwhelmed with process changes all at once.

If you'd like to adopt either play, click "Use this play" to create a tracked intervention. I'll monitor the impact on Phoenix's flow metrics and report back on whether the intervention is improving things, holding steady, or not working \u2014 so you'll know within 2 sprints whether to stay the course or adjust.`,
      intent: "playbook",
      playbookActions: [
        PLAYBOOK.find(p => p.id === "pb1"),
        PLAYBOOK.find(p => p.id === "pb4"),
      ],
      chips: ["What-if: reduce Phoenix WIP to 6", "Help me plan Phoenix's next sprint", "Full health check", "Tell me about PAY-E001"],
    },
  },
];
