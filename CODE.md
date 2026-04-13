# Agent Coach — Project Setup Instructions for Claude Code

## What Is This?

Agent Coach is an AI-native agile coaching platform for enterprise engineering organisations. A **fully working React prototype** exists in `reference/App.jsx` (2,559 lines, single-file). Your job is to turn this into a production-grade **Next.js** application with proper component splitting, file structure, and routing.

**Do NOT rewrite the logic or data.** The prototype is tested and working. Extract, reorganise, and adapt — do not reinvent.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14+ (App Router) |
| Language | JavaScript (JSX) — no TypeScript for now |
| Styling | Tailwind CSS 3 (utility classes, configured via `tailwind.config.js`) |
| Charts | Recharts (`recharts@^2.10.0`) |
| Icons | Custom inline SVG components (already in the prototype — no external icon library) |
| State | React `useState` / `useRef` / `useEffect` — no external state library |
| Package Manager | npm |

---

## Step 1: Scaffold the Next.js Project

```bash
npx create-next-app@latest agent-coach --js --app --tailwind --eslint --src-dir --no-import-alias
cd agent-coach
npm install recharts
```

Make sure Tailwind is configured in `tailwind.config.js` with content paths covering `./src/**/*.{js,jsx}`.

---

## Step 2: File Structure

Split the monolithic `reference/App.jsx` into the following structure. Every component, constant, and function already exists in the prototype — your job is to cut and paste them into the right files, adding `import`/`export` statements.

```
src/
  app/
    layout.jsx          # Root layout — html, body, metadata
    page.jsx            # Main App component (the root shell)
    globals.css         # Tailwind directives + any global styles
  components/
    icons.jsx           # ALL icon components (Svg base + Ico* components)
    layout/
      Sidebar.jsx       # Sidebar navigation component
      AlertBell.jsx     # Alert bell dropdown component
      BottomNav.jsx     # Mobile bottom navigation bar
    charts/
      ChartShell.jsx    # Reusable chart wrapper (title + sub + children)
      FlowTimeChart.jsx
      VelocityChart.jsx
      EfficiencyChart.jsx
      DistributionChart.jsx
      WIPChart.jsx
      ScatterAgeChart.jsx
      BeforeAfterChart.jsx   # Used in Interventions tab
    coach/
      Bubble.jsx        # Chat message bubble (user + AI)
      Typing.jsx        # Typing indicator animation
      RecCard.jsx       # Recommendation card with action buttons
      CoachTab.jsx      # Main coach conversation tab
      WhatIfPanel.jsx   # Little's Law WIP simulator
    tabs/
      OverviewTab.jsx   # Squad health heat map + team health update
      OKRTab.jsx        # OKR tracking with confidence indicators
      PortfolioTab.jsx  # Epic predictability + Monte Carlo forecasts
      InterventionsTab.jsx  # Interventions list + detail + add form
      PlaybookTab.jsx   # Coaching playbook library
      ReportsTab.jsx    # Scheduled reports (email + Teams delivery)
      ActionsTab.jsx    # Jira write-back actions with approval UI
    interventions/
      InterventionCard.jsx
      InterventionDetail.jsx
      AddInterventionForm.jsx
      NotesInput.jsx    # Coaching notes text input
    reports/
      CreateReportForm.jsx
      ReportCard.jsx
      EmailPreview.jsx
      TeamsPreview.jsx
      ReportPreviewPanel.jsx
  data/
    constants.js        # All mock data arrays and seed data
    helpers.js          # Utility functions (computeBeforeAfter, intStatus, etc.)
    palette.js          # Colour palette (the C object)
    respond.js          # Canned AI responses (the respond() function)
```

---

## Step 3: Extraction Guide

### `src/data/palette.js`
Extract the `C` colour palette object. Export it as a named export.

### `src/data/constants.js`
Extract ALL constant arrays and objects. These are clearly marked with comment headers in the prototype:
- `ORG`, `FLOW_TIME_DATA`, `VELOCITY_DATA`, `EFFICIENCY_DATA`, `DISTRIBUTION_DATA`
- `SCATTER_YOUNG`, `SCATTER_OLD`, `OKRS`, `EPICS`, `JIRA_ACTIONS`
- `ALERTS_DATA`, `SQUAD_HEALTH`, `PLAYBOOK`
- `ORION_VELOCITY_SERIES`, `SPRINT_LIST`, `ALL_TARGETS`, `METRIC_OPTIONS`
- `INTERVENTIONS_SEED`, `INT_STATUS_CFG` (if present)
- `FREQ_OPTIONS`, `DAYS_OF_WEEK`, `REPORT_TIMES`, `SCHEDULED_REPORTS_SEED`
- `SEED` (conversation seed messages), `CHIPS` (quick-action chips)
- `NAV` (navigation items — note this references icon components, so import them)
- `TABS`, `TAB_LABELS` (tab registry — these map tab IDs to components)
- `CONF` (OKR confidence styles), `STATUS` (epic status styles), `REC_P` (recommendation priority styles)
- Tooltip style object `tt`

### `src/data/helpers.js`
Extract all utility functions:
- `getChartData(targetId, metricId)` — returns chart data series
- `computeBeforeAfter(chartData, startSprint)` — splits data at intervention start
- `intStatus(delta, lowerIsBetter)` — classifies improvement status
- `heatCell(metric, value, wipLimit)` — returns Tailwind classes for heat map cells
- `fmtTime(t)` — formats 24h time to 12h
- `scheduleLabel(s)` — formats schedule as human-readable string
- `generateReportOutput(prompt)` — generates mock report based on prompt keywords
- `uid()` — simple incrementing ID generator
- `respond(input)` — canned AI response function

### `src/components/icons.jsx`
Extract the `Svg` base component and ALL `Ico*` components. Export each as a named export. There are approximately 25+ icons.

### Component Extraction
For each component file, extract the corresponding function from the prototype. Key things to watch:

1. **Imports**: Each component file needs its own imports (React hooks, recharts components, icons, data, helpers)
2. **Default exports**: Each component should use `export default function ComponentName`
3. **State**: All state stays in the component where it's currently defined — don't lift state unnecessarily
4. **The `CHARTS` map**: This lives in `CoachTab.jsx` or a shared location — it maps chart type strings to chart components

### Root App Component (`src/app/page.jsx`)
The `export default function App()` at the bottom of the prototype becomes the page component. It manages:
- `tab` state (current active tab)
- `alerts` state (alert data)
- `squad` state (selected squad)
- `showWhatIf` state (what-if panel visibility)
- `handleAlertRead` and `handleAlertReadAll` functions
- Renders: `<Sidebar>`, top tab bar, `<Tab>` (dynamic component), `<BottomNav>`, `<AlertBell>`, `<WhatIfPanel>`

Wrap the entire page in `"use client"` since it uses React state.

---

## Step 4: Key Implementation Notes

### Mobile Responsive Layout
The prototype uses Tailwind responsive breakpoints:
- Sidebar: `hidden md:flex` (hidden on mobile)
- Bottom nav: `md:hidden fixed bottom-0` (shown only on mobile)
- Top tab bar: `hidden md:flex`
- Main content: `pb-14 md:pb-0` (padding for bottom nav clearance)

### Recharts Imports
The prototype imports these from recharts:
```jsx
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, ReferenceLine, ReferenceArea,
} from "recharts";
```
Split these across the chart component files — each file only imports what it uses.

### No `localStorage`
All data is in-memory React state. Do not add localStorage or any persistence layer.

### No External Icon Library
All icons are custom inline SVGs using the `Svg` base wrapper. Do NOT install lucide-react, heroicons, or any other icon package.

---

## Step 5: Verify

After splitting, run:
```bash
npm run dev
```

Verify:
1. All 8 nav tabs render and are clickable (Coach, Overview, OKRs, Portfolio, Interventions, Playbook, Reports, Jira Actions)
2. Coach tab shows the seeded conversation with charts
3. Quick-action chips trigger canned responses with correct charts
4. "What-if simulator" chip opens the WhatIfPanel overlay
5. Alert bell shows unread count badge and dropdown
6. Overview tab shows heat map with colour coding
7. OKR tab shows objectives with confidence indicators and progress bars
8. Portfolio tab shows epics with status and P70 forecast dates
9. Interventions tab shows 2 seed interventions with before/after charts
10. Adding a coaching note to an intervention works
11. Playbook tab shows 6 playbook cards with steps and "Use this" button
12. Reports tab shows 2 seed reports, create form works, preview panel renders (email + Teams styles)
13. Jira Actions tab shows 5 actions with approve/reject buttons
14. Mobile responsive: resize below `md` breakpoint — sidebar collapses, bottom nav appears

---

## Feature Specs Reference

See `reference/feature-specs.md` for the full PRD covering all 13 features with problem statements, user stories, requirements, and success metrics.

---

## What NOT to Do

- Do not rewrite the UI design or layouts — preserve the existing look and feel exactly
- Do not add TypeScript (may migrate later)
- Do not add a backend, database, or API routes yet — this is a frontend prototype
- Do not install external icon libraries — use the custom SVG icons from the prototype
- Do not add localStorage or sessionStorage
- Do not add authentication or routing beyond the single page
- Do not modify the mock data or canned responses — they demonstrate specific coaching scenarios
