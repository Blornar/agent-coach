# Agent Coach Feature Specifications Reference

**Product:** Agent Coach — AI-native Agile Coaching Platform  
**Target Market:** Enterprise Engineering (500+ headcount)  
**Document Version:** 1.0  
**Last Updated:** 2026-04-13

---

## Executive Summary

Agent Coach is an AI-native platform that brings agile coaching into conversational workflows. Rather than building dashboards for metrics to be passively consumed, we surface charts *within* coaching conversations as context becomes relevant. The platform ingests Flow Framework data from Jira, generates data-driven recommendations, tracks OKR alignment, and proposes agentic actions—all through a conversational interface with explicit human approval gates on write operations.

**Core Design Principles:**
- **Conversation before canvas** — Charts surface inline in context, not on pre-built dashboards
- **Data before intelligence** — Ingestion and accuracy before ML-based recommendations
- **Read before write** — All Jira write-back requires explicit human approval
- **OKR value unlocked by flow data** — Delivery alignment requires healthy metrics first

**Target Personas:** Engineering Managers, Scrum Masters, Product Managers

---

## Feature 1: Flow Metrics Visualisation — Emergent, Conversation-Driven

### Problem Statement
Engineering teams struggle to understand their delivery health in real time. Metrics live in separate tools, dashboards are overwhelming, and metrics only become visible when teams proactively dig for them. Coaches need instant access to relevant metrics *in context* of ongoing conversations, not as a separate artifact to toggle to.

### Goals
- Surface Flow Framework metrics inline within coaching conversations, triggered by topic relevance
- Reduce friction between discussing a problem and seeing evidence
- Provide 6 chart types that cover the full spectrum of flow and delivery health
- Enable coaches to reference and interpret metrics without leaving the conversation interface

### Non-Goals
- Custom dashboard builder or drag-and-drop chart configuration
- Real-time event streaming or sub-second metric updates
- Mobile-optimised chart interactions (covered in Feature 12)

### User Stories
1. **As a coaching agent**, I want to detect when a user discusses "flow time" or "cycle time" in conversation, so I can automatically surface a line chart showing flow time trends for the selected sprint/crew.
2. **As an engineering manager**, I want to see a bar chart of sprint velocity history when discussing team capacity, so I can quickly assess if our burndown is on track.
3. **As a scrum master**, I want to see a pie chart of item distribution (stories/bugs/tech debt) when we discuss backlog health, so I can identify imbalance.
4. **As a coach**, I want to see a scatter plot of item age vs. WIP status when debugging delivery delays, so I can spot bottlenecks visually.

### Requirements

#### P0 (Must Have)
- Implement 6 chart types: Line, Bar, Pie, Load Indicator (gauge), Scatter, and Trend sparklines
- Chart data refreshes from Jira source-of-truth on-demand (not cached beyond 5 minutes)
- Charts render inline in conversation UI with caption and legend
- Conversational trigger mapping: pre-defined keywords (e.g., "flow time", "velocity", "WIP") map to chart types
- Line chart displays flow time with 8-sprint lookback window
- Bar chart displays velocity with configurable team/crew filter
- Pie chart shows item type distribution (Stories, Bugs, Tech Debt, etc.)
- Load indicator (gauge) displays current WIP as percentage of configured limit
- Scatter plot shows item age (y-axis) vs. item status progression (x-axis)
- All charts respect Jira data permissions per user role

#### P1 (Should Have)
- Conversational context enrichment: agent includes metric interpretation in coaching text (e.g., "I see your flow time has increased 12% this sprint")
- Dark mode theme for charts
- Configurable chart colours per org branding
- Hover tooltips on all interactive chart elements
- Quick-access "export as PNG" button per chart

#### P2 (Nice to Have)
- Drilldown: click scatter plot point to see issue details in modal
- Predicted trend lines on line charts (next 4 sprints)
- Compare current sprint to average of last 4 sprints overlay

### Success Metrics
- 80% of conversations that mention flow-related keywords trigger a chart auto-surface
- Average time from metric question to chart visibility: <2 seconds
- Chart comprehension score on user feedback: ≥4.2/5
- 60% of users report faster decision-making with inline metrics vs. toggling to external dashboard

### Acceptance Criteria
- Charts load and render correctly on all 6 chart types with test data
- Jira API integration fetches sprint data, item metadata, and metrics without errors
- Conversational trigger mapping correctly identifies 90%+ of flow-metric keywords
- Charts update when underlying Jira data changes (within 5-minute refresh window)
- All charts are readable and accessible (WCAG 2.1 AA standard)
- Charts don't break responsive layout on tablets (Feature 12 coverage)

---

## Feature 2: AI Coaching Engine & Recommendations

### Problem Statement
Metrics alone don't drive action. Coaches need to synthesize evidence, diagnose root causes, and recommend targeted interventions. Today's coaching is reactive (waiting for 1:1s) or generic (templated advice). We need structured, data-driven recommendations that feel personalized and evidence-backed.

### Goals
- Generate prioritized, actionable recommendations based on Flow Framework data
- Surface root cause hypotheses alongside each recommendation
- Track recommendation outcomes over time to validate coaching impact
- Reduce coaching prep time by automating evidence synthesis

### Non-Goals
- ML-based predictive recommendations (start with rule-based)
- Natural language generation for recommendation copy (use templates initially)
- Auto-actioning recommendations without human approval

### User Stories
1. **As an engineering manager**, I want to see a recommendation card that says "WIP is 40% over limit in Backend squad; review active items and consider pausing new work intake" with evidence (chart snapshot) and expected impact (estimated 15% flow time improvement), so I can prioritize this issue in my next squad sync.
2. **As a coaching agent**, I want to log when a recommendation is marked "Actioned" so I can track which interventions are most commonly adopted.
3. **As a scrum master**, I want to see recommendation history for the past 4 sprints, so I can assess if we're making progress on recurring issues (e.g., review cycle slowness).
4. **As a product manager**, I want to understand the business impact of each recommendation (e.g., "Expected velocity gain: +8 points over 2 sprints"), so I can prioritize coaching focus.

### Requirements

#### P0 (Must Have)
- Recommendation card structure: Priority (Critical/High/Medium), Evidence (text + 1 chart), Root Cause hypothesis, Recommended Action, Expected Impact estimate
- 3 priority levels: Critical (metric breach for 2+ sprints), High (metric degradation trend), Medium (metric slightly out of range)
- Evidence includes which metric triggered the recommendation and a snapshot of relevant chart
- Actions support: mark as "Actioned", "Dismissed", or "Snooze 2 weeks"
- Recommendation persistence: store all recommendations with timestamp and outcome status
- Coach can view recommendation history (last 12 sprints) filtered by squad/crew
- Expected impact estimates based on Flow Framework first principles (e.g., reducing WIP by 30% typically improves flow time by ~15%)
- Evidence accuracy: recommendations only surface if 2+ sprints of data available

#### P1 (Should Have)
- Recommendation templates for 8 common scenarios: WIP Overload, Review Cycle Delay, High Bug Load, Blocked Items, Low Velocity, Knowledge Silos, Inconsistent Velocity, Delivery Uncertainty
- Personalization: show which crew/squad the recommendation applies to
- A/B testing flag: enable/disable recommendations per org to measure coaching impact
- Notification integration: send recommendation summary to Slack channel weekly

#### P2 (Nice to Have)
- Multi-factor recommendations that combine 2+ metric signals
- Recommendation confidence score (e.g., "86% confident this is the bottleneck")
- Suggested OKR link: "This action aligns with OKR: Reduce Lead Time by 20%"

### Success Metrics
- 70% of recommendations marked "Actioned" within 2 weeks of surface
- Recommendation-to-outcome correlation: teams that action 3+ recommendations show avg 12% flow time improvement
- Average time from recommendation surface to action: <7 days
- User satisfaction: ≥4.0/5 on recommendation relevance

### Acceptance Criteria
- Recommendation card structure renders correctly with all 5 components
- Evidence chart fetches, renders, and displays without errors
- Action buttons (Actioned/Dismissed/Snooze) update state correctly and persist
- Recommendation history view loads and filters correctly (≥100 recommendations)
- Coaching agent surfaces recommendations proactively at appropriate times (no spam)
- All recommendations include metric triggers and expected impact estimates

---

## Feature 3: Epic Predictability & Portfolio View

### Problem Statement
Product and engineering leaders struggle to forecast epic delivery dates with confidence. Excel spreadsheets and manual estimates lead to uncertainty. Portfolio stakeholders need visibility into which epics are on track, at risk, or off track—and need to understand how delivery aligns with business OKRs.

### Goals
- Provide probabilistic (P70) delivery date forecasting for epics using Monte Carlo simulation
- Surface epic status (on-track / at-risk / off-track) at a glance
- Link epics to OKR key results to drive delivery alignment
- Reduce estimation uncertainty through data-driven forecasting

### Non-Goals
- Manual burndown curve entry or Jira epic field override
- Timeline Gantt chart (start with portfolio table view)
- Custom forecasting models per org (use standardized Little's Law model)

### User Stories
1. **As a product manager**, I want to see that Epic "Payments Infra Upgrade" has a P70 delivery date of May 15 with a 72% confidence level (calculated from velocity trends), so I can confidently commit to stakeholders.
2. **As a director of engineering**, I want to see a portfolio table showing all 24 active epics with their status (on-track/at-risk/off-track), P70 date, and linked OKR, so I can quickly identify delivery risks.
3. **As a scrum master**, I want to see how velocity trends impact a P70 date; if we add 2 more engineers to the crew, I want to see forecasted impact on delivery (P70 moves up by ~2 weeks).
4. **As a coach**, I want to flag an epic as "at-risk" if velocity drops 15% and forecasted delivery slips >1 week, so I can trigger coaching conversations.

### Requirements

#### P0 (Must Have)
- Epic-to-story mapping: ingest epic rollup from Jira (stories → sprints → velocity)
- Monte Carlo simulation: run 1000+ iterations with velocity distribution to calculate P70 delivery date
- Velocity distribution: use 8-sprint historical lookback to establish mean, std dev
- Status calculation: On-Track (P70 date within target ±5 days), At-Risk (±5-14 days), Off-Track (>14 days)
- Portfolio view: table with columns: Epic Name, Current Capacity (story points), Remaining Capacity, Velocity Trend (↑/→/↓), P70 Date, Status, Linked OKR
- Epic-OKR linking: UI to manually link epic to OKR key result
- Refresh cadence: P70 recalculated every sprint close (data-driven, not real-time)
- Data validation: P70 requires minimum 3 sprints of velocity data

#### P1 (Should Have)
- Sensitivity analysis: slider to model "add X engineers" impact on P70 (multiplies velocity baseline)
- Status change alerts: notify owning manager if epic status changes from On-Track → At-Risk
- Trend sparkline: 8-sprint velocity sparkline per epic in portfolio table
- Forecasted vs. Actual comparison: historical accuracy tracking (did P70 dates match reality?)

#### P2 (Nice to Have)
- Forecast confidence visualization: width of P70 confidence band (narrow = high confidence)
- Dependency graph: show inter-epic blocking dependencies
- Scenario planning: save multiple "what-if" forecasts and compare

### Success Metrics
- P70 forecast accuracy: 70%+ of epics actually deliver within P70 date window
- Portfolio view adoption: 80%+ of product/engineering leaders access weekly
- On-time delivery improvement: orgs using epic forecasting improve on-time delivery by 18% on average
- User confidence: ≥4.3/5 on whether P70 forecasts are trustworthy

### Acceptance Criteria
- Monte Carlo simulation runs correctly and produces P70 dates within expected range
- Portfolio table renders with all columns, filters correctly by crew/squad
- Epic-OKR linking UI is intuitive and persists correctly
- Status logic correctly categorises epics (On-Track/At-Risk/Off-Track) based on P70 variance
- Minimum 3-sprint validation rule is enforced
- Sensitivity analysis accurately models velocity increase from headcount additions
- Historical accuracy tracking logs actual vs. forecasted delivery dates

---

## Feature 4: OKR Tracking & Alignment

### Problem Statement
Engineering often executes delivery without understanding alignment to business OKRs. OKRs live in spreadsheets, key results lack confidence metrics, and there's no visibility into whether flow health improvements actually drive business outcomes. We need OKRs to be living, confidence-driven, and visibly linked to flow and delivery.

### Goals
- Enable teams to define and track OKRs with confidence levels per key result
- Surface crew-level and squad-level alignment visibility
- Link OKRs to epics and flow metrics to close the strategy-execution loop
- Make progress visible with real-time progress bars tied to delivery data

### Non-Goals
- OKR grading or final scoring (that's a business review process)
- Integration with external OKR platforms (start with in-app OKR data model)
- AI-generated OKRs (start with manual entry)

### User Stories
1. **As a VP of Engineering**, I want to see that Objective "Improve Delivery Velocity" has 3 key results: "Reduce flow time by 20%" (66% progress, High confidence), "Increase on-time delivery to 90%" (45% progress, Medium confidence), "Reduce WIP by 30%" (72% progress, High confidence), so I can track quarterly progress at a glance.
2. **As a crew lead**, I want to see which squads contribute to which key results and view alignment across the crew, so I can ensure all squads are rowing in the same direction.
3. **As a coach**, I want to link an epic to a key result so that when the epic delivers, the system auto-updates KR progress, so I can close the strategy-execution loop.
4. **As a product manager**, I want to see confidence levels per key result (High = 80-100% likely to achieve, Medium = 60-80%, Low = <60%) and adjust coaching focus for Low-confidence KRs, so I can de-risk the quarter.

### Requirements

#### P0 (Must Have)
- OKR data model: Objectives (text, owner crew, Q# of year), Key Results (text, target metric, progress %, confidence level)
- Confidence levels: High (80-100%), Medium (60-80%), Low (<60%) — manually set by OKR owner
- Key result progress bar: visual progress display (0-100%)
- Epic-to-KR linking: UI to link 1 epic to 1+ KRs
- Crew-level OKR view: show all OKRs for a crew with contributing squads
- Squad-level OKR view: show which crew OKRs the squad contributes to
- OKR filter: view OKRs by quarter, crew, or search by name
- Persistence: all OKRs stored with creation timestamp, last updated timestamp

#### P1 (Should Have)
- Auto-progress calculation: if OKR is linked to epic, KR progress auto-updates based on epic P70 confidence (e.g., if epic is 72% confident, KR shows 72% progress)
- Confidence trend: show how confidence has changed week-over-week (was High, now Medium, trending Low)
- At-risk flag: surface key results with Low confidence to org leaders weekly
- Narrative field: owner can add 2-3 sentence update on KR progress status

#### P2 (Nice to Have)
- Historical OKR tracking: archive past quarters and show achievement rates
- Correlation analysis: show which flow metrics correlate most strongly with KR progress
- Suggested OKRs: coach recommends OKRs based on current flow metric trends

### Success Metrics
- 90%+ of org OKRs linked to at least 1 epic
- Confidence accuracy: teams' High-confidence KRs achieve 82%+ of the time
- OKR tracking engagement: 70%+ of crew leads update OKR progress weekly
- Flow-to-business correlation: orgs show 34% better on-time delivery on OKRs with linked epics

### Acceptance Criteria
- OKR CRUD operations (Create, Read, Update, Delete) work correctly
- Confidence levels correctly categorise and update
- Epic-to-KR linking UI is intuitive and enforces 1 epic → 1+ KRs relationship
- Crew and squad-level views correctly filter and display OKRs
- Auto-progress calculation accurately reflects epic P70 confidence
- OKRs persist correctly with timestamps
- Confidence trend tracking updates correctly week-over-week

---

## Feature 5: Jira MCP Integration — Read & Write

### Problem Statement
Coaches need to ingest sprint data and propose targeted actions (sprint moves, priority changes, etc.) but today's integration options are either read-only dashboards or require coaches to manually edit Jira. This creates friction and inconsistency. We need a safe, audited pathway for the coaching system to propose actions with human approval gates.

### Goals
- Ingest sprint data, item metadata, and status changes from Jira in real time
- Propose 5 types of agentic actions with human approval required before execution
- Maintain audit trail of all proposed and executed actions
- Ensure read access respects Jira permission model

### Non-Goals
- Direct bot account mutations (use OAuth and user context)
- Bi-directional sync of all Jira fields (read high-value fields only)
- Custom Jira field creation or schema modifications

### User Stories
1. **As a coaching agent**, I want to ingest the latest sprint data (sprint ID, team velocity, items in sprint, status changes) from Jira every 15 minutes, so my recommendations are based on current state.
2. **As a scrum master**, I want to see a coaching recommendation to "Move 3 lower-priority stories from this sprint to backlog to stay within WIP limit" with a review button, and after I click Approve, the system moves the issues and notifies the team in Slack, so I don't have to manually edit Jira.
3. **As an engineering manager**, I want to see an audit log showing "Sprint Move: 3 issues moved by Coach (approved by [Manager])" so I maintain governance.
4. **As a coach**, I want to propose a label change (e.g., add "blocked-by-infrastructure" to an issue) so the team can see blockers visually in Jira, and I want human approval before the change executes.

### Requirements

#### P0 (Must Have)
- Jira OAuth integration: use org's Jira instance with user OAuth token (no bot account)
- Read endpoints: ingest Sprint (active/recent), Issues (in sprint, in backlog), Status changes, Custom fields (labels, priority, WIP field)
- Ingestion cadence: 15-minute refresh cycle for sprint data, 5-minute for recent item status changes
- 5 action types: (1) Sprint Move (story to sprint/backlog), (2) Priority Change, (3) Label Add/Remove, (4) WIP Limit Override (with warning), (5) Assignee Change (suggest only, not auto-assign)
- Approval flow: action proposal → human review → approve/reject → execute or log rejection
- Audit trail: log all proposed/approved/rejected/executed actions with actor, timestamp, item IDs
- Data validation: verify item exists and sprint is active before proposing action
- Error handling: graceful fallback if Jira API unavailable (show cached data, disable write actions)

#### P1 (Should Have)
- Slack integration for approval: send action proposal to Slack, approve/reject via Slack button (then confirm in UI)
- Batch actions: propose moving 3+ items in one action (e.g., "Move items 101, 102, 104 to backlog")
- Undo capability: revert executed action if approved within 2 hours
- Permission check: validate user has required Jira permissions before proposing action (e.g., don't propose sprint move if user lacks sprint edit permission)

#### P2 (Nice to Have)
- Custom action templates per org (define additional action types)
- Dry-run mode: show what the action would do without executing
- Bulk action sequencing: propose multiple actions in dependency order

### Success Metrics
- 95%+ of Jira read requests complete without error
- Average action proposal-to-approval time: <10 minutes
- 70%+ of proposed actions are approved and executed
- Zero permission violations (no unauthorized Jira changes)
- Audit trail completeness: 100% of executed actions logged with actor and timestamp

### Acceptance Criteria
- Jira OAuth flow works end-to-end (user can authenticate org)
- Sprint data ingestion fetches correctly and updates every 15 minutes
- Item status changes tracked and trigger recommendations
- All 5 action types can be proposed, reviewed, and executed
- Approval flow requires explicit human confirmation before execution
- Audit trail logs all actions with required metadata
- Error handling shows user-friendly messages on Jira unavailability
- Permission checks validate before proposing action

---

## Feature 6: Organisational Context & Configuration

### Problem Statement
Agent Coach operates across large orgs with multiple teams, hierarchies, and different working cadences. Without proper context configuration, metrics are confusing (whose WIP limit?), recommendations are irrelevant (wrong squad), and configurations can't scale. We need a robust org configuration layer.

### Goals
- Enable coaches to define org hierarchy: Platform → Crew → Squad
- Configure WIP limits, sprint cadence, and metric baselines per squad
- Maintain squad-to-crew mapping for cross-team visibility
- Support teams with non-standard cadences (2-week vs. 1-week sprints)

### Non-Goals
- Automated org structure inference from Jira (manual entry to ensure accuracy)
- Role-based access control beyond org hierarchy (delegated to SSO layer)
- Custom metric definitions or Flow Framework variations

### User Stories
1. **As an engineering director**, I want to configure the org structure as: Platform "Infrastructure" → Crews "Core Services" and "Developer Tools" → Squads "API", "Storage", "CLI" under Core Services, so metrics and recommendations are scoped correctly.
2. **As a scrum master**, I want to set WIP limit for "API Squad" to 12 items and 2-week sprint cadence, so recommendations respect our team's constraints.
3. **As a coach**, I want to see that Squad "API" reports to Crew "Core Services" which reports to Platform "Infrastructure", so I can show alignment across hierarchy.
4. **As a PM**, I want to configure baseline metrics for each squad (e.g., "Historical velocity for API Squad: 34 points/sprint") so forecasts and recommendations are calibrated.

### Requirements

#### P0 (Must Have)
- Org structure hierarchy: Platform (top level), Crews (middle), Squads (bottom)
- Hierarchy configuration UI: ability to create/edit/delete levels and define parent-child relationships
- WIP limit per squad: configurable integer, used in load indicator and alerts
- Sprint cadence per squad: dropdown (1-week, 2-week, 3-week, 4-week)
- Squad-to-crew mapping: bidirectional view of which squads belong to crew
- Baseline metrics per squad: historical velocity (calculated from Jira, not manual)
- Data persistence: org structure stored in Agent Coach database
- Access control: only org admins can modify org structure

#### P1 (Should Have)
- Import from Jira: auto-import squad/team structure from Jira board hierarchy
- Crew-level WIP limits: optional, inherited by squads unless overridden
- Metric defaults: pre-populate baseline metrics from first 8 sprints of Jira data
- Versioning: track org structure changes and show audit history

#### P2 (Nice to Have)
- Multi-org support: single Agent Coach instance serving multiple customers with separate configs
- Custom labels: tag squads with metadata (e.g., "TypeScript Stack", "Payments Domain")
- Slack channel mapping: associate squads with Slack channels for notifications

### Success Metrics
- 100% of active squads configured with WIP limit and sprint cadence
- Org structure setup time: <30 minutes for typical enterprise (20+ squads)
- Hierarchy accuracy: 98%+ of recommendations scoped to correct squad
- User satisfaction: ≥4.4/5 on config UX

### Acceptance Criteria
- Org structure creation/edit/delete operations work correctly
- Parent-child relationships correctly enforced and displayed
- WIP limits per squad persist and are used in alerts and load indicators
- Sprint cadence correctly configures analysis windows (e.g., 2-week cadence uses 2-week sprint boundaries)
- Squad-to-crew mapping displays correctly in crew and squad views
- Baseline metrics load from Jira and display accurately
- Only org admins can access config UI

---

## Feature 7: Proactive Alerting

### Problem Statement
Today, coaching is reactive: coaches wait for 1:1s or stumble upon issues in dashboards. By the time a metric breach is visible, damage is done (4-week backlog buildup, stuck items, etc.). We need proactive, event-driven alerts that notify coaches to emerging issues *before* they become crises.

### Goals
- Surface metric threshold breaches as event-driven alerts with severity levels
- Enable coaches to see alert history and take action directly from alerts
- Reduce time-to-detection of flow health degradation
- Provide alert configuration so orgs can set thresholds relevant to their context

### Non-Goals
- Slack/Teams push notifications (start with in-app bell icon)
- ML-based anomaly detection (use configured thresholds)
- Alert suppression or snoozing

### User Stories
1. **As a coach**, I want an alert when Flow Efficiency drops below 30% for 2+ consecutive sprints for any squad, so I can proactively trigger a coaching intervention before it cascades.
2. **As a scrum master**, I want to see an alert that "WIP in Backend Squad exceeded limit (16 items vs. 12 limit) for 3 consecutive sprints", so I know to escalate and discuss capacity planning.
3. **As an engineering manager**, I want to dismiss or snooze low-priority (info-level) alerts, but Critical alerts stay pinned until actioned, so I'm not overwhelmed.
4. **As a coach**, I want to see alert history per squad (last 12 weeks) and drill into each alert to see which metric triggered it, so I can spot patterns.

### Requirements

#### P0 (Must Have)
- Alert data model: Alert ID, Severity (Critical/Warning/Info), Metric Name, Squad/Crew, Threshold Breach, Timestamp, Status (New/Acknowledged/Dismissed)
- Severity levels: Critical (metric 20%+ out of range for 2+ sprints), Warning (metric 10-20% out of range), Info (metric slightly out of range or informational)
- Trigger conditions: (1) Flow Efficiency <30% for 2+ sprints, (2) WIP exceeds limit for 3+ sprints, (3) Velocity variance >30% sprint-over-sprint, (4) Lead time increases 20% over 4-sprint average
- Alert generation: daily evaluation (5 AM UTC) against configured thresholds
- Alert UI: bell icon with unread badge (count of new alerts), dropdown showing recent 20 alerts
- Alert detail: clicking alert shows metric name, threshold, squad, historical chart of metric, actions (Mark as Acknowledged, Dismiss, Snooze 1 week)
- Alert persistence: store all alerts for 12 weeks
- Threshold configuration: org admins can configure alert thresholds per severity level

#### P1 (Should Have)
- Alert frequency: avoid duplicate alerts for same breach (don't re-alert on Day 3 of breach if already alerted Day 2)
- Alert context: include chart snapshot in alert detail showing breach
- Escalation: if Critical alert not acknowledged within 48 hours, send Slack notification to crew lead
- Alert trends: show in sidebar how many alerts per squad/crew (to prioritize coaching)

#### P2 (Nice to Have)
- Custom alert rules per org: allow teams to define additional alert triggers
- Alert dampening: if multiple metrics breach simultaneously, group into single alert
- Alert recommendations: show suggested playbook or action for each alert

### Success Metrics
- Alert detection time: average 1 day from metric breach to alert surface
- Alert accuracy: 85%+ of alerts lead to coaching intervention
- False positive rate: <10% (alerts that don't represent real issues)
- Acknowledged alerts: 70%+ acknowledged within 24 hours

### Acceptance Criteria
- Alert generation logic correctly identifies threshold breaches
- Severity classification matches defined rules
- Bell icon displays correctly with unread count badge
- Alert dropdown shows recent alerts with sortable/filterable options
- Alert detail view renders metric chart and provides action buttons
- Threshold configuration UI is accessible to org admins only
- Duplicate alert suppression prevents alert spam
- Alert persistence stores 12 weeks of history

---

## Feature 8: Coaching Playbook Library

### Problem Statement
Coaches lack a shared knowledge base of proven interventions. Each coach reinvents solutions for common problems (WIP overload, slow reviews, etc.), leading to inconsistent outcomes. We need a library of evidence-based playbooks that coaches can reference, use, and improve over time.

### Goals
- Provide 6 pre-built coaching playbooks for common flow issues
- Track playbook usage and outcomes to validate effectiveness
- Enable coaches to launch interventions directly from playbooks
- Measure playbook efficacy over time to improve recommendations

### Non-Goals
- Custom playbook creation (start with pre-built library)
- Video tutorials or interactive walkthroughs
- Playbook versioning or A/B testing different playbook versions

### User Stories
1. **As a coach**, I want to access a playbook for "WIP Overload" that includes: (1) Root cause theory, (2) Step 1: Visualize current WIP and limit, (3) Step 2: Conduct squad sync to review active items, (4) Step 3: Propose pause on new intake, (5) Success rate (73% of teams see flow time improvement), (6) Avg improvement: 18% flow time reduction in 2 sprints, so I can guide a coaching conversation methodically.
2. **As an engineering manager**, I want to click "Use this Playbook" on the Slow Review Cycle playbook, so Agent Coach creates a new intervention tracking this playbook, and I see checkboxes for each step.
3. **As a scrum master**, I want to see playbook usage count (e.g., "WIP Overload: used 14 times across org") and average improvement achieved (e.g., "Avg flow time improvement: 17%"), so I know which playbooks work best.
4. **As a coach**, I want to log completion of each playbook step with notes ("We reduced WIP from 18 to 11 items"), so the system can track intervention outcomes.

### Requirements

#### P0 (Must Have)
- Playbook data model: Playbook ID, Category, Title, Root Cause Theory (2-3 sentences), Steps (3-5 ordered steps with description), Success Rate (%), Avg Improvement (metric and %), Usage Count, Avg Improvement Sprints (how long to see results)
- 6 playbooks: (1) WIP Overload, (2) Slow Review Cycle, (3) High Bug Load, (4) Blocked Items, (5) Low Velocity, (6) Knowledge Silos
- Playbook library view: grid or table showing all playbooks with category filter
- Playbook detail view: full playbook text, success rate, usage count, avg improvement, "Use this Playbook" button
- Create intervention: clicking "Use" creates a new intervention record linked to playbook
- Intervention tracking: UI shows playbook steps as checklist; coach can mark steps complete with optional notes
- Outcome logging: coach can log final outcome (e.g., "Flow time improved 21%") and when improvement was observed

#### P1 (Should Have)
- Playbook recommendations: agent suggests relevant playbook when recommendation is actioned (e.g., if WIP overload recommendation is actioned, suggest WIP Overload playbook)
- Success rate calculation: aggregate actual intervention outcomes to update playbook success rate weekly
- Cohort analysis: show success rate per crew/squad (e.g., "WIP Overload playbook: 71% success in Platform crew, 75% in Product crew")
- Playbook timeline: show when intervention started/completed in coaching history

#### P2 (Nice to Have)
- Playbook variations: different versions per org context (e.g., "WIP Overload for Distributed Teams")
- Prerequisite playbooks: flag if Coach recommends Playbook B before Playbook A (e.g., reduce WIP before optimizing reviews)
- Playbook templates: allow orgs to create custom playbooks

### Success Metrics
- Playbook usage: 65%+ of coaching interventions use a playbook
- Playbook success rates: 70%+ of interventions achieve stated improvement within avg improvement sprints
- Playbook engagement: 85%+ of steps completed for interventions that reach completion
- Outcome logging accuracy: 80%+ of interventions log outcome measurements

### Acceptance Criteria
- All 6 playbooks render correctly in library view with category, title, success rate, usage count
- "Use this Playbook" button creates intervention and shows step checklist
- Step checklist allows marking complete and adding notes
- Outcome logging captures final metrics and timeline
- Success rate calculation aggregates outcomes correctly
- Playbook recommendations surface at appropriate intervention times
- Cohort analysis breaks down success rates by crew/squad

---

## Feature 9: Squad Comparison & Team Health Overview

### Problem Statement
Leaders can't easily compare health across multiple squads. Metrics are scattered across tools or require manual compilation into spreadsheets. There's no single view of "which squads are struggling?" or "how does velocity compare across crews?". We need a team health overview that surfaces the full picture at a glance.

### Goals
- Provide a heat map view of squad metrics across Flow Time, Velocity, Efficiency, WIP, and manual health score
- Enable fast identification of underperforming squads and crews
- Allow manual health score entry with context notes
- Drive coaching prioritization by highlighting squads needing attention

### Non-Goals
- Automated health scoring (start with manual input)
- Benchmarking against external industry data
- Detailed drill-down analytics (covered by Feature 1)

### User Stories
1. **As a VP of Engineering**, I want to see a heat map table of all 24 squads with columns: Squad Name, Flow Time, Velocity, Efficiency, WIP, Health Score (1-5), so I can see at a glance that Backend Squad is red (high flow time, low velocity, low efficiency) while Frontend Squad is green.
2. **As a crew lead**, I want to click on a squad row to expand and see drill-down metrics, notes, and recent recommendations for that squad, so I understand why it's flagged.
3. **As an engineering manager**, I want to manually set a Health Score (1-5) for my squad once per month with notes (e.g., "2 = we lost 2 senior engineers, expecting recovery in 4 weeks"), so the system understands context beyond metrics.
4. **As a coach**, I want to filter the heat map by crew or platform, so I can focus on crews I'm coaching.

### Requirements

#### P0 (Must Have)
- Heat map table: rows = squads, columns = Flow Time (avg days), Velocity (avg story points/sprint), Efficiency (%), WIP (current), Health Score (1-5)
- Colour coding: Green (metric in healthy range), Amber (metric warning range), Red (metric critical range); thresholds configured per org baseline
- Health score input: dropdown (1-5) per squad, stored with timestamp and updater name
- Health score notes: text field for context (max 500 chars), displayed as tooltip on health score cell
- Sort/filter: sort by any column, filter by crew/platform, search by squad name
- Row drill-down: click squad row to expand and show: recent recommendations (last 3), coaching interventions in progress, alert history
- Metric baseline: Flow Time/Velocity/Efficiency ranges configured per org (e.g., "green if flow time <5 days")
- Data source: metrics pull from Flow Metrics Visualisation (Feature 1) calculated from Jira data

#### P1 (Should Have)
- Trend indicator: sparkline (↑/→/↓) per metric showing 8-sprint trend
- Comparison view: select 2-3 squads to compare side-by-side (detailed metrics)
- Export as CSV: download heat map data for reporting
- Health score history: timeline showing health score changes over quarters

#### P2 (Nice to Have)
- Peer comparison: "Squad is performing [better/worse] than [X]% of crews in similar size"
- Recommended actions: "Based on metrics, this squad would benefit from: WIP Overload playbook"

### Success Metrics
- Heat map view adoption: 85%+ of directors/crew leads access monthly
- Manual health score entry: 90%+ of squads have health scores
- Time-to-insight: <1 minute to identify 3 underperforming squads
- Accuracy: manually entered health scores correlate with metric trends at r² = 0.72+

### Acceptance Criteria
- Heat map table renders correctly with all 5 metrics plus health score column
- Colour coding correctly applies based on configured thresholds
- Sort and filter work correctly across all columns
- Health score dropdown and notes UI functional
- Row drill-down expands to show recommendations, interventions, alerts
- Baseline thresholds are configurable and applied correctly
- Metrics data loads and updates without errors

---

## Feature 10: What-if Flow Simulator

### Problem Statement
Coaches lack a way to model the impact of interventions before committing. "If we reduce WIP from 14 to 8 items, how much will flow time improve?" requires manual calculation. Leaders need to see projected outcomes to justify coaching investment and build buy-in from engineering teams.

### Goals
- Provide a Little's Law-based simulator to model WIP impact on flow metrics
- Enable coaches to test scenarios and show projected improvements
- Drive coaching prioritization by quantifying impact
- Help teams set realistic flow improvement targets

### Non-Goals
- Non-linear flow models or queuing theory beyond Little's Law
- Simulation of headcount or velocity changes (Feature 3 covers velocity)
- Historical what-if replay (just forward projections)

### User Stories
1. **As a coach**, I want to move a WIP limit slider from 14 (current) to 8 and see projected outcomes: Flow Time reduced 35% (from 8.2 to 5.3 days), Efficiency improved 28% (from 64% to 82%), so I can tell the Backend Squad: "If we cap WIP at 8, we'll cut cycle time by a week."
2. **As an engineering manager**, I want to adjust WIP to 6 and see it's too aggressive (flow time would be 4.1 days, but max sustainable efficiency 85%, meaning bottlenecks), so I can find a realistic target (WIP 9 = 6.2 days, 79% efficiency).
3. **As a scrum master**, I want to show the simulator to the squad during a retro to get buy-in on WIP limits, so the team understands the trade-offs.
4. **As a coach**, I want to compare 3 scenarios (WIP 8, 10, 12) side-by-side, so I can recommend the optimal WIP target for the squad.

### Requirements

#### P0 (Must Have)
- Little's Law model: Flow Time = WIP / Throughput; Efficiency = Throughput / Capacity
- Input: WIP slider (range 2-12 items, or configurable per squad's current WIP ±50%)
- Baseline metrics: use squad's last 4-sprint average for Throughput (items/sprint) and Capacity (ideal throughput if no multitasking)
- Outputs: Projected Flow Time (days), Projected Efficiency (%), Projected Velocity (estimated impact)
- Visualization: show baseline (current WIP, current metrics) vs. simulated (new WIP, projected metrics) as side-by-side cards
- Improvement %: calculate and display % improvement in each metric (e.g., "Flow Time: -35%")
- Realistic bounds: warn if WIP <2 or >squad size (e.g., "WIP 18 exceeds squad size of 10")

#### P1 (Should Have)
- Scenario comparison: save 3 scenarios and display side-by-side (WIP 8, 10, 12)
- Optimal WIP recommendation: calculate WIP that maximizes Efficiency while keeping Flow Time <X days
- Sensitivity analysis: show impact range (e.g., "Confidence band: flow time could improve 30-40%")
- Chart visualization: show projected flow time / efficiency curves as WIP changes

#### P2 (Nice to Have)
- Headcount impact: slider to model adding 1-2 engineers, see impact on throughput
- Sprint duration modeling: adjust sprint length and see impact on cycle time
- Historical accuracy: show how past simulations compared to actual outcomes

### Success Metrics
- Simulator usage: 60%+ of coaching interventions include simulator walkthrough
- Accuracy: projected flow time vs. actual within ±20% for 75%+ of implementations
- User understanding: 80%+ of engineers who see simulator understand WIP-flow relationship
- Adoption: 85%+ of squads implement simulated WIP targets

### Acceptance Criteria
- WIP slider works correctly (2-12 range, configurable baseline)
- Little's Law calculations are accurate and match published formulas
- Projected metrics display correctly (Flow Time, Efficiency, Velocity)
- Improvement % calculated and displayed
- Bounds checking warns for unrealistic WIP values
- Scenario comparison saves and displays correctly
- Optimal WIP recommendation logic is sound
- Visualization renders charts without errors

---

## Feature 11: Richer Jira Write-back (Agentic Actions v2)

### Problem Statement
Feature 5 covers basic write-back (sprint move, priority, label, assignee). But the highest-value coaching actions happen at the backlog level: sprint planning (trimming backlog to respect WIP) and dependency reordering (unblocking parallel work). These require more sophisticated logic and user context.

### Goals
- Extend Jira write-back with Sprint Planning and Backlog Reordering actions
- Propose intelligently trimmed sprint backlogs aligned to WIP limits
- Enable dependency-driven backlog ordering to unblock parallel work
- Maintain full approval gates and audit trails

### Non-Goals
- Fully automated sprint planning (stay with proposal + approval model)
- AI-driven dependency inference (require manual tagging or Jira linking)
- Capacity allocation per engineer (start with team-level)

### User Stories
1. **As a scrum master**, I want to see a proposal: "Sprint Backlog Trim — Backend Squad's planned sprint (84 story points) exceeds WIP-adjusted capacity (60 points for 12-item WIP limit). Propose removing: [Story 456, 457, 458] (18 points) to reach 66 points. Reasons: these stories depend on API changes in progress." With Approve/Reject buttons.
2. **As a crew lead**, I want to see proposed backlog reordering: "Reorder backlog to unblock parallel work: Move [Task 789] (blocked by API feature) to position 8, after API feature [Story 234] (currently position 2)." so dependencies are visible and work flows smoothly.
3. **As a coach**, I want the system to calculate WIP-adjusted sprint capacity based on our WIP limit (Feature 6) and squad velocity, so sprint planning proposals are always realistic.
4. **As an engineering manager**, I want to audit all sprint planning changes, so I maintain visibility into what changed and why.

### Requirements

#### P0 (Must Have)
- Sprint Planning action: propose trimmed sprint backlog to respect WIP-adjusted capacity
- Capacity calculation: WIP Limit × (Velocity / Avg Items Per Sprint) = max story points for sprint
- Trim algorithm: identify lowest-priority stories that exceed capacity, propose removing them
- Removal rationale: flag if story is blocked, has open bugs, or is high-risk (justification for removal)
- Backlog Reordering action: detect issues with "blocked by" links, propose reordering to unblock dependencies
- Dependency detection: read Jira "blocked by" and "relates to" links to understand dependency graph
- Reorder proposal: show current order vs. proposed order with before/after visualization
- Approval flow: both actions follow standard approval UI from Feature 5 (review + approve/reject)
- Audit trail: log sprint planning and backlog reordering changes

#### P1 (Should Have)
- Batch planning: propose full sprint plan for multiple squads at once (for crew sync)
- Dependency visualization: show dependency graph in proposal (which items block which)
- Risk assessment: flag high-risk removals (stories with bugs, incomplete design, etc.)
- Unblock analysis: calculate estimated productivity gain from unblocking parallel work

#### P2 (Nice to Have)
- Capacity forecasting: "If we add 1 engineer, capacity would increase to X points"
- Multi-sprint planning: propose work distribution across 2-3 sprint horizons
- Dependency automation: auto-detect dependencies from commit/PR links, not just Jira links

### Success Metrics
- Sprint planning proposal accuracy: 80%+ of proposed trims don't require mid-sprint adjustment
- Adoption: 70%+ of sprint planning uses coached proposal vs. manual
- Backlog unblocking: average 25% more parallel work attempted after reordering
- Audit trail completeness: 100% of planning changes logged

### Acceptance Criteria
- Sprint Planning action proposes correctly trimmed backlog based on capacity calculation
- Trim rationale explains why stories are proposed for removal
- Backlog Reordering detects and visualizes dependency relationships
- Reorder proposal shows before/after with clear change indication
- Approval flow requires explicit human confirmation before executing
- Audit trail logs all planning and reordering changes
- Capacity calculation accounts for WIP limits and historical velocity
- Dependency detection works with Jira linked issues

---

## Feature 12: Mobile-Responsive Layout

### Problem Statement
Coaches and managers access Agent Coach on phones during standups, 1:1s, and while walking between meetings. The current desktop-optimised layout breaks on mobile: sidebar spans full width, charts are too small, and navigation is confusing. We need a mobile-first responsive design.

### Goals
- Ensure full functionality on phones (iOS 14+, Android 10+)
- Optimise for small screens without removing features
- Enable quick access to alerts, recommendations, and OKRs on mobile
- Improve mobile usability to near parity with desktop

### Non-Goals
- Native mobile apps (stay with responsive web)
- Offline mode (assume always-connected mobile)
- Touch-optimised gestures beyond standard tap/swipe

### User Stories
1. **As an engineering manager**, I want to pull up Agent Coach on my phone during a standup and see alerts, the alert bell shows unread count, I can tap it to see recent alerts, so I can address issues in real time.
2. **As a scrum master**, I want the sidebar to collapse on mobile (hamburger menu), the main content to use full width, so I can read recommendation cards clearly on a 5-inch screen.
3. **As a coach**, I want to see a bottom navigation bar with tabs (Coaching, Metrics, Alerts, OKRs, Settings) on mobile, so I can navigate quickly between sections without scrolling.
4. **As a product manager**, I want charts to remain readable on mobile (not too small), so I can make decisions from anywhere.

### Requirements

#### P0 (Must Have)
- Breakpoints: Design for mobile-first at 375px (iPhone SE), tablet at 768px (iPad), desktop at 1024px+
- Sidebar: collapse to hamburger menu on mobile (<768px), expand normally on tablet/desktop
- Bottom navigation: appear on mobile only (<768px), contain: Coaching, Metrics, OKRs, Alerts, Settings (5 tabs)
- Tab bar: hide classic top tab bar on mobile (redundant with bottom nav)
- Content area: full-width on mobile, left-margin on desktop (no sidebar clip)
- Padding: add bottom padding on mobile to accommodate fixed bottom nav
- Charts: responsive SVG, scale to fit container, maintain readability (legend, labels visible)
- Buttons: minimum 44x44 tap targets (iOS accessibility)
- Keyboard: mobile keyboard doesn't hide critical UI (scroll to show submit buttons)

#### P1 (Should Have)
- Landscape mode: charts and tables adapt to landscape orientation
- Touch interactions: swipe to navigate between tabs, double-tap to zoom charts
- Safe areas: respect notch and home indicator (iOS) and gesture areas (Android)
- Performance: pages load within 2s on 4G mobile networks
- Dark mode: render correctly in system dark mode (iOS/Android)

#### P2 (Nice to Have)
- Progressive Web App (PWA): add to home screen, offline caching
- Native-like transitions: smooth page transitions on mobile
- Bottom sheet modals: use bottom sheets for secondary actions (approve action, add notes)

### Success Metrics
- Mobile traffic: 35%+ of sessions from mobile devices
- Mobile session duration: ≥5 minutes (not drop-off from poor UX)
- Mobile satisfaction: ≥4.0/5 on mobile usability survey
- Performance: 95th percentile load time <3s on 4G

### Acceptance Criteria
- Layout responsive at all breakpoints (375px, 768px, 1024px+)
- Sidebar collapses to hamburger menu on mobile
- Bottom navigation bar appears on mobile with 5 tabs
- All interactive elements have 44x44 tap targets
- Charts readable and interactive on mobile
- Buttons and forms don't get hidden by mobile keyboard
- Performance meets <3s load time on 4G

---

## Feature 13: Coaching History & Notes

### Problem Statement
Coaching impact is lost because interventions and decisions aren't documented. Coaches can't revisit what was tried, when, and what worked. OKRs and flow metrics improve, but the "why" is unclear. We need a timestamped record of coaching decisions and follow-ups.

### Goals
- Maintain timestamped notes for each coaching intervention
- Enable coaches to reflect on decisions and track follow-up outcomes
- Provide historical context for future coaching decisions
- Document coaching narratives for performance reviews and org learning

### Non-Goals
- Collaborative notes (single author per note initially)
- Video/audio recording of coaching sessions
- Natural language summaries of interventions

### User Stories
1. **As a coach**, I want to add timestamped notes to a WIP Overload intervention (e.g., "Sprint 1: Discussed WIP limits with squad, agreed to 10-item cap. Velocity stable but WIP still spiking. Sprint 2: Found root cause — QA bottleneck. Moving QA work earlier in sprint."), so I document the coaching journey.
2. **As an engineering manager**, I want to see a timeline of all coaching interventions and notes for my squad (last 6 months), so I can brief my director on what we've worked on.
3. **As a scrum master**, I want to view intervention detail and see all notes chronologically (oldest first), so I understand what was tried and when impact was observed.
4. **As a coach**, I want to add a note "Follow-up: Check if WIP reduction held in Sprint 4" and set a reminder 2 weeks out, so I don't forget to follow up.

### Requirements

#### P0 (Must Have)
- Notes data model: Note ID, Intervention ID, Text (max 2000 chars), Timestamp, Author
- Note creation: textarea input in intervention detail view, submit button
- Notes timeline: chronological list (oldest first) in intervention detail, showing timestamp and author
- Note display: read-only rendering with timestamp, author name, text
- Intervention timeline: show all interventions per squad/crew with creation date and status
- Notes persistence: all notes stored with full history
- Author tracking: note author captured from authenticated user

#### P1 (Should Have)
- Note editing: author can edit notes within 24 hours of creation
- Follow-up reminders: option to set 1-week or 2-week reminder when adding note
- Rich text: support markdown formatting in notes (bold, italic, links)
- Search: ability to search interventions and notes by keyword
- Export: download intervention history + notes as PDF

#### P2 (Nice to Have)
- Note templates: pre-defined prompts (e.g., "What was the root cause?", "What metrics improved?")
- Sentiment tracking: tag notes with sentiment (positive/negative/neutral) to show coaching progress
- Coaching report: auto-generate quarterly coaching summary for director review

### Success Metrics
- Notes adoption: 75%+ of interventions have 2+ notes
- Note frequency: average 1 note per week per intervention
- Follow-up rate: 80%+ of reminders acted upon
- History completeness: 100% of interventions retrievable with full note history

### Acceptance Criteria
- Note creation and persistence work correctly
- Notes timeline displays chronologically with timestamps
- Note author correctly identified and displayed
- Intervention timeline shows all interventions with dates
- Note search works across notes text
- Follow-up reminders are set and trigger correctly
- Export to PDF generates valid file with all intervention + note data
- Notes support markdown formatting (if P1)

---

## Appendix: Feature-to-Roadmap Mapping

### Q1 2026 — Foundation: Flow Metrics, Coaching, Org Config

| Feature | Q1 | Q2 | Q3 | Q4 |
|---------|----|----|----|----|
| Feature 1: Flow Metrics Visualisation | ✓ | | | |
| Feature 2: AI Coaching Engine & Recommendations | ✓ | | | |
| Feature 6: Organisational Context & Configuration | ✓ | | | |

**Q1 Goals:** Establish core data ingestion (Feature 6), flow metric visualization (Feature 1), and basic coaching recommendation engine (Feature 2) so coaches have visibility into team health and can surface data-driven recommendations within conversations.

**Success Criteria for Q1:**
- Jira data ingestion stable with <1% error rate
- Flow Metrics Visualisation renders 6 chart types correctly
- Coaching Engine generates 5+ recommendation templates
- Org configuration supports 20+ squads with accurate WIP limits

---

### Q2 2026 — Portfolio & Integration: Epic Forecasting, OKRs, Jira Write

| Feature | Q1 | Q2 | Q3 | Q4 |
|---------|----|----|----|----|
| Feature 3: Epic Predictability & Portfolio View | | ✓ | | |
| Feature 4: OKR Tracking & Alignment | | ✓ | | |
| Feature 5: Jira MCP Integration — Read & Write | | ✓ | | |

**Q2 Goals:** Deliver delivery forecasting (Feature 3) so leadership can commit to stakeholders with confidence, link delivery to OKRs (Feature 4) to close the strategy-execution loop, and enable coaches to propose Jira actions with human approval (Feature 5).

**Success Criteria for Q2:**
- P70 epic forecasts achieve 70% accuracy
- 90% of orgs link epics to OKRs
- 5 Jira action types implemented (sprint move, priority, label, WIP override, assignee)
- Zero unauthorized Jira mutations (100% audit trail)

---

### Q3 2026 — Intelligence & Insights: Alerting, Playbooks, Health Overview, Simulator, Notes

| Feature | Q1 | Q2 | Q3 | Q4 |
|---------|----|----|----|----|
| Feature 7: Proactive Alerting | | | ✓ | |
| Feature 8: Coaching Playbook Library | | | ✓ | |
| Feature 9: Squad Comparison & Team Health Overview | | | ✓ | |
| Feature 10: What-if Flow Simulator | | | ✓ | |
| Feature 13: Coaching History & Notes | | | ✓ | |

**Q3 Goals:** Shift from reactive to proactive coaching with event-driven alerts (Feature 7), empower coaches with playbook library (Feature 8) capturing institutional knowledge, provide team health overview (Feature 9) for coaching prioritization, enable scenario modeling (Feature 10) to drive buy-in, and maintain coaching history (Feature 13) for organizational learning.

**Success Criteria for Q3:**
- Alert detection time <1 day, accuracy 85%+
- Playbook usage 65%+ of interventions, success rate 70%+
- Heat map adoption 85%+ of leaders
- Simulator accuracy ±20% for 75% of implementations
- Notes adoption 75%+ of interventions

---

### Q4 2026 — Polish & Accessibility: Richer Jira Write-back, Mobile

| Feature | Q1 | Q2 | Q3 | Q4 |
|---------|----|----|----|----|
| Feature 11: Richer Jira Write-back (Agentic Actions v2) | | | | ✓ |
| Feature 12: Mobile-Responsive Layout | | | | ✓ |

**Q4 Goals:** Extend write-back capability to the highest-value coaching actions (sprint planning and backlog reordering, Feature 11) and ensure platform accessibility on mobile (Feature 12) for coaches and managers using phones during standups and 1:1s.

**Success Criteria for Q4:**
- Sprint Planning proposals achieve 80%+ accuracy (no mid-sprint adjustment needed)
- Backlog Reordering unblocks 25%+ more parallel work
- Mobile traffic 35%+ of sessions, satisfaction ≥4.0/5
- Mobile load time <3s on 4G

---

## Notes on Sequencing

**Why this order?**

1. **Q1 builds the foundation:** We need accurate org context (Feature 6), data ingestion (Feature 1), and basic recommendations (Feature 2) before anything downstream. Without these, metrics are unreliable and recommendations are generic.

2. **Q2 closes the strategy loop:** Once coaches can see and recommend on flow data, product/engineering leaders need delivery forecasting (Feature 3) and OKR alignment (Feature 4). Jira write-back (Feature 5) enables coaches to act without manual friction.

3. **Q3 shifts to proactive, intelligent coaching:** Alerts (Feature 7), playbooks (Feature 8), and team health (Feature 9) give coaches the tools and insights to drive change. The simulator (Feature 10) and notes (Feature 13) let them model impact and document learning.

4. **Q4 polishes and scales:** Richer write-back (Feature 11) and mobile (Feature 12) remove friction and expand access, making the platform easier to use at scale.

**Risk mitigation:**

- Q1 depends on stable Jira integration; mitigate with phased rollout to 2-3 orgs first
- Q2 depends on accurate velocity forecasting; mitigate with validation against historical P70s
- Q3 alert rules must be tuned to avoid spam; mitigate with threshold configuration and user feedback
- Q4 mobile design impacts all features; plan for responsive CSS/layout from Q1

---

## Document History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-04-13 | Initial feature specs document with 13 features and Q1-Q4 roadmap |

