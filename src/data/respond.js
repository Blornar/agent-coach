/**
 * Smart response engine for Coach chat.
 * respond(input, context) => { messages: Message[], chips: string[] }
 */
import {
  ORG, SQUAD_HEALTH, SQUAD_METRICS, CREW_METRICS,
  OKRS, EPICS, PLAYBOOK, INTERVENTIONS_SEED,
} from "./constants";
import { computeBeforeAfter, heatCell } from "./helpers";

/* ── Entity map (built once at import) ────────────────── */
const ENTITY_MAP = new Map();

ORG.crews.forEach(c => {
  ENTITY_MAP.set(c.name.toLowerCase(), { type: "crew", id: c.id, name: c.name });
  ENTITY_MAP.set(c.id, { type: "crew", id: c.id, name: c.name });
  c.squads.forEach(s => {
    ENTITY_MAP.set(s.name.toLowerCase(), { type: "squad", id: s.id, name: s.name });
    ENTITY_MAP.set(s.id, { type: "squad", id: s.id, name: s.name });
  });
});
EPICS.forEach(e => {
  ENTITY_MAP.set(e.id.toLowerCase(), { type: "epic", ...e });
  ENTITY_MAP.set(e.name.toLowerCase(), { type: "epic", ...e });
});
OKRS.forEach(o => {
  o.keyResults.forEach(kr => {
    ENTITY_MAP.set(kr.id.toLowerCase(), { type: "kr", ...kr, objective: o.objective, owner: o.owner });
  });
});

/* ── Entity extractor ─────────────────────────────────── */
function extractEntities(input) {
  const q = input.toLowerCase();
  const found = [];
  const sorted = [...ENTITY_MAP.entries()].sort((a, b) => b[0].length - a[0].length);
  for (const [key, ent] of sorted) {
    if (q.includes(key) && !found.some(f => f.id === ent.id)) {
      found.push(ent);
    }
  }
  return found;
}

/* ── Intent detection ─────────────────────────────────── */
function detectIntent(q, entities, history) {
  /* Follow-up detection */
  const short = q.length < 30;
  const followUpWords = ["why", "tell me more", "elaborate", "explain", "what about", "and ", "how to fix", "how do i", "what else", "go deeper", "more detail", "can you expand"];
  if (short && followUpWords.some(w => q.includes(w)) && history?.length) {
    const lastAi = [...history].reverse().find(m => m.role === "ai" && m.intent);
    if (lastAi) return { intent: "followUp", prevIntent: lastAi.intent };
  }

  /* Comparison */
  if (/\b(compare|vs\.?|versus|which squad|best|worst|ranking)\b/.test(q)) return { intent: "comparison" };

  /* Sprint planning */
  if (/(plan.*(sprint|next)|sprint plan|help me plan|next sprint)/.test(q)) return { intent: "sprintPlan" };

  /* Health check */
  if (/(health check|full check|full health|how.*(doing|going)|give me a summary|overview of|status update)/.test(q)) return { intent: "healthCheck" };

  /* What-if */
  if (/(what.if|simulator|simulate|model|predict)/.test(q)) return { intent: "whatIf" };

  /* Specific entities — must come before generic keyword matching */
  if (entities.some(e => e.type === "epic")) return { intent: "epic" };
  if (entities.some(e => e.type === "kr")) return { intent: "okr" };

  /* Metric intents — use looser matching to catch chip button text and natural language */
  if (/(flow\s*efficien|efficien)/.test(q)) return { intent: "efficiency" };
  if (/(flow\s*time|cycle\s*time|lead\s*time|flow time)/.test(q)) return { intent: "flowTime" };
  if (/(wip|work.in.progress|capacity|overload|\bload\b)/.test(q)) return { intent: "wip" };
  if (/(velocit|throughput|output|items.per.sprint|completed.per)/.test(q)) return { intent: "velocity" };
  if (/(distribut|work.type|bug|mix\b|breakdown|type of work)/.test(q)) return { intent: "distribution" };
  if (/(ageing|aging|age.?ing|old items|stuck|block|stale|scatter|overdue|in progress too long)/.test(q)) return { intent: "scatter" };
  if (/(recommend|coach|what should|improve|recs\b|suggest|advice|intervention|action)/.test(q)) return { intent: "recommendation" };
  if (/(okr|key result|objective|confidence|quarterly goal)/.test(q)) return { intent: "okr" };
  if (/(epic|portfolio|forecast|delivery date|p70)/.test(q)) return { intent: "epicPortfolio" };

  /* Greeting */
  if (/^(hi|hello|hey|good morning|good afternoon|g'day)\b/.test(q)) return { intent: "greeting" };

  return { intent: "unknown" };
}

/* ── Time-scope extraction ────────────────────────────── */
function extractTimeScope(q) {
  let m = q.match(/(?:since|from|after)\s+(s\d+)/i);
  if (m) return { since: m[1].toUpperCase() };
  m = q.match(/(?:last|past)\s+(\d+)\s+sprint/i);
  if (m) return { lastN: parseInt(m[1]) };
  return null;
}

function sliceData(arr, timeScope) {
  if (!arr?.length || !timeScope) return arr;
  if (timeScope.since) {
    const idx = arr.findIndex(d => d.sprint === timeScope.since);
    return idx >= 0 ? arr.slice(idx) : arr;
  }
  if (timeScope.lastN) return arr.slice(-timeScope.lastN);
  return arr;
}

/* ── Resolve metrics for a scope ──────────────────────── */
function getMetrics(scopeType, scopeId) {
  if (scopeType === "squad") return SQUAD_METRICS[scopeId] || null;
  if (scopeType === "crew") return CREW_METRICS[scopeId] || null;
  return null;
}

function getHealth(scopeType, scopeId, scopeName) {
  if (scopeType === "squad") return SQUAD_HEALTH.find(s => s.id === scopeId);
  if (scopeType === "crew") return SQUAD_HEALTH.filter(s => s.crew === scopeName);
  return SQUAD_HEALTH;
}

/* ── Intervention context helper ──────────────────────── */
function interventionNote(scopeId, interventions) {
  const active = (interventions || INTERVENTIONS_SEED).filter(i => i.targetId === scopeId);
  if (!active.length) return "";
  return "\n\n\u{1F4CB} Active interventions on this squad: " + active.map(i => `"${i.name}" (started ${i.startSprint}, tracking ${i.metric || "flow metrics"})`).join("; ") + ". I'm factoring these into my analysis.";
}

/* ── Playbook matcher ─────────────────────────────────── */
const CATEGORY_MAP = {
  flowTime: "WIP Overload",
  wip: "WIP Overload",
  efficiency: "Slow Review Cycle",
  velocity: "Low Velocity",
  scatter: "Blocked Items",
  distribution: "High Bug Load",
};

function findPlaybook(intent) {
  const cat = CATEGORY_MAP[intent];
  if (!cat) return null;
  return PLAYBOOK.find(p => p.category === cat) || null;
}

/* ── Response generators (per intent) ─────────────────── */

function genFlowTime(scope, metrics, timeScope, interventions) {
  const data = sliceData(metrics?.flowTime, timeScope);
  if (!data?.length) return fallback(scope);
  const latest = data[data.length - 1];
  const first = data[0];
  const sprintCount = data.length;
  const change = latest.median - first.median;
  const pctChange = Math.round(Math.abs(change / first.median) * 100);
  const dir = change > 0.5 ? "increased" : change < -0.5 ? "improved" : "held steady";

  let text;
  if (latest.median > 5) {
    text = `${scope.name} has a concerning flow time trend. Over the last ${sprintCount} sprints, median flow time has ${dir} from ${first.median} days to ${latest.median} days \u2014 a ${pctChange}% ${change > 0 ? "increase" : "change"}. The p85 percentile has reached ${latest.p85} days, meaning the slowest 15% of items are taking nearly ${Math.round(latest.p85)} days to complete.

This is well above the healthy threshold of 4 days. The widening gap between median and p85 suggests that a subset of items are getting stuck in the system \u2014 likely spending disproportionate time waiting in review or testing queues rather than being actively worked on.

The pattern is consistent with WIP overload: when more work enters the pipeline than the team can process, items queue up at handoff points. Each additional item in progress competes for the same limited reviewer and tester attention, creating a bottleneck that inflates cycle time for everything.

I'd recommend looking at the WIP load and flow efficiency metrics next to confirm whether this is a capacity issue or a process issue.`;
  } else if (change < -0.5) {
    text = `Good news for ${scope.name} \u2014 flow time is trending in the right direction. Over the last ${sprintCount} sprints, median flow time has improved from ${first.median} days to ${latest.median} days, a ${pctChange}% reduction. The p85 has also come down to ${latest.p85} days.

At ${latest.median} days, the squad is operating within the healthy range (under 4 days). Items are moving through the system at a sustainable pace, which indicates good WIP discipline and effective handoff practices.

Keep monitoring the p85 \u2014 if it starts climbing while the median stays flat, it's an early warning sign that a few items are beginning to age silently in the system.`;
  } else {
    text = `${scope.name}'s flow time has been relatively stable over the last ${sprintCount} sprints, sitting at ${latest.median} days median with a p85 of ${latest.p85} days.

${latest.median <= 4 ? "This is within the healthy range. The squad is maintaining consistent throughput without items piling up in queues." : `At ${latest.median} days, this is slightly above the ideal threshold of 4 days. While it's not deteriorating, there may be room to improve by examining where items spend the most time waiting.`}

The gap between median (${latest.median}d) and p85 (${latest.p85}d) tells us how variable the flow is \u2014 a wide gap means some items sail through while others get stuck. Investigate the stuck items to find systemic blockers.`;
  }

  text += interventionNote(scope.id, interventions);
  const pb = findPlaybook("flowTime");
  return {
    messages: [{ role: "ai", text, intent: "flowTime", chart: "flowTime", chartProps: { data, squadName: scope.name }, ...(pb ? { playbookRef: pb } : {}) }],
    chips: ["Show WIP load", "Flow efficiency trend", "Compare squads", "Coaching recs", "Full health check"],
  };
}

function genVelocity(scope, metrics, timeScope, interventions) {
  const data = sliceData(metrics?.velocity, timeScope);
  if (!data?.length) return fallback(scope);
  const latest = data[data.length - 1];
  const first = data[0];
  const sprintCount = data.length;
  const change = latest.value - first.value;
  const pctChange = Math.round(Math.abs(change / first.value) * 100);

  let text;
  if (change < -3) {
    text = `${scope.name}'s velocity is in decline. Over the last ${sprintCount} sprints, throughput has dropped from ${first.value} to ${latest.value} items per sprint \u2014 a ${pctChange}% decrease. This is a significant and sustained downward trend that warrants immediate attention.

At ${latest.value} items/sprint, ${scope.name} is performing well below the org average of approximately 17.5 items. This level of velocity decline almost always has a systemic root cause rather than being a capacity problem. The most common drivers are:

\u2022 WIP overload \u2014 too many items started simultaneously means fewer actually get finished each sprint
\u2022 High bug ratio \u2014 unplanned reactive work displaces planned feature delivery and disrupts sprint commitments
\u2022 Blocked items \u2014 work sitting idle in the system occupies capacity without producing output
\u2022 Review bottlenecks \u2014 completed work waiting for review/testing creates a hidden backlog

I'd suggest checking the work type distribution to see if bug load is a factor, and the WIP chart to see if the squad is carrying too much in-progress work.`;
  } else if (change > 3) {
    text = `${scope.name}'s velocity is improving nicely. Over the last ${sprintCount} sprints, throughput has increased from ${first.value} to ${latest.value} items per sprint \u2014 a ${pctChange}% increase. This is a healthy upward trend.

${latest.value >= 18 ? `At ${latest.value} items/sprint, the squad is performing above the org average. This suggests effective WIP management and good flow discipline.` : `At ${latest.value} items/sprint, the squad is still below the org average of ~17.5 but trending in the right direction. As process improvements take hold, expect this to continue improving.`}

Keep an eye on quality metrics alongside velocity \u2014 a velocity increase driven by cutting corners on testing or rushing reviews will eventually show up as increased bug load in future sprints.`;
  } else {
    text = `${scope.name}'s velocity has remained relatively stable at around ${latest.value} items per sprint over the last ${sprintCount} sprints.

${latest.value >= 16 ? `At ${latest.value} items/sprint, this is a solid and consistent output. Stable velocity is generally a positive signal \u2014 it means the squad has found a sustainable pace and isn't oscillating between overcommitment and underdelivery.` : `At ${latest.value} items/sprint, this is below the org average of ~17.5. While stability is good, there may be room to unlock more throughput by addressing flow bottlenecks. Check the WIP load and flow efficiency for clues about what's constraining output.`}`;
  }

  text += interventionNote(scope.id, interventions);
  const pb = findPlaybook("velocity");
  return {
    messages: [{ role: "ai", text, intent: "velocity", chart: "velocity", chartProps: { data, squadName: scope.name, mode: "line" }, ...(pb ? { playbookRef: pb } : {}) }],
    chips: ["Flow time trend", "Work type breakdown", "Compare squads", "Coaching recs", "Full health check"],
  };
}

function genEfficiency(scope, metrics, timeScope, interventions) {
  const data = sliceData(metrics?.efficiency, timeScope);
  if (!data?.length) return fallback(scope);
  const latest = data[data.length - 1];
  const first = data[0];
  const sprintCount = data.length;
  const change = latest.efficiency - first.efficiency;

  let text;
  if (latest.efficiency < 40) {
    text = `Flow Efficiency for ${scope.name} has deteriorated significantly \u2014 dropping from ${first.efficiency}% down to just ${latest.efficiency}% over the last ${sprintCount} sprints. This is well below the crew median of 55% and represents a serious process health concern.

What this means in practice: items in ${scope.name}'s pipeline are spending ${100 - latest.efficiency}% of their total time waiting \u2014 sitting in backlogs, queued for review, waiting for testing, or blocked on dependencies. Only ${latest.efficiency}% of the total lifecycle is actual active development work.

This is the clearest signal that the squad is carrying too much work in progress. When WIP exceeds what the team can actively work on, items pile up at handoff points (dev \u2192 review, review \u2192 test). Each queue adds wait time without adding value.

The fix for low flow efficiency is almost always the same: reduce the amount of work in progress. The natural instinct is to "work faster" but the bottleneck isn't active work time \u2014 it's wait time. Capping WIP and improving review turnaround will have a much larger impact than trying to increase coding speed.`;
  } else if (latest.efficiency >= 55) {
    text = `Flow Efficiency for ${scope.name} is healthy at ${latest.efficiency}%, ${change > 5 ? `up from ${first.efficiency}% over the last ${sprintCount} sprints \u2014 a positive trend` : "holding steady near the crew median of 55%"}.

At this level, items are spending roughly half their time being actively worked on and half waiting in queues or handoffs. While 100% efficiency is theoretically ideal, 50\u201365% is considered healthy for a well-functioning team \u2014 some queue time is natural and expected as work flows between stages.

The squad appears to have good WIP discipline and effective handoff practices. Continue monitoring for any early signs of deterioration, particularly if WIP starts creeping above the limit.`;
  } else {
    text = `Flow Efficiency for ${scope.name} is at ${latest.efficiency}%, ${change < -5 ? `declining from ${first.efficiency}% over the last ${sprintCount} sprints` : "sitting slightly below the crew median of 55%"}.

Items are spending about ${100 - latest.efficiency}% of their lifecycle in wait states. While not yet critical, this suggests there are handoff delays or queue build-ups that could be addressed. The most common causes are: batch code reviews (items waiting for scheduled review windows instead of being reviewed as they're ready), limited tester availability, and unclear ownership of items between stages.

I'd recommend looking at the WIP load to see if the squad is over capacity, and at ageing items to identify specific bottleneck points.`;
  }

  text += interventionNote(scope.id, interventions);
  const pb = findPlaybook("efficiency");
  return {
    messages: [{ role: "ai", text, intent: "efficiency", chart: "efficiency", chartProps: { data, squadName: scope.name }, ...(pb ? { playbookRef: pb } : {}) }],
    chips: ["Show WIP load", "Ageing items", "Compare squads", "Coaching recs", "What-if simulator"],
  };
}

function genWIP(scope, healthArr, interventions) {
  const h = Array.isArray(healthArr) ? healthArr[0] : healthArr;
  if (!h) return fallback(scope);
  const over = h.wip > h.wipLimit;
  const overPct = over ? Math.round(((h.wip - h.wipLimit) / h.wipLimit) * 100) : 0;

  let text;
  if (over && overPct >= 30) {
    text = `${scope.name} is carrying ${h.wip} active items against a configured WIP limit of ${h.wipLimit} \u2014 that's ${overPct}% over safe capacity. This is a significant overload and is almost certainly the primary driver of the flow problems I'm seeing in other metrics.

Here's why WIP overload matters so much: Little's Law tells us that Flow Time = WIP \u00F7 Throughput. If throughput stays roughly constant (which it does in the short term \u2014 you can't suddenly code faster), then every additional item in progress directly increases the time every item takes to complete. It's not linear either \u2014 the impact accelerates because of context switching overhead and queue congestion.

With ${h.wip} items active and only ${h.wipLimit} that the team can effectively work on, at least ${h.wip - h.wipLimit} items are essentially sitting idle, occupying mental overhead and creating the illusion of progress without actually being worked on.

The most effective intervention is straightforward: stop starting, start finishing. Move ${h.wip - h.wipLimit} items out of the current sprint into the next one, and enforce the WIP limit of ${h.wipLimit} going forward. I've seen this single change improve flow time by 25\u201340% within 2 sprints when applied consistently.`;
  } else if (over) {
    text = `${scope.name} is slightly over WIP limit with ${h.wip} active items against a limit of ${h.wipLimit}. While this isn't a crisis, it's worth addressing before it becomes a habit.

Even a small WIP overage creates queue pressure at handoff points. The limit of ${h.wipLimit} exists for a reason \u2014 it represents the amount of work the team can actively progress without items stacking up.

I'd suggest a quick conversation in the next standup about which item could be deferred to bring the count back within limit.`;
  } else {
    text = `${scope.name} is within WIP limit at ${h.wip} active items against a limit of ${h.wipLimit}. This is a healthy signal \u2014 the squad is managing their in-progress work well.

Good WIP discipline is the foundation of predictable delivery. By keeping active work within the system's capacity, the team ensures that items flow through smoothly rather than piling up at bottlenecks.

${h.wip === h.wipLimit ? "The squad is right at the limit. Monitor this closely \u2014 if even one more item gets pulled in, it will tip over into overload territory." : `There's capacity for ${h.wipLimit - h.wip} more item${h.wipLimit - h.wip > 1 ? "s" : ""} before hitting the limit, so the team has some headroom for urgent work.`}`;
  }

  text += interventionNote(scope.id, interventions);
  const pb = findPlaybook("wip");
  return {
    messages: [{ role: "ai", text, intent: "wip", chart: "wip", chartProps: { wip: h.wip, limit: h.wipLimit, squadName: scope.name }, ...(pb ? { playbookRef: pb } : {}) }],
    chips: ["Flow efficiency trend", "Ageing items", "What-if simulator", "Coaching recs", "Sprint planning help"],
  };
}

function genDistribution(scope, metrics, interventions) {
  const data = metrics?.distribution;
  if (!data) return fallback(scope);
  const bugs = data.find(d => d.name === "Bugs")?.value || 0;
  const features = data.find(d => d.name === "Features")?.value || 0;
  const techDebt = data.find(d => d.name === "Tech Debt")?.value || 0;
  const risk = data.find(d => d.name === "Risk")?.value || 0;

  let text;
  if (bugs > 35) {
    text = `The work type distribution for ${scope.name} is raising a red flag. Here's the breakdown of completed items over the last 4 sprints:

\u2022 Features: ${features}% \u2014 planned product work
\u2022 Bugs: ${bugs}% \u2014 unplanned reactive fixes
\u2022 Tech Debt: ${techDebt}% \u2014 quality and infrastructure investment
\u2022 Risk/Compliance: ${risk}% \u2014 regulatory and risk items

The bug ratio at ${bugs}% is roughly ${Math.round(bugs / 20)}\u00D7 the healthy level of 15\u201320%. This means the squad is spending more time reacting to defects than delivering new value. It creates a vicious cycle: rushing to ship features generates more bugs, which consume more capacity, which forces more rushing.

This pattern correlates directly with the velocity decline \u2014 bug triage is unplanned, interrupt-driven work that disrupts sprint commitments and fragments developer focus. Every context switch from feature work to bug investigation carries a cognitive overhead of 15\u201320 minutes.

To break the cycle, I'd recommend a dedicated Bug Reduction Sprint \u2014 one sprint where the team focuses exclusively on root-cause fixing the top bug generators. It's a short-term velocity hit for a long-term capacity gain. The Playbook has a template for this approach with a 65% success rate across similar teams.`;
  } else if (bugs > 25) {
    text = `The work type distribution for ${scope.name} shows an elevated but manageable bug ratio:

\u2022 Features: ${features}% | Bugs: ${bugs}% | Tech Debt: ${techDebt}% | Risk: ${risk}%

Bug load at ${bugs}% is above the healthy range of 15\u201320% but not yet at crisis levels. The squad is still delivering more feature work than bug fixes, but the balance is shifting in the wrong direction.

If this trend continues, it will start suppressing velocity as more sprint capacity gets consumed by unplanned work. Now is a good time to invest in root-cause analysis of the most frequent bug categories before the ratio tips further.`;
  } else {
    text = `The work type distribution for ${scope.name} looks healthy:

\u2022 Features: ${features}% | Bugs: ${bugs}% | Tech Debt: ${techDebt}% | Risk: ${risk}%

Bug load at ${bugs}% is within the healthy range. The squad is spending the majority of its effort on planned feature delivery, which is exactly what you want to see. The tech debt investment at ${techDebt}% suggests the team is also maintaining code quality \u2014 a good sign for sustainable velocity.`;
  }

  text += interventionNote(scope.id, interventions);
  const pb = findPlaybook("distribution");
  return {
    messages: [{ role: "ai", text, intent: "distribution", chart: "distribution", chartProps: { data, squadName: scope.name }, ...(pb ? { playbookRef: pb } : {}) }],
    chips: ["Flow velocity trend", "Coaching recs", "Compare squads", "Full health check"],
  };
}

function genScatter(scope, metrics, interventions) {
  const young = metrics?.scatterYoung || [];
  const old = metrics?.scatterOld || [];
  const totalItems = young.length + old.length;
  const oldCount = old.length;

  if (totalItems === 0) return fallback(scope);

  const stageName = (s) => ["", "Development", "Review", "Testing"][s] || "Unknown";

  let text;
  if (oldCount >= 2) {
    text = `Looking at ${scope.name}'s ${totalItems} items currently in progress, ${oldCount} are past the 14-day age threshold \u2014 these are the items that need immediate attention:

${old.map(i => `\u2022 ${i.id}: ${i.age} days in ${stageName(i.stage)} \u2014 ${i.age > 21 ? "critically aged, likely blocked without being flagged" : "approaching critical age, investigate for hidden blockers"}`).join("\n")}

Items that age beyond 14 days almost always indicate a hidden blocker. The work isn't progressing but nobody has flagged it as blocked, so it sits silently in the system consuming WIP capacity without producing output. This is one of the most common \u2014 and most preventable \u2014 causes of flow time inflation.

The remaining ${young.length} items are within healthy age ranges: ${young.map(i => `${i.id} (${i.age}d, ${stageName(i.stage)})`).join(", ")}.

Recommended actions:
1. Review each aged item in tomorrow's standup \u2014 ask "what is this waiting for?"
2. Add "blocked" labels to any item with no status change in the last 5 days
3. Assign an owner to resolve each blocker within 24 hours
4. If a blocker can't be resolved within 48 hours, escalate to the Engineering Manager`;
  } else if (oldCount === 1) {
    const item = old[0];
    text = `${scope.name} has ${totalItems} items in progress, and one is flagged as potentially stuck:

\u2022 ${item.id}: ${item.age} days in ${stageName(item.stage)} \u2014 past the 14-day age threshold

This item has been in the system for ${item.age} days without completing. At this age, it's likely blocked on something \u2014 a dependency, a decision, a missing piece of information. Items that sit this long drag down flow metrics and occupy WIP capacity that could be used for active work.

The other ${young.length} items are progressing normally: ${young.map(i => `${i.id} (${i.age}d)`).join(", ")}.

I'd recommend checking in on ${item.id} specifically \u2014 is it genuinely blocked? Does it need to be descoped or broken into smaller pieces?`;
  } else {
    text = `Good news \u2014 ${scope.name} has ${totalItems} items in progress and none have crossed the 14-day age threshold. All work is moving through the system at a healthy pace.

Current items: ${young.map(i => `${i.id} (${i.age}d in ${stageName(i.stage)})`).join(", ")}.

No items showing signs of being stuck or blocked. This indicates good flow discipline and effective escalation of blockers when they arise. Keep the team's focus on early identification of dependencies to maintain this pattern.`;
  }

  text += interventionNote(scope.id, interventions);
  const pb = findPlaybook("scatter");
  return {
    messages: [{ role: "ai", text, intent: "scatter", chart: "scatter", chartProps: { youngData: young, oldData: old, squadName: scope.name }, ...(pb ? { playbookRef: pb } : {}) }],
    chips: ["Show WIP load", "Flow time trend", "Coaching recs", "Sprint planning help"],
  };
}

function genRecommendation(scope, metrics, healthArr, interventions) {
  const h = Array.isArray(healthArr) ? healthArr[0] : healthArr;
  if (!h) return fallback(scope);
  let priority = "Medium", title, metric, rootCause, action, impact;

  if (h.wip > h.wipLimit + 1) {
    priority = "Critical";
    const overPct = Math.round(((h.wip - h.wipLimit) / h.wipLimit) * 100);
    title = `Cap WIP \u2014 ${scope.name} is ${overPct}% over limit`;
    metric = `Flow Load: ${h.wip} items active vs. limit of ${h.wipLimit}. This has been sustained for multiple sprints, correlating with declining flow efficiency (${h.efficiency}%) and increasing flow time (${h.flowTime}d).`;
    rootCause = `The squad is carrying ${h.wip - h.wipLimit} more items than the system can effectively process. This excess WIP creates queue congestion at every handoff point (dev \u2192 review, review \u2192 test), inflating wait times and reducing the percentage of time items spend being actively worked on. It's the root cause of both the Flow Time increase and Flow Efficiency decline.`;
    action = `1. In the next standup, agree with the squad to defer ${h.wip - h.wipLimit} lower-priority items to Sprint 24.\n2. Enforce the WIP limit of ${h.wipLimit} \u2014 no new work starts until an existing item completes.\n3. Focus this sprint on finishing in-progress items, not starting new ones.\n4. Review the WIP limit itself in 2 sprints \u2014 the right limit is typically team size \u00F7 2, rounded up.`;
    impact = `Based on similar interventions across ${PLAYBOOK[0]?.usedCount || 12} teams, expected improvement: 20\u201330% flow efficiency gain and 25\u201335% flow time reduction within 1\u20132 sprints.`;
  } else if (h.efficiency < 40) {
    priority = "High";
    title = `Address flow efficiency \u2014 only ${h.efficiency}% active time`;
    metric = `Flow Efficiency: ${h.efficiency}% (crew median 55%). Items are spending ${100 - h.efficiency}% of their lifecycle waiting in queues rather than being actively worked on.`;
    rootCause = `The squad's items are spending the majority of their time in wait states \u2014 queued for review, waiting for testing, or blocked on dependencies. This is typically caused by batch review patterns (reviews happen in scheduled windows instead of continuously) and limited cross-functional capacity (too few people who can review or test).`;
    action = "1. Introduce a daily 30-minute review rotation \u2014 assign team members to review as items arrive, not in batches.\n2. Cap items in review at 3 simultaneously.\n3. Track any item waiting >2 days as a blocker in standup.\n4. Consider pairing a developer with a tester to reduce handoff delays.";
    impact = `Expected 15\u201325% efficiency improvement within 2\u20133 sprints. Success rate for this intervention pattern: ${PLAYBOOK[1]?.successRate || 71}%.`;
  } else if (h.flowTime > 5) {
    priority = "High";
    title = `Reduce flow time \u2014 currently ${h.flowTime}d median`;
    metric = `Flow Time: ${h.flowTime}d median (healthy threshold: 4d). At this rate, items are taking ${Math.round(h.flowTime / 4 * 100) - 100}% longer than the healthy benchmark.`;
    rootCause = "Items are ageing in review and testing phases. The root cause is typically a combination of WIP overload and insufficient review capacity \u2014 more work enters each stage than can be processed, creating queues that grow over time.";
    action = "1. Review WIP limits and enforce them strictly.\n2. Prioritise completing existing work over starting new items.\n3. Pair on stuck items \u2014 two people actively working to unblock is better than one person context-switching.\n4. Introduce a \"stop the line\" culture where blocked items are the team's top priority.";
    impact = "Expected 25\u201335% flow time reduction within 2 sprints if WIP is brought within limit.";
  } else {
    title = `${scope.name} is in good shape \u2014 focus on sustainability`;
    metric = `Flow Time: ${h.flowTime}d | Efficiency: ${h.efficiency}% | WIP: ${h.wip}/${h.wipLimit} | Health: ${h.health}/5 \u2014 all within healthy ranges.`;
    rootCause = "No critical issues detected. The squad is delivering at a sustainable pace with good flow discipline. The main risk is complacency \u2014 these patterns need active maintenance.";
    action = "1. Continue current WIP discipline \u2014 this is working.\n2. Monitor for early warning signs (p85 flow time increasing, efficiency dipping below 50%).\n3. Consider investing 20\u201330% of sprint capacity in tech debt to maintain code quality.\n4. Celebrate the team's effective practices \u2014 positive reinforcement sustains good habits.";
    impact = "Sustained healthy delivery metrics and predictable output.";
  }

  const introText = `Here's my highest-priority coaching recommendation for ${scope.name}, based on the current metrics and trend analysis:`;
  const rec = { priority, title, metric, rootCause, action, impact };
  const pb = findPlaybook(h.wip > h.wipLimit + 1 ? "wip" : h.efficiency < 40 ? "efficiency" : "flowTime");
  return {
    messages: [{ role: "ai", text: introText, intent: "recommendation", rec, ...(pb ? { playbookRef: pb } : {}) }],
    chips: ["What-if simulator", "Sprint planning help", "Flow time trend", "Full health check"],
  };
}

function genOKR(scope) {
  const relevant = scope.type === "squad"
    ? OKRS.filter(o => o.keyResults.some(kr => EPICS.some(e => kr.epics?.includes(e.id) && e.squad === scope.name)))
    : OKRS;
  if (!relevant.length) return { messages: [{ role: "ai", text: `No OKRs are directly linked to ${scope.name}. This might mean the squad's work is supporting OKRs owned by another crew, or that OKR alignment hasn't been mapped yet. I'd recommend checking the OKR tab for the full picture.`, intent: "okr" }], chips: ["Flow time trend", "Coaching recs", "Full health check"] };

  const lowConf = relevant.flatMap(o => o.keyResults.filter(kr => kr.confidence === "low"));
  const highConf = relevant.flatMap(o => o.keyResults.filter(kr => kr.confidence === "high"));

  let text = `Here's the OKR picture for ${scope.name}:\n\n`;
  text += relevant.map(o => {
    const krs = o.keyResults.map(kr => {
      const emoji = kr.confidence === "high" ? "\u2705" : kr.confidence === "low" ? "\u{1F534}" : "\u{1F7E1}";
      return `  ${emoji} ${kr.text}: ${kr.progress}% complete \u00B7 ${kr.confidence} confidence`;
    }).join("\n");
    return `${o.objective} (${o.owner}):\n${krs}`;
  }).join("\n\n");

  if (lowConf.length) {
    text += `\n\n\u26A0\uFE0F ${lowConf.length} key result${lowConf.length > 1 ? "s are" : " is"} at Low confidence. These are at risk of not being achieved this quarter. I'd recommend reviewing the linked epics and considering whether the targets need to be adjusted or whether additional support is needed.`;
  }
  if (highConf.length) {
    text += `\n\n${highConf.length} key result${highConf.length > 1 ? "s are" : " is"} tracking well at High confidence.`;
  }

  return {
    messages: [{ role: "ai", text, intent: "okr" }],
    chips: ["Epic portfolio status", "Coaching recs", "Compare squads", "Full health check"],
  };
}

function genEpic(entities) {
  const epic = entities.find(e => e.type === "epic");
  if (!epic) return null;
  const e = EPICS.find(ep => ep.id === epic.id) || epic;
  const linkedOkr = OKRS.flatMap(o => o.keyResults.filter(kr => kr.epics?.includes(e.id)).map(kr => ({ ...kr, objective: o.objective })));
  const entityCard = { type: "epic", ...e, linkedOkr };

  const daysLate = e.status === "at-risk" ? `The P70 forecast of ${e.p70} is ${Math.abs(parseInt(e.p70.split(" ")[1]) - parseInt(e.target.split(" ")[1]))} days past the target date of ${e.target}.` : "";

  let text = `${e.name} (${e.id}) is assigned to ${e.squad} and is currently ${e.status === "on-track" ? "on track" : "at risk"}.

Progress: ${e.pct}% complete. Target delivery: ${e.target}. Monte Carlo P70 forecast: ${e.p70}. ${daysLate}`;

  if (linkedOkr.length) {
    text += `\n\nThis epic is linked to the following Key Results:\n${linkedOkr.map(kr => `\u2022 ${kr.text} (${kr.confidence} confidence, ${kr.progress}% progress)`).join("\n")}`;
    const lowOkr = linkedOkr.filter(kr => kr.confidence === "low");
    if (lowOkr.length) {
      text += `\n\nThe linked Key Result${lowOkr.length > 1 ? "s are" : " is"} at Low confidence, which means delays on this epic directly threaten the crew's quarterly OKR outcomes. This should be escalated for discussion in the next OKR review.`;
    }
  }

  return {
    messages: [{ role: "ai", intent: "epic", text, entityCard }],
    chips: ["Show coaching recs", "OKR status", "Full health check", "Compare squads"],
  };
}

function genEpicPortfolio(scope) {
  const relevant = scope.type === "squad"
    ? EPICS.filter(e => e.squad === scope.name)
    : EPICS;

  const atRisk = relevant.filter(e => e.status === "at-risk");
  const onTrack = relevant.filter(e => e.status === "on-track");

  let text = `Epic portfolio for ${scope.name}:\n\n`;
  if (atRisk.length) {
    text += `\u{1F534} At Risk (${atRisk.length}):\n${atRisk.map(e => `\u2022 ${e.id} ${e.name}: ${e.pct}% complete \u00B7 Target ${e.target} \u00B7 P70 ${e.p70} \u00B7 ${e.squad}`).join("\n")}\n\n`;
  }
  if (onTrack.length) {
    text += `\u2705 On Track (${onTrack.length}):\n${onTrack.map(e => `\u2022 ${e.id} ${e.name}: ${e.pct}% complete \u00B7 Target ${e.target} \u00B7 P70 ${e.p70} \u00B7 ${e.squad}`).join("\n")}`;
  }

  if (atRisk.length) {
    text += `\n\nThe at-risk epics are forecast to miss their target dates. I'd recommend reviewing the WIP and flow health of the squads responsible to understand what's blocking progress.`;
  }

  return {
    messages: [{ role: "ai", text, intent: "epicPortfolio" }],
    chips: ["Coaching recs", "OKR status", "Compare squads", "Full health check"],
  };
}

function genComparison(scope, entities) {
  let squads = entities.filter(e => e.type === "squad").map(e => e.id);
  if (squads.length < 2) {
    if (scope.type === "crew") {
      const crew = ORG.crews.find(c => c.id === scope.id);
      squads = crew ? crew.squads.map(s => s.id) : [];
    } else {
      squads = ORG.crews.flatMap(c => c.squads.map(s => s.id));
    }
  }
  const rows = squads.map(id => {
    const h = SQUAD_HEALTH.find(s => s.id === id);
    return h ? { id, name: h.squad, flowTime: h.flowTime, velocity: h.velocity, efficiency: h.efficiency, wip: h.wip, wipLimit: h.wipLimit, health: h.health, healthNote: h.healthNote } : null;
  }).filter(Boolean);

  if (rows.length < 2) return fallback(scope);

  const worst = rows.reduce((a, b) => a.efficiency < b.efficiency ? a : b);
  const best = rows.reduce((a, b) => a.efficiency > b.efficiency ? a : b);
  const fastestFlow = rows.reduce((a, b) => a.flowTime < b.flowTime ? a : b);
  const wipOverloaded = rows.filter(r => r.wip > r.wipLimit);

  let text = `Here's a side-by-side comparison of ${rows.map(r => r.name).join(", ")}:

\u{1F3C6} Top performer: ${best.name} with ${best.efficiency}% flow efficiency, ${best.flowTime}d median flow time, and ${best.velocity} items/sprint velocity.

${worst.name !== best.name ? `\u26A0\uFE0F Needs attention: ${worst.name} with only ${worst.efficiency}% efficiency and ${worst.flowTime}d flow time. ${worst.healthNote}` : "All squads are performing similarly."}`;

  if (fastestFlow.id !== best.id) {
    text += `\n\n${fastestFlow.name} has the fastest flow time (${fastestFlow.flowTime}d) but ${best.name} has better overall efficiency. This can happen when a squad delivers fewer items but processes them more smoothly.`;
  }

  if (wipOverloaded.length) {
    text += `\n\n\u{1F6A8} WIP overload: ${wipOverloaded.map(r => `${r.name} (${r.wip}/${r.wipLimit})`).join(", ")} ${wipOverloaded.length > 1 ? "are" : "is"} over WIP limit. This is the most likely cause of their flow problems.`;
  }

  return {
    messages: [{ role: "ai", text, intent: "comparison", comparison: { rows } }],
    chips: [`Deep dive on ${worst.name}`, `Coaching recs for ${worst.name}`, "Full health check"],
  };
}

function genHealthCheck(scope, metrics, healthArr) {
  const squads = Array.isArray(healthArr) ? healthArr : healthArr ? [healthArr] : [];
  if (!squads.length) return fallback(scope);
  const data = { scopeName: scope.name, scopeType: scope.type, squads };

  const worst = squads.reduce((a, b) => a.health < b.health ? a : b);
  const critical = squads.filter(h => h.health <= 2);
  const healthy = squads.filter(h => h.health >= 4);

  let text = `Health check for ${scope.name}:\n\n`;
  text += squads.map(h => {
    const flowStatus = h.flowTime <= 4 ? "\u2705" : h.flowTime <= 6 ? "\u{1F7E1}" : "\u{1F534}";
    const effStatus = h.efficiency >= 55 ? "\u2705" : h.efficiency >= 35 ? "\u{1F7E1}" : "\u{1F534}";
    const wipStatus = h.wip <= h.wipLimit ? "\u2705" : "\u{1F534}";
    return `${h.squad}: ${flowStatus} Flow ${h.flowTime}d | Velocity ${h.velocity} | ${effStatus} Efficiency ${h.efficiency}% | ${wipStatus} WIP ${h.wip}/${h.wipLimit} | Health ${h.health}/5`;
  }).join("\n");

  if (critical.length) {
    text += `\n\n\u{1F6A8} ${critical.length} squad${critical.length > 1 ? "s need" : " needs"} immediate attention: ${critical.map(h => `${h.squad} (health ${h.health}/5 \u2014 ${h.healthNote})`).join("; ")}.`;
  }
  if (healthy.length) {
    text += `\n\n\u{1F4AA} ${healthy.length} squad${healthy.length > 1 ? "s are" : " is"} performing well: ${healthy.map(h => h.squad).join(", ")}.`;
  }
  if (squads.length > 1 && worst.health < 4) {
    text += `\n\nI'd recommend focusing coaching attention on ${worst.squad} first \u2014 it has the lowest health score and the metrics suggest systemic issues that will compound if not addressed.`;
  }

  return {
    messages: [{ role: "ai", text, intent: "healthCheck", healthCheck: data }],
    chips: [`Coaching recs for ${worst.squad}`, "Compare squads", "OKR status", "What-if simulator"],
  };
}

function genSprintPlan(scope, metrics, healthArr) {
  const h = Array.isArray(healthArr) ? healthArr[0] : healthArr;
  if (!h) return fallback(scope);
  const items = metrics?.scatterYoung || [];
  const oldItems = metrics?.scatterOld || [];
  const allItems = [...items, ...oldItems];
  const data = {
    squadName: scope.name, squadId: scope.id,
    currentWip: h.wip, wipLimit: h.wipLimit,
    carryForward: allItems,
  };

  const text = `Let's plan the next sprint for ${scope.name}. I'll walk you through three key decisions:

1\uFE0F\u20E3 **WIP Limit** \u2014 How many items should be active simultaneously? Current state: ${h.wip} items against a limit of ${h.wipLimit}. ${h.wip > h.wipLimit ? `The squad is over limit \u2014 consider reducing to ${h.wipLimit} or lower.` : "Within limit \u2014 consider maintaining or adjusting based on team capacity."}

2\uFE0F\u20E3 **Carry-forward items** \u2014 Which in-progress items should continue into next sprint? There are ${allItems.length} items currently active. ${oldItems.length ? `${oldItems.length} of these are aged beyond 14 days and may need to be descoped or re-prioritised.` : "All items are within healthy age ranges."}

3\uFE0F\u20E3 **Sprint Goal** \u2014 What single outcome should the team rally around? A clear, focused sprint goal helps the team say "no" to scope creep.

Use the planner below to work through each step:`;

  return {
    messages: [{ role: "ai", text, intent: "sprintPlan", sprintPlan: data }],
    chips: ["What-if simulator", "Show coaching recs", "Full health check"],
  };
}

function genFollowUp(prevIntent, scope, metrics, healthArr, interventions) {
  const deepDive = {
    flowTime: () => {
      const data = metrics?.flowTime;
      if (!data?.length) return null;
      const latest = data[data.length - 1];
      return { messages: [{ role: "ai", text: `Digging deeper into ${scope.name}'s flow time problem:

The main contributors to elevated flow time are typically items spending too long in review and testing queues. When WIP exceeds the limit, items compete for reviewer attention, creating a backlog that inflates cycle time across the board.

There are two key metrics to watch:

1. **The p85 trend** \u2014 At ${latest.p85} days, the slowest 15% of items are a leading indicator. If p85 is growing faster than the median, it means the tail of slow items is getting worse, not just the average. This signals that some items are getting trapped in the system.

2. **The median-to-p85 ratio** \u2014 Currently ${latest.median}d vs ${latest.p85}d (ratio: ${(latest.p85 / latest.median).toFixed(1)}x). A healthy ratio is under 2x. Above that, flow is highly variable \u2014 some items sail through while others languish. This usually points to specific bottleneck stages rather than a general slowdown.

The most effective fix is almost always reducing WIP. Little's Law (Flow Time = WIP \u00F7 Throughput) means that if throughput is constant, reducing WIP directly and proportionally reduces flow time. Try the What-If simulator to model different WIP levels.`, intent: "flowTime" }], chips: ["Show WIP load", "Ageing items", "What-if simulator", "Coaching recs"] };
    },
    velocity: () => ({ messages: [{ role: "ai", text: `Let me break down the common causes of velocity changes for ${scope.name}:

**WIP overload** is the #1 culprit. When a squad starts more items than it can finish, velocity drops because items take longer to complete. Paradoxically, starting less work often results in finishing more work.

**High bug ratio** suppresses velocity because bug fixing is unplanned, interrupt-driven work. Every bug investigation requires a context switch away from sprint work, and each context switch costs 15\u201320 minutes of re-orientation time. If the squad's bug ratio is above 25%, this is likely a significant factor.

**Blocked items** occupy WIP capacity without producing output. An item that's been "in progress" for 3 weeks but is actually blocked on a dependency is indistinguishable from active work in most tracking systems \u2014 it looks like the squad has capacity when it doesn't.

**Knowledge silos** slow everything down when only one person can review or test a particular area of code. If that person is on leave or overloaded, items queue up waiting for them.

I'd suggest checking the work type distribution and WIP load to identify which of these factors is most relevant.`, intent: "velocity" }], chips: ["Work type breakdown", "Show WIP load", "Ageing items", "Coaching recs"] }),
    efficiency: () => ({ messages: [{ role: "ai", text: `Let me explain what's driving ${scope.name}'s flow efficiency:

Flow Efficiency = Active Work Time \u00F7 Total Time in System. It measures what percentage of an item's lifecycle is spent being actively worked on versus waiting.

There are three categories of wait time that drive efficiency down:

1. **Queue time** \u2014 Items waiting in a column before someone picks them up. This happens when the previous stage produces work faster than the next stage can consume it. Example: three items finishing development simultaneously but only one reviewer available.

2. **Block time** \u2014 Items that can't progress because they're waiting for something outside the team's control (a dependency, a decision, access, information). This is the most frustrating type because it's often invisible.

3. **Batch time** \u2014 Items that are technically ready but are being held for a scheduled batch process. Example: code reviews that only happen during a daily 30-minute window instead of continuously.

The fix is not "work faster" \u2014 it's "wait less." Reducing WIP, introducing continuous review practices, and flagging blockers immediately are the highest-leverage changes. The What-If simulator can model the impact of WIP changes on efficiency.`, intent: "efficiency" }], chips: ["Show WIP load", "What-if simulator", "Coaching recs"] }),
    wip: () => ({ messages: [{ role: "ai", text: `Here's a deeper look at why WIP management matters for ${scope.name}:

**Little's Law** is the mathematical foundation: Flow Time = WIP \u00F7 Throughput. This isn't an approximation \u2014 it's a proven relationship that holds for any stable system. If throughput is constant (which it is in the short term), then reducing WIP directly and proportionally reduces flow time.

**The WIP trap**: Teams often resist lowering WIP because it feels like "doing less." But WIP measures started work, not completed work. A team with 10 items started and 6 completed is less productive than a team with 6 started and 6 completed \u2014 even though the first team looks busier.

**Context switching cost**: Research consistently shows that each additional item in progress costs 15\u201320% of a developer's time in context-switching overhead. At 9 items across a team of 5, every person is juggling nearly 2 items \u2014 meaning roughly 15\u201320% of capacity is lost to switching alone.

**The virtuous cycle**: When WIP drops below the limit, a positive feedback loop begins \u2014 items complete faster, freeing capacity for more items, which also complete faster. It typically takes 1\u20132 sprints for this effect to become visible in the metrics.

Try the What-If simulator to model the exact impact of reducing WIP by 1, 2, or 3 items.`, intent: "wip" }], chips: ["What-if simulator", "Sprint planning help", "Coaching recs"] }),
    scatter: () => ({ messages: [{ role: "ai", text: `Let me explain how to address the ageing items pattern for ${scope.name}:

**Why items age**: Items don't get stuck because people are lazy. They get stuck because:
\u2022 A dependency hasn't been delivered by another team
\u2022 A technical question needs an answer that nobody has
\u2022 The scope was underestimated and the item is much larger than expected
\u2022 The original developer moved on and nobody picked it up
\u2022 A review has been requested but the reviewer is overloaded

**The hidden cost**: Each aged item occupies a WIP slot. If the WIP limit is 6 and 2 items are aged/stuck, the team effectively only has 4 slots for active work \u2014 but the dashboard shows 6. This creates a phantom capacity problem that compounds over time.

**The Daily Blocker Escalation ritual** is the most effective intervention I've seen. It adds 3 minutes to standup:
1. Surface any item with no status change in 5+ days
2. Ask: "What is this waiting for? Who can resolve it?"
3. Assign an owner and a 24-hour deadline
4. If unresolved after 48 hours, escalate to EM

This intervention has an 84% success rate and typically shows improvement within 1 sprint.`, intent: "scatter" }], chips: ["Show WIP load", "Coaching recs", "Sprint planning help"] }),
    recommendation: () => genRecommendation(scope, metrics, healthArr, interventions),
    distribution: () => ({ messages: [{ role: "ai", text: `Exploring the work type distribution further for ${scope.name}:

A healthy squad should spend roughly 60\u201370% on features, 15\u201320% on bugs, 10\u201315% on tech debt, and 5\u201310% on risk/compliance. When bug ratio exceeds 25\u201330%, it signals a quality feedback loop:

1. Pressure to deliver features fast leads to shortcuts
2. Shortcuts generate bugs in production
3. Bugs consume capacity, reducing feature delivery time
4. More pressure, more shortcuts, more bugs

Breaking this cycle requires a deliberate investment \u2014 typically one sprint dedicated to root-cause fixing the top 3 bug generators. This costs one sprint of velocity but typically reduces bug inflow by 40\u201360%, freeing sustained capacity for feature work.

The tech debt ratio is also worth watching. Teams that invest zero in tech debt build up a hidden drag on velocity that compounds over quarters. Conversely, teams that over-invest (>30%) may be gold-plating at the expense of delivery. The sweet spot is 15\u201325%.`, intent: "distribution" }], chips: ["Coaching recs", "Velocity trend", "Full health check"] }),
  };
  const gen = deepDive[prevIntent];
  return gen ? gen() : fallback(scope);
}

function genGreeting(scope) {
  return {
    messages: [{ role: "ai", text: `Hi! I'm your AI delivery coach, and I'm ready to help you with ${scope.name}. Here's what I can do:

\u2022 **Flow metrics** \u2014 Analyse flow time, velocity, efficiency, WIP load, work type distribution, and item ageing patterns
\u2022 **OKRs & Epics** \u2014 Review OKR confidence, epic progress, and P70 delivery forecasts
\u2022 **Coaching** \u2014 Diagnose systemic issues and provide evidence-based recommendations with linked playbook entries
\u2022 **Comparisons** \u2014 Compare squads, crews, or the full org side by side
\u2022 **Planning** \u2014 Sprint planning wizard and What-If simulator to model the impact of changes
\u2022 **Tracking** \u2014 Active interventions are factored into my analysis so I can tell you what's working and what isn't

What would you like to explore first?`, intent: "greeting" }],
    chips: ["Full health check", "Flow time trend", "OKR status", "Coaching recs", "Compare squads", "What-if simulator"],
  };
}

function fallback(scope) {
  return {
    messages: [{ role: "ai", text: `I can help you analyse ${scope.name}'s delivery health across multiple dimensions. Here are some things you can ask:

\u2022 **"Flow time trend"** \u2014 How long items take from start to done, with trend analysis
\u2022 **"Flow efficiency"** \u2014 Ratio of active work time to wait time
\u2022 **"WIP load"** \u2014 Current items in progress vs. the safe limit
\u2022 **"Velocity"** \u2014 Items completed per sprint with trend analysis
\u2022 **"Work type breakdown"** \u2014 Feature vs bug vs tech debt distribution
\u2022 **"Ageing items"** \u2014 Items stuck in the system beyond healthy thresholds
\u2022 **"OKR status"** or **"Tell me about PAY-E001"** \u2014 OKR confidence and epic progress
\u2022 **"Compare Phoenix and Orion"** \u2014 Side-by-side squad comparison
\u2022 **"Give me coaching recs"** \u2014 Evidence-based improvement recommendations
\u2022 **"Help me plan next sprint"** \u2014 Guided sprint planning wizard
\u2022 **"What-if simulator"** \u2014 Model the impact of WIP, team size, and bug reduction changes

You can also ask about any squad or crew by name and I'll switch context automatically.`, intent: "unknown" }],
    chips: ["Full health check", "Flow time trend", "Flow efficiency", "WIP load", "Ageing items", "Coaching recs"],
  };
}

/* ── Main respond function ────────────────────────────── */

export function respond(input, context = {}) {
  const { scope = { type: "squad", id: "phoenix", name: "Squad Phoenix" }, history = [], interventions } = context;
  const q = input.toLowerCase().trim();
  const entities = extractEntities(q);
  const { intent, prevIntent } = detectIntent(q, entities, history);
  const timeScope = extractTimeScope(q);

  /* Resolve effective scope (entity mention may override) */
  let effScope = scope;
  const squadEntity = entities.find(e => e.type === "squad");
  const crewEntity = entities.find(e => e.type === "crew");
  if (squadEntity && squadEntity.id !== scope.id) {
    effScope = { type: "squad", id: squadEntity.id, name: squadEntity.name, crewId: scope.crewId, crewName: scope.crewName, breadcrumb: scope.breadcrumb };
  } else if (crewEntity && crewEntity.id !== scope.id) {
    effScope = { type: "crew", id: crewEntity.id, name: crewEntity.name, breadcrumb: scope.breadcrumb };
  }

  const metrics = getMetrics(effScope.type, effScope.id);
  const healthArr = getHealth(effScope.type, effScope.id, effScope.name);
  const health = Array.isArray(healthArr) ? healthArr : healthArr ? [healthArr] : [];

  switch (intent) {
    case "flowTime":       return genFlowTime(effScope, metrics, timeScope, interventions);
    case "velocity":       return genVelocity(effScope, metrics, timeScope, interventions);
    case "efficiency":     return genEfficiency(effScope, metrics, timeScope, interventions);
    case "wip":            return genWIP(effScope, health, interventions);
    case "distribution":   return genDistribution(effScope, metrics, interventions);
    case "scatter":        return genScatter(effScope, metrics, interventions);
    case "recommendation": return genRecommendation(effScope, metrics, health, interventions);
    case "okr":            return genOKR(effScope);
    case "epic":           return genEpic(entities) || fallback(effScope);
    case "epicPortfolio":  return genEpicPortfolio(effScope);
    case "comparison":     return genComparison(effScope, entities);
    case "healthCheck":    return genHealthCheck(effScope, metrics, health);
    case "sprintPlan":     return genSprintPlan(effScope, metrics, health);
    case "whatIf":         return { messages: [{ role: "ai", text: `Opening the What-If simulator for ${effScope.name}. Use the sliders below to model different scenarios:\n\n\u2022 **WIP adjustment** \u2014 See how reducing or increasing in-progress items affects flow time and efficiency (based on Little's Law)\n\u2022 **Team size** \u2014 Model the impact of adding or removing engineers (each engineer contributes approximately 15% of throughput)\n\u2022 **Bug reduction** \u2014 See how reducing bug inflow frees capacity for feature work\n\nThe projections are based on current metrics and historical patterns from similar teams. Adjust the levers to explore different scenarios:`, intent: "whatIf" }], chips: ["Coaching recs", "Sprint planning help", "Full health check"] };
    case "followUp":       return genFollowUp(prevIntent, effScope, metrics, health, interventions);
    case "greeting":       return genGreeting(effScope);
    default:               return fallback(effScope);
  }
}
