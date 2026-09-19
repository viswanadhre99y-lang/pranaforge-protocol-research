#!/usr/bin/env python3
"""Generate Cluster D client-protocol intelligence files."""
from pathlib import Path

ROOT = Path("/workspace/pranaforge-protocol-research/client-protocol-intelligence")

P = {
  "morning_light": ("Morning Outdoor Light Timing", "A"),
  "stimulus_control": ("Stimulus Control Therapy (CBT-I)", "A"),
  "sleep_restriction": ("Sleep Restriction Therapy (CBT-I)", "A"),
  "aerobic": ("Moderate Aerobic Exercise Bout", "A"),
  "if_then": ("Implementation Intentions (If–Then Plans)", "A"),
  "woop": ("WOOP", "A"),
  "reappraisal": ("Cognitive Reappraisal", "A"),
  "ba": ("Tiny Behavioral Activation Step", "A"),
  "cyclic_sigh": ("Cyclic Sighing / Acute Physiological Sigh", "B"),
  "resonance": ("Coherent / Resonance Breathing (~6/min)", "B"),
  "pmr": ("Progressive Muscle Relaxation", "B"),
  "ppr": ("Pre-Performance Routine", "B"),
  "imagery": ("PETTLEP / Process Imagery", "B"),
  "caffeine": ("Caffeine Timing Cutoff", "B"),
  "wake": ("Fixed Wake-Time Sleep Schedule", "B"),
  "evening_light": ("Evening Light Hygiene", "B"),
  "jetlag": ("Jet Lag Light ± Melatonin Timing (Careful)", "B"),
  "nap": ("Brief Nap Protocol (10–20 min)", "B"),
  "affect": ("Affect Labeling", "B"),
  "worry": ("Scheduled Worry / Postpone Worry", "B"),
  "social": ("Micro Social Connection Check-In", "B"),
  "body_scan": ("Body Scan (MBSR Element)", "B"),
  "mindfulness": ("Mindfulness of Breath", "B"),
  "distancing": ("Self-Distancing Reflection", "B"),
  "nsdr": ("Yoga Nidra / NSDR", "C"),
  "wind_down": ("Behavioral Wind-Down Routine", "C"),
  "box": ("Box Breathing / Tactical Breath Reset", "C"),
  "grounding": ("5-4-3-2-1 Sensory Grounding", "C"),
  "tipp": ("TIPP (DBT Skill)", "C"),
  "pomodoro": ("Pomodoro-style Focus Block", "C"),
  "art": ("Attention Restoration Micro-Break", "C"),
  "habit": ("Habit Stacking", "C"),
  "values": ("Values Compass (ACT)", "C"),
  "defusion": ("Cognitive Defusion", "C"),
  "centering": ("Centering (Ravizza-Style)", "C"),
  "gratitude": ("Brief Gratitude Listing", "C"),
  "cold": ("Cold Face Stimulation", "C"),
  "autogenic": ("Autogenic Training", "C"),
  "478": ("4-7-8 Breathing", "C"),
  "anb": ("Alternate Nostril Breathing", "D"),
}

DISCLAIMER = """> **Disclaimer:** Educational personalization intelligence for PranaForge research — **not medical advice**, not psychotherapy, not a treatment plan. Not PranaForge proprietary session IP. Prefer A/B public protocols as defaults; label C/D honestly; never market E-tier claims as science. **NSDR ≠ sleep replacement.** Melatonin: timed chronobiotic tool — not DIY mega-dosing."""

def plist(items):
    lines = []
    for key, why in items:
        name, grade = P[key]
        lines.append(f"| {name} | **{grade}** | {why} |")
    return "\n".join(lines)

def write(path: Path, text: str):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(text.strip() + "\n", encoding="utf-8")
    print("wrote", path.relative_to(ROOT))

# ============================================================================
# CLIENT DATA
# ============================================================================

CLIENTS = {}

CLIENTS["frequent_international_travelers"] = {
  "title": "Frequent International Travelers",
  "cluster": "D — Travel / Lifestyle / Performance-adjacent",
  "one_liner": "Repeated multi-zone flights; circadian debt, cabin dehydration, and local-clock meetings before adaptation.",
  "who": "Consultants, corporate BD, investors, athletes, entertainers, diplomats flying commercial/mixed cabin across regions 1–4×/month.",
  "constraints": [
    "Hotel/airport privacy limits",
    "Unreliable gym/kitchen access",
    "Meetings on local clock before circadian adaptation",
    "Cabin alcohol/social pressure",
    "Jurisdiction-varying supplement rules",
  ],
  "stressors": [
    "Eastward phase advance harder than westward",
    "Travel jet lag stacked with social jet lag",
    "Red-eye sleep fragmentation",
    "Post-landing fog before high-stakes meetings",
    "Caffeine misused as recovery",
  ],
  "commercial": "High WTP for arrival-day sharpness; pairs with concierge/PA travel desks; wraps public rails around Recovery Accelerator: Jet-lag / Travel Reset (IP elsewhere).",
  "privacy": "Itineraries sensitive; suite/lounge practice only; never leak routes.",
  "avoid": [
    "DIY high-dose melatonin (>5 mg) — CDC Yellow Book 2026: 0.5–1 mg often sufficient; residual melatonin at wrong clock time worsens misalignment",
    "NSDR framed as sleep replacement after overnight flights",
    "Aggressive DIY sleep restriction while driving/flying fatigued",
    "Wrong-timed bright light (can worsen jet lag)",
    "Standing hyperventilation protocols mid-flight",
  ],
  "rails": [
    "Destination-local meal anchors (secondary zeitgeber; not a cure)",
    "Hydration + alcohol restraint night 0",
    "Caffeine mapped to local morning after light plan",
  ],
  "jobs": [
    "Adapt circadian phase to destination",
    "Protect arrival-night sleep opportunity",
    "Restore meeting-ready alertness without stimulant pile-on",
    "Contain travel irritability",
  ],
  "core": [
    ("jetlag", "Core package: light primary; melatonin only carefully timed; jet-lag calculator for direction × zones"),
    ("morning_light", "Arrival outdoor light in destination-appropriate circadian window (east vs west differs)"),
    ("evening_light", "Dim/warm local evening to protect melatonin rise when seeking local night"),
    ("wake", "Anchor wake toward destination when adapting; <48h trips may choose partial non-adaptation"),
    ("caffeine", "Local-morning after light; stop ~6–12h before planned local sleep"),
    ("cyclic_sigh", "Discreet cabin/lounge downshift"),
    ("pmr", "Hotel-chair somatic release when breath focus feels forced"),
    ("nap", "10–20 min early local afternoon only if night sleep protected"),
    ("nsdr", "Afternoon deep rest adjunct — NOT sleep replacement"),
    ("wind_down", "Protected 20–40 min hotel off-ramp"),
    ("if_then", "Pre-commit travel rules (alcohol, tasting menus, lights-out)"),
  ],
  "secondary": [
    ("resonance", "Daily HRV-style practice when ≥10 min available"),
    ("stimulus_control", "If travel triggers bed–arousal conditioning — clinician framing for chronic insomnia"),
    ("aerobic", "Outdoor walk = light + mild exercise"),
    ("affect", "Label travel irritability before meetings"),
    ("ppr", "Pre-board / pre-meeting micro-routine"),
  ],
  "moments": [
    ("T−3 to T−1", "Optional pre-shift sleep 30–60 min/day for large eastward shifts; pack mask/earplugs; write alcohol/caffeine if–thens"),
    ("In cabin", "Watch to destination; light/dark per calculator; hydrate; no alcohol-as-sleep-aid; physiological sigh if anxious"),
    ("Landing 0–4h", "Execute light plan; warm familiar meal; skip tasting menu; outdoor walk if light timing allows"),
    ("First local night", "Wind-down + dim light; melatonin only if plan/clinician allows; NSDR if restless — do not clock-watch in bed"),
    ("Meeting AM day 1–2", "Morning light + caffeine window + 2-min sigh/centering"),
    ("Return home", "Reverse light plan; protect one recovery night; avoid weekend phase chaos"),
  ],
  "stacks": {
    "2 min": "Affect label → 1–3 physiological sighs → one next action.",
    "5 min": "Cyclic sighing 5 min OR tactical breath reset + travel if–then.",
    "10–12 min": "Resonance 8–10 min OR short suite NSDR OR PPR before deal meeting.",
    "20 min": "Correctly timed outdoor light walk + brief PMR OR wind-down start.",
    "30–60 min": "Aerobic outdoor bout in correct light window OR full wind-down + sleep opportunity.",
    "Arrival 72h": "D0: light plan + familiar meal + alcohol skip + early local sleep attempt. D1–2: wake toward local + AM light + caffeine cutoff + optional early nap. D3: drop emergency jet-lag stack if adapted.",
  },
  "evidence": "CDC Yellow Book 2026 Jet Lag Disorder (timed light ± melatonin; avoid >5 mg); Bin et al. 2019 Frontiers Physiol; AASM circadian parameters. Meal timing = secondary cue. NSDR ≠ sleep replacement.",
}

CLIENTS["private_jet_uhnw_travelers"] = {
  "title": "Private Jet / UHNW Travelers",
  "cluster": "D — Travel / Lifestyle / Performance-adjacent",
  "one_liner": "Same jet-lag biology as commercial travelers; differentiation is staffed ops, discretion, and compressed multi-city performance.",
  "who": "Family-office principals, founders, entertainers, protocol-adjacent travelers on private/charter aviation.",
  "constraints": [
    "Staff execute rails (PA, chef, aviation)",
    "Privacy/security > novelty wellness demos",
    "Multi-residence crew consistency hard",
    "Expectation of invisible recovery",
  ],
  "stressors": [
    "Compressed multi-city days",
    "Entertainment + deal alcohol",
    "Sleep sacrificed for networking",
    "Entourage decision load",
    "Zero-margin 'show up sharp' pressure",
  ],
  "commercial": "Highest ACV; sell lifestyle rails + staff cue cards + discreet suite resets; never medicalize; never dump proprietary Forge recipes here.",
  "privacy": "Private suite/closed door default; no lobby demos; no itinerary gossip; no recording without consent.",
  "avoid": [
    "Public breathwork theater",
    "Influencer mega-dose melatonin stacks",
    "NSDR-as-sleep-cure marketing",
    "Staff inventing clinical CBT-I",
    "Cold plunge as trauma-therapy claims",
  ],
  "rails": [
    "Chef: Travel 72h meal anchors",
    "PA: light/caffeine from jet-lag calculator",
    "Aviation: cabin light/dark when feasible",
    "Claims Warden: wellness language only",
  ],
  "jobs": [
    "Arrive meeting-ready",
    "Protect reputation (no fog/irritability)",
    "Staff-run consistency across cities",
    "Recovery without spa-day time cost",
  ],
  "core": [
    ("jetlag", "Identical chronobiology — light first; low-dose timed melatonin; calculator for complex itineraries"),
    ("morning_light", "Staff-cued outdoor/balcony light window"),
    ("evening_light", "Residence warm/dim 60–90 min pre-sleep"),
    ("caffeine", "Chef/PA owns cutoff vs planned local sleep"),
    ("cyclic_sigh", "Invisible cabin/car micro-reset"),
    ("pmr", "Brief hands-shoulders-face before events"),
    ("ppr", "Pre-board / pre-stage / pre-deal — high UHNW ROI"),
    ("imagery", "Process imagery of first 3 actions — not outcome fantasy"),
    ("nsdr", "10–20 min suite rest between meetings — rest framing only"),
    ("social", "One trusted micro-connection if isolation spikes"),
    ("if_then", "Staff-executable rules (wheels-down, board timing, tasting menus)"),
  ],
  "secondary": [
    ("wake", "Fixed wake when adapting; short-trip non-adaptation option in Principal File"),
    ("aerobic", "Private trainer walk/zone-2 compounds light"),
    ("resonance", "Daily 10 min when schedule allows"),
    ("wind_down", "Butler/PA enforces buffer"),
    ("reappraisal", "Reframe perform-on-debt → prioritized rails"),
    ("values", "Calendar tyranny → brief values compass with advisor"),
  ],
  "moments": [
    ("Pre-departure PA brief", "Confirm zones; print light±melatonin card; lock alcohol/caffeine; offline NSDR audio"),
    ("Wheels-up", "Cabin light to plan; 2-min sigh if tense; reduce deal work in last hour if sleep planned"),
    ("Wheels-down", "Light plan immediate; familiar plate; security-aware outdoor light"),
    ("Pre-gala / board", "PPR + process imagery + brief PMR"),
    ("Multi-city hop", "Protect one NSDR/nap slot; no stimulant stacking"),
    ("Home-base return", "Restore residence light/sleep rails within 24h"),
  ],
  "stacks": {
    "2 min": "Invisible: label → physiological sigh → posture reset.",
    "5 min": "PPR: breath + cue word + first-action image.",
    "10–12 min": "Short NSDR OR resonance OR full PPR+imagery.",
    "20 min": "Suite NSDR/PMR OR correctly timed outdoor light walk.",
    "30–60 min": "Zone-2 + light OR protected wind-down + sleep opportunity.",
    "Staff-run day": "AM light → caffeine window → meeting micro-resets → optional afternoon NSDR → dim evening → wind-down → melatonin only if itinerary card says so.",
  },
  "evidence": "Physiology = CDC YB 2026 + Bin 2019. Ops/discretion differentiate UHNW, not biology. Melatonin product quality variance (CDC notes label mismatch/contamination risk).",
}

CLIENTS["digital_nomads"] = {
  "title": "Digital Nomads",
  "cluster": "D — Travel / Lifestyle / Performance-adjacent",
  "one_liner": "Location-independent workers with chronic mild jet lag, wifi-driven sleep delay, and weak zeitgeber structure.",
  "who": "Remote founders, freelancers, creators, crypto-adjacent mobiles on 2–6 week hops or perpetual travel.",
  "constraints": [
    "Cheap lodging light pollution",
    "Coworking late culture",
    "No staff; self-serve only",
    "Budget vs UHNW tooling",
    "Visa/work stress",
  ],
  "stressors": [
    "Nightlife + async work social jet lag",
    "Inconsistent wake times across cities",
    "Evening blue light",
    "Loneliness–overwork cycles",
    "Timezone arbitrage destroying sleep",
  ],
  "commercial": "Volume/community play; lower ACV; content + self-serve packs; upsell intensives at burnout.",
  "privacy": "Lower than UHNW; still respect location OPSEC for some.",
  "avoid": [
    "Romanticizing grind-without-sleep",
    "NSDR replaces sleep",
    "Universal 5am moralizing (chronotypes differ)",
    "Unvalidated fasting jet-lag theater",
  ],
  "rails": [
    "Fixed wake ±30 min even when cities change",
    "Morning outdoor light non-negotiable",
    "Caffeine cutoff relative to intended sleep",
  ],
  "jobs": [
    "Stabilize circadian despite city hops",
    "Protect deep work blocks",
    "Prevent burnout spiral",
    "Build portable recovery kit",
  ],
  "core": [
    ("morning_light", "Outdoor light within ~30–60 min of wake in each city"),
    ("wake", "Primary stabilizer for nomad life"),
    ("evening_light", "Night mode + coworking exit ritual"),
    ("caffeine", "Cutoff 8–12h before target sleep"),
    ("pomodoro", "Structure amid chaotic environments"),
    ("if_then", "New city day 1 → light walk + groceries + early sleep, no nightlife"),
    ("cyclic_sigh", "Between calls / visa stress"),
    ("art", "Park soft-fascination break for attention fatigue"),
    ("nsdr", "Afternoon rest when sleep truncated — not replacement"),
    ("ba", "Tiny activation when loneliness → rumination"),
    ("social", "Scheduled micro-connection vs isolation"),
  ],
  "secondary": [
    ("resonance", "Portable daily breath training"),
    ("habit", "Stack onto packing/coffee cues"),
    ("woop", "Monthly location/work goals with obstacles"),
    ("mindfulness", "Attention training without gear"),
    ("aerobic", "Walk/run = free gym + light"),
    ("worry", "Contain timezone anxiety to a slot"),
  ],
  "moments": [
    ("City arrival D1", "Light + local meal anchors; no FOMO nightlife"),
    ("Deep work morning", "Light → caffeine → Pomodoro"),
    ("Lonely evening", "Social micro-check-in + wind-down, not doomscroll"),
    ("Visa/admin spike", "Sigh + grounding + one if–then action"),
    ("Burnout week", "Sleep rails + aerobic + BA; drop optimization theater"),
  ],
  "stacks": {
    "2 min": "Sigh + label + next task.",
    "5 min": "Cyclic sighing or one-wish WOOP.",
    "10–12 min": "Resonance or ART nature break or short NSDR.",
    "20 min": "Pomodoro cycle or wind-down start.",
    "30–60 min": "Outdoor aerobic + light or full NSDR rest block.",
    "New city 48h": "Fixed wake + AM light both days; caffeine discipline; early dinners; sleep > networking.",
  },
  "evidence": "Social jet lag (Wittmann/Roenneberg); morning light A-grade; sleep hygiene alone weak monotherapy (AASM) — escalate to stimulus control concepts if insomnia emerges.",
}

CLIENTS["irregular_schedule_shift_adjacent"] = {
  "title": "Irregular Schedule / Shift-Adjacent",
  "cluster": "D — Travel / Lifestyle / Performance-adjacent",
  "one_liner": "Rotating sleep opportunities — on-call execs, traders, clinicians, incident responders — not only classic factory shifts.",
  "who": "Night-adjacent professionals, rotating on-call, market-hours traders, healthcare/tech responders, hospitality managers.",
  "constraints": [
    "Cannot always choose sleep timing",
    "Safety-critical drowsy risk",
    "Family schedule conflicts",
    "Light at wrong biological time",
  ],
  "stressors": [
    "Circadian misalignment",
    "Chronotype × shift mismatch",
    "Sleep debt + social jet lag",
    "Stimulant dependence",
    "Mood/irritability",
  ],
  "commercial": "B2B for hospitals/trading desks/aviation; individual coaching for on-call executives.",
  "privacy": "Workplace stigma around sleep — discreet tools.",
  "avoid": [
    "Universal 5am optimization",
    "DIY aggressive sleep restriction in safety-critical jobs",
    "Melatonin at random clock times",
    "Cold showers as shift-work-disorder cure",
  ],
  "rails": [
    "Protect dark sleep opportunity after night work",
    "Sunglasses after nights when needing day sleep (reduce unwanted phase reset)",
    "Caffeine early in wake episode only",
  ],
  "jobs": [
    "Maximize sleep when opportunity exists",
    "Manage on-duty alertness safely",
    "Reduce off-day social jet lag",
    "Prevent burnout",
  ],
  "core": [
    ("wake", "Stabilize wake within a shift block; limit huge off-day swings"),
    ("morning_light", "Timed to desired phase for THAT shift — not generic morning"),
    ("evening_light", "Blackout for day-sleep after nights"),
    ("caffeine", "Front-load on duty; stop well before planned sleep"),
    ("nap", "Prophylactic nap before night duty if safe"),
    ("cyclic_sigh", "Arousal management without more caffeine"),
    ("pmr", "Pre-day-sleep wind-down"),
    ("stimulus_control", "Bed=sleep even if daytime — clinician if chronic insomnia"),
    ("if_then", "If ending night shift → sunglasses + direct-to-bed"),
    ("aerobic", "Exercise timing that does not wreck sleep opportunity"),
    ("nsdr", "Rest when sleep impossible — not equivalent to sleep"),
  ],
  "secondary": [
    ("resonance", "Off-duty regulation training"),
    ("worry", "Contain rumination before day sleep"),
    ("ba", "Mood maintenance on hard rotations"),
    ("reappraisal", "Imperfect sleep → protected opportunity"),
    ("social", "One relationship check-in on off days"),
    ("jetlag", "Concepts transfer; melatonin for SWD only with clinician/guidance"),
  ],
  "moments": [
    ("Before night block", "Prophylactic nap; caffeine plan; light plan"),
    ("On-duty 03:00 dip", "Appropriate light; caffeine within rules; micro-sigh; safety check"),
    ("Commute after nights", "Dark glasses; no bright errands; sleep"),
    ("Day sleep", "Stimulus-control rules; PMR; phone out of room"),
    ("Off days", "Limit phase swings; gradual social re-entry"),
  ],
  "stacks": {
    "2 min": "Safety scan → sigh → hydrate/caffeine decision.",
    "5 min": "Brief PMR or cyclic sighing before day sleep.",
    "10–12 min": "NSDR if cannot sleep yet OR resonance.",
    "20 min": "Prophylactic nap OR day-sleep wind-down.",
    "30–60 min": "Protected sleep opportunity (beats optimization theater).",
    "Rotation change": "Plan light/dark 2–3 days ahead; chronotype-aware if employer allows.",
  },
  "evidence": "AASM shift-work parameters (planned sleep schedules; timed melatonin Guideline for SWD). Chronotype × shift (Juda/Roenneberg). Not a substitute for occupational health.",
}

CLIENTS["demanding_social_calendar_hosts"] = {
  "title": "Demanding Social Calendar Hosts",
  "cluster": "D — Travel / Lifestyle / Performance-adjacent",
  "one_liner": "Dense evening social/business calendars where alcohol, late light, and 'on' presence collide with sleep.",
  "who": "Society hosts, UHNW salon runners, dinner-circuit dealmakers, political/fundraising calendars, wedding-season principals.",
  "constraints": [
    "Hard to skip events",
    "Alcohol/food social pressure",
    "Late bright venues",
    "Reputation = visible energy",
  ],
  "stressors": [
    "Chronic sleep curtailment",
    "Weekend social jet lag ballooning",
    "Pre-event anxiety",
    "Post-event rumination",
    "Recovery guilt",
  ],
  "commercial": "Pair with household staff + event planners; pre-event regulation + post-event recovery packs.",
  "privacy": "Guest lists and venues confidential.",
  "avoid": [
    "Sobriety moralizing as only path",
    "NSDR replacing lost sleep after galas",
    "Public grounding at tables",
  ],
  "rails": [
    "Alcohol stop ≥3–4h before intended sleep when possible",
    "One recovery night protected per dense week",
    "Avoid late caffeine as power-through on event days",
  ],
  "jobs": [
    "Show up regulated and warm",
    "Limit physiological damage from late nights",
    "Recover next morning without wrecking next night",
    "Contain social anxiety",
  ],
  "core": [
    ("ppr", "Pre-event: breath + posture + intention cue"),
    ("cyclic_sigh", "Bathroom micro-reset mid-event"),
    ("pmr", "Pre-event face/shoulders/hands release"),
    ("affect", "Private label of social anxiety"),
    ("evening_light", "Hard dim on return; no bright teardown scrolling"),
    ("caffeine", "Morning-only on event day if night sleep matters"),
    ("wind_down", "Abbreviated even at 01:00 — better than none"),
    ("morning_light", "Next day light + avoid sleeping to noon if it destroys next night"),
    ("nap", "Early short next-day nap if needed"),
    ("nsdr", "Post-event or next-day rest block"),
    ("if_then", "Champagne → water alternate; late return → phone charges outside bedroom"),
  ],
  "secondary": [
    ("reappraisal", "Obligatory events → values-aligned presence"),
    ("imagery", "Greeting first three guests"),
    ("social", "One real connection > performing for room"),
    ("gratitude", "Brief meaning capture — not toxic positivity"),
    ("resonance", "Morning-after regulation"),
    ("ba", "Post-event crash → tiny activation before rumination"),
  ],
  "moments": [
    ("T−60 min", "PPR + light snack + caffeine decision locked"),
    ("Doorway", "Centering breath; first-action script"),
    ("Mid-event overwhelm", "Excuse → sigh/grounding → water"),
    ("Car ride home", "No email; dim; begin wind-down"),
    ("Next morning", "Light + modest wake consistency + optional nap/NSDR"),
  ],
  "stacks": {
    "2 min": "Bathroom: sigh ×3 + affect label + posture reset.",
    "5 min": "Full PPR before leaving residence.",
    "10–12 min": "PMR + process imagery of hosting cues.",
    "20 min": "NSDR post-event or next afternoon.",
    "30–60 min": "Protected recovery + outdoor light walk.",
    "Dense week": "1–2 recovery anchor nights; alcohol rules; AM light after late nights non-negotiable.",
  },
  "evidence": "Alcohol fragments sleep; evening light delays phase; fixed wake + morning light blunt social jet lag; PPR performance psychology moderate evidence.",
}

print("defined", len(CLIENTS), "so far")

CLIENTS["executive_parents"] = {
  "title": "Executive Parents",
  "cluster": "D — Travel / Lifestyle / Performance-adjacent",
  "one_liner": "High-responsibility careers + caregiving sleep fragmentation; guilt, cognitive load, interrupted nights.",
  "who": "C-suite/founders/partners with young children or eldercare; dual-career households.",
  "constraints": [
    "Unpredictable night wakings",
    "No long morning routines",
    "Partner coordination required",
    "School-run mornings",
    "Travel away from kids",
  ],
  "stressors": [
    "Sleep fragmentation (not always insomnia disorder)",
    "Guilt when recovering",
    "Work↔home context switching",
    "Irritability spillover",
    "Identity squeeze",
  ],
  "commercial": "Empathy-led packaging; micro-protocols; household rails; school-year seasonality.",
  "privacy": "Children/family details highly sensitive.",
  "avoid": [
    "Perfect morning-routine shaming",
    "DIY sleep restriction while caring for infants",
    "NSDR as substitute when urgent sleep opportunity finally appears",
    "Cold exposure as parenting therapy",
  ],
  "rails": [
    "Protect shared wind-down when possible",
    "Split night duty if feasible",
    "Caffeine cutoff still matters",
    "Opportunistic nap/NSDR when childcare allows",
  ],
  "jobs": [
    "Regulate after broken sleep",
    "Be present without snapping",
    "Use scarce 5–12 min wisely",
    "Protect couple system",
  ],
  "core": [
    ("cyclic_sigh", "Fastest discreet reset after kid crisis or before Zoom"),
    ("affect", "Label frustration before reacting"),
    ("ba", "Tiny valued action when overwhelmed"),
    ("if_then", "Night waking → no email; morning chaos → light+protein then work"),
    ("morning_light", "5–10 min outdoor with stroller/school walk"),
    ("caffeine", "Strategic AM; avoid late parenting fuel"),
    ("pmr", "Brief after kids asleep"),
    ("nsdr", "When nap impossible but 10–20 min alone exists"),
    ("worry", "Park work worry to a slot — not bedtime-with-kids"),
    ("social", "Partner micro-check-in beyond logistics"),
    ("reappraisal", "Ruined night → protect next opportunity"),
  ],
  "secondary": [
    ("stimulus_control", "If adult insomnia persists beyond child wakings — clinician CBT-I"),
    ("wake", "Consistent wake when child schedule allows"),
    ("resonance", "Optional shared 5–10 min with partner"),
    ("values", "Clarify work vs family season priorities"),
    ("pomodoro", "Protect deep work in scarce windows"),
    ("tipp", "Peak emotional crisis only — not daily parenting"),
  ],
  "moments": [
    ("03:00 child waking", "Minimize bright light; return to sleep opportunity; no work phone"),
    ("School-run morning", "Outdoor light compound; caffeine plan; if–then for first work block"),
    ("Post-tantrum", "Affect label + sigh + warmth if safe"),
    ("Kids asleep", "Wind-down vs finally-work trap — recover some nights"),
    ("Business travel", "Jet-lag stack + guilt reappraisal + partner check-in"),
  ],
  "stacks": {
    "2 min": "Label → sigh → one kind next action.",
    "5 min": "Cyclic sighing or brief bathroom PMR.",
    "10–12 min": "NSDR in locked room / parked car (safe).",
    "20 min": "Partner: 10 min each uninterrupted + wind-down start.",
    "30–60 min": "Safe nap OR aerobic OR protected couple time.",
    "Broken night → next day": "Fixed-ish wake + AM light + caffeine discipline + optional early nap/NSDR + earlier wind-down — not 11h catch-up that wrecks circadian.",
  },
  "evidence": "Sleep fragmentation / parental burnout context; BA + reappraisal for mood; CBT-I only if insomnia disorder — not normal infant waking.",
}

CLIENTS["high_profile_families"] = {
  "title": "High-Profile Families",
  "cluster": "D — Travel / Lifestyle / Performance-adjacent",
  "one_liner": "Multi-member households under visibility, security, and schedule complexity; recovery must be family-system aware.",
  "who": "Public-facing families (business dynasties, entertainment, political-adjacent) with staffed homes and shared calendars.",
  "constraints": [
    "Media/security constraints on movement/light exposure venues",
    "Different chronotypes under one roof",
    "Staff turnover breaks protocol continuity",
    "Children/teens with own social jet lag",
  ],
  "stressors": [
    "Collective travel misalignment",
    "Reputation stress shared across members",
    "Privacy anxiety",
    "Uneven recovery privileges between principals and kids",
    "Event clustering (weddings, IPOs, campaigns)",
  ],
  "commercial": "Household OS sell — family rails + staff playbooks + discreet individual intensives; trust/safety narrative.",
  "privacy": "Maximum — OPSEC, NDAs, no identifiable case studies without consent.",
  "avoid": [
    "One protocol forced on all ages/chronotypes",
    "Photographable wellness spectacles",
    "Melatonin dosing children without clinician",
    "NSDR-as-sleep for sleep-deprived teens as primary strategy",
  ],
  "rails": [
    "Household lighting policy (AM bright / PM dim)",
    "Shared wake anchors where feasible; protect teen sleep need",
    "Travel: per-person light cards, not one spreadsheet assumption",
    "Staff Claims Warden language",
  ],
  "jobs": [
    "Stabilize household circadian culture",
    "De-escalate conflict under fatigue",
    "Travel as a unit without mutual sleep sabotage",
    "Protect minors' recovery",
  ],
  "core": [
    ("morning_light", "Family outdoor light ritual when security allows — or bright indoor substitute with honest limits"),
    ("evening_light", "House-wide dim protocol"),
    ("wake", "Anchor for adults; teens: protect duration + consistency over moralized early wake"),
    ("cyclic_sigh", "Private regulation before family conflict"),
    ("affect", "Label before hard conversations"),
    ("social", "Non-logistics connection rituals"),
    ("if_then", "Household rules: phones overnight, caffeine, post-event recovery"),
    ("pmr", "Shared or parallel evening practice"),
    ("nsdr", "Individual rest rooms — rest framing"),
    ("jetlag", "Per-traveler timing cards on family trips"),
    ("reappraisal", "Public pressure → controllable rails"),
  ],
  "secondary": [
    ("resonance", "Optional family breath minutes"),
    ("values", "Family season priorities clarification"),
    ("woop", "Shared event-week obstacle planning"),
    ("stimulus_control", "Adult insomnia — clinician"),
    ("aerobic", "Family walks = light + bonding + load reduction"),
    ("worry", "Park media worry to scheduled slot"),
  ],
  "moments": [
    ("Pre-public appearance", "Individual PPR; no last-minute family fight"),
    ("Family long-haul", "Per-person light/melatonin cards; kids clinician-guided only"),
    ("Teen exam + parent IPO week", "Protect sleep duration; reduce evening light; drop nonessential events"),
    ("Security lockdown / limited outdoors", "Bright indoor AM light best-effort; prioritize sleep opportunity"),
    ("Post-scandal / media spike", "Affect label + postpone-worry + social support + sleep rails first"),
  ],
  "stacks": {
    "2 min": "Private sigh + label before entering shared space.",
    "5 min": "Household cue: lights / phones / caffeine rule check.",
    "10–12 min": "Parallel NSDR or PMR in separate rooms.",
    "20 min": "Family walk in correct light window OR wind-down together.",
    "30–60 min": "Aerobic + protected sleep opportunity for highest-debt member.",
    "Travel week": "Individual chronobiology cards + shared meal anchors + staff enforcement.",
  },
  "evidence": "Same circadian science; adolescent sleep need higher; pediatric melatonin = clinician domain. Household behavior change via if–then / habit cues.",
}

CLIENTS["executive_power_couples"] = {
  "title": "Executive Power Couples",
  "cluster": "D — Travel / Lifestyle / Performance-adjacent",
  "one_liner": "Two high-load careers in one household; misaligned travel, calendars, and recovery become a systems problem.",
  "who": "Dual executives/founders/partners whose careers both demand travel, late events, and cognitive intensity.",
  "constraints": [
    "Asynchronous travel calendars",
    "Competition for quiet recovery space/time",
    "Social obligations doubled",
    "Childcare coordination if parents",
  ],
  "stressors": [
    "Resentment over uneven recovery",
    "Ships-passing-in-the-night loneliness",
    "Stacked jet lag when reuniting",
    "Work conflict spillover into couple conflict",
    "Performance pressure as identity for both",
  ],
  "commercial": "Couple packages; joint onboarding; conflict-aware micro-protocols; travel sync planning.",
  "privacy": "Relationship dynamics confidential; no couple content without consent.",
  "avoid": [
    "Therapy-replacement claims",
    "Forcing identical wake times against chronotypes",
    "NSDR replacing needed reunion sleep",
    "Using breathwork to suppress legitimate conflict",
  ],
  "rails": [
    "Weekly calendar sync with recovery blocks marked sacred",
    "Reunion nights: alcohol/light rules",
    "Travel: share light cards so reunion timing is planned",
  ],
  "jobs": [
    "Regulate before hard couple conversations",
    "Sync recovery after dual travel",
    "Protect intimacy from optimization culture",
    "Reduce conflict under sleep debt",
  ],
  "core": [
    ("social", "Non-logistics micro-check-ins scheduled"),
    ("affect", "Label before conflict"),
    ("distancing", "Self-distancing journal after fights"),
    ("reappraisal", "Partner delay ≠ rejection under travel load"),
    ("cyclic_sigh", "Co-regulate or parallel reset"),
    ("if_then", "If both home after travel → no heavy agenda night 1"),
    ("morning_light", "Shared walk when both home"),
    ("evening_light", "Agree household dim"),
    ("jetlag", "Plan reunion around worse-jet-lag partner"),
    ("nsdr", "Parallel rest without requiring same script"),
    ("values", "Seasonal priority negotiation"),
  ],
  "secondary": [
    ("ppr", "Pre-difficult conversation routine"),
    ("pmr", "Evening parallel practice"),
    ("woop", "Shared quarterly obstacles"),
    ("ba", "Tiny joint pleasant activity when withdrawn"),
    ("caffeine", "Align cutoffs when sharing bedroom"),
    ("wake", "Negotiate compromise wake — not domination by earlier chronotype"),
  ],
  "moments": [
    ("Sunday sync", "Calendars + recovery blocks + one values check"),
    ("Both land same night", "Familiar meal; dim light; low agenda; optional parallel NSDR"),
    ("One traveling", "Async voice note social check-in; protect solo sleep"),
    ("Conflict under fatigue", "TIPP/sigh first if peak arousal; postpone content conversation"),
    ("Joint high-stakes week", "Double down on light/caffeine/sleep rails; cut optional social"),
  ],
  "stacks": {
    "2 min": "Each: label → sigh → one appreciation or logistics only.",
    "5 min": "Shared or parallel cyclic sighing + agenda triage.",
    "10–12 min": "Self-distancing notes OR parallel NSDR.",
    "20 min": "Walk + light OR structured check-in (10/10).",
    "30–60 min": "Joint wind-down + protected sleep OR values season talk.",
    "Reunion 48h": "Worse jet-lag partner sets light plan; low conflict agenda; alcohol restraint.",
  },
  "evidence": "Emotion regulation (reappraisal, affect labeling); sleep/alcohol/light rails; relationship check-ins as social support (not couples therapy substitute).",
}

CLIENTS["extreme_academic_students"] = {
  "title": "Extreme Academic Students",
  "cluster": "D — Travel / Lifestyle / Performance-adjacent",
  "one_liner": "Elite university/grad load with chronic sleep curtailment, deadline spikes, and identity fused to achievement.",
  "who": "Undergrad/grad/professional students in high-pressure programs (law, med, IIT/IIM-adjacent, Ivy/Oxbridge intensity).",
  "constraints": [
    "Library/all-nighter culture",
    "Shared housing light/noise",
    "Limited control over exam schedules",
    "Budget",
  ],
  "stressors": [
    "Social jet lag (late chronotype × early classes)",
    "Caffeine dependence",
    "Performance anxiety",
    "Rumination after exams",
    "Burnout risk mid-semester",
  ],
  "commercial": "Campus/community; parent-paid UHNW students overlap; exam-season campaigns.",
  "privacy": "Grades/mental health sensitive; crisis → professional resources.",
  "avoid": [
    "All-nighter glorification",
    "NSDR replaces missed sleep before exams",
    "DIY sleep restriction during exam weeks",
    "Stimulant stacking advice",
    "Manifestation-as-grades claims",
  ],
  "rails": [
    "Fixed wake on class days; limit weekend oversleep to ≤1–2h",
    "Caffeine cutoff before target sleep",
    "Morning light even on campus walks",
  ],
  "jobs": [
    "Sustain cognitive output across semester",
    "Regulate exam anxiety",
    "Recover after all-nighters without destroying next night",
    "Protect mental health escalation path",
  ],
  "core": [
    ("pomodoro", "Antidote to unstructured marathon studying"),
    ("morning_light", "Campus outdoor light between classes"),
    ("caffeine", "Front-load; hard cutoff"),
    ("cyclic_sigh", "Pre-exam / post-rumination"),
    ("worry", "Scheduled worry slot vs all-night rumination"),
    ("if_then", "If 00:30 still studying → wind-down decision rule"),
    ("nap", "Early 10–20 min post-poor-night"),
    ("nsdr", "Library rest — not sleep replacement"),
    ("reappraisal", "Catastrophic grade thoughts → workable next action"),
    ("ba", "Break freeze after bad feedback"),
    ("ppr", "Pre-exam routine"),
  ],
  "secondary": [
    ("resonance", "Daily 5–10 min regulation"),
    ("imagery", "Process imagery of exam first pages — not fantasy A+"),
    ("art", "Green-space micro-break"),
    ("stimulus_control", "If chronic insomnia — campus clinic CBT-I"),
    ("aerobic", "Strong mood lever between study blocks"),
    ("defusion", "Unstick 'I am my GPA' fusion"),
  ],
  "moments": [
    ("Semester start", "Install wake/light/caffeine rails before crisis"),
    ("Midterm week", "Pomodoro + worry slot + protect sleep opportunity most nights"),
    ("All-nighter aftermath", "Morning light + short nap + earlier next night — not second all-nighter"),
    ("Post-exam rumination", "Affect label + postpone worry + BA walk"),
    ("Burnout signs", "Values check + social + sleep; escalate care if depression/anxiety clinical"),
  ],
  "stacks": {
    "2 min": "Sigh + label + restart Pomodoro.",
    "5 min": "Cyclic sighing or WOOP for study obstacle.",
    "10–12 min": "NSDR in quiet space OR resonance OR ART outdoors.",
    "20 min": "Pomodoro cycle OR wind-down.",
    "30–60 min": "Aerobic + light OR deep work block with breaks.",
    "Exam morning": "Light + caffeine in window + PPR + process imagery of first actions — not cramming panic.",
  },
  "evidence": "Sleep and academic performance correlational literature; CBT-I for insomnia; exercise for mood; WOOP/if–then for goals; NSDR adjunct only.",
}

CLIENTS["competitive_exam_candidates"] = {
  "title": "Competitive Exam Candidates",
  "cluster": "D — Travel / Lifestyle / Performance-adjacent",
  "one_liner": "Time-boxed high-stakes exam preparation (UPSC, JEE/NEET, CFA, bar, boards) with arousal control and sleep as performance variables.",
  "who": "Candidates in multi-month prep cycles for gatekeeper exams; often coaching-center or self-study intensity.",
  "constraints": [
    "Long sedentary study hours",
    "Family pressure",
    "Coaching schedule may fight chronotype",
    "One-day performance climax",
  ],
  "stressors": [
    "Anticipatory anxiety",
    "Sleep onset insomnia before exam",
    "Comparison/social media",
    "Burnout months before exam",
    "Catastrophic thinking",
  ],
  "commercial": "Seasonal India-heavy demand; parent buyers; group cohorts; exam-countdown protocol packs.",
  "privacy": "Results anxiety private; avoid public ranking culture in product.",
  "avoid": [
    "Guaranteed rank claims",
    "Mega-dose melatonin night before exam without guidance",
    "NSDR as sleep substitute night before",
    "Hyperventilation for 'oxygen genius'",
    "Law-of-attraction grade manifestation",
  ],
  "rails": [
    "Protect sleep in final 2 weeks more than extra cram hour",
    "Simulate exam wake time for 7–10 days prior",
    "Caffeine rehearsal (same dose/timing as exam day)",
  ],
  "jobs": [
    "Sustain months of study without burnout",
    "Peak arousal control on exam day",
    "Sleep through high-anxiety nights",
    "Recover after mocks/failures",
  ],
  "core": [
    ("ppr", "Exam-day locked routine"),
    ("imagery", "Process imagery of opening booklet / first section — PETTLEP-ish"),
    ("cyclic_sigh", "Acute anxiety downshift"),
    ("worry", "Scheduled worry vs nocturnal spiral"),
    ("morning_light", "Stabilize wake for exam clock"),
    ("wake", "Pre-shift to exam wake time"),
    ("caffeine", "Rehearse exam-day dose; no new stimulants on day"),
    ("pomodoro", "Sustainable study structure"),
    ("if_then", "If panic in hall → sigh ×3 + read next question"),
    ("pmr", "Bedtime somatic release in final weeks"),
    ("reappraisal", "Mock failure → information, not identity"),
  ],
  "secondary": [
    ("resonance", "Daily regulation training"),
    ("nsdr", "Afternoon recovery on heavy study days — not night-before sleep replacement"),
    ("stimulus_control", "Exam insomnia lasting — clinician"),
    ("ba", "After demoralizing mock"),
    ("aerobic", "Mood + cognition support"),
    ("defusion", "Unstick catastrophic thoughts"),
    ("grounding", "If panic spiral mid-exam (breath may worsen for some)"),
  ],
  "moments": [
    ("T−30 days", "Install wake/light matching exam; cut late caffeine; PPR rehearsal"),
    ("T−7 days", "No new techniques; sleep priority; taper volume"),
    ("Night before", "Wind-down + PMR; avoid heavy new study; NSDR only as rest if sleepless — leave bed if clock-watching (stimulus control)"),
    ("Exam morning", "Light + practiced caffeine + PPR + process imagery"),
    ("Between papers", "Short sigh/grounding; light food; no catastrophic post-mortems"),
    ("Post-result", "Reappraisal + BA + social; escalate if distress clinical"),
  ],
  "stacks": {
    "2 min": "If–then panic plan: sigh or grounding → next question.",
    "5 min": "PPR rehearsal or cyclic sighing.",
    "10–12 min": "Process imagery block OR resonance OR short NSDR.",
    "20 min": "Pomodoro OR wind-down.",
    "30–60 min": "Aerobic + light OR deep study with breaks.",
    "Final 72h": "Sleep > marginal cram; same wake; same caffeine; PPR locked; no melatonin mega-dose experiments.",
  },
  "evidence": "Performance routines + process imagery (sport psych transfer); anxiety regulation breathing; sleep critical for memory consolidation — do not trade for all-nighters pre-exam. Melatonin only careful if jet-lag/clinician context — not magic exam pill.",
}

print("clients now", len(CLIENTS))

CLIENTS["young_professionals"] = {
  "title": "Young Professionals",
  "cluster": "D — Travel / Lifestyle / Performance-adjacent",
  "one_liner": "Early-career intensity: ambition, late social culture, first managerial stress, and fragile sleep/exercise rails.",
  "who": "Ages ~22–35 in consulting, tech, finance, startups, law — promoting or grinding for promotion.",
  "constraints": [
    "Open offices / late culture",
    "Roommate or small apartment",
    "Limited discretionary budget vs UHNW",
    "FOMO social calendar",
  ],
  "stressors": [
    "Social jet lag (weeknight late + early work)",
    "Imposter anxiety",
    "Always-on Slack",
    "Weekend repayment sleep that delays Monday",
    "Burnout trajectory",
  ],
  "commercial": "Volume segment; employer wellness B2B; content-led funnel to higher tiers.",
  "privacy": "Standard; workplace mental health stigma.",
  "avoid": [
    "Hustle-porn sleep deprivation",
    "5am club as universal",
    "NSDR replaces sleep",
    "Supernatural manifestation career claims",
  ],
  "rails": [
    "Fixed wake weekdays; weekend shift ≤1–2h",
    "Caffeine cutoff",
    "Phone out of bed (stimulus control lite)",
  ],
  "jobs": [
    "Build durable recovery habits early",
    "Regulate before high-stakes meetings",
    "Contain Sunday scaries",
    "Sustain output without burnout",
  ],
  "core": [
    ("morning_light", "Commute outdoor light as free habit"),
    ("wake", "Anchor against social jet lag"),
    ("caffeine", "Stop afternoon creep"),
    ("cyclic_sigh", "Pre-meeting / post-Slack spike"),
    ("pomodoro", "Focus amid open office"),
    ("if_then", "If Slack after 21:00 → tomorrow note not reply"),
    ("woop", "Promotion/skill goals with obstacles"),
    ("aerobic", "Highest chronic stress lever — schedule like a meeting"),
    ("evening_light", "Dim + night mode"),
    ("wind_down", "Even 15–20 min beats none"),
    ("ba", "Weekend activation when low mood"),
  ],
  "secondary": [
    ("resonance", "Daily 5–10 min skill"),
    ("nsdr", "Lunch rest on debt days — not sleep replacement"),
    ("ppr", "Before presentations"),
    ("reappraisal", "Feedback ≠ identity"),
    ("social", "Real friend check-in vs networking-only"),
    ("habit", "Stack rails onto coffee/commute"),
  ],
  "moments": [
    ("Sunday evening", "Worry slot + wind-down + prep if–then — not doomscroll"),
    ("Pre-review meeting", "PPR + sigh + process cue"),
    ("Post-deadline crash", "Light + aerobic + BA; protect sleep"),
    ("Team offsite travel", "Mini jet-lag / late-night alcohol rules"),
    ("Promotion anxiety month", "WOOP + sleep rails + social support"),
  ],
  "stacks": {
    "2 min": "Sigh + label + one next work action.",
    "5 min": "Cyclic sighing or WOOP micro.",
    "10–12 min": "Resonance or NSDR or ART walk.",
    "20 min": "Pomodoro or wind-down.",
    "30–60 min": "Aerobic meeting with self OR deep work block.",
    "High-load week": "Wake+light+caffeine locked; 2 micro-resets/day; one protected wind-down; one aerobic session.",
  },
  "evidence": "Social jet lag; exercise for stress/mood (A); if–then/WOOP (A); cyclic sighing (B); sleep rails.",
}

CLIENTS["burnout_seekers"] = {
  "title": "Burnout Seekers",
  "cluster": "D — Travel / Lifestyle / Performance-adjacent",
  "one_liner": "Actively seeking recovery from chronic occupational exhaustion, cynicism, and reduced efficacy — not a casual wellness shopper.",
  "who": "Professionals self-identifying as burned out or post-burnout; may include medical, tech, founder, caregiver overlaps.",
  "constraints": [
    "Low energy for complex protocols",
    "Possible clinical depression/anxiety comorbidity",
    "Workplace still demanding",
    "Shame / identity loss",
  ],
  "stressors": [
    "Exhaustion + sleep disruption",
    "Anhedonia / withdrawal",
    "Irritability",
    "Cognitive fog",
    "Relapse into overwork when energy returns",
  ],
  "commercial": "High intent; needs careful claims (not diagnosing/treating burnout disorder); pathway to clinicians when indicated.",
  "privacy": "Health stigma high; gentle language.",
  "avoid": [
    "Performance-optimization framing too early",
    "NSDR replaces sleep / therapy",
    "Aggressive biohacks (hyperventilation, extreme cold) as first line",
    "Gratitude-cures-depression claims",
    "DIY sleep restriction",
  ],
  "rails": [
    "Sleep opportunity first",
    "Morning light",
    "Tiny BA over heroic goals",
    "Medical/mental health screen encouragement when red flags",
  ],
  "jobs": [
    "Restore basic energy/sleep",
    "Reintroduce agency via tiny actions",
    "Downshift acute overwhelm",
    "Prevent premature optimization relapse",
  ],
  "core": [
    ("ba", "First-line behavioral: motion before motivation"),
    ("morning_light", "Circadian + mood support"),
    ("aerobic", "Strongest chronic load reducer when able — start tiny"),
    ("wake", "Stabilize even if duration imperfect"),
    ("cyclic_sigh", "Acute overwhelm tool"),
    ("affect", "Name exhaustion/cynicism without fusion"),
    ("social", "Safe person check-in"),
    ("values", "Reconnect to why — not hustle"),
    ("nsdr", "Rest blocks while rebuilding — NOT sleep replacement"),
    ("if_then", "If urge to overwork returns → 10-min walk first"),
    ("worry", "Contain rumination"),
  ],
  "secondary": [
    ("pmr", "Somatic tension"),
    ("resonance", "Gentle daily regulation"),
    ("reappraisal", "Failure narratives"),
    ("stimulus_control", "If insomnia disorder — clinician CBT-I"),
    ("body_scan", "If tolerated; trauma-sensitive caution"),
    ("gratitude", "Optional small wellbeing — not depression cure"),
  ],
  "moments": [
    ("Recognition / intake", "Safety screen; sleep+light+BA triad; defer peak-performance stacks"),
    ("Morning after crash", "Light + tiny BA + caffeine discipline"),
    ("Work trigger day", "Micro-sigh + if–then boundary"),
    ("Weekend", "Rest without total withdrawal — one valued action"),
    ("Energy returns", "Prevent rebound overwork; keep rails"),
  ],
  "stacks": {
    "2 min": "Label → sigh → one tiny BA.",
    "5 min": "Cyclic sighing or values one-liner + next tiny step.",
    "10–12 min": "NSDR or PMR or short walk outside.",
    "20 min": "Gentle aerobic start or wind-down.",
    "30–60 min": "Aerobic bout when ready OR protected sleep opportunity.",
    "Rebuild 2 weeks": "Light + wake + BA daily; social 3×/week; NSDR as rest; no new optimization protocols.",
  },
  "evidence": "BA strong for depression-adjacent withdrawal (A); exercise (A); sleep/circadian rails; mindfulness packages mixed/moderate. Burnout as occupational phenomenon — product does not diagnose ICD/DSM.",
}

CLIENTS["high_cognitive_load_knowledge_workers"] = {
  "title": "High Cognitive Load Knowledge Workers",
  "cluster": "D — Travel / Lifestyle / Performance-adjacent",
  "one_liner": "Deep-work professionals with directed-attention fatigue, context switching, and decision load — cognition is the bottleneck.",
  "who": "Researchers, PMs, engineers, analysts, writers, strategists with sustained mental demand.",
  "constraints": [
    "Meeting-heavy calendars fragmenting attention",
    "Screen-bound days",
    "Open office / home-office blur",
    "Evening cognitive spillover into sleep",
  ],
  "stressors": [
    "Directed attention fatigue",
    "Task-switch residue",
    "Rumination on unfinished loops",
    "Eye strain + evening light",
    "Under-recovery sleep",
  ],
  "commercial": "B2B knowledge orgs; individual 'clarity' positioning without claiming proprietary Clarity IP recipes here.",
  "privacy": "Work content confidential.",
  "avoid": [
    "Pomodoro as proven neuroscience cure",
    "Hyperventilation for genius focus",
    "NSDR replaces sleep after cognitive marathons",
    "Outcome-only visualization of 'crushing OKRs'",
  ],
  "rails": [
    "Task-batching + buffers",
    "Evening light hygiene",
    "Caffeine timing for deep work AM",
  ],
  "jobs": [
    "Restore directed attention",
    "Clean task-switch residue",
    "Protect deep work blocks",
    "Sleep after high mental load",
  ],
  "core": [
    ("art", "Soft-fascination break for attention restoration"),
    ("pomodoro", "Structure heuristic — label as such"),
    ("cyclic_sigh", "Between meetings"),
    ("worry", "Close open loops into scheduled slot"),
    ("if_then", "If meeting ends → 2-min buffer before next"),
    ("morning_light", "Cognitive day start"),
    ("caffeine", "Align to deep work window"),
    ("nsdr", "Midday reset after heavy load — rest framing"),
    ("mindfulness", "Attention training micro-dose"),
    ("evening_light", "Protect sleep after screen day"),
    ("wind_down", "Cognitive off-ramp"),
  ],
  "secondary": [
    ("resonance", "Daily regulation"),
    ("body_scan", "Interoceptive downshift"),
    ("aerobic", "Chronic load + BDNF-adjacent benefits framing careful"),
    ("defusion", "Unstick fused problem thoughts"),
    ("reappraisal", "Reframe unfinished work"),
    ("nap", "Early short nap if sleep debt and night protected"),
  ],
  "moments": [
    ("Pre-deep-work", "Light + caffeine + phone away + if–then distraction plan"),
    ("Post-3-meeting block", "ART break or sigh + task-switch buffer"),
    ("Afternoon fog", "NSDR 10–20 or walk outdoors — not third espresso if cutoff near"),
    ("Shutdown ritual", "Worry park + tomorrow if–then + dim lights"),
    ("Deadline week", "Protect sleep; ART micro-breaks; cut low-value meetings"),
  ],
  "stacks": {
    "2 min": "Task-switch buffer: sigh + note next action.",
    "5 min": "ART window gaze / plant / sky OR cyclic sighing.",
    "10–12 min": "NSDR or mindfulness of breath or resonance.",
    "20 min": "Pomodoro cycle or outdoor ART walk.",
    "30–60 min": "Deep work block with breaks OR aerobic.",
    "Heavy cognition day": "AM light+caffeine; 2 ART breaks; 1 NSDR option; hard shutdown + wind-down.",
  },
  "evidence": "Attention Restoration Theory (promising/mixed); Pomodoro weak branded evidence; mindfulness B at package level; sleep critical for cognition; NSDR C adjunct.",
}

CLIENTS["sleep_recovery_seekers"] = {
  "title": "Sleep / Recovery Seekers",
  "cluster": "D — Travel / Lifestyle / Performance-adjacent",
  "one_liner": "Primary job-to-be-done is better sleep and recovery — insomnia symptoms, poor restorative feel, or recovery from sleep debt.",
  "who": "Adults prioritizing sleep quality; may include post-travel, postpartum (non-infant-waking insomnia), high-stress insomnia-adjacent.",
  "constraints": [
    "May already take supplements/meds",
    "Partner snoring / environment",
    "Clock-watching habits",
    "Desire for quick biohack vs behavioral work",
  ],
  "stressors": [
    "Sleep onset difficulty",
    "Middle-of-night waking",
    "Non-restorative sleep feel",
    "Anxiety about sleep",
    "Daytime compensation (naps/caffeine) that perpetuates",
  ],
  "commercial": "Core wellness wedge; must route chronic insomnia toward CBT-I clinician framing; product sells rails + adjuncts honestly.",
  "privacy": "Health data sensitive.",
  "avoid": [
    "Sleep hygiene alone as cure (AASM: weak monotherapy)",
    "DIY aggressive sleep restriction",
    "NSDR replaces sleep",
    "Melatonin as generic sleep vitamin for chronic insomnia",
    "Guaranteed PSG-like claims",
  ],
  "rails": [
    "Fixed wake time",
    "Morning outdoor light",
    "Evening dim",
    "Caffeine cutoff",
    "Bed = sleep/sex (stimulus control spirit)",
  ],
  "jobs": [
    "Improve sleep continuity/quality",
    "Reduce sleep anxiety",
    "Daytime function after poor nights",
    "Know when to escalate to clinician",
  ],
  "core": [
    ("stimulus_control", "A-grade CBT-I component — product cues rules; clinician for full therapy"),
    ("wake", "Fixed wake including weekends (±small)"),
    ("morning_light", "Circadian anchor"),
    ("evening_light", "Protect melatonin rise"),
    ("caffeine", "Evidence-backed timing"),
    ("wind_down", "Arousal buffer — C but practical"),
    ("pmr", "Relaxation training component"),
    ("worry", "Get worry out of bed"),
    ("cyclic_sigh", "Downshift if anxious at bedtime — prefer chair if stimulus control active"),
    ("nsdr", "Daytime/rest adjunct — NEVER marketed as sleep replacement"),
    ("nap", "Cautious; often avoid in classic stimulus control"),
  ],
  "secondary": [
    ("sleep_restriction", "A-grade but clinician-guided ONLY — never DIY-aggressive in product"),
    ("478", "Memorable bedtime cue — C; not insomnia monotherapy"),
    ("body_scan", "If it doesn't become in-bed arousal"),
    ("autogenic", "Optional traditional — C"),
    ("resonance", "Evening regulation"),
    ("aerobic", "Earlier in day for sleep benefit"),
    ("jetlag", "If travel-triggered"),
  ],
  "moments": [
    ("Intake", "Screen: chronic insomnia → CBT-I path; travel → jet-lag path; fragmentation from kids → executive parent path"),
    ("Bedtime arousal", "Leave bed ~15–20 min rule spirit; PMR in chair; no clock obsession"),
    ("3am wake", "Stimulus control; postpone worry; dim"),
    ("After bad night", "Fixed wake + AM light + caffeine discipline + optional early short nap only if not in SC protocol; NSDR as rest"),
    ("Good week", "Keep rails — don't reward with late caffeine/alcohol"),
  ],
  "stacks": {
    "2 min": "In chair: sigh + postpone-worry note.",
    "5 min": "Brief PMR or cyclic sighing (not clock-watching in bed).",
    "10–12 min": "NSDR daytime OR abbreviated body scan evening (out of bed if SC).",
    "20 min": "Wind-down buffer.",
    "30–60 min": "Full wind-down + protected sleep opportunity.",
    "Bad-night toolkit": "Fixed wake + AM light + caffeine cutoff + evening dim + wind-down + chair PMR/sigh + NSDR rest framing — clinician if chronic.",
  },
  "evidence": "AASM 2021 CBT-I guideline; Furukawa 2024 cNMA (stimulus control & sleep restriction potent); melatonin stronger for jet lag/circadian than chronic primary insomnia; NSDR preliminary only.",
}

CLIENTS["performance_optimization_seekers"] = {
  "title": "Performance Optimization Seekers",
  "cluster": "D — Travel / Lifestyle / Performance-adjacent",
  "one_liner": "Wants measurable edge in cognition, composure, and output — high curiosity, high bullshit-risk for unsupported biohacks.",
  "who": "Founders, athletes, operators, quantified-self adjacent users seeking performance stacks.",
  "constraints": [
    "Will try everything; adherence to basics may lag",
    "Supplement stacking culture",
    "Over-instrumentation anxiety",
    "Confuses acute arousal tools with chronic foundations",
  ],
  "stressors": [
    "Plateau frustration",
    "Comparison to influencer protocols",
    "Pre-performance anxiety",
    "Recovery neglected for 'more stimulus'",
    "Sleep traded for work",
  ],
  "commercial": "Premium positioning; must gate E-tier claims; sell foundations before exotic; bridge to Peak Performance intensive (IP elsewhere).",
  "privacy": "Metrics dashboards private.",
  "avoid": [
    "Oxygenate-brain hyperventilation myths",
    "NSDR = sleep hour-for-hour",
    "Law of Attraction performance",
    "Outcome-only visualization without practice",
    "DIY clinical sleep restriction as biohack",
    "Hemisphere-balancing nostril claims as science",
  ],
  "rails": [
    "Sleep + light + exercise + caffeine timing BEFORE exotic breath",
    "One change at a time",
    "Process > outcome imagery",
  ],
  "jobs": [
    "Raise reliable performance floor",
    "Pre-performance arousal control",
    "Sustain deep work quality",
    "Recover to train/perform again",
  ],
  "core": [
    ("morning_light", "Free cognitive/circadian edge"),
    ("aerobic", "Chronic performance substrate"),
    ("ppr", "Pre-performance stabilization"),
    ("imagery", "PETTLEP/process imagery adjunct to practice"),
    ("cyclic_sigh", "Acute downshift / composure"),
    ("resonance", "Trainable breath engine"),
    ("if_then", "Obstacle automation"),
    ("woop", "Goal pursuit with obstacles"),
    ("caffeine", "Timed ergogenic — not chaos"),
    ("nap", "Strategic 10–20 when sleep OK"),
    ("wake", "Consistency > heroic wake time"),
  ],
  "secondary": [
    ("nsdr", "Recovery block between loads — rest framing"),
    ("pomodoro", "Structure heuristic"),
    ("centering", "Sport psych centering"),
    ("box", "Tactical structure under pressure — C"),
    ("reappraisal", "Pressure reinterpretation"),
    ("evening_light", "Protect sleep = next-day performance"),
    ("anb", "Optional traditional — D; no hemisphere claims"),
  ],
  "moments": [
    ("Baseline week", "Install light/sleep/exercise/caffeine; measure subjectively; no exotic adds"),
    ("Pre-keynote / deal / match", "PPR + process imagery + sigh/box"),
    ("Heavy training/work block", "NSDR or nap recovery; do not stack stimulants"),
    ("Plateau", "Return to sleep audit before new biohack"),
    ("Travel + performance", "Jet-lag light plan + PPR on arrival day"),
  ],
  "stacks": {
    "2 min": "Physiological sigh + cue word + first action.",
    "5 min": "PPR skeleton or cyclic sighing 5 min.",
    "10–12 min": "Process imagery + breath OR resonance.",
    "20 min": "NSDR recovery OR focused work block.",
    "30–60 min": "Aerobic OR full PPR+imagery+warmup chain.",
    "Perform-in-15": "Light if AM → 2–3 min sigh/centering → process imagery 5–8 → PPR lock → one if–then obstacle.",
  },
  "evidence": "PPR/imagery sport psych B; cyclic sighing B; resonance B; exercise A; WOOP/if–then A; foundations outperform exotic unsupported claims (see library 14_UNSUPPORTED).",
}

assert len(CLIENTS) == 15, len(CLIENTS)
print("all 15 clients defined")

# ============================================================================
# FILE RENDERERS
# ============================================================================

def bullets(items):
    return "\n".join(f"- {x}" for x in items)

def moments_table(moments):
    rows = ["| Moment | Protocol posture |", "|--------|------------------|"]
    for m, a in moments:
        rows.append(f"| **{m}** | {a} |")
    return "\n".join(rows)

def stacks_block(stacks):
    lines = []
    for k, v in stacks.items():
        lines.append(f"### {k}\n{v}\n")
    return "\n".join(lines)

def render_profile(slug, c):
    return f"""# Profile — {c['title']}

{DISCLAIMER}

**Slug:** `{slug}`  
**Cluster:** {c['cluster']}  
**Compiled:** 2026-09-19 (Asia/Calcutta)

## One-liner
{c['one_liner']}

## Who
{c['who']}

## Constraints
{bullets(c['constraints'])}

## Dominant stressors
{bullets(c['stressors'])}

## Primary jobs-to-be-done
{bullets(c['jobs'])}

## Commercial notes
{c['commercial']}

## Privacy / discretion
{c['privacy']}

## Lifestyle rails (non-negotiable before exotic tools)
{bullets(c['rails'])}

## Hard avoids / contraindications (product)
{bullets(c['avoid'])}

## Evidence posture for this type
{c['evidence']}

## Cross-links
- Protocols: `02_protocols_by_client/{slug}.md`
- Moments: `03_moments/{slug}.md`
- Stacks: `04_stacks/{slug}.md`
"""

def render_protocols(slug, c):
    return f"""# Protocols by client — {c['title']}

{DISCLAIMER}

**Slug:** `{slug}`  
**Source library:** `pranaforge-protocol-research/01_MASTER_DATABASE.md` (public protocols only)

## Core map (prefer these)

| Protocol | Grade | Why for this client |
|----------|-------|---------------------|
{plist(c['core'])}

## Secondary / situational

| Protocol | Grade | Why for this client |
|----------|-------|---------------------|
{plist(c['secondary'])}

## Sequencing rule
1. Install **lifestyle rails** (light, wake, caffeine, evening dim, alcohol restraint as relevant).  
2. Add **acute regulation** (sigh / PMR / affect label) for spikes.  
3. Add **performance wrappers** (PPR / process imagery / if–then) only when foundations hold.  
4. Use **NSDR** as deep rest — never as sleep replacement.  
5. Escalate **CBT-I components** (stimulus control / sleep restriction) with clinician framing when insomnia is clinical.

## Evidence notes
{c['evidence']}
"""

def render_moments(slug, c):
    return f"""# Moments — {c['title']}

{DISCLAIMER}

**Slug:** `{slug}`  
**Use:** Trigger → protocol posture map for personalization engines and staff cue cards.

{moments_table(c['moments'])}

## Design notes
- Moments are **situational entry points**, not diagnoses.
- Prefer the shortest effective stack that matches available privacy and time.
- If safety risk / clinical crisis → professional help, not protocol theater.
"""

def render_stacks(slug, c):
    return f"""# Stacks — {c['title']}

{DISCLAIMER}

**Slug:** `{slug}`  
**Time buckets** aligned to public library `09_TIME_BUCKETS.md`.

{stacks_block(c['stacks'])}

## Composition hygiene
- Highest evidence available wins on ties.
- No E-tier claims.
- NSDR blocks labeled as **rest**, not sleep.
- Melatonin only inside careful jet-lag / clinician context — low dose, timed, no mega-dosing.
"""

for slug, c in CLIENTS.items():
    write(ROOT / "01_profiles" / f"{slug}.md", render_profile(slug, c))
    write(ROOT / "02_protocols_by_client" / f"{slug}.md", render_protocols(slug, c))
    write(ROOT / "03_moments" / f"{slug}.md", render_moments(slug, c))
    write(ROOT / "04_stacks" / f"{slug}.md", render_stacks(slug, c))

print("CLIENT FILES DONE", len(CLIENTS) * 4)
