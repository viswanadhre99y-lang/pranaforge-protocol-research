#!/usr/bin/env python3
"""Generate Cluster C — Sport / Performance / Duty Protocol Intelligence."""
from pathlib import Path
import csv

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

import json
_clients_path = ROOT / "_cluster_c_clients.json"
CLIENTS.update(json.loads(_clients_path.read_text(encoding="utf-8")))
print("loaded clients", len(CLIENTS))

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


# ============================================================================
# MATRIX + SYNTHESIS (Cluster C)
# ============================================================================

def write_matrix():
    path = ROOT / "05_matrix" / "MATRIX_PERFORMANCE_DUTY.csv"
    fields = [
        "client_slug","client_title","cluster","moment","protocol_posture",
        "duty_critical","safety_flag","uhnw_travel_relevant","core_protocol_grades"
    ]
    rows = []
    for slug, c in CLIENTS.items():
        grades = "; ".join(f"{P[k][0]}[{P[k][1]}]" for k,_ in c["core"][:5])
        for i, (moment, posture) in enumerate(c["moments"]):
            mlow = (moment + " " + posture).lower()
            if slug == "pilots_aviation":
                safe = "fatigue_ftl_frms"
            elif slug in ("emergency_responders", "military_special_ops_adjacent"):
                safe = "trauma_informed"
            elif slug == "combat_motorsport_athletes" or "heat" in mlow:
                safe = "heat_cold_breath"
            elif "concussion" in mlow or "injury" in mlow:
                safe = "medical_clearance"
            else:
                safe = "standard"
            duty = "yes" if i < 3 or any(x in mlow for x in ["duty", "cockpit", "call", "grid", "debate", "en route", "ftl", "sop"]) else "varies"
            uhnw = "yes" if any(x in mlow for x in ["travel", "jet", "land", "festival", "layover", "circuit", "tour", "suite", "uhnw"]) or slug in (
                "professional_athletes","actors_performing_artists","musicians_dancers","diplomats","pilots_aviation"
            ) else "maybe"
            rows.append({
                "client_slug": slug,
                "client_title": c["title"],
                "cluster": c["cluster"],
                "moment": moment,
                "protocol_posture": posture,
                "duty_critical": duty,
                "safety_flag": safe,
                "uhnw_travel_relevant": uhnw,
                "core_protocol_grades": grades,
            })
    import csv
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=fields)
        w.writeheader()
        w.writerows(rows)
    print("wrote", path.relative_to(ROOT), "rows", len(rows))
    return len(rows)

def write_synthesis(nrows):
    slugs = list(CLIENTS.keys())
    report = f"""# Cluster C Report — Client-Specific Protocol Intelligence (Sport / Performance / Duty)

**Compiled:** 2026-09-19 (Asia/Calcutta)  
**Root:** `client-protocol-intelligence/`  
**Slugs:** {len(slugs)} deep-dives × profiles / protocols / moments / stacks

{DISCLAIMER}

## Deliverables

| Artifact | Status |
|----------|--------|
| `01_profiles/{{slug}}.md` | {len(slugs)} |
| `02_protocols_by_client/{{slug}}.md` | {len(slugs)} |
| `03_moments/{{slug}}.md` | {len(slugs)} |
| `04_stacks/{{slug}}.md` | {len(slugs)} |
| `05_matrix/MATRIX_PERFORMANCE_DUTY.csv` | {nrows} rows |
| `06_synthesis/WHITESPACE_UHNW_ATHLETE_PERFORMER_TRAVEL.md` | written |
| `06_synthesis/CLUSTER_C_REPORT.md` | this file |
| `07_sources/SOURCES_CLUSTER_C.md` | written |
| `00_universe/CLUSTER_C_SLUGS.md` | written |

## Slugs

""" + "\n".join(f"- `{s}` — {CLIENTS[s]['title']}" for s in slugs) + """

## Research pillars

1. **Sport psychology:** PPR (Rupprecht 2021 meta), PETTLEP/imagery, arousal titration, centering.
2. **Breathing/autonomic:** cyclic sighing (Balban 2023), resonance/HRVB (Lehrer), tactical/box (C).
3. **Performing arts anxiety:** CBT-family for MPA; slow breathing; dance intervention reviews (limited).
4. **Aviation:** ICAO/EASA FRMS/FTL public fatigue management; layover circadian packs.
5. **Military (public only):** MMFT Marines study; VA MBSR PTSD adjunct; MBAT public framing — **no classified tactics**.
6. **First responders:** trauma-informed grounding; shiftwork sleep; EAP/CISM over catharsis.
7. **Safety cross-cut:** heat/cold, breath extremes, trauma, sleep-replacement myths, ED language.

## Evidence posture (product)

- Default ship **A/B** (light, PPR, reappraisal, if–then, coherent/sigh, exercise, CBT-I components with clinician where needed).
- Keep **C** optional/labeled (centering brand, tactical box, grounding mnemonics, NSDR).
- Never market **E** (manifestation metaphysics, hyperventilation-for-cut).
- Package ≠ micro-skill (TIPP, full DBT, full MBSR).

## Duty-critical design rule

Inside duty windows (cockpit, call, cage, debate, code): **SOP/skill first**; micro regulation only if it preserves task attention. Longer MT/sleep/exercise = off-duty capacity tools.

## UHNW athlete/performer travel whitespace

See `06_synthesis/WHITESPACE_UHNW_ATHLETE_PERFORMER_TRAVEL.md`.

## Military file compliance

`military_special_ops_adjacent` = published resilience/mindfulness performance psychology only. No classified tactics, targeting, or operational tradecraft.
"""
    write(ROOT / "06_synthesis" / "CLUSTER_C_REPORT.md", report)

    ws = f"""# White-Space — UHNW Athlete / Performer Travel Recovery

**Compiled:** 2026-09-19 (Asia/Calcutta)  
**Cluster:** C synthesis

{DISCLAIMER}

## Problem

UHNW athletes and performers already buy private aviation, contrast spa theatre, celebrity trainers, and hotel wellness menus.  
**Under-served:** discreet, evidence-honest **nervous-system + circadian** protocols that (1) survive team/medical politics, (2) keep anti-doping optics clean, (3) work in suites/jets without guru branding, (4) separate **state tools** from **sleep replacement myths**.

## White-space map

| Gap | Why it exists | PranaForge-shaped offer | Evidence honesty |
|-----|---------------|-------------------------|------------------|
| Cross-TZ compete/show-day playbooks co-signed for medical staff | Teams fear random breath influencers | One-pager: light timing + nap rules + PPR + evening downshift | Light A; naps B; PPR B; breath B/C |
| Post-presser / post-premiere emotional residue | Physical recovery gets budget; social-eval residue ignored | 5–8 min label + distancing + sigh + device if–then | A/B components |
| Concussion / voice / ED-safe variants | One-size breath stacks unsafe | External-focus-only; vocal-safe nasal pacing; no body-shame copy | Safety > novelty |
| Bizav / owner-pressure fatigue ethics | Awkward incentives on shared jets | Boundary if–then + layover sleep pack | Aviation FRMS A-grade principles |
| Village / tour-bus privacy | Shared spaces kill adherence | Silent micro-PPR; eyes-open grounding | C/B practical |
| De-role after intense acting / combat media | Catharsis culture pushes unsafe extremes | Trauma-informed de-role ground (no hyperventilation) | C applied + safety |
| Family/partner travel recovery | Entourage travels too | Parallel short packs for partners | B sleep/light |
| Post-Olympic / off-season identity | Market sells peak only | Ethical transition BA + values + sleep (referral-friendly) | A/B clinical-adjacent |

## Recommended UHNW Travel Recovery stack (public components)

**Landing day (east/west aware):**
1. Timed outdoor light (**A**)
2. Strategic 10–20m nap if appropriate (**B**)
3. Melatonin only with known personal/clinical protocol (**B** careful; avoid >5 mg DIY)
4. Coherent or exhale-emphasized / cyclic sighing 10m for landing arousal (**B**)
5. Evening dim + wind-down (**C**) + optional NSDR as **rest** (**C**) — never sleep substitute

**Compete/show day on foreign clock:**
1. Morning light + brief movement
2. Pre-event PPR + tactical/sigh breath sized to arousal (**B/C**)
3. Post-event downshift + sleep protect

**Hard no's:**
- Hyperventilation + ice + hold stacks as recovery
- "Cures jet lag" medical claims
- Outcome-only manifestation (**E**)
- DIY aggressive sleep restriction

## Priority slugs

`professional_athletes` · `olympic_elite_athletes` · `actors_performing_artists` · `musicians_dancers` · `public_speakers_creators` · `combat_motorsport_athletes` (paddock) · `pilots_aviation` (bizav ethics adjacency) · `diplomats` (residence kits)

## Positioning line (research)

> Private travel recovery for athletes and performers: circadian timing, composure routines, and downshift — evidence-graded, team-safe, discreet.
"""
    write(ROOT / "06_synthesis" / "WHITESPACE_UHNW_ATHLETE_PERFORMER_TRAVEL.md", ws)

    sources = f"""# Sources — Cluster C (Sport / Performance / Duty)

**Compiled:** 2026-09-19 (Asia/Calcutta)

## Sport psychology / performance
- Rupprecht, Tran & Gröpel (2021). Effectiveness of pre-performance routines in sports: a meta-analysis. *IRSEP*. https://doi.org/10.1080/1750984X.2021.1944271
- Holmes & Collins (2001). PETTLEP approach to motor imagery.
- PETTLEP systematic review — *Applied Sciences* 2022. https://doi.org/10.3390/app12199753
- Imagery multilevel meta-analysis (2025) PMC12109254
- Reinebo et al. (2024). PST effects — caution when removing low-quality studies.

## Breathing / autonomic
- Yilmaz Balban et al. (2023). *Cell Reports Medicine*. PubMed 36630953
- Lehrer & Gevirtz (2014). HRV biofeedback / resonance. PMC4104929

## Performing arts anxiety
- Therapeutic interventions for MPA — PMC11851691
- Musician performance anxiety treatments meta-analysis literature 2025
- Performer/athlete anxiety psychological interventions — Behav Sci 2023 meta
- Dancers’ mental health interventions systematic review (recent literature)

## Aviation fatigue / CRM
- ICAO Doc 9966 — Fatigue management oversight / FRMS materials
- EASA Fatigue Risk Management / FTL (ORO.FTL; CS-FTL guidance)
- Jet-lag chronobiology (e.g., Frontiers Physiol 2019); CDC Yellow Book jet lag guidance

## Military resilience (public only)
- Johnson et al. (2014). Mindfulness training in Marines pre-deployment. *AJP*. PMC4458258
- VA / multisite MBSR for PTSD RCTs (e.g., PMC8189576) — adjunct framing
- MBSR veterans meta-analysis PMC11583271
- MBAT public ClinicalTrials descriptions (e.g., NCT03310112)

## Trauma-informed / first responders
- Trauma-focused therapies first-line for PTSD; mindfulness/breath adjunct
- Prefer grounding/choice; avoid intense breathwork if dissociating
- DBT TIPP package-level (C for isolated micro-skill)

## Circadian / sleep
- AASM circadian practice parameters; CBT-I components
- Nap performance literature; insomnia nap cautions
- Parent library: `../15_SOURCES.md`, `../05_PERFORMANCE.md`
"""
    write(ROOT / "07_sources" / "SOURCES_CLUSTER_C.md", sources)

    uni = f"""# Cluster C — Slug Index (Sport / Performance / Duty)

**Compiled:** 2026-09-19 (Asia/Calcutta)

Deep-dive slugs (14):

""" + "\n".join(f"| `{s}` | {CLIENTS[s]['title']} | {CLIENTS[s]['one_liner']} |" for s in slugs) + """

See also parent `CLIENT_UNIVERSE.md` sections D–G (sport, creative, government, aviation).
"""
    # fix table header
    uni = f"""# Cluster C — Slug Index (Sport / Performance / Duty)

**Compiled:** 2026-09-19 (Asia/Calcutta)

| Slug | Title | One-liner |
|------|-------|-----------|
""" + "\n".join(f"| `{s}` | {CLIENTS[s]['title']} | {CLIENTS[s]['one_liner']} |" for s in slugs) + """

Cross-ref: `CLIENT_UNIVERSE.md` sections D–G (sport, creative, government, aviation).  
Matrix: `05_matrix/MATRIX_PERFORMANCE_DUTY.csv`.  
Report: `06_synthesis/CLUSTER_C_REPORT.md`.
"""
    write(ROOT / "00_universe" / "CLUSTER_C_SLUGS.md", uni)

nrows = write_matrix()
write_synthesis(nrows)
print("SYNTHESIS DONE")
