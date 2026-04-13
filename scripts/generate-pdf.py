"""Generate the Flow Metrics Coaching Guide PDF."""
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import cm
from reportlab.lib.colors import HexColor
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
from reportlab.lib.enums import TA_CENTER

doc = SimpleDocTemplate(
    "public/docs/flow-metrics-coaching-guide.pdf",
    pagesize=A4,
    leftMargin=2.5*cm, rightMargin=2.5*cm,
    topMargin=2.5*cm, bottomMargin=2*cm,
)

styles = getSampleStyleSheet()
yellow = HexColor("#FFCC00")
dark = HexColor("#1a1a1a")
slate = HexColor("#475569")
light_bg = HexColor("#FFF9E0")

styles.add(ParagraphStyle("DocTitle", parent=styles["Title"], fontSize=22, textColor=dark, spaceAfter=6, fontName="Helvetica-Bold"))
styles.add(ParagraphStyle("DocSubtitle", parent=styles["Normal"], fontSize=11, textColor=slate, spaceAfter=20))
styles.add(ParagraphStyle("SectionHead", parent=styles["Heading1"], fontSize=16, textColor=dark, spaceBefore=24, spaceAfter=8, fontName="Helvetica-Bold"))
styles.add(ParagraphStyle("SubHead", parent=styles["Heading2"], fontSize=13, textColor=HexColor("#334155"), spaceBefore=16, spaceAfter=6, fontName="Helvetica-Bold"))
styles.add(ParagraphStyle("Body", parent=styles["Normal"], fontSize=10, textColor=HexColor("#334155"), spaceAfter=8, leading=14))
styles.add(ParagraphStyle("Step", parent=styles["Normal"], fontSize=10, textColor=HexColor("#334155"), spaceAfter=4, leading=14, leftIndent=20))
styles.add(ParagraphStyle("Callout", parent=styles["Normal"], fontSize=10, textColor=dark, spaceAfter=8, leading=14, backColor=light_bg, borderPadding=8))
styles.add(ParagraphStyle("Footer", parent=styles["Normal"], fontSize=8, textColor=HexColor("#94a3b8"), alignment=TA_CENTER))

story = []

# Title
story.append(Paragraph("Flow Metrics Coaching Guide", styles["DocTitle"]))
story.append(Paragraph("WIP Management &amp; Blocker Escalation", styles["DocSubtitle"]))
story.append(Paragraph("Internal Document \u2014 Agent Coach \u2014 Delivery Intelligence Practice", styles["Footer"]))
story.append(Spacer(1, 8))
story.append(HRFlowable(width="100%", thickness=2, color=yellow, spaceAfter=16))

# 1. Introduction
story.append(Paragraph("1. Introduction", styles["SectionHead"]))
story.append(Paragraph(
    "Flow metrics coaching is a data-driven approach to improving software delivery performance. "
    "Rather than relying on subjective assessments or lagging indicators like velocity alone, flow metrics "
    "measure how efficiently value moves through the delivery pipeline \u2014 from the moment work is started "
    "to the moment it reaches customers.", styles["Body"]))
story.append(Paragraph(
    "The two most common systemic issues that degrade flow are <b>WIP overload</b> (too many items in "
    "progress simultaneously) and <b>silent blockers</b> (items that stall without being flagged). This guide "
    "provides step-by-step coaching interventions for both, based on patterns observed across engineering "
    "organisations.", styles["Body"]))
story.append(Paragraph(
    "<b>Key principle:</b> The goal is not to make people work faster. The goal is to reduce the time items "
    "spend waiting. In most teams, 50\u201370% of an item's lifecycle is spent in queues, not being actively "
    "worked on. Addressing wait time has a far larger impact than optimising active work time.",
    styles["Callout"]))

# 2. WIP Management
story.append(Paragraph("2. WIP Management", styles["SectionHead"]))

story.append(Paragraph("2.1 What is WIP and Why It Matters", styles["SubHead"]))
story.append(Paragraph(
    "Work in Progress (WIP) is the number of items currently in an active state \u2014 started but not yet "
    "completed. High WIP is the single most common root cause of flow degradation in software teams. "
    "When a team carries more items than it can actively work on, items compete for attention at every "
    "handoff point, creating queues that inflate cycle time for everything in the system.", styles["Body"]))

story.append(Paragraph("2.2 Little's Law", styles["SubHead"]))
story.append(Paragraph("<b>Flow Time = WIP \u00F7 Throughput</b>", styles["Callout"]))
story.append(Paragraph(
    "Little's Law is a proven mathematical relationship that holds for any stable system. If throughput "
    "(items completed per unit time) remains roughly constant in the short term \u2014 which it does, because "
    "you cannot suddenly code faster \u2014 then reducing WIP directly and proportionally reduces flow time. "
    "This is not an approximation; it is a law. A team running 9 items against a capacity of 6 will see "
    "flow times approximately 50% higher than they would at the limit.", styles["Body"]))

story.append(Paragraph("2.3 Hard WIP Cap with Completion Gate", styles["SubHead"]))
story.append(Paragraph(
    "This intervention introduces a strict rule: no new work item can be pulled into the active column "
    "until an existing item reaches Done.", styles["Body"]))
story.append(Paragraph(
    "<b>Step 1:</b> Agree a WIP limit with the squad. The standard formula is team size \u00F7 2, rounded up. "
    "For a team of 5, the limit would be 3. Discuss this openly \u2014 the team needs to understand why, "
    "not just comply.", styles["Step"]))
story.append(Paragraph(
    "<b>Step 2:</b> Configure Jira (or equivalent) column constraints to enforce the limit programmatically. "
    "The column should physically prevent pulling a new item if the count is at the limit.", styles["Step"]))
story.append(Paragraph(
    "<b>Step 3:</b> In the next sprint planning, remove items from the sprint backlog until the team is at "
    "or below the cap. This is the hardest step emotionally \u2014 it feels like doing less. Reinforce that "
    "WIP measures started work, not completed work.", styles["Step"]))
story.append(Paragraph(
    "<b>Step 4:</b> Review the limit every 2 sprints. Adjust based on flow time trends. If flow time is "
    "still elevated, consider lowering the limit further.", styles["Step"]))

story.append(Paragraph("2.4 Expected Outcomes", styles["SubHead"]))
story.append(Paragraph("Based on data from 12 teams that have implemented hard WIP caps:", styles["Body"]))
story.append(Paragraph(
    "\u2022 78% reported measurable improvement within 2 sprints<br/>"
    "\u2022 Median flow time reduction: 25\u201340%<br/>"
    "\u2022 Flow efficiency improvement: 15\u201325 percentage points<br/>"
    "\u2022 Common side effect: velocity initially dips in sprint 1, then recovers above baseline by sprint 3",
    styles["Body"]))

# 3. Blocker Escalation
story.append(Paragraph("3. Blocker Escalation", styles["SectionHead"]))

story.append(Paragraph("3.1 Why Items Age Silently", styles["SubHead"]))
story.append(Paragraph(
    "Items don't get stuck because people are lazy. They get stuck because of external dependencies, "
    "unanswered technical questions, underestimated scope, or reviewer overload. The problem is that most "
    "teams lack a systematic mechanism to surface these blockers early. Items sit in \"In Progress\" for "
    "weeks without anyone formally flagging them, consuming WIP capacity without producing output.",
    styles["Body"]))

story.append(Paragraph("3.2 Daily Blocker Escalation Ritual", styles["SubHead"]))
story.append(Paragraph("This adds approximately 3 minutes to the daily standup:", styles["Body"]))
story.append(Paragraph(
    "<b>Step 1:</b> Surface any item with no status change in 5+ days. This should be automated \u2014 "
    "a Jira filter or dashboard widget that flags stale items automatically.", styles["Step"]))
story.append(Paragraph(
    "<b>Step 2:</b> For each surfaced item, ask: \"What is this waiting for?\" Assign a specific owner "
    "to resolve the blocker within 24 hours.", styles["Step"]))
story.append(Paragraph(
    "<b>Step 3:</b> If the blocker is not resolved within 48 hours, escalate to the Engineering Manager. "
    "This creates accountability and prevents blockers from becoming chronic.", styles["Step"]))

story.append(Paragraph("3.3 Escalation Matrix", styles["SubHead"]))
escalation_data = [
    ["Age", "Status", "Action", "Owner"],
    ["5\u201310 days", "Warning", "Surface in standup, assign owner", "Team lead"],
    ["10\u201314 days", "Escalation", "EM review, dependency resolution", "Engineering Manager"],
    ["14+ days", "Critical", "Exec visibility, consider descoping", "Director / VP Eng"],
]
t = Table(escalation_data, colWidths=[60, 60, 200, 100])
t.setStyle(TableStyle([
    ("BACKGROUND", (0, 0), (-1, 0), dark),
    ("TEXTCOLOR", (0, 0), (-1, 0), HexColor("#ffffff")),
    ("FONTSIZE", (0, 0), (-1, -1), 9),
    ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
    ("ALIGN", (0, 0), (-1, -1), "LEFT"),
    ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
    ("GRID", (0, 0), (-1, -1), 0.5, HexColor("#e2e8f0")),
    ("ROWBACKGROUNDS", (0, 1), (-1, -1), [HexColor("#ffffff"), HexColor("#f8fafc")]),
    ("TOPPADDING", (0, 0), (-1, -1), 6),
    ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
    ("LEFTPADDING", (0, 0), (-1, -1), 8),
]))
story.append(t)
story.append(Spacer(1, 8))
story.append(Paragraph(
    "Success rate: 84% of teams report significant reduction in aged items within 1 sprint.", styles["Body"]))

# 4. Measuring Impact
story.append(Paragraph("4. Measuring Impact", styles["SectionHead"]))

story.append(Paragraph("4.1 Key Metrics to Track", styles["SubHead"]))
story.append(Paragraph(
    "\u2022 <b>Median Flow Time</b> \u2014 Primary outcome metric. Should decrease after WIP cap.<br/>"
    "\u2022 <b>p85 Flow Time</b> \u2014 Measures variability. A dropping p85 means fewer items getting stuck.<br/>"
    "\u2022 <b>Flow Efficiency</b> \u2014 Active time \u00F7 total time. Should increase as queue time decreases.<br/>"
    "\u2022 <b>WIP Count</b> \u2014 Leading indicator. Must stay at or below the agreed limit.<br/>"
    "\u2022 <b>Items > 14 days</b> \u2014 Count of aged items. Should trend toward zero.",
    styles["Body"]))

story.append(Paragraph("4.2 Before/After Analysis Framework", styles["SubHead"]))
story.append(Paragraph(
    "Establish a baseline by averaging the target metric over the 3 sprints before the intervention. "
    "Then compare against the average over the 2\u20133 sprints after. A meaningful improvement is typically "
    ">10% change in the desired direction. Agent Coach automates this analysis and provides a coach "
    "assessment (Improving / Worsening / Neutral) based on the delta.", styles["Body"]))

story.append(Paragraph("4.3 When to Adjust vs Stay the Course", styles["SubHead"]))
story.append(Paragraph(
    "\u2022 <b>Improving (>10% better):</b> Stay the course. Continue for at least 2 more sprints to "
    "confirm the trend is sustained, not a one-sprint anomaly.<br/>"
    "\u2022 <b>Neutral (within \u00B110%):</b> May be too early to see impact. Give it one more sprint before "
    "adjusting. Check that the intervention is actually being followed consistently.<br/>"
    "\u2022 <b>Worsening (>10% worse):</b> The root cause may not be what we diagnosed. Revisit the analysis, "
    "check if the intervention is being consistently applied, and consider whether a different lever might "
    "be more appropriate.", styles["Body"]))

story.append(Spacer(1, 24))
story.append(HRFlowable(width="100%", thickness=1, color=HexColor("#e2e8f0"), spaceAfter=8))
story.append(Paragraph(
    "Agent Coach \u2014 AI Delivery Intelligence | Confidential \u2014 Internal Use Only", styles["Footer"]))

doc.build(story)
print("PDF created successfully")
