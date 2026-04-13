/**
 * Workshop response engine — guides PMs through feature spec creation and mockup generation.
 *
 * workshopRespond(input, context) => { messages: Message[], chips: string[], spec?: object }
 *
 * Context shape:
 *   { spec: object|null, history: Message[], phase: string }
 *
 * Phases: idle -> describe -> problem -> users -> stories -> acceptance -> edges -> mockup -> iterate
 */

/* ── Phase detection ─────────────────────────────────────── */

function detectPhase(input, ctx) {
  const q = input.toLowerCase().trim();
  const spec = ctx.spec;

  /* Explicit intents */
  if (/^(start|new|create|begin|describe)\b.*\b(feature|spec|idea|concept)/i.test(q) || (!spec && /^(i want to build|i.m thinking of|we need|let.s build|how about)/i.test(q))) return "describe";
  if (/\b(generate|create|show|make|build)\b.*\b(mockup|mock.up|wireframe|preview|screen|ui|prototype)/i.test(q)) return "mockup";
  if (/\b(refine|edit|change|update|revise)\b.*\b(spec|problem|user|stor|acceptan|criteria|edge)/i.test(q)) return "refine";
  if (/\b(add|more)\b.*\b(edge|case|scenario)/i.test(q)) return "edges";
  if (/\b(add|more|another)\b.*\b(stor|criteria|ac\b)/i.test(q)) return "stories";
  if (/\b(iterate|tweak|adjust|modify|change)\b.*\b(mockup|mock.up|design|screen|ui|layout|color|button)/i.test(q)) return "iterateMockup";
  if (/\b(review|critique|stress.test|check|feedback|what.s missing)/i.test(q)) return "review";

  /* Phase progression based on current spec state */
  if (!spec) return "describe";
  if (!spec.problem) return "problem";
  if (!spec.users?.length) return "users";
  if (!spec.stories?.length) return "stories";
  if (!spec.acceptance?.length) return "acceptance";
  if (!spec.edges?.length) return "edges";

  /* Default — treat as continuation/clarification */
  return "continue";
}

/* ── Spec builders ───────────────────────────────────────── */

function initSpec(input) {
  return {
    title: extractTitle(input),
    description: input,
    problem: null,
    users: [],
    stories: [],
    acceptance: [],
    edges: [],
    mockupHtml: null,
  };
}

function extractTitle(input) {
  /* Try to pull a short noun-phrase title from the input */
  let m = input.match(/(?:build|create|add|make|design|need)\s+(?:a|an|the)\s+(.{5,50?)(?:\.|,|$| that| which| for| so)/i);
  if (m) return capitalize(m[1].trim());
  m = input.match(/(?:build|create|add|make|design|need)\s+(.{5,40?})(?:\.|,|$| that| which| for| so)/i);
  if (m) return capitalize(m[1].trim());
  /* Fallback: first ~40 chars */
  const short = input.length > 45 ? input.slice(0, 42) + "..." : input;
  return capitalize(short);
}

function capitalize(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

/* ── Response generators ─────────────────────────────────── */

function genDescribe(input, ctx) {
  const spec = initSpec(input);
  spec.problem = inferProblem(input);
  spec.users = inferUsers(input);
  return {
    spec,
    messages: [
      {
        role: "ai", intent: "describe",
        text: `Great \u2014 I'll help you build out a feature spec for "${spec.title}". I've started drafting the spec from your description. Let's sharpen it up.\n\nWhat problem does this solve for the user? What's the pain point or unmet need?`,
      },
      { role: "ai", intent: "spec", specCard: spec },
    ],
    chips: ["Define the problem statement", "Skip to user stories", "Generate a mockup"],
  };
}

function genProblem(input, ctx) {
  const spec = { ...ctx.spec, problem: input };
  return {
    spec,
    messages: [
      { role: "ai", intent: "problem", text: `Good problem statement. I've added it to the spec.\n\nNow \u2014 who are the target users? List the key personas or user types who'll use this feature.` },
      { role: "ai", intent: "spec", specCard: spec },
    ],
    chips: ["Define target users", "Skip to user stories", "Refine the problem"],
  };
}

function genUsers(input, ctx) {
  const users = input.split(/[,;\n]+/).map(u => u.trim()).filter(Boolean);
  const spec = { ...ctx.spec, users: [...(ctx.spec.users || []), ...users] };
  return {
    spec,
    messages: [
      { role: "ai", intent: "users", text: `Added ${users.length} user type${users.length > 1 ? "s" : ""} to the spec.\n\nLet's write user stories now. Describe what each user needs to be able to do \u2014 I'll format them as proper user stories.` },
      { role: "ai", intent: "spec", specCard: spec },
    ],
    chips: ["Write user stories", "Add more user types", "Generate a mockup"],
  };
}

function genStories(input, ctx) {
  const raw = input.split(/[\n]+/).map(s => s.trim()).filter(Boolean);
  const stories = raw.map(s => formatStory(s, ctx.spec.users));
  const spec = { ...ctx.spec, stories: [...(ctx.spec.stories || []), ...stories] };
  return {
    spec,
    messages: [
      { role: "ai", intent: "stories", text: `I've added ${stories.length} user stor${stories.length > 1 ? "ies" : "y"}.\n\nNow let's define acceptance criteria \u2014 the specific conditions that must be true for this feature to be considered complete. What are the must-haves?` },
      { role: "ai", intent: "spec", specCard: spec },
    ],
    chips: ["Define acceptance criteria", "Add more stories", "Generate a mockup"],
  };
}

function genAcceptance(input, ctx) {
  const items = input.split(/[\n;]+/).map(s => s.replace(/^[-\u2022\d.)\s]+/, "").trim()).filter(Boolean);
  const spec = { ...ctx.spec, acceptance: [...(ctx.spec.acceptance || []), ...items] };
  return {
    spec,
    messages: [
      { role: "ai", intent: "acceptance", text: `Added ${items.length} acceptance criteria.\n\nLet's think about edge cases \u2014 what could go wrong? What happens when the user does something unexpected?` },
      { role: "ai", intent: "spec", specCard: spec },
    ],
    chips: ["Add edge cases", "I'll skip edge cases", "Generate a mockup", "Review the spec"],
  };
}

function genEdges(input, ctx) {
  const items = input.split(/[\n;]+/).map(s => s.replace(/^[-\u2022\d.)\s]+/, "").trim()).filter(Boolean);
  const spec = { ...ctx.spec, edges: [...(ctx.spec.edges || []), ...items] };
  return {
    spec,
    messages: [
      { role: "ai", intent: "edges", text: `Added ${items.length} edge case${items.length > 1 ? "s" : ""}. The spec is looking solid!\n\nReady to generate a phone mockup of this feature?` },
      { role: "ai", intent: "spec", specCard: spec },
    ],
    chips: ["Generate a mockup", "Review the spec", "Add more edge cases"],
  };
}

function genReview(input, ctx) {
  const spec = ctx.spec;
  const issues = [];
  if (!spec.problem) issues.push("No problem statement defined yet \u2014 why does this feature need to exist?");
  if (!spec.users?.length) issues.push("No target users specified \u2014 who is this for?");
  if (!spec.stories?.length) issues.push("No user stories \u2014 what should users be able to do?");
  if (!spec.acceptance?.length) issues.push("No acceptance criteria \u2014 how do we know it's done?");
  if (!spec.edges?.length) issues.push("No edge cases listed \u2014 what happens when things go wrong?");
  if (spec.stories?.length < 3) issues.push("Only " + (spec.stories?.length || 0) + " user stories \u2014 consider adding more to cover the full scope.");
  if (spec.acceptance?.length < 3) issues.push("Only " + (spec.acceptance?.length || 0) + " acceptance criteria \u2014 this might not be specific enough for engineering.");

  const text = issues.length
    ? `Here's my review of the spec:\n\n${issues.map((iss, i) => `${i + 1}. \u26A0\uFE0F ${iss}`).join("\n")}\n\nShould we address any of these?`
    : "The spec looks comprehensive! You have a clear problem statement, target users, user stories, acceptance criteria, and edge cases covered. This is ready for engineering review or stakeholder alignment.\n\nWant to generate a mockup to bring it to life?";

  return {
    spec,
    messages: [{ role: "ai", intent: "review", text, reviewCard: issues.length ? { issues } : null }],
    chips: issues.length ? ["Fix the gaps", "Generate a mockup", "It's good enough"] : ["Generate a mockup", "Add more detail", "Start a new feature"],
  };
}

function genMockup(input, ctx) {
  const spec = ctx.spec;
  if (!spec) {
    return {
      spec: null,
      messages: [{ role: "ai", intent: "mockup", text: "You'll need to describe a feature first before I can generate a mockup. What would you like to build?" }],
      chips: ["Describe a feature idea"],
    };
  }
  const html = buildMockupHtml(spec);
  const updatedSpec = { ...spec, mockupHtml: html };
  return {
    spec: updatedSpec,
    messages: [
      { role: "ai", intent: "mockup", text: `Here's a phone mockup of "${spec.title}". It's a styled, interactive preview \u2014 scroll it, look at the layout. Let me know what to change.` },
      { role: "ai", intent: "phoneMockup", phoneMockup: html },
    ],
    chips: ["Change the color scheme", "Add a bottom tab bar", "Make the cards bigger", "Start a new feature"],
  };
}

function genIterateMockup(input, ctx) {
  const spec = ctx.spec;
  if (!spec?.mockupHtml) return genMockup(input, ctx);
  const html = buildMockupHtml(spec, input);
  const updatedSpec = { ...spec, mockupHtml: html };
  return {
    spec: updatedSpec,
    messages: [
      { role: "ai", intent: "iterateMockup", text: `I've updated the mockup based on your feedback. Take a look:` },
      { role: "ai", intent: "phoneMockup", phoneMockup: html },
    ],
    chips: ["Looks great!", "Change the layout", "Try a different style", "Back to the spec"],
  };
}

function genContinue(input, ctx) {
  /* Smart continuation — try to fit the input into the current spec gaps */
  const spec = ctx.spec;
  if (!spec) return genDescribe(input, ctx);

  /* Check what the user probably means based on content shape */
  const lines = input.split(/[\n]+/).filter(Boolean);
  if (lines.length >= 2 && lines.some(l => /^(as a|i want|so that|user can|should be able)/i.test(l.trim()))) return genStories(input, ctx);
  if (lines.length >= 2 && lines.some(l => /^(when|given|then|must|should|the system)/i.test(l.trim()))) return genAcceptance(input, ctx);
  if (lines.length >= 2 && lines.some(l => /^(what if|if the|edge|error|fail|timeout|empty)/i.test(l.trim()))) return genEdges(input, ctx);

  /* Fill next gap */
  if (!spec.problem) return genProblem(input, ctx);
  if (!spec.users?.length) return genUsers(input, ctx);
  if (!spec.stories?.length) return genStories(input, ctx);
  if (!spec.acceptance?.length) return genAcceptance(input, ctx);
  if (!spec.edges?.length) return genEdges(input, ctx);

  /* Everything filled — treat as refinement */
  return {
    spec,
    messages: [{ role: "ai", intent: "continue", text: `The spec is looking complete. You can:\n\n\u2022 **Generate a mockup** to visualize the feature\n\u2022 **Review the spec** for gaps\n\u2022 **Start a new feature** to spec something else\n\nWhat would you like to do?` }],
    chips: ["Generate a mockup", "Review the spec", "Start a new feature"],
  };
}

function genRefine(input, ctx) {
  const q = input.toLowerCase();
  const spec = { ...ctx.spec };
  if (/problem/i.test(q)) {
    const newProblem = input.replace(/^.*?(?:problem|statement)[:\s]*/i, "").trim();
    if (newProblem.length > 10) spec.problem = newProblem;
    return { spec, messages: [{ role: "ai", intent: "refine", text: "Updated the problem statement." }, { role: "ai", intent: "spec", specCard: spec }], chips: ["Generate a mockup", "Review the spec"] };
  }
  return {
    spec,
    messages: [{ role: "ai", intent: "refine", text: "What part of the spec would you like to refine? You can update the problem statement, add users, edit stories, or modify acceptance criteria." }],
    chips: ["Refine problem statement", "Add more stories", "Add edge cases"],
  };
}

function genGreeting() {
  return {
    spec: null,
    messages: [{ role: "ai", intent: "greeting", text: "Hey! Welcome to the Feature Workshop. I'll help you go from a rough idea to a structured spec with a visual mockup.\n\nDescribe a feature you're thinking about and I'll guide you through building it out." }],
    chips: ["Describe a feature idea", "Show me a demo"],
  };
}

/* ── Mockup HTML builder ─────────────────────────────────── */

function buildMockupHtml(spec, iterateHint) {
  const title = spec.title || "Feature";
  const stories = spec.stories || [];
  const allText = [title, spec.problem || "", ...stories, ...(spec.acceptance || [])].join(" ").toLowerCase();

  /* Determine color accent from iteration hints */
  let accent = "#007AFF";
  let accentLight = "#EBF5FF";
  let bgColor = "#F2F2F7";
  let cardBg = "#FFFFFF";
  let textPrimary = "#1C1C1E";
  let textSecondary = "#8E8E93";
  let borderColor = "#E5E5EA";
  let isDark = false;

  if (iterateHint) {
    const h = iterateHint.toLowerCase();
    if (/blue|ocean|cool/i.test(h)) { accent = "#007AFF"; accentLight = "#EBF5FF"; }
    else if (/green|nature|eco/i.test(h)) { accent = "#34C759"; accentLight = "#EAFBEF"; }
    else if (/purple|violet/i.test(h)) { accent = "#AF52DE"; accentLight = "#F5EEFB"; }
    else if (/red|coral|warm/i.test(h)) { accent = "#FF3B30"; accentLight = "#FFF0EF"; }
    else if (/pink/i.test(h)) { accent = "#FF2D55"; accentLight = "#FFF0F3"; }
    else if (/orange/i.test(h)) { accent = "#FF9500"; accentLight = "#FFF7EB"; }
    if (/dark/i.test(h)) { isDark = true; bgColor = "#000000"; cardBg = "#1C1C1E"; textPrimary = "#FFFFFF"; textSecondary = "#8E8E93"; borderColor = "#38383A"; }
  }

  /* ── Analyse stories to generate real UI controls ──────── */
  const uiSections = stories.map(story => analyseStory(story, allText)).filter(Boolean);

  /* De-dupe by type — don't show two toggle groups */
  const seen = new Set();
  const dedupedSections = [];
  for (const sec of uiSections) {
    const key = sec.type;
    if (!seen.has(key)) { seen.add(key); dedupedSections.push(sec); }
  }

  /* If we couldn't parse stories into UI, generate a sensible settings-style page */
  const sections = dedupedSections.length ? dedupedSections : generateFallbackUI(allText);

  /* ── Render ────────────────────────────────────────────── */
  const toggleCSS = `
    .toggle{position:relative;width:51px;height:31px;border-radius:16px;background:${borderColor};flex-shrink:0;transition:background .2s;}
    .toggle.on{background:${accent};}
    .toggle::after{content:'';position:absolute;top:2px;left:2px;width:27px;height:27px;border-radius:50%;background:white;box-shadow:0 1px 3px rgba(0,0,0,.2);transition:transform .2s;}
    .toggle.on::after{transform:translateX(20px);}
    .seg{display:flex;background:${isDark ? "#2C2C2E" : "#E5E5EA"};border-radius:9px;padding:2px;gap:0;}
    .seg-btn{flex:1;text-align:center;padding:7px 0;font-size:12px;font-weight:600;border-radius:7px;color:${textSecondary};background:transparent;}
    .seg-btn.active{background:${cardBg};color:${textPrimary};box-shadow:0 1px 3px rgba(0,0,0,.1);}
    .chip{display:inline-flex;align-items:center;gap:4px;padding:5px 12px;border-radius:20px;font-size:12px;font-weight:500;border:1px solid ${borderColor};color:${textSecondary};background:${cardBg};}
    .chip.selected{background:${accent};color:white;border-color:${accent};}
    .row{display:flex;align-items:center;justify-content:space-between;padding:14px 0;border-bottom:1px solid ${borderColor};}
    .row:last-child{border-bottom:none;}
    .row-label{font-size:15px;color:${textPrimary};font-weight:400;}
    .row-sub{font-size:12px;color:${textSecondary};margin-top:2px;}
    .row-value{font-size:15px;color:${textSecondary};}
    .section{background:${cardBg};border-radius:12px;margin:0 16px 12px;overflow:hidden;}
    .section-inner{padding:0 16px;}
    .section-header{font-size:13px;font-weight:600;color:${textSecondary};text-transform:uppercase;letter-spacing:0.5px;padding:24px 16px 8px;display:flex;align-items:center;gap:6px;}
  `;

  const renderedSections = sections.map(sec => renderSection(sec, { accent, accentLight, cardBg, textPrimary, textSecondary, borderColor, isDark })).join("");

  /* Has bottom tab bar hint? */
  const showBottomTabs = iterateHint && /tab\s*bar|bottom\s*(nav|tab|bar)|navigation/i.test(iterateHint);
  const bottomTabBar = showBottomTabs ? `
    <div style="position:fixed;bottom:0;left:0;right:0;height:56px;background:${isDark ? "#1C1C1E" : "rgba(255,255,255,0.92)"};backdrop-filter:blur(20px);border-top:1px solid ${borderColor};display:flex;align-items:center;justify-content:space-around;padding:0 8px;">
      <div style="display:flex;flex-direction:column;align-items:center;gap:2px;">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="${accent}" stroke="${accent}" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
        <span style="font-size:10px;color:${accent};font-weight:500;">Alerts</span>
      </div>
      <div style="display:flex;flex-direction:column;align-items:center;gap:2px;">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="${textSecondary}" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
        <span style="font-size:10px;color:${textSecondary};font-weight:500;">Settings</span>
      </div>
      <div style="display:flex;flex-direction:column;align-items:center;gap:2px;">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="${textSecondary}" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
        <span style="font-size:10px;color:${textSecondary};font-weight:500;">Profile</span>
      </div>
    </div>` : "";

  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<style>
*{margin:0;padding:0;box-sizing:border-box;}
body{font-family:-apple-system,BlinkMacSystemFont,'SF Pro Text','Segoe UI',Roboto,sans-serif;background:${bgColor};color:${textPrimary};-webkit-font-smoothing:antialiased;overflow-x:hidden;}
${toggleCSS}
</style></head><body>
<div style="position:relative;min-height:100vh;padding-bottom:${showBottomTabs ? "70px" : "20px"};">

  <!-- Status bar -->
  <div style="padding:8px 20px 0;display:flex;justify-content:space-between;align-items:center;">
    <span style="font-size:14px;font-weight:600;color:${textPrimary};">9:41</span>
    <div style="display:flex;gap:6px;align-items:center;">
      <svg width="16" height="12" viewBox="0 0 16 12"><rect x="0" y="4" width="3" height="8" rx="0.5" fill="${textPrimary}" opacity="0.4"/><rect x="4.5" y="2.5" width="3" height="9.5" rx="0.5" fill="${textPrimary}" opacity="0.6"/><rect x="9" y="0.5" width="3" height="11.5" rx="0.5" fill="${textPrimary}" opacity="0.8"/><rect x="13" y="0" width="3" height="12" rx="0.5" fill="${textPrimary}"/></svg>
      <div style="width:22px;height:11px;border-radius:3px;border:1px solid ${textPrimary};position:relative;">
        <div style="position:absolute;top:1.5px;left:1.5px;right:4px;bottom:1.5px;background:${accent};border-radius:1.5px;"></div>
        <div style="position:absolute;right:-3px;top:3px;width:2px;height:5px;background:${textPrimary};border-radius:0 1px 1px 0;opacity:.4;"></div>
      </div>
    </div>
  </div>

  <!-- Header -->
  <div style="padding:12px 16px 6px;">
    <div style="display:flex;align-items:center;gap:4px;margin-bottom:4px;">
      <svg width="10" height="17" viewBox="0 0 10 17" fill="${accent}"><path d="M9.7.3a1 1 0 0 1 0 1.4L2.8 8.5l6.9 6.8a1 1 0 1 1-1.4 1.4L.3 9.2a1 1 0 0 1 0-1.4L8.3.3a1 1 0 0 1 1.4 0z"/></svg>
      <span style="font-size:17px;color:${accent};">Settings</span>
    </div>
    <h1 style="font-size:34px;font-weight:700;color:${textPrimary};letter-spacing:-0.5px;line-height:1.15;">${escHtml(shortTitle(title))}</h1>
  </div>

  ${renderedSections}

  ${bottomTabBar}
</div>
</body></html>`;
}

/* ── Story analyser — interprets what UI control a story implies ── */

function analyseStory(story, allText) {
  const s = story.toLowerCase();

  /* Toggle / on-off patterns */
  if (/toggle|on.?off|enable|disable|turn (on|off)|switch/i.test(s)) {
    const categories = extractCategories(allText);
    return { type: "toggleGroup", label: "Notifications", items: categories };
  }

  /* Channel / delivery method selection */
  if (/channel|deliver|push|email|sms|in.?app|method|how.*(receive|send)/i.test(s)) {
    return { type: "channelSelector", label: "Delivery Channels" };
  }

  /* Quiet hours / schedule / time-based */
  if (/quiet|schedule|hours|time|do not disturb|dnd|silent|mute|between/i.test(s)) {
    return { type: "quietHours", label: "Quiet Hours" };
  }

  /* Admin / policy / defaults */
  if (/admin|policy|org.?wide|default|manage|team|enforce/i.test(s)) {
    return { type: "adminPolicy", label: "Organisation Defaults" };
  }

  /* Preview / sample / example */
  if (/preview|sample|example|what.*look|test/i.test(s)) {
    return { type: "preview", label: "Notification Preview" };
  }

  /* Search / filter */
  if (/search|filter|find|look up/i.test(s)) {
    return { type: "searchBar", label: "Search" };
  }

  /* List / browse / view items */
  if (/list|browse|view|see (all|my)|history/i.test(s)) {
    return { type: "listItems", label: "Items" };
  }

  /* Form / input / create / add */
  if (/create|add|new|fill|enter|submit|form/i.test(s)) {
    return { type: "formInput", label: "Details" };
  }

  /* Frequency / how often */
  if (/frequen|how often|daily|weekly|instant|digest|batch|summary/i.test(s)) {
    return { type: "frequencyPicker", label: "Frequency" };
  }

  return null;
}

function extractCategories(allText) {
  /* Try to pull notification category names from the full spec text */
  const defaults = [
    { name: "Messages", desc: "Direct messages and replies", on: true },
    { name: "Mentions", desc: "When you're @mentioned", on: true },
    { name: "Comments", desc: "New comments on your items", on: true },
    { name: "Updates", desc: "Status changes and assignments", on: false },
    { name: "Marketing", desc: "Product updates and news", on: false },
  ];
  return defaults;
}

/* ── Section renderer — generates HTML for each UI type ──────── */

function renderSection(sec, theme) {
  const { accent, cardBg, textPrimary, textSecondary, borderColor, isDark } = theme;

  switch (sec.type) {
    case "toggleGroup":
      return `
        <div class="section-header">\u{1F514} ${escHtml(sec.label)}</div>
        <div class="section">
          <div class="section-inner">
            ${sec.items.map(item => `
              <div class="row">
                <div>
                  <div class="row-label">${escHtml(item.name)}</div>
                  <div class="row-sub">${escHtml(item.desc)}</div>
                </div>
                <div class="toggle ${item.on ? "on" : ""}"></div>
              </div>
            `).join("")}
          </div>
        </div>`;

    case "channelSelector":
      return `
        <div class="section-header">\u{1F4E8} ${escHtml(sec.label)}</div>
        <div class="section">
          <div class="section-inner">
            <div class="row" style="flex-direction:column;align-items:stretch;gap:10px;">
              <div class="row-label">Default channel</div>
              <div class="seg">
                <div class="seg-btn active">Push</div>
                <div class="seg-btn">Email</div>
                <div class="seg-btn">In-App</div>
              </div>
            </div>
            <div class="row">
              <div>
                <div class="row-label">Critical alerts</div>
                <div class="row-sub">Always delivered via all channels</div>
              </div>
              <div class="toggle on"></div>
            </div>
            <div class="row" style="flex-direction:column;align-items:stretch;gap:8px;">
              <div class="row-label">Per-category overrides</div>
              <div style="display:flex;gap:6px;flex-wrap:wrap;">
                <span class="chip selected">\u2709 Email for Reports</span>
                <span class="chip">\u{1F4F1} Push for Urgent</span>
                <span class="chip">+ Add override</span>
              </div>
            </div>
          </div>
        </div>`;

    case "quietHours":
      return `
        <div class="section-header">\u{1F319} ${escHtml(sec.label)}</div>
        <div class="section">
          <div class="section-inner">
            <div class="row">
              <div class="row-label">Do Not Disturb</div>
              <div class="toggle on"></div>
            </div>
            <div class="row">
              <div class="row-label">From</div>
              <div style="background:${isDark ? "#2C2C2E" : "#E5E5EA"};padding:6px 14px;border-radius:8px;font-size:15px;font-weight:500;color:${textPrimary};">10:00 PM</div>
            </div>
            <div class="row">
              <div class="row-label">Until</div>
              <div style="background:${isDark ? "#2C2C2E" : "#E5E5EA"};padding:6px 14px;border-radius:8px;font-size:15px;font-weight:500;color:${textPrimary};">7:00 AM</div>
            </div>
            <div class="row" style="flex-direction:column;align-items:stretch;gap:8px;">
              <div class="row-label">Active days</div>
              <div style="display:flex;gap:5px;">
                ${["M","T","W","T","F","S","S"].map((d, i) => `<div style="width:34px;height:34px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:600;${i < 5 ? `background:${accent};color:white;` : `background:${isDark ? "#2C2C2E" : "#E5E5EA"};color:${textSecondary};`}">${d}</div>`).join("")}
              </div>
            </div>
            <div class="row">
              <div>
                <div class="row-label">Allow critical alerts</div>
                <div class="row-sub">Bypass quiet hours for urgent items</div>
              </div>
              <div class="toggle on"></div>
            </div>
          </div>
        </div>`;

    case "adminPolicy":
      return `
        <div class="section-header">\u{1F6E1}\uFE0F ${escHtml(sec.label)}</div>
        <div class="section">
          <div class="section-inner">
            <div class="row">
              <div>
                <div class="row-label">Enforce defaults</div>
                <div class="row-sub">Team members can't override</div>
              </div>
              <div class="toggle"></div>
            </div>
            <div class="row">
              <div class="row-label">Default policy</div>
              <div style="display:flex;align-items:center;gap:4px;">
                <span class="row-value">Standard</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="${textSecondary}" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
              </div>
            </div>
            <div class="row">
              <div>
                <div class="row-label">Mandatory notifications</div>
                <div class="row-sub">Security, compliance, system outages</div>
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${accent}" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            </div>
          </div>
        </div>`;

    case "preview":
      return `
        <div class="section-header">\u{1F441}\uFE0F ${escHtml(sec.label)}</div>
        <div class="section">
          <div style="padding:16px;">
            <div style="background:${isDark ? "#2C2C2E" : "#F2F2F7"};border-radius:16px;padding:14px;display:flex;gap:12px;align-items:flex-start;">
              <div style="width:40px;height:40px;border-radius:10px;background:${accent};display:flex;align-items:center;justify-content:center;flex-shrink:0;">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
              </div>
              <div style="flex:1;min-width:0;">
                <div style="font-size:14px;font-weight:600;color:${textPrimary};margin-bottom:2px;">Sample Notification</div>
                <div style="font-size:13px;color:${textSecondary};line-height:1.3;">Alex commented on your design review: &ldquo;Looks great, just one small change...&rdquo;</div>
                <div style="font-size:11px;color:${textSecondary};margin-top:4px;opacity:0.7;">2 minutes ago</div>
              </div>
            </div>
            <div style="text-align:center;margin-top:12px;">
              <span style="font-size:13px;color:${accent};font-weight:500;">Send test notification</span>
            </div>
          </div>
        </div>`;

    case "searchBar":
      return `
        <div style="padding:8px 16px 4px;">
          <div style="background:${isDark ? "#1C1C1E" : cardBg};border-radius:10px;padding:10px 12px;display:flex;align-items:center;gap:8px;border:1px solid ${borderColor};">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${textSecondary}" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            <span style="font-size:15px;color:${textSecondary};">Search...</span>
          </div>
        </div>`;

    case "frequencyPicker":
      return `
        <div class="section-header">\u{23F0} ${escHtml(sec.label)}</div>
        <div class="section">
          <div class="section-inner">
            <div class="row" style="flex-direction:column;align-items:stretch;gap:10px;">
              <div class="row-label">Digest frequency</div>
              <div class="seg">
                <div class="seg-btn active">Instant</div>
                <div class="seg-btn">Hourly</div>
                <div class="seg-btn">Daily</div>
              </div>
            </div>
            <div class="row">
              <div>
                <div class="row-label">Daily summary email</div>
                <div class="row-sub">Receive at 9:00 AM</div>
              </div>
              <div class="toggle on"></div>
            </div>
          </div>
        </div>`;

    case "listItems":
      return `
        <div class="section-header">\u{1F4CB} ${escHtml(sec.label)}</div>
        <div class="section">
          <div class="section-inner">
            ${[1,2,3].map(i => `
              <div class="row">
                <div style="display:flex;align-items:center;gap:12px;">
                  <div style="width:36px;height:36px;border-radius:8px;background:${isDark ? "#2C2C2E" : "#E5E5EA"};"></div>
                  <div>
                    <div class="row-label">Item ${i}</div>
                    <div class="row-sub">Description here</div>
                  </div>
                </div>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="${textSecondary}" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
              </div>`).join("")}
          </div>
        </div>`;

    case "formInput":
      return `
        <div class="section-header">\u270F\uFE0F ${escHtml(sec.label)}</div>
        <div class="section">
          <div class="section-inner">
            <div class="row" style="flex-direction:column;align-items:stretch;gap:6px;">
              <div class="row-label">Name</div>
              <div style="background:${isDark ? "#2C2C2E" : "#E5E5EA"};padding:10px 12px;border-radius:8px;font-size:15px;color:${textSecondary};">Enter name...</div>
            </div>
            <div class="row" style="flex-direction:column;align-items:stretch;gap:6px;">
              <div class="row-label">Description</div>
              <div style="background:${isDark ? "#2C2C2E" : "#E5E5EA"};padding:10px 12px;border-radius:8px;font-size:15px;color:${textSecondary};min-height:60px;">Enter description...</div>
            </div>
          </div>
        </div>
        <div style="padding:8px 16px;">
          <div style="width:100%;padding:14px;background:${accent};color:white;border:none;border-radius:12px;font-size:16px;font-weight:600;text-align:center;">Save</div>
        </div>`;

    default:
      return "";
  }
}

/* ── Fallback UI — for specs we can't parse, generate a generic settings screen ── */

function generateFallbackUI(allText) {
  const sections = [];
  sections.push({ type: "toggleGroup", label: "Preferences", items: [
    { name: "Enabled", desc: "Turn this feature on or off", on: true },
    { name: "Auto-save", desc: "Save changes automatically", on: true },
    { name: "Notifications", desc: "Receive alerts for updates", on: false },
  ]});
  if (/search|filter|find/i.test(allText)) sections.push({ type: "searchBar", label: "Search" });
  return sections;
}

/* ── Short title for header ── */
function shortTitle(title) {
  if (title.length <= 30) return title;
  /* Try to abbreviate common words */
  return title.replace(/notification/gi, "Notification").replace(/preferences/gi, "Preferences").replace(/management/gi, "Mgmt").replace(/configuration/gi, "Config");
}

function escHtml(s) {
  return (s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

/* ── Story formatting ────────────────────────────────────── */

function formatStory(raw, users) {
  if (/^as a /i.test(raw)) return raw;
  const user = users?.[0] || "user";
  /* Try to detect "can X" or "should X" patterns */
  const m = raw.match(/^(?:user\s+)?(?:can|should|wants?\s+to|needs?\s+to)\s+(.+)/i);
  if (m) return `As a ${user}, I want to ${m[1].replace(/\.$/, "")}.`;
  return raw;
}

/* ── Infer helpers (extract from freeform description) ──── */

function inferProblem(input) {
  const m = input.match(/(?:because|since|problem is|pain point is|issue is|currently)\s+(.{15,}?)(?:\.|$)/i);
  return m ? capitalize(m[1].trim()) : null;
}

function inferUsers(input) {
  const users = [];
  if (/\b(admin|administrator)\b/i.test(input)) users.push("Admin");
  if (/\b(end.?user|customer|member|subscriber)\b/i.test(input)) users.push("End user");
  if (/\b(manager|team lead|supervisor)\b/i.test(input)) users.push("Manager");
  return users;
}

/* ── Main export ─────────────────────────────────────────── */

export function workshopRespond(input, ctx) {
  const q = input.toLowerCase().trim();

  /* Greetings */
  if (/^(hi|hello|hey|good morning|good afternoon|g'day)\b/.test(q)) return genGreeting();

  /* Start new feature */
  if (/^(start|new|begin)\b.*\b(feature|spec)\b/i.test(q) && ctx.spec) {
    return genDescribe(input, { ...ctx, spec: null });
  }

  const phase = detectPhase(input, ctx);

  switch (phase) {
    case "describe": return genDescribe(input, ctx);
    case "problem": return genProblem(input, ctx);
    case "users": return genUsers(input, ctx);
    case "stories": return genStories(input, ctx);
    case "acceptance": return genAcceptance(input, ctx);
    case "edges": return genEdges(input, ctx);
    case "mockup": return genMockup(input, ctx);
    case "iterateMockup": return genIterateMockup(input, ctx);
    case "review": return genReview(input, ctx);
    case "refine": return genRefine(input, ctx);
    case "continue": return genContinue(input, ctx);
    default: return genContinue(input, ctx);
  }
}

/* ── Demo script ─────────────────────────────────────────── */

export const WORKSHOP_DEMO_SCRIPT = [
  {
    user: "I want to build a notification preferences page where users can control what alerts they receive and how they receive them",
    agent: {
      text: "Great \u2014 I'll help you build out a feature spec for \"Notification Preferences Page\". I've started drafting the spec from your description. Let's sharpen it up.\n\nWhat problem does this solve for the user? What's the pain point or unmet need?",
      specCard: {
        title: "Notification Preferences Page",
        description: "A notification preferences page where users can control what alerts they receive and how they receive them",
        problem: null, users: [], stories: [], acceptance: [], edges: [], mockupHtml: null,
      },
      chips: ["Define the problem statement", "Skip to user stories", "Generate a mockup"],
    },
  },
  {
    user: "Users are overwhelmed by notifications they can't control. They either get too many alerts or miss the ones that matter. There's no way to customize notification channels or frequency.",
    agent: {
      text: "Good problem statement. I've added it to the spec.\n\nNow \u2014 who are the target users? List the key personas or user types who'll use this feature.",
      specCard: {
        title: "Notification Preferences Page",
        description: "A notification preferences page where users can control what alerts they receive and how they receive them",
        problem: "Users are overwhelmed by notifications they can't control. They either get too many alerts or miss the ones that matter. There's no way to customize notification channels or frequency.",
        users: [], stories: [], acceptance: [], edges: [], mockupHtml: null,
      },
      chips: ["Define target users", "Skip to user stories", "Refine the problem"],
    },
  },
  {
    user: "Power users who need granular control, casual users who just want sensible defaults, and team admins who manage notification policies for their org",
    agent: {
      text: "Added 3 user types to the spec.\n\nLet's write user stories now. Describe what each user needs to be able to do \u2014 I'll format them as proper user stories.",
      specCard: {
        title: "Notification Preferences Page",
        description: "A notification preferences page where users can control what alerts they receive and how they receive them",
        problem: "Users are overwhelmed by notifications they can't control. They either get too many alerts or miss the ones that matter. There's no way to customize notification channels or frequency.",
        users: ["Power users who need granular control", "Casual users who just want sensible defaults", "Team admins who manage notification policies"],
        stories: [], acceptance: [], edges: [], mockupHtml: null,
      },
      chips: ["Write user stories", "Add more user types", "Generate a mockup"],
    },
  },
  {
    user: "User can toggle individual notification categories on/off\nUser can choose delivery channel per category (push, email, in-app)\nUser can set a quiet hours schedule\nAdmin can set org-wide default notification policies\nUser can see a preview of what each notification type looks like",
    agent: {
      text: "I've added 5 user stories.\n\nNow let's define acceptance criteria \u2014 the specific conditions that must be true for this feature to be considered complete. What are the must-haves?",
      specCard: {
        title: "Notification Preferences Page",
        description: "A notification preferences page where users can control what alerts they receive and how they receive them",
        problem: "Users are overwhelmed by notifications they can't control. They either get too many alerts or miss the ones that matter. There's no way to customize notification channels or frequency.",
        users: ["Power users who need granular control", "Casual users who just want sensible defaults", "Team admins who manage notification policies"],
        stories: [
          "As a Power user, I want to toggle individual notification categories on/off.",
          "As a Power user, I want to choose delivery channel per category (push, email, in-app).",
          "As a Casual user, I want to set a quiet hours schedule.",
          "As a Team admin, I want to set org-wide default notification policies.",
          "As a Power user, I want to see a preview of what each notification type looks like.",
        ],
        acceptance: [], edges: [], mockupHtml: null,
      },
      chips: ["Define acceptance criteria", "Add more stories", "Generate a mockup"],
    },
  },
  {
    user: "Changes save instantly with visual confirmation\nQuiet hours override all non-critical notifications\nAdmin policies show as locked toggles for managed users\nNew notification types default to the user's last similar preference\nMust work on mobile and desktop",
    agent: {
      text: "Added 5 acceptance criteria.\n\nLet's think about edge cases \u2014 what could go wrong? What happens when the user does something unexpected?",
      specCard: {
        title: "Notification Preferences Page",
        description: "A notification preferences page where users can control what alerts they receive and how they receive them",
        problem: "Users are overwhelmed by notifications they can't control. They either get too many alerts or miss the ones that matter. There's no way to customize notification channels or frequency.",
        users: ["Power users who need granular control", "Casual users who just want sensible defaults", "Team admins who manage notification policies"],
        stories: [
          "As a Power user, I want to toggle individual notification categories on/off.",
          "As a Power user, I want to choose delivery channel per category (push, email, in-app).",
          "As a Casual user, I want to set a quiet hours schedule.",
          "As a Team admin, I want to set org-wide default notification policies.",
          "As a Power user, I want to see a preview of what each notification type looks like.",
        ],
        acceptance: [
          "Changes save instantly with visual confirmation",
          "Quiet hours override all non-critical notifications",
          "Admin policies show as locked toggles for managed users",
          "New notification types default to the user's last similar preference",
          "Must work on mobile and desktop",
        ],
        edges: [], mockupHtml: null,
      },
      chips: ["Add edge cases", "I'll skip edge cases", "Generate a mockup", "Review the spec"],
    },
  },
  {
    user: "Generate a mockup",
    agent: {
      text: "Here's a phone mockup of \"Notification Preferences Page\". It's a styled, interactive preview \u2014 scroll it, look at the layout. Let me know what to change.",
      phoneMockup: "GENERATE_AT_RUNTIME",
      chips: ["Change the color scheme", "Add a bottom tab bar", "Make the cards bigger", "Start a new feature"],
    },
  },
];

/* Pre-build the demo mockup HTML */
const DEMO_SPEC_FINAL = WORKSHOP_DEMO_SCRIPT[4].agent.specCard;
WORKSHOP_DEMO_SCRIPT[5].agent.phoneMockup = buildMockupHtml(DEMO_SPEC_FINAL);
