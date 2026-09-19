#!/usr/bin/env python3
"""Cluster B generator — professional client protocol intelligence."""
from __future__ import annotations
from pathlib import Path
from copy import deepcopy
import csv

ROOT = Path("/workspace/pranaforge-protocol-research/client-protocol-intelligence")

QUESTIONS = [
    (1, "Sleep onset after late / ruminative work"),
    (2, "Early waking or fragmented sleep"),
    (3, "Chronic stress / burnout risk"),
    (4, "Acute pre-performance anxiety"),
    (5, "Sustained focus / deep work"),
    (6, "Decision fatigue"),
    (7, "Emotional recovery after hard interpersonal load"),
    (8, "Occupational physical tension / MSD"),
    (9, "Travel / jet lag / schedule disruption"),
    (10, "Recovery after long high-demand day"),
    (11, "Low motivation / activation when depleted"),
    (12, "Rumination / worry loops"),
    (13, "Confidence / evaluation anxiety"),
    (14, "Rejection / failure / setback recovery"),
    (15, "Boundary / psychological detachment from work"),
    (16, "Afternoon energy crash"),
    (17, "Pre-meeting / presentation / pitch nerves"),
    (18, "Post-event cognitive residue"),
    (19, "Habit consistency under irregular schedules"),
    (20, "Relationship / social recovery capacity"),
]

DISCLAIMER = (
    "> **Disclaimer:** Educational personalization intelligence for PranaForge research — "
    "**not medical advice**, not psychotherapy, not a treatment plan. Not proprietary Daily Forge IP. "
    "CBT-I sleep restriction / stimulus control = **clinician-guided**. Individual skills do not replace "
    "organizational workload/culture fixes. Crisis → emergency/local professional help."
)

def proto(**kw):
    need = ["name","purpose","problem","typical","minimum","steps","when","short","longer",
            "mechanism","evidence","research","risks","avoid","sources","creator","tags","qnums"]
    for r in need:
        assert r in kw, f"missing {r} in {kw.get('name')}"
    return kw

def P(base, **ov):
    d = deepcopy(base); d.update(ov); return proto(**d)

# -------------------- shared bases --------------------
CYCLIC = dict(name="Cyclic Sighing (Physiological Sigh Pattern)", purpose="Rapidly reduce acute arousal via double-inhale + long exhale.", problem="Acute stress spike, elevated respiratory rate, pre-meeting nerves.", typical="5 min daily; 1–3 cycles acutely", minimum="1–3 sighs (~30–60 s)", steps=["Sit/stand upright.","Inhale slowly through nose until mostly full.","Second shorter nasal inhale to fully inflate.","Exhale slowly/fully through mouth or nose.","Repeat 1–3 cycles acutely or ~5 min as daily dose."], when="Acute spikes, pre-call, end-of-day downshift.", short="Often calmer affect and slower breathing within minutes.", longer="28-day RCT: daily cyclic sighing improved mood vs matched mindfulness; reduced resting respiratory rate (Balban 2023).", mechanism="Physiological sigh recruits alveoli; prolonged exhale increases parasympathetic influence.", evidence="B", research="Yilmaz Balban et al., Cell Rep Med 2023; PubMed 36630953.", risks="Lightheadedness if overdone; mouth dryness.", avoid="Severe respiratory disease, recent thoracic surgery, panic with breath-focus — use gentler long exhales.", sources="https://pubmed.ncbi.nlm.nih.gov/36630953/", creator="Studied by Balban/Huberman/Spiegel et al. (Stanford).", tags="Generic|High-value", qnums="4,17,18")

COHERENT = dict(name="Coherent / Resonance Frequency Breathing (~6 breaths/min)", purpose="Train HRV/RSA near ~0.1 Hz for autonomic downshift.", problem="Chronic stress load, low HRV, need trainable daily practice.", typical="10–20 min; ~5.5–6 breaths/min", minimum="5 min comfortable slow breathing", steps=["Sit upright; nasal breathe if comfortable.","Pace ~6/min (e.g., 5 s in / 5 s out) or personal resonance if biofeedback available.","Gentle depth — avoid overbreathing.","Optional pacer/HRV biofeedback."], when="Daily stress regulation; pre-sleep if not alerting.", short="Increased HRV/RSA during practice; often calmer mood.", longer="HRVB/resonance breathing: small–moderate benefits for stress/anxiety/BP in reviews.", mechanism="Respiration–HR–baroreflex resonance maximizes RSA (Lehrer/Vaschillo).", evidence="B", research="Lehrer & Gevirtz Front Psychol 2014; Steffen et al. 2017.", risks="Overbreathing dizziness; rare anxiety with interoception.", avoid="Severe lung disease; acute panic if breath focus worsens — shorten or guide clinically.", sources="https://pmc.ncbi.nlm.nih.gov/articles/PMC4104929/", creator="Paul Lehrer, Evgeny Vaschillo et al.", tags="Generic|High-value", qnums="3,10")

BOX = dict(name="Box Breathing (Square Breathing)", purpose="Stabilize attention/arousal with equal inhale–hold–exhale–hold.", problem="Performance anxiety, scattered attention under pressure.", typical="2–5 min (e.g., 4-4-4-4)", minimum="~1–2 min", steps=["Choose sustainable count (often 4 s).","Inhale nose → hold gently full → exhale → hold near-empty, equal counts.","Stop if dizzy; shorten/remove holds as needed."], when="Pre-performance, between tasks, tactical reset.", short="Subjective calm and attentional anchoring.", longer="Balban 2023: improved mood/anxiety similarly to other arms; not superior to cyclic sighing on primary outcomes.", mechanism="Paced breathing + mild holds provide structure; equal counts are heuristic not optimized resonance.", evidence="C", research="Comparator in Balban 2023; limited isolating RCTs for exact box pattern.", risks="Hold discomfort; dizziness.", avoid="Pregnancy, uncontrolled HTN, panic with holds, severe asthma — remove holds.", sources="https://pubmed.ncbi.nlm.nih.gov/36630953/", creator="Popularized in tactical/performance settings; single inventor unclear.", tags="Generic|Situation-specific", qnums="4,17")

PMR = dict(name="Progressive Muscle Relaxation (PMR)", purpose="Reduce somatic tension via systematic tense–release.", problem="Muscle guarding, occupational tension, arousal that blocks sleep onset.", typical="10–20 min full; 3–5 min brief (hands-shoulders-face)", minimum="3 min brief PMR", steps=["Tense one muscle group ~5 s without pain, then release 10–15 s.","Progress feet→face (or reverse); notice contrast.","Brief version: fists, shoulders, jaw/face only."], when="Wind-down; tension after desk/standing work; pre-sleep if body tense.", short="Reduced perceived muscle tension and anxiety for many.", longer="Longstanding clinical evidence base for anxiety/insomnia adjunct (package-level).", mechanism="Reduced muscle afferent drive; attentional shift; conditioned relaxation response.", evidence="B", research="Jacobson lineage; modern RCTs support PMR for anxiety/sleep as adjunct.", risks="Pain if over-tensile; avoid injured sites.", avoid="Acute injury, uncontrolled HTN for strong isometrics — use release-only cues.", sources="Clinical PMR literature; see parent master library.", creator="Edmund Jacobson (original); abbreviated clinical adaptations widely used.", tags="Generic|High-value", qnums="8,1")

STIM = dict(name="Stimulus Control Therapy (CBT-I Component) — Clinician-Guided Framing", purpose="Rebuild bed–sleep association; reduce conditioned arousal in bed.", problem="Insomnia with bed associated with wakeful worry/work.", typical="Ongoing nightly rules; clinician package often 4–8 weeks", minimum="Consistent application of core rules for several nights (under guidance)", steps=["Use bed only for sleep/sex (no work laptop in bed).","If unable to sleep after ~15–20 min quiet wakefulness, leave bed; return when sleepy.","Fixed wake time; avoid compensatory long lie-ins.","No clock-watching; dim light out of bed.","**Do not self-prescribe aggressive sleep restriction** — pair with clinician if restricting time-in-bed."], when="Chronic sleep-onset/maintenance insomnia with conditioned arousal.", short="May reduce time awake in bed within days–weeks when followed.", longer="Core A-tier CBT-I component in guidelines.", mechanism="Classical conditioning: extinguish bed–wake association; consolidate sleep drive.", evidence="A", research="CBT-I guideline literature; Bootzin stimulus control classic; AASM CBT-I recommendations.", risks="Temporary sleepiness; frustration; unsafe if sleep-deprived driving.", avoid="Bipolar spectrum / seizure risk without clinician; shift workers need adapted plans; never DIY aggressive restriction.", sources="AASM CBT-I guidance summaries; PubMed CBT-I reviews.", creator="Richard Bootzin (stimulus control); CBT-I packages (Morin, Espie lineages).", tags="Generic|High-value", qnums="1,2")

SRT = dict(name="Sleep Restriction Therapy (CBT-I Component) — Clinician-Guided ONLY", purpose="Consolidate fragmented sleep by temporarily limiting time-in-bed under clinical supervision.", problem="Severe sleep fragmentation / low sleep efficiency insomnia.", typical="Multi-week clinician-titrated schedule", minimum="N/A for DIY — requires clinician", steps=["Clinician sets initial time-in-bed from sleep diary sleep efficiency.","Fixed wake time; bedtime delayed to match prescribed window.","Titrate weekly as efficiency improves.","**Product rule:** never auto-prescribe restriction algorithms without clinician pathway."], when="Clinically significant insomnia with fragmentation — after assessment.", short="Often increased sleep pressure; temporary daytime sleepiness.", longer="Strong evidence within CBT-I packages for chronic insomnia.", mechanism="Homeostatic sleep drive consolidation; reduced wakefulness in bed.", evidence="A", research="CBT-I RCTs/meta-analyses; sleep restriction as key behavioral component.", risks="Daytime impairment, mood instability, mania risk in bipolar, seizure risk, accidents.", avoid="Anyone without clinician oversight; bipolar, epilepsy, safety-critical jobs until cleared.", sources="AASM/European insomnia guidelines; clinical CBT-I manuals.", creator="Spielman et al. (sleep restriction therapy).", tags="Generic", qnums="2")

II = dict(name="Implementation Intentions (If–Then Plans)", purpose="Automate desired response to a specific cue under stress/irregular schedules.", problem="Habit failure when willpower is depleted; missed recovery rituals.", typical="2–5 min to write; lifelong reuse", minimum="One precise if–then", steps=["Identify critical cue (e.g., 'When I close the laptop after 9pm…').","Specify exact action ('…I plug phone outside bedroom and start 5 cyclic sighs').","Rehearse once mentally; keep plan visible for 1 week."], when="Irregular schedules; travel; protecting sleep/boundaries.", short="Higher follow-through vs vague goals in many studies.", longer="Large evidence base for goal attainment (Gollwitzer).", mechanism="Cue–response links reduce deliberation under fatigue.", evidence="A", research="Gollwitzer meta-analyses on implementation intentions.", risks="Overly rigid plans that ignore safety; plan proliferation.", avoid="None major; keep plans few and specific.", sources="Gollwitzer implementation intention literature.", creator="Peter Gollwitzer.", tags="Generic|High-value|Lifestyle-specific", qnums="19,15")

WOOP = dict(name="WOOP (Mental Contrasting + Implementation Intentions)", purpose="Combine desired future with obstacle realism + if–then plan.", problem="Wishful goals that collapse under real obstacles (travel, deadlines).", typical="5–10 min", minimum="~5 min one cycle", steps=["Wish: name important feasible wish.","Outcome: best result if achieved.","Obstacle: main inner obstacle.","Plan: if [obstacle], then [action]."], when="Weekly planning; behavior change under high demand.", short="More realistic commitment; reduced pure fantasy.", longer="RCTs support mental contrasting + II for behavior change.", mechanism="Mental contrasting energizes goal pursuit when expectancy is sufficient; II automates obstacle response.", evidence="A", research="Oettingen mental contrasting / WOOP research program.", risks="Demotivation if wish is unrealistic — reframe wish.", avoid="None major.", sources="woopmylife.org educational materials; Oettingen publications.", creator="Gabriele Oettingen (mental contrasting); WOOP branding for public use.", tags="Generic|High-value", qnums="3,14,19")

AL = dict(name="Affect Labeling (Putting Feelings into Words)", purpose="Reduce amygdala reactivity by briefly naming emotion.", problem="Emotional flooding after hard calls/cases; unnamed arousal.", typical="30–90 s", minimum="One precise label aloud or written", steps=["Pause; notice body activation.","Name feeling specifically ('frustrated + anxious', not just 'bad').","Optional: one sentence cause without story spiral.","Return to next task or recovery protocol."], when="Post-conflict, post-bad-news, emotional residue.", short="Often slight downshift in intensity.", longer="fMRI/behavioral work supports labeling reducing emotional reactivity (Lieberman lineage).", mechanism="Prefrontal linguistic processing dampens limbic response.", evidence="B", research="Lieberman et al. affect labeling neuroimaging; related emotion-regulation literature.", risks="Rumination if labeling becomes lengthy analysis — keep brief.", avoid="Active trauma processing needs clinician — not DIY exposure.", sources="Affect labeling literature (Lieberman).", creator="Research program associated with Matthew Lieberman et al.", tags="Generic|Situation-specific|High-value", qnums="7,18")

SW = dict(name="Scheduled Worry / Postpone Worry", purpose="Contain rumination to a bounded slot to free focus and sleep onset.", problem="Work worry invading evenings/bed.", typical="10–15 min scheduled slot", minimum="5 min capture + postpone", steps=["When worry arises outside slot: jot 1 line, say 'I'll worry at 6:30pm'.","At slot: list worries 10–15 min; pick one actionable next step or park it.","Close notebook; do wind-down (light hygiene / breath)."], when="Evening rumination; sleep-onset worry.", short="Reduced intrusive worry for many when practiced consistently.", longer="Used in CBT for GAD/insomnia adjunct packages.", mechanism="Stimulus control for worry; reduces continuous monitoring.", evidence="B", research="Borkovec-style stimulus control for worry; CBT packages.", risks="Avoidance of needed action — always extract one actionable item when appropriate.", avoid="Acute crisis safety issues — do not postpone risk assessment.", sources="CBT worry-control literature.", creator="Popularized in CBT (Borkovec and successors).", tags="Generic|High-value|Situation-specific", qnums="12,1")

BA = dict(name="Tiny Behavioral Activation Step", purpose="Counter depletion/anhedonia with smallest valued action.", problem="Low motivation when burned out or post-setback.", typical="2–10 min action", minimum="2-minute start", steps=["Pick valued domain (body, social, mastery).","Shrink to ridiculous-small step (shoes on; send one text; open doc and write one sentence).","Do it without mood as prerequisite; notice completion."], when="Depleted mornings; post-rejection; depressive slide (non-crisis).", short="Slight activation; breaks inertia.", longer="Behavioral activation is A-tier for depression in clinical packages — here used as micro self-management, not therapy substitute.", mechanism="Action→reward loop; reduces avoidance.", evidence="A", research="Behavioral activation RCTs for depression (clinical); micro-BA adapted for self-management.", risks="Pushing through medical illness; masking need for care.", avoid="Severe depression/suicidality — seek care; don't use BA as sole treatment.", sources="Dimidjian/Martell BA literature (clinical context).", creator="Lewinsohn lineage; modern BA (Martell, Dimidjian et al.).", tags="Generic|High-value", qnums="11,14")

POMO = dict(name="Focused Work Block + Break (Pomodoro-style)", purpose="Protect deep work with timed focus + mandatory micro-recovery.", problem="Context switching, endless screens, attention fragmentation.", typical="25/5 or 50/10 min", minimum="One 25-min protected block", steps=["Define single outcome for the block.","Silence notifications; start timer.","On break: stand, look far, 3 cyclic sighs — no new inputs.","After 3–4 blocks, longer break."], when="Deep work days; coding; writing; analysis.", short="Better completion rate; less continuous strain.", longer="Timeboxing evidence mixed/package-level; useful as attention hygiene heuristic (C).", mechanism="Limits continuous cognitive load; reinforces detachment micro-breaks.", evidence="C", research="Cirillo Pomodoro method (popular); related attention-rest literature.", risks="Rigidity; interrupting flow states — adapt lengths.", avoid="None major.", sources="Cirillo Pomodoro method; attention restoration adjacent work.", creator="Francesco Cirillo (Pomodoro Technique branding).", tags="Generic|Situation-specific", qnums="5,6,16")

LIGHT = dict(name="Morning Outdoor Light Timing", purpose="Anchor circadian phase with morning outdoor light.", problem="Social jet lag, travel, shift-ish schedules, low morning alertness.", typical="10–30 min outdoor light within ~1 h of wake", minimum="~5–10 min bright outdoor light (longer if overcast)", steps=["Within ~60 min of wake, go outdoors without sunglasses if safe.","Face general outdoor brightness (not stare at sun).","Keep wake time relatively fixed."], when="Most days; especially after late nights or travel.", short="Often improved alertness; circadian cueing.", longer="Strong circadian science; light timing is A-tier for phase alignment.", mechanism="ipRGC→SCN photic resetting.", evidence="A", research="Chronobiology light literature; Czeisler/Wright et al. circadian work.", risks="UV exposure — use shade/hat as needed; never stare at sun.", avoid="Photosensitivity conditions — modify with clinician/ophthalmology advice.", sources="Circadian light-timing reviews.", creator="Foundational chronobiology (many labs); public protocols widely popularized.", tags="Generic|Lifestyle-specific|High-value", qnums="9,16,2")

CAFF = dict(name="Caffeine Timing Cutoff", purpose="Protect sleep by stopping caffeine with adequate half-life buffer.", problem="Late caffeine delaying sleep onset in knowledge workers.", typical="Cutoff ~8–10 h before target bedtime (individualize)", minimum="No caffeine after mid-afternoon for sensitive sleepers", steps=["Estimate bedtime; set cutoff ~8–10 h prior (or earlier if sensitive).","Switch to non-caffeinated rituals after cutoff.","Track sleep onset for 1 week; adjust."], when="Chronic delayed sleep onset; high coffee culture professions.", short="May improve sleep latency within days.", longer="Pharmacokinetic rationale strong; sleep hygiene component with good face validity (B).", mechanism="Adenosine receptor antagonism delaying sleep pressure signaling.", evidence="B", research="Caffeine + sleep literature; Drake et al. caffeine timing studies.", risks="Withdrawal headache if abrupt — taper.", avoid="None major; medical caffeine uses need clinician input.", sources="Sleep caffeine timing studies.", creator="N/A (pharmacology + sleep hygiene practice).", tags="Generic|Lifestyle-specific|High-value", qnums="1,9")

WIND = dict(name="Behavioral Wind-Down Routine", purpose="Create predictable pre-sleep sequence to reduce arousal.", problem="Hard stop from high-stimulation work to bed.", typical="30–60 min", minimum="15 min dim + offline sequence", steps=["Dim lights; warm color temperature.","Park work (notebook capture) — no new email.","Optional: PMR or coherent breathing 5–10 min.","Same sequence nightly when possible."], when="Most nights; critical after late client work.", short="Easier sleep onset for many.", longer="Sleep hygiene package component (C as standalone; stronger inside CBT-I).", mechanism="Stimulus control + reduced cognitive/physiological arousal.", evidence="C", research="Sleep hygiene reviews; CBT-I packages include wind-down elements.", risks="Perfectionism about routine — keep flexible when travel.", avoid="None major.", sources="CBT-I / sleep hygiene educational materials.", creator="Sleep medicine practice packages.", tags="Generic|Lifestyle-specific", qnums="1,10")

DET = dict(name="Psychological Detachment Boundary Ritual (Recovery Experience)", purpose="Mentally separate from work to enable recovery (Sonnentag).", problem="Always-on roles; blurred boundaries; poor evening recovery.", typical="5–15 min end-of-day ritual", minimum="3 min shutdown + device park", steps=["Write tomorrow's top 3; close loops on paper.","Explicit shutdown phrase ('Work is parked until X').","Park devices out of bedroom; change clothes/context.","Do one non-work mastery or relaxation activity."], when="End of day; after last client message; travel hotel arrival.", short="Reduced cognitive residue; better evening affect for many.", longer="Psychological detachment robustly linked to well-being in occupational recovery research (Sonnentag & Fritz).", mechanism="Recovery experience model: detachment, relaxation, mastery, control.", evidence="B", research="Sonnentag & Fritz 2007 recovery experiences; subsequent occupational health work.", risks="Guilt about detaching in always-on cultures — pair with team norms.", avoid="On-call safety roles need adapted 'partial detachment' plans.", sources="Sonnentag recovery literature; attorney recovery PMC11182056 citing framework.", creator="Sabine Sonnentag, Charlotte Fritz (recovery experiences framework).", tags="Generic|Profession-specific|High-value", qnums="15,18,20")

VAL = dict(name="Values Compass (Brief ACT/Values Clarification)", purpose="Reconnect action to chosen values under burnout cynicism.", problem="Depersonalization, meaning loss, values drift.", typical="5–10 min", minimum="3 min pick one valued action", steps=["Name 1–2 valued domains (craft, care, family, integrity).","Rate recent alignment 0–10.","Choose one tiny valued action today."], when="Burnout cynicism; ethical stress; weekly review.", short="Slight increase in purposefulness.", longer="ACT values work supported in packages; brief self-help is C.", mechanism="Values-consistent action reduces experiential avoidance.", evidence="C", research="ACT clinical literature (Hayes); brief values tools as derivatives.", risks="Should not replace therapy for clinical depression.", avoid="Acute crisis — seek care.", sources="ACT educational materials.", creator="Steven C. Hayes et al. (ACT); brief tools adapted widely.", tags="Generic|Profession-specific", qnums="3,20")

REAPP = dict(name="Cognitive Reappraisal", purpose="Change emotional impact by reframing meaning of a situation.", problem="Catastrophic interpretations of setbacks, evaluations, rejections.", typical="2–5 min", minimum="One alternative appraisal written", steps=["Name situation + automatic thought.","Generate 1–2 alternative appraisals that are realistic (not toxic positivity).","Choose action consistent with valued goal."], when="Post-rejection; negative feedback; evaluation anxiety.", short="Reduced intensity of negative emotion often.", longer="Gross process model; strong basic evidence (A for skill in lab/clinical packages).", mechanism="Prefrontal reinterpretation alters emotional trajectory.", evidence="A", research="James Gross emotion regulation process model; reappraisal meta-analyses.", risks="Forced positivity; invalidating real injustice — use realistic reframes.", avoid="Trauma processing without clinician.", sources="Gross emotion regulation literature.", creator="James J. Gross (process model popularization).", tags="Generic|High-value|Situation-specific", qnums="13,14")

SD = dict(name="Self-Distancing Reflection", purpose="Reflect on stressors from slightly distanced perspective to reduce immersion.", problem="Immersive rumination after conflicts/cases.", typical="3–8 min", minimum="2 min", steps=["Recall event briefly.","Rewrite using own name / 'you' (distanced language) OR imagine fly-on-wall view.","Ask: what advice to a colleague? Extract one lesson + one next step."], when="Post-mortem after conflict; evening residue.", short="Less emotional immersion; clearer takeaways.", longer="Kross/Ayduk self-distancing research program (B).", mechanism="Linguistic/psychological distance reduces emotional reactivity while preserving insight.", evidence="B", research="Kross & Ayduk self-distancing studies.", risks="Avoidance if used to never feel — balance with labeling.", avoid="Active trauma — clinical care.", sources="Self-distancing literature (Kross).", creator="Ethan Kross, Ozlem Ayduk et al.", tags="Generic|Situation-specific", qnums="12,18")

ART = dict(name="Brief Attention Restoration (Soft Fascination Break)", purpose="Restore directed attention via soft-fascination environments.", problem="Directed attention fatigue after deep cognitive work.", typical="5–20 min", minimum="5 min window/nature micro-break", steps=["Leave screen; look at sky/trees/distant view or quiet indoor plants.","No phone scroll.","Optional short walk without podcast."], when="Between deep blocks; afternoon crash.", short="Subjective mental refresh for many.", longer="Attention Restoration Theory (Kaplan); evidence mixed/moderate for nature micro-breaks (C).", mechanism="Soft fascination allows directed-attention networks to recover.", evidence="C", research="Kaplan ART; nature-break studies heterogeneous.", risks="None major.", avoid="None major.", sources="Kaplan Attention Restoration Theory literature.", creator="Rachel & Stephen Kaplan (ART).", tags="Generic", qnums="16,5")

SHARED = [CYCLIC, COHERENT, BOX, PMR, STIM, SRT, II, WOOP, AL, SW, BA, POMO, LIGHT, CAFF, WIND, DET, VAL, REAPP, SD, ART]



# -------------------- profession-specific extras --------------------

def lawyer_mindfulness():
    return proto(
        name="Lawyer-Adapted Brief Mindfulness Pause (Anxious Lawyer / Mindful Pause lineage)",
        purpose="Short daily mindfulness to reduce perceived stress and negative affect in legal practice.",
        problem="Lawyer stress, anxiety, negative mood, low resilience.",
        typical="Daily micro-practice within 30-day or 8-week programs",
        minimum="3–5 min mindful pause",
        steps=["Set a recurring cue (before email, after call).",
               "3–5 min: posture, breath awareness, non-judgmental notice of thoughts about case/client.",
               "Return to next billable task with one intentional priority.",
               "Prefer structured 30-day/8-week curriculum when available vs ad-hoc only."],
        when="Daily; high-conflict practice weeks.",
        short="Studies report reduced stress/negative affect in lawyer participants.",
        longer="Preliminary lawyer-specific evidence (C–B range): 8-week Anxious Lawyer pre-post; 30-day Mindful Pause with waitlist comparison showed benefits vs control on stress/affect.",
        mechanism="Attention training + decentering from legal threat appraisals.",
        evidence="C",
        research="Nielsen/Minda/Cho lawyer mindfulness studies; OSF preprints; APS poster 2019; Western University thesis work.",
        risks="Avoidance of needed legal action; shame if practice skipped.",
        avoid="Active trauma/PTSD from case exposure — trauma-informed clinician.",
        sources="https://doi.org/10.31234/osf.io/6zs5g ; https://doi.org/10.31234/osf.io/pxbyu",
        creator="Jeena Cho & Karen Gifford (Anxious Lawyer); Cho Mindful Pause adaptations; studied by Minda lab collaborators.",
        tags="Profession-specific|High-value",
        qnums="3,12,15",
    )

def lawyer_restructure():
    return proto(
        name="Cognitive Restructuring for Demand Appraisals (Lawyer-Relevant)",
        purpose="Challenge rigid demand beliefs that amplify strain under high workload.",
        problem="Catastrophic billable/perfection beliefs; reduced engagement under demand.",
        typical="5–10 min written restructure",
        minimum="One thought record",
        steps=["Write automatic thought ('If I miss this, I'm finished').",
               "Evidence for/against; generate balanced alternative.",
               "Define 'good enough filing' criteria aligned with ethics — not perfectionism."],
        when="High-demand weeks; after errors; performance reviews.",
        short="Reduced emotional intensity; clearer priorities.",
        longer="In Australian lawyer sample, cognitive restructuring correlated with satisfaction/engagement and buffered demands (correlational — not causal RCT).",
        mechanism="CBT cognitive mediation of stress appraisals.",
        evidence="C",
        research="Brough & Boase 2019 lawyer coping correlates; general CBT evidence stronger than lawyer-specific RCTs.",
        risks="Intellectualization without behavior change.",
        avoid="Clinical depression/anxiety — full CBT with clinician.",
        sources="Brough & Boase occupational papers; CBT thought-record methods.",
        creator="CBT lineage (Beck); applied occupational adaptations.",
        tags="Profession-specific|High-value|White-space",
        qnums="3,6,13",
    )

def surgical_breath():
    return proto(
        name="Pre-Performance Relaxing Breathing (4s in / 6s out) — Surgical Simulation Evidence",
        purpose="Reduce pre-performance stress and support performance under simulation stress.",
        problem="Acute OR/simulation stress impairing performance.",
        typical="5 minutes immediately pre-scenario",
        minimum="2–3 min paced relaxing breaths",
        steps=["After briefing, before starting: sit/stand quietly.",
               "Inhale ~4 s, exhale ~6 s, gentle, nasal if possible.",
               "Optional HRV biofeedback if available (trial found breathing alone sufficient vs +biofeedback).",
               "Enter procedure with one attentional cue word."],
        when="Pre-OR (when time allows), pre-simulation, pre-difficult airway practice.",
        short="Trial: higher overall simulation performance vs control; lower stress, higher relaxation.",
        longer="Supports short breathing as performance adjunct (C–B); generalize to live OR cautiously.",
        mechanism="Exhale-emphasized pacing reduces sympathetic arousal; frees attentional resources.",
        evidence="C",
        research="Schlatter et al. BMC Med Educ 2022 (anesthesiology residents, high-fidelity simulation RCT).",
        risks="Lightheadedness; delaying emergency care — never postpone critical intervention for ritual.",
        avoid="Unstable patient needing immediate action; severe respiratory disease.",
        sources="https://doi.org/10.1186/s12909-022-03420-9",
        creator="Studied by Schlatter et al.; technique is paced relaxing breathing (not proprietary).",
        tags="Profession-specific|Situation-specific|High-value",
        qnums="4,17",
    )

def surgical_msc():
    return proto(
        name="Surgical Mental Skills Curriculum Elements (Imagery + PPR + Refocus)",
        purpose="Improve skill transfer/retention and performance under stress via mental skills package.",
        problem="Performance decrement under OR stress; skill decay.",
        typical="Multi-session curriculum (e.g., 8×45 min historically) + brief daily use",
        minimum="3–5 min pre-case mental walkthrough + breath",
        steps=["Pre-performance routine: process goal, energy (breath), attention cue, imagery of key steps/contingencies.",
               "Brief PETTLEP-style imagery of critical portions.",
               "Refocus cue if interruption/error ('next stitch').",
               "Post-case: brief non-ruminative debrief."],
        when="Training blocks; complex cases; after near-miss.",
        short="MSC RCTs: better performance under stress / retention vs technical-only training in novices/residents.",
        longer="Profession-specific performance psychology with RCT support (B).",
        mechanism="Cognitive rehearsal + arousal regulation + attentional control under pressure.",
        evidence="B",
        research="Stefanidis / Anton / mental skills curriculum RCTs (surgical education); ACS RISE summaries; surgical cognitive simulation studies.",
        risks="Overconfidence; imagery replacing necessary technical reps.",
        avoid="Not a substitute for supervision/credentialing.",
        sources="https://pmc.ncbi.nlm.nih.gov/articles/PMC5303657/ ; ACS RISE mental skills article",
        creator="Surgical education mental skills research groups (e.g., Stefanidis and collaborators).",
        tags="Profession-specific|High-value|Situation-specific",
        qnums="4,5,13,18",
    )

def physician_coaching():
    return proto(
        name="Professional Coaching for Physician Burnout (Adjunct)",
        purpose="Reduce emotional exhaustion/depersonalization via structured coaching.",
        problem="Physician burnout dimensions (MBI).",
        typical="Multi-week coaching (>4 weeks often)",
        minimum="N/A micro; this is a program referral",
        steps=["Refer to qualified professional coach experienced with clinicians.",
               "Agree goals (boundaries, values, workload negotiation skills).",
               "Pair with org advocacy — coaching is adjunct."],
        when="Rising EE/DP scores; career inflection; post-leave return.",
        short="Meta-analytic signals for coaching on EE/DP in physicians (certainty limited).",
        longer="2025 evidence: coaching probably helpful for physicians; mindfulness effects mixed by role.",
        mechanism="Goal clarity, accountability, cognitive/behavioral change, relational support.",
        evidence="B",
        research="Individual-level HCP burnout intervention reviews 2025 (coaching vs mindfulness by role); MDPI Medicina meta of individual-focused interventions.",
        risks="Cost; blaming individual without system change.",
        avoid="Acute psychiatric emergency — clinical care first.",
        sources="https://pubmed.ncbi.nlm.nih.gov/41248499/ ; https://doi.org/10.3390/medicina62010039",
        creator="Various clinical coaching programs (not single inventor).",
        tags="Profession-specific|High-value",
        qnums="3,15,20",
    )

def dental_ergo():
    return proto(
        name="Participatory Ergonomics + Microbreak Protocol (Dental MSD)",
        purpose="Reduce work-related musculoskeletal disorders via ergonomics and scheduled microbreaks.",
        problem="Neck/back/shoulder/wrist pain in dentists.",
        typical="Ongoing workstation redesign + hourly microbreaks",
        minimum="20–60 s posture reset between patients",
        steps=["Audit chair height, patient position, magnification, instrument reach.",
               "Between patients: stand, scapular retraction, gentle neck ROM, wrist shakes (pain-free).",
               "Schedule stretch/strengthen per physio guidance.",
               "Prefer participatory ergonomics programs when clinic can implement."],
        when="All clinic days; flare weeks intensify microbreaks.",
        short="Reduced discomfort; some RCTs show MSD reductions over months.",
        longer="Cluster-RCT participatory ergonomics evidence for young dental professionals; physio posture RCTs.",
        mechanism="Load variation; reduced static muscle ischemia; better mechanical advantage.",
        evidence="B",
        research="Participatory ergonomics cluster-RCT (J Occup Health); physiotherapy ergonomics RCT PMC12188261; dental MSD systematic reviews.",
        risks="Stretching into pain; ignoring red-flag neuro symptoms.",
        avoid="Acute disc herniation / neuro deficit — medical care first.",
        sources="https://pmc.ncbi.nlm.nih.gov/articles/PMC12188261/",
        creator="Occupational ergonomics field; clinic-specific adaptations.",
        tags="Profession-specific|High-value|Lifestyle-specific",
        qnums="8,10,16",
    )

def dental_selfcomp():
    return proto(
        name="Self-Compassion Break (Dentist Burnout Adjunct — Preliminary)",
        purpose="Reduce self-criticism and burnout-related distress.",
        problem="Dentist burnout, anxiety, harsh self-judgment after imperfect outcomes.",
        typical="3–5 min after difficult case",
        minimum="1 min three phrases",
        steps=["Mindfulness: 'This is a moment of stress.'",
               "Common humanity: 'Other clinicians struggle too.'",
               "Kindness: place hand on chest; kind phrase to self."],
        when="After complication or aesthetic dissatisfaction; end of hard day.",
        short="May reduce self-criticism acutely.",
        longer="Controlled intervention signals in dentists preliminary (C); Neff self-compassion broader evidence stronger than dentist-specific.",
        mechanism="Reduces threat/shame physiology; increases caregiving-like response.",
        evidence="C",
        research="Dentist self-compassion controlled study (BMC Psychology); Neff self-compassion training literature.",
        risks="Not a substitute for competence remediation when skill gap real.",
        avoid="Severe depression — clinical care.",
        sources="https://doi.org/10.1186/s40359-026-04571-w ; Neff self-compassion resources",
        creator="Kristin Neff (self-compassion); applied in dental study adaptations.",
        tags="Profession-specific|White-space|High-value",
        qnums="3,14,13",
    )

def sales_rebt():
    return proto(
        name="REBT-Informed Irrational Belief Challenge (Sales Target Catastrophizing)",
        purpose="Reduce irrational 'end of the world' beliefs about missing targets and shorten negative-emotion persistence.",
        problem="Sales rejection/target misses triggering catastrophic beliefs and prolonged negative emotion.",
        typical="4-week online REBT-style program historically; 5–10 min micro challenge acutely",
        minimum="One belief challenge worksheet",
        steps=["Identify belief ('Missing target means I'm finished').",
               "Dispute: evidence, usefulness, alternative flexible belief.",
               "Replace with preferential (not demanding) belief; plan next controllable sales behavior.",
               "Prefer structured REBT coaching/program for multi-week change."],
        when="After lost deal; mid-quarter target panic; post-rejection call.",
        short="May reduce belief rigidity and negative-emotion persistence (trial signals).",
        longer="4-week online REBT in UK sales professionals reduced irrational beliefs and negative-emotion persistence; limited effects on sensitivity/intensity (Turner et al. 2024).",
        mechanism="REBT: dispute demanding/awfulizing beliefs → more flexible appraisals → less prolonged distress.",
        evidence="C",
        research="Turner et al., Stress & Health 2024; PubMed 38414157.",
        risks="Intellectualizing without behavior change; ignoring real pipeline issues.",
        avoid="Clinical depression/anxiety — clinician; not a substitute for sales skill coaching alone.",
        sources="https://pubmed.ncbi.nlm.nih.gov/38414157/",
        creator="REBT lineage (Ellis); applied in sales by Turner et al.",
        tags="Profession-specific|High-value|Situation-specific",
        qnums="14,13,12",
    )

def therapist_selfcare():
    return proto(
        name="Structured Clinician Self-Care + Supervision Boundary Protocol",
        purpose="Reduce burnout/compassion fatigue risk via scheduled self-care, supervision, and caseload boundaries.",
        problem="Psychotherapist burnout, secondary traumatic stress, compassion fatigue.",
        typical="Weekly supervision + daily micro self-care + caseload review",
        minimum="10 min post-session reset + weekly supervision check",
        steps=["After heavy session: 2–5 min affect label + cyclic sigh + brief walk before next client.",
               "Protect weekly supervision/consultation — non-negotiable.",
               "Weekly caseload review: acuity mix, trauma load, recovery gaps.",
               "Mindfulness/ACT self-care practices as adjunct (effects on burnout mixed)."],
        when="Trauma-heavy weeks; rising cynicism; after secondary trauma exposure.",
        short="Reduced residual arousal between sessions; earlier detection of overload.",
        longer="Reviews support mindfulness/ACT/self-compassion/supervision as promising; effects on burnout inconsistent; org factors essential. Compassion-fatigue interventions meta-analysis heterogeneous.",
        mechanism="Recovery + social support + decentering from client material; prevents allostatic overload.",
        evidence="C",
        research="Frontiers psychotherapist burnout review 2022; self-care lit review PMC7223989; vicarious trauma intervention scoping PMC8426417; compassion fatigue meta-analysis PMC11543797.",
        risks="Self-care framing that blames clinician without caseload reform.",
        avoid="Active impairment — fitness-for-practice / clinical care pathway.",
        sources="https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2022.928191/full ; https://pmc.ncbi.nlm.nih.gov/articles/PMC7223989/",
        creator="Profession norms + mindfulness/ACT adaptations; not a single inventor.",
        tags="Profession-specific|High-value|White-space",
        qnums="3,7,15,18",
    )

def coder_detachment_iCBT():
    return proto(
        name="Boundary + Detachment-Focused Recovery Training (iCBT-I Informed) — Blurred Work/Non-Work",
        purpose="Improve insomnia and recovery when work–non-work boundaries are blurred (common in software work).",
        problem="Always-on coding culture; insomnia; poor psychological detachment.",
        typical="6-module online recovery training (~45–60 min/module historically)",
        minimum="Daily boundary tactic + stimulus-control compatible sleep rules (clinician for restriction)",
        steps=["Define hard stop cue and notification rules.",
               "Practice psychological detachment ritual after last commit/Slack.",
               "Apply sleep hygiene + stimulus control; sleep restriction only via clinician.",
               "Cognitive methods for hyperarousal; scheduled worry for rumination about bugs/deploys."],
        when="Remote/hybrid always-on weeks; on-call rotations; insomnia with laptop-in-bed habit.",
        short="RCT signals: online recovery training improved insomnia outcomes in blurred-boundary workers.",
        longer="iCBT-I–informed recovery training with detachment focus effective in RCT (Bayesian analysis); insomnia reduction can mediate stress/exhaustion improvements.",
        mechanism="CBT-I elements + boundary tactics increase detachment and reduce hyperarousal.",
        evidence="B",
        research="BMJ Ment Health 2024 online recovery training RCT (blurred boundaries); workplace insomnia meta-analyses; insomnia as mediator in ICBT for chronic stress.",
        risks="DIY aggressive sleep restriction — route to clinician.",
        avoid="Bipolar/epilepsy without clinician; safety-critical on-call impairment.",
        sources="https://doi.org/10.1136/bmjment-2024-301016 ; https://pmc.ncbi.nlm.nih.gov/articles/PMC11033646/",
        creator="iCBT-I recovery training adaptations (teacher→general worker versions in literature).",
        tags="Profession-specific|Lifestyle-specific|High-value",
        qnums="1,2,15,12",
    )

def academic_mindfulness():
    return proto(
        name="Graduate/Researcher Mindfulness Program (8-week class adaptations)",
        purpose="Reduce stress and improve trait mindfulness/well-being in research trainees.",
        problem="Academic stress, emotional distress, burnout risk in graduate researchers.",
        typical="~8-week mindfulness program; online variants studied",
        minimum="10 min daily mindfulness practice during program weeks",
        steps=["Commit to structured program (not only random apps).",
               "Daily formal practice (breath/body) + informal mindful transitions between writing blocks.",
               "Pair with behavioral activation for writing (tiny BA step) and sleep rails.",
               "Multicomponent > mindfulness alone for burnout per student meta-analyses."],
        when="Thesis crunch; grant cycles; exam/defense prep.",
        short="RCTs: online mindfulness can improve trait mindfulness and some well-being indices in research postgrads (mixed on sleep).",
        longer="Student burnout meta-analyses: mindfulness and REBT among stronger interventions; multicomponent preferred.",
        mechanism="Attention training + decentering from evaluative threat; reduced rumination.",
        evidence="B",
        research="Online mindfulness RCT in research postgrads (BMC Psychol); engineering graduate mindfulness PMC10032494; student burnout meta-analysis 2023.",
        risks="Avoidance of needed academic action; shame if inconsistent.",
        avoid="Clinical depression/anxiety — clinician; not a thesis substitute.",
        sources="https://link.springer.com/article/10.1186/s40359-024-02233-3 ; https://pmc.ncbi.nlm.nih.gov/articles/PMC10032494/",
        creator="MBSR/MBCT adaptations for graduate populations; various research groups.",
        tags="Profession-specific|High-value",
        qnums="3,12,13",
    )

def journalist_trauma():
    return proto(
        name="Trauma-Informed Peer Support + Specialist Referral Pathway (Journalism)",
        purpose="Reduce secondary trauma/PTSD risk via trauma literacy, peer support, and specialist care access — not DIY exposure.",
        problem="Journalist PTSD, depression, moral injury, secondary trauma from conflict/crime coverage.",
        typical="Ongoing org + peer structures; therapy as needed",
        minimum="Post-assignment peer check-in + know referral path",
        steps=["After traumatic assignment: peer check-in (not forced CISD-style single-session debrief).",
               "Affect label + detachment ritual; protect sleep opportunity.",
               "Use trauma-informed education; access specialist trauma therapists when symptoms persist.",
               "Avoid alcohol as primary coping; escalate early."],
        when="After graphic/conflict assignments; cumulative exposure weeks; intrusive memories.",
        short="Peer support + early referral can contain acute distress; evidence for specific brief trainings mixed.",
        longer="Journalism trauma literature supports trauma-informed education, org/peer support, specialist therapy. Group debriefing alone not shown superior to leisure. Stimulus-discrimination training reduced intrusive memories in student samples (preliminary).",
        mechanism="Social support + trauma processing with specialists; reduces isolation and maladaptive coping.",
        evidence="C",
        research="VA PTSD Center journalists page; journalism trauma systematic reviews; JTSN white paper 2025; CISD limitations literature.",
        risks="Forced debriefing can harm; peer support is not therapy.",
        avoid="DIY trauma exposure; active PTSD — specialist care.",
        sources="https://www.ptsd.va.gov/professional/treat/care/journalists_ptsd.asp ; JTSN white papers",
        creator="Journalism trauma support networks + trauma therapy field.",
        tags="Profession-specific|High-value|White-space",
        qnums="3,7,12,18",
    )

def architect_msd_creative():
    return proto(
        name="Desk Ergonomics + Creative Block Micro-Recovery Stack",
        purpose="Address architect/designer MSD + creative fixation with ergonomics, microbreaks, and attention restoration.",
        problem="Long CAD/modeling sessions; neck/shoulder pain; creative block under deadline.",
        typical="Hourly microbreaks + end-of-day PMR + nature micro-break on block",
        minimum="60 s posture reset each hour",
        steps=["Set hourly timer: stand, scapular retraction, neck ROM pain-free.",
               "Audit monitor height, mouse reach, chair support.",
               "On creative block: 10–20 min soft-fascination break (no portfolio doomscroll).",
               "End of day: brief PMR + detachment ritual."],
        when="Deadline charrettes; long Revit/Rhino days; creative stuckness.",
        short="Reduced discomfort; subjective creative reset for many.",
        longer="Occupation-specific RCTs for architects are thin (white-space). Borrow dental/office ergonomics evidence (B) + ART micro-breaks (C).",
        mechanism="Load variation for MSD; soft fascination restores directed attention for creative problem-solving.",
        evidence="C",
        research="Office/dental ergonomics RCTs as analogs; Kaplan ART; architect burnout literature sparse vs need.",
        risks="Stretching into pain; ignoring neuro red flags.",
        avoid="Acute injury — medical/physio care.",
        sources="Occupational ergonomics reviews; Kaplan ART literature.",
        creator="Composite occupational ergonomics + ART adaptation (not a single inventor).",
        tags="Profession-specific|White-space|Lifestyle-specific|High-value",
        qnums="8,5,16,10",
    )

def consultant_travel_shutdown():
    return proto(
        name="Consulting Travel Shutdown + Hotel Stimulus-Control Bundle",
        purpose="Protect recovery and sleep on travel-heavy consulting weeks via detachment + stimulus control + light timing.",
        problem="Hotel insomnia, always-on Slack, travel sleep disruption, utilization anxiety.",
        typical="Nightly hotel ritual 15–30 min + morning light",
        minimum="3 min unpack if–then + device park",
        steps=["If–then: If I enter the hotel room, then unpack, shower, and 5 cyclic sighs before opening laptop.",
               "Apply stimulus-control rules (no deck in bed).",
               "Morning outdoor light toward local schedule.",
               "Friday ship: full detachment evening; no DIY sleep restriction."],
        when="Travel delivery weeks; Sunday scaries; hotel nights after late decks.",
        short="Better sleep opportunity; reduced cognitive residue.",
        longer="Consulting burnout papers emphasize job demands→burnout via WLB; POS buffers. Detachment/recovery evidence (B) + stimulus control (A) packaged for travel lifestyle.",
        mechanism="Boundary tactics + conditioning bed for sleep + circadian light cues.",
        evidence="B",
        research="Management consulting burnout theses/journal papers (job demands, WLB, POS); Sonnentag detachment; CBT-I stimulus control.",
        risks="DIY aggressive sleep restriction while traveling/driving fatigued.",
        avoid="Bipolar/epilepsy without clinician; never restrict sleep on heavy travel without clinician.",
        sources="Consulting burnout POS/WLB papers; Sonnentag recovery framework; AASM CBT-I summaries.",
        creator="Composite packaging of public protocols for consulting travel (not a single inventor).",
        tags="Profession-specific|Lifestyle-specific|High-value",
        qnums="9,1,15,19",
    )

def realestate_boundary():
    return proto(
        name="Client-Availability Boundary + Vacation Detachment Protocol (Real Estate)",
        purpose="Reduce always-on client pressure and protect recovery/vacation effects.",
        problem="Real estate agent burnout from 24/7 client texts; working during vacation undermines recovery.",
        typical="Weekly day off + coverage plan + transition ritual",
        minimum="Daily shutdown ritual + notification batching windows",
        steps=["Publish office hours + emergency-only path to clients.",
               "Batch notifications; if–then: If outside hours, then auto-reply and park phone.",
               "Weekly true day off with coverage.",
               "Vacation: work-free coverage; transition ritual on return (benefits fade if work continues)."],
        when="Open-house weekends; closing weeks; before/after vacation.",
        short="Reduced evening arousal; clearer recovery windows.",
        longer="Vacation research: work during vacation linked to worse recovery; detachment predicts well-being. Real-estate-specific RCTs thin (white-space) — package from occupational recovery science.",
        mechanism="Psychological detachment + recovery experiences; reduces continuous demand monitoring.",
        evidence="C",
        research="Vacation after-effects literature; physician vacation/work-during-vacation burnout associations as analog; Sonnentag detachment; trade press boundary guidance.",
        risks="Fear of lost deals — needs coverage system not willpower alone.",
        avoid="None major; depression/burnout impairing function → clinician.",
        sources="Vacation recovery research; Sonnentag framework; industry boundary guidance.",
        creator="Composite occupational recovery packaging for RE (not single inventor).",
        tags="Profession-specific|Lifestyle-specific|High-value|White-space",
        qnums="15,10,20,19",
    )



# -------------------- render helpers --------------------

def render_protocol(p, idx):
    steps = "\n".join(f"{i+1}. {s}" for i, s in enumerate(p["steps"]))
    return f"""### {idx}. {p['name']}

| Field | Content |
|------|---------|
| **Protocol name** | {p['name']} |
| **Primary purpose** | {p['purpose']} |
| **Problem targeted** | {p['problem']} |
| **Typical duration** | {p['typical']} |
| **Minimum useful duration** | {p['minimum']} |
| **When to use** | {p['when']} |
| **Short-term effect** | {p['short']} |
| **Longer-term effect** | {p['longer']} |
| **Mechanism** | {p['mechanism']} |
| **Evidence (A–E)** | **{p['evidence']}** |
| **Best supporting research** | {p['research']} |
| **Risks** | {p['risks']} |
| **Avoid / modify** | {p['avoid']} |
| **Sources** | {p['sources']} |
| **Creator / developer** | {p['creator']} |
| **Specificity tags** | `{p['tags']}` |
| **Maps to Q#** | {p['qnums']} |

**Step-by-step**
{steps}

---
"""

def q_coverage_table(protocols):
    rows = []
    for n, q in QUESTIONS:
        hits = []
        for p in protocols:
            nums = {x.strip() for x in str(p["qnums"]).split(",")}
            if str(n) in nums:
                hits.append(f"{p['name']} ({p['evidence']})")
        rows.append(f"| {n} | {q} | {'; '.join(hits[:5]) if hits else '_gap — see stack/escalate_'} |")
    return "\n".join(rows)

def write_client(slug, title, profile, protocols, moments, stack, distinctive):
    for sub in ["01_profiles","02_protocols_by_client","03_moments","04_stacks","05_matrix","06_synthesis","07_sources","00_universe"]:
        (ROOT/sub).mkdir(parents=True, exist_ok=True)

    stressors = "\n".join(f"- {s}" for s in profile["stressors"])
    constraints = "\n".join(f"- {c}" for c in profile["constraints"])
    hvm = "\n".join(f"- {m}" for m in profile["high_value_moments"])
    qtable = "\n".join(f"| {n} | {q} |" for n,q in QUESTIONS)

    prof = f"""# Profile — {title}

{DISCLAIMER}

**Slug:** `{slug}`  
**Cluster:** B — Professional Services / Clinical / Knowledge / Field  
**Compiled:** 2026-09-19 IST

## Who
{profile['who']}

## Dominant stressors
{stressors}

## Constraints (protocol design)
{constraints}

## Safety / contraindications notes
{profile['contraindications']}

## High-value moments
{hvm}

## Literature notes (population-specific)
{profile['literature_notes']}

## Distinctive finding
{distinctive}

## Shared 20 lifestyle / problem questions
| # | Question |
|---|----------|
{qtable}
"""
    (ROOT/"01_profiles"/f"{slug}.md").write_text(prof)

    ev = {}
    for p in protocols:
        ev[p["evidence"]] = ev.get(p["evidence"], 0) + 1
    evs = ", ".join(f"{k}:{v}" for k,v in sorted(ev.items()))
    body = "\n".join(render_protocol(p, i+1) for i,p in enumerate(protocols))
    index = "\n".join(f"- {i+1}. {p['name']} — **{p['evidence']}** — `{p['tags']}` — Q{p['qnums']}" for i,p in enumerate(protocols))
    prot = f"""# Protocols by client — {title}

{DISCLAIMER}

**Slug:** `{slug}`  
**Protocol count:** {len(protocols)}  
**Evidence mix:** {evs}  
**Rule:** Never mix clients. Base science also in `../../01_MASTER_DATABASE.md`.

## Index
{index}

## Question coverage
| # | Question | Protocols |
|---|----------|-----------|
{q_coverage_table(protocols)}

---

## Full records

{body}
"""
    (ROOT/"02_protocols_by_client"/f"{slug}.md").write_text(prot)

    mrows = "\n".join(f"| {a} | {b} |" for a,b in moments)
    mom = f"""# Moments — {title}

{DISCLAIMER}

**Slug:** `{slug}_moments`

## Trigger → protocol map

| Moment / trigger | Protocol sequence |
|------------------|-------------------|
{mrows}

## Question → primary protocols
| # | Question | Primary protocols |
|---|----------|-------------------|
{q_coverage_table(protocols)}

## Escalation
{stack.get('escalate','Seek clinician/EAP if impairing symptoms; address structural workload when burnout is organizational.')}
"""
    (ROOT/"03_moments"/f"{slug}_moments.md").write_text(mom)

    def bullets(key):
        items = stack.get(key, [])
        if isinstance(items, str):
            return items
        return "\n".join(f"- {x}" for x in items)

    stk = f"""# Stack — {title}

{DISCLAIMER}

**Slug:** `{slug}_stack`  
**Design principle:** Few high-ROI rails > many optional rituals. Prefer A/B evidence for defaults; label C/D honestly.

## Daily rails
{bullets('daily')}

## High-demand overlays
{bullets('high_demand')}
"""
    for k in stack:
        if k in ("daily","high_demand","escalate","weekly"):
            continue
        stk += f"\n### {k.replace('_',' ').title()}\n{bullets(k)}\n"
    stk += f"""
## Weekly
{bullets('weekly')}

## Escalate
{stack.get('escalate','Clinician/EAP for impairing symptoms; organizational workload conversation when burnout is structural.')}
"""
    (ROOT/"04_stacks"/f"{slug}_stack.md").write_text(stk)
    return len(protocols)

# -------------------- clients --------------------
CLIENTS = []

def add(slug, title, profile, extras, moments, stack, distinctive, shared_keys=None):
    # shared_keys: indices into SHARED to include; default all
    if shared_keys is None:
        protocols = [deepcopy(p) for p in SHARED]
    else:
        protocols = [deepcopy(SHARED[i]) for i in shared_keys]
    protocols.extend(extras)
    CLIENTS.append(dict(slug=slug, title=title, profile=profile, protocols=protocols,
                        moments=moments, stack=stack, distinctive=distinctive))

# Use a slightly reduced shared set for length + all 20 Q coverage
CORE_IDX = list(range(len(SHARED)))  # all 20 shared

add(
    "management_consultants", "Management Consultants",
    profile=dict(
        who="Strategy/operations consultants (MBB-style, Big 4 advisory, boutique); travel-heavy delivery roles.",
        stressors=["Utilization / billability pressure","Sunday scaries & late decks","Travel + hotel sleep disruption","Always-on Slack across time zones","Ambiguous up-or-out evaluation","Job demands → burnout mediated by work–life balance; POS buffers"],
        constraints=["Irregular sleep windows","Hotel rooms","Public composure required","Limited recovery control on client site"],
        contraindications="Travel + sleep debt: no aggressive DIY sleep restriction. Avoid hyperventilation if flying same day fatigued.",
        high_value_moments=["Pre-steering committee","Post-client challenge meeting","Hotel arrival reset","Friday detachment","Staffing change recovery"],
        literature_notes="Consulting samples: job demands predict burnout; WLB mediates; perceived organizational support and resilience buffer (2024–2025 theses/journal papers). Org support + workload reduction > apps alone.",
    ),
    extras=[consultant_travel_shutdown()],
    moments=[
        ("Sunday scaries / staffing email", "Scheduled worry 15m → detachment ritual → wind-down; no deck in bed"),
        ("Pre-steering committee (T-15)", "Cyclic sigh 3× or box 2 min → one-sentence objective → enter"),
        ("Post-hostile client challenge", "Affect label → self-distancing 5m → attention-rest walk"),
        ("Hotel arrival after travel", "Travel shutdown bundle; morning light next day; stimulus-control rules"),
        ("Deck all-nighter risk", "If–then caffeine cutoff; ship MVP + sleep; escalate staffing next day"),
        ("Utilization anxiety spike", "WOOP on controllables; values compass; avoid rumination spiral"),
        ("Friday ship", "Detachment ritual; social recovery; devices parked"),
        ("Timezone shift week", "Light timing + fixed wake; no DIY sleep restriction"),
    ],
    stack=dict(
        daily=["Morning outdoor light 10–20m","One protected deep block (Pomodoro-style)","End-of-day detachment 5–10m","Caffeine cutoff"],
        high_demand=["Pre-meeting cyclic sigh","Micro attention-rest between workshops","Scheduled worry instead of bed rumination"],
        travel=["Hotel stimulus-control rules","Light timing for TZ","If–then unpack ritual","No aggressive sleep restriction"],
        weekly=["WOOP Sunday 10m","One full detachment evening","Values check if cynicism rising"],
        escalate="Persistent insomnia, panic, depression, or burnout impairing function → clinician / EAP; org workload conversation required.",
    ),
    distinctive="Consulting literature emphasizes **organizational support + workload/WLB** over apps; detachment rituals and travel sleep hygiene are highest-ROI individual layers. White-space: consulting-specific brief protocols validated in MBB samples remain scarce.",
)

add(
    "lawyers", "Lawyers / Attorneys",
    profile=dict(
        who="Associates, partners, in-house counsel; litigation and transactional.",
        stressors=["Billable hour culture","Adversarial emotional load","Perfectionism / zero-error norms","Elevated substance-use risk in profession surveys","Poor psychological detachment (too stressed to de-stress)","Court/deposition performance"],
        constraints=["Confidentiality","Erratic court schedules","Evening document review"],
        contraindications="High depression/substance risk — screen; don't position breathwork as treatment for clinical depression. Sleep restriction clinician-only.",
        high_value_moments=["Pre-hearing","Post-deposition","Discovery dump evenings","Partner feedback","Billable guilt at shutdown"],
        literature_notes="Cho/Gifford Anxious Lawyer 8-week and Mindful Pause 30-day programs: reduced stress/negative affect in lawyer samples. Krill et al. substance use prevalence. Attorney recovery study: detachment hard when hyper-aroused; cognitive restructuring linked to better attitudes (correlational).",
    ),
    extras=[lawyer_mindfulness(), lawyer_restructure()],
    moments=[
        ("Pre-hearing / deposition T-10", "Box or cyclic sigh; one objective sentence; enter"),
        ("Hostile email at 10pm", "Do not reply; scheduled worry capture; detachment"),
        ("Adverse ruling", "Affect label → reappraisal → colleague consult → self-distancing journal"),
        ("Billable guilt at shutdown", "If–then detachment; values: sustainable craft beats martyrdom"),
        ("Discovery dump weekend", "Pomodoro-style blocks + caffeine cutoff + stimulus control at night"),
        ("Substance-use urge after stress", "Escalate to LAP/clinician — not self-help breath only"),
    ],
    stack=dict(
        daily=["Mindful pause 3–5m","Caffeine cutoff","Shutdown detachment","Optional coherent breathing 10m"],
        high_demand=["Pre-court breath","Post-court affect label + walk","No case review in bed"],
        litigation=["Pre-hearing PPR breath","Post-hearing label + distancing","Scheduled worry for case rumination"],
        weekly=["WOOP on hours boundaries","Values compass if cynicism","Social recovery block"],
        escalate="Depression, SI, substance misuse → Lawyer Assistance Program / clinician immediately.",
    ),
    distinctive="Lawyer-specific mindfulness curricula (Anxious Lawyer / Mindful Pause) are a rare **profession-specific** evidence pocket. Detachment is hard when hyper-aroused — pair boundary rituals with cognitive skills. White-space: large preregistered RCTs still limited.",
)

add(
    "physicians_surgeons", "Physicians & Surgeons",
    profile=dict(
        who="Attendings, residents, surgeons; procedural and non-procedural.",
        stressors=["Clinical load + documentation","Moral injury / adverse events","On-call sleep","Malpractice threat","OR performance under scrutiny","Burnout prevalence high; individual interventions only small–moderate effects"],
        constraints=["Scrubbed hands/time","Infection control","Pager interruptions","Sleep debt"],
        contraindications="Never DIY sleep restriction on call. Hyperventilation/cold extremes unsafe around procedures. Coaching/mindfulness adjuncts ≠ staffing reform.",
        high_value_moments=["Pre-incision","Post-adverse event","Between OR cases","Post-call recovery","Difficult family meeting"],
        literature_notes="2025 meta-analyses: individual interventions SMD ~−0.32 on burnout; coaching may outperform mindfulness for physicians in some analyses; structural change still primary. Surgical MSC RCTs: mental skills improve performance under stress. Relaxing breathing 5 min pre-simulation improved performance (~7–8%).",
    ),
    extras=[surgical_breath(), surgical_msc(), physician_coaching()],
    moments=[
        ("Pre-incision / pre-induction (time allows)", "4/6 relaxing breath 2–5m + process imagery of critical steps"),
        ("Intraoperative error / interruption", "Refocus cue ('next action'); not rumination"),
        ("Post-adverse event (after patient safe)", "Affect label; structured M&M prep; peer/coach; clinician mental health if needed"),
        ("Post-call arrival home", "Detachment ritual; light as appropriate; no DIY sleep restriction"),
        ("Difficult goals-of-care meeting", "Pre: cyclic sigh; post: label + brief walk + document then detach"),
        ("Burnout rising (EE)", "Coaching referral + org workload conversation; mindfulness adjunct only"),
    ],
    stack=dict(
        daily=["Light when off-cycle allows","One detachment boundary off-duty","Micro breath between cases if feasible"],
        high_demand=["Pre-case mental skills PPR","Relaxing breath when time","Post-list brief non-rumination debrief"],
        or_day=["Pre-case MSC elements","4/6 breath if time","Refocus cues under stress"],
        post_call=["Protect sleep opportunity","Stimulus control compatible rest","No major decisions if impaired"],
        weekly=["Values compass","Social recovery","Coaching session if enrolled"],
        escalate="Depression, PTSD after events, SI, substance → physician health program / psychiatry. Burnout needs system + individual.",
    ),
    distinctive="Strongest **profession-specific performance** evidence among clusters (surgical MSC; pre-sim breathing). Burnout: individual effects small–moderate; **coaching** signal for physicians; label honestly vs org reform. White-space: live OR RCTs of ultra-brief breath still limited.",
)

add(
    "dentists", "Dentists",
    profile=dict(
        who="General dentists, specialists; private practice and clinic.",
        stressors=["Precision under time pressure","Patient anxiety contagion","Neck/back/shoulder MSD endemic","Business + clinical dual role","Perfectionism on aesthetics"],
        constraints=["Operatory ergonomics","Gloved/brief breaks","Standing/sitting static postures"],
        contraindications="MSD: avoid aggressive tensing on injured tissues. Burnout self-compassion studies small.",
        high_value_moments=["Between patients","Post-difficult extraction","End of clinic day posture reset","Pre-aesthetic reveal"],
        literature_notes="Ergonomics/participatory ergonomics RCTs reduce MSD. Physiotherapy posture programs help. Self-compassion intervention preliminary for dentist burnout.",
    ),
    extras=[dental_ergo(), dental_selfcomp()],
    moments=[
        ("Between patients", "Posture microbreak 30–60s; optional 1 cyclic sigh"),
        ("Patient panic contagion", "Own breath first (cyclic sigh); then patient-facing calm"),
        ("End of clinic MSD flare", "Brief PMR pain-free + physio exercises; ergonomics audit"),
        ("Imperfect aesthetic outcome", "Self-compassion break → factual plan → detachment"),
        ("Business stress evening", "Scheduled worry + shutdown"),
    ],
    stack=dict(
        daily=["Ergonomics + microbreaks","Caffeine cutoff","Detachment","Optional coherent breathing"],
        high_demand=["Between-patient posture resets","Pre-hard-procedure box/cyclic sigh"],
        clinic=["Microbreaks every patient","End-day PMR","Self-compassion after hard cases"],
        weekly=["Physio/strengthen session","Values/business boundaries WOOP"],
        escalate="Persistent pain/neuro symptoms → physician/physio; burnout depression → clinician.",
    ),
    distinctive="Dentists: **MSD/ergonomics** is the distinctive high-evidence profession layer. Self-compassion for burnout is promising white-space. Performance anxiety shares generic breath tools.",
)

add(
    "psychologists_therapists", "Psychologists / Therapists",
    profile=dict(
        who="Clinical/counseling psychologists, psychotherapists, counselors; private practice and agency.",
        stressors=["Empathy load / compassion fatigue","Secondary traumatic stress","Caseload acuity mix","Boundary erosion with clients","Isolation in private practice","Burnout + STS overlap"],
        constraints=["Session back-to-backs","Confidentiality limits peer venting","Ethical dual-role vigilance"],
        contraindications="Self-care protocols are adjuncts — not treatment for clinician impairment. Trauma processing of own material needs personal therapy.",
        high_value_moments=["Between heavy sessions","After trauma narrative exposure","End-of-day caseload residue","Supervision gaps","Client suicide-risk weeks"],
        literature_notes="Reviews: mindfulness/ACT/self-compassion/supervision promising; burnout effects inconsistent; org factors essential. Vicarious trauma intervention evidence limited/heterogeneous. Compassion-fatigue meta-analysis heterogeneous.",
    ),
    extras=[therapist_selfcare()],
    moments=[
        ("Between heavy sessions", "Affect label 60s + cyclic sigh + stand/walk before next client"),
        ("After trauma narrative", "Grounding optional + detachment micro-ritual; supervision note"),
        ("Rising cynicism", "Values compass + caseload review + supervision escalate"),
        ("Isolation in private practice", "Peer consultation block; micro social check-in"),
        ("Sleep onset with client residue", "Scheduled worry for clinical rumination; stimulus control; no notes in bed"),
    ],
    stack=dict(
        daily=["Post-heavy-session reset","Caffeine cutoff","Detachment ritual","Optional coherent breathing"],
        high_demand=["Between-session micro-reset","Affect label","Protect supervision"],
        trauma_week=["Peer check-in","Reduce acuity if possible","Personal therapy if STS rising"],
        weekly=["Supervision/consultation","Caseload acuity review","Values compass","Social recovery"],
        escalate="Impairment, STS/PTSD symptoms, depression → personal clinician + fitness-for-practice pathway. Caseload reform required.",
    ),
    distinctive="Therapists need **between-session residue management + supervision boundaries** more than more meditation apps. Evidence for self-care is promising but mixed; white-space: brief between-session RCTs.",
)

add(
    "software_engineers", "Software Engineers",
    profile=dict(
        who="IC engineers, tech leads, SREs; remote/hybrid and on-site.",
        stressors=["Always-on Slack/PagerDuty","Context switching","Deploy anxiety","Blurred work–non-work boundaries","Sitting/MSD","Imposter in review culture"],
        constraints=["Deep work needs vs meetings","On-call rotations","Screen-heavy evenings"],
        contraindications="DIY aggressive sleep restriction unsafe with on-call driving/ops. Hyperventilation near water never.",
        high_value_moments=["Pre-deploy","Post-incident","On-call night","PR review rejection","Deep work protect"],
        literature_notes="Online recovery training with detachment + iCBT-I elements improved insomnia in blurred-boundary workers (RCT). Workplace insomnia interventions (mostly CBT-I) moderate effects. Insomnia reduction can mediate stress/exhaustion improvements.",
    ),
    extras=[coder_detachment_iCBT()],
    moments=[
        ("Pre-deploy anxiety", "Box or cyclic sigh; process checklist imagery; one if–then rollback cue"),
        ("Post-incident", "Affect label → written timeline → detachment; no blame spiral alone"),
        ("On-call quiet window", "If–then: if quiet 20m then dim light + rest compatible with stimulus control — not doomscroll"),
        ("PR rejection", "Reappraisal + tiny BA (one next commit) + optional distancing"),
        ("Deep work day", "Pomodoro-style blocks + attention-rest breaks + caffeine cutoff"),
        ("Laptop-in-bed insomnia", "Stimulus control; boundary recovery training; clinician for restriction"),
    ],
    stack=dict(
        daily=["Morning light","One protected deep block","Notification boundaries","Caffeine cutoff","Detachment ritual"],
        high_demand=["Pre-deploy breath","Post-incident label","Micro attention-rest between meetings"],
        on_call=["Partial detachment plan","Stimulus-control compatible rest","No DIY sleep restriction"],
        weekly=["WOOP on focus boundaries","MSD mobility","Social recovery away from screens"],
        escalate="Insomnia disorder, panic, depression, burnout → clinician; on-call policy redesign with manager.",
    ),
    distinctive="Highest-ROI profession layer is **boundary/detachment + insomnia rails** (iCBT-I–informed recovery training evidence). White-space: engineer-only RCTs still limited; borrow blurred-boundary worker trials.",
)

add(
    "academics_researchers", "Academics / Researchers",
    profile=dict(
        who="PhD students, postdocs, faculty researchers; grant- and publication-driven.",
        stressors=["Publish-or-perish evaluative threat","Advisor/committee dynamics","Funding uncertainty","Isolation in writing","Imposter syndrome","Teaching + research load"],
        constraints=["Irregular writing schedules","Conference travel","Low structure for early career"],
        contraindications="Mindfulness is adjunct not depression treatment. Sleep restriction clinician-only during thesis crunch.",
        high_value_moments=["Pre-defense","Grant rejection","Writing block day","Conference talk","Reviewer R&R spiral"],
        literature_notes="Online mindfulness RCT in research postgrads; engineering graduate mindfulness studies; student burnout meta-analysis favors mindfulness and REBT; multicomponent > single-skill.",
    ),
    extras=[academic_mindfulness()],
    moments=[
        ("Pre-defense / talk T-15", "Box/cyclic sigh + process imagery of first 60s"),
        ("Grant/paper rejection", "Affect label → reappraisal → tiny BA (one next action) → peer support"),
        ("Writing block", "Pomodoro-style + attention-rest; if–then open doc"),
        ("Rumination about advisor", "Scheduled worry slot; values compass; supervision/mentor consult"),
        ("Conference jet lag", "Light timing; caffeine cutoff; stimulus control in hotel"),
    ],
    stack=dict(
        daily=["Morning light","Writing block (Pomodoro-style)","Caffeine cutoff","Detachment","Optional mindfulness 10m"],
        high_demand=["Pre-talk breath","Post-rejection label+BA","Scheduled worry for evaluative rumination"],
        thesis_crunch=["Protect sleep rails","Tiny BA daily","Peer writing group","No DIY sleep restriction"],
        weekly=["WOOP on writing goals","Mindfulness program session if enrolled","Social recovery"],
        escalate="Depression, panic, burnout → university counseling / clinician; advisor conflict may need ombuds.",
    ),
    distinctive="Academics: **evaluative threat + writing isolation** dominate. Structured mindfulness programs have better evidence than random apps; pair with BA for writing. White-space: faculty-specific (not only student) RCTs.",
)

add(
    "sales_professionals", "Sales Professionals",
    profile=dict(
        who="B2B/B2C sales, AEs, SDRs, account managers; quota-driven.",
        stressors=["Rejection frequency","Quota anxiety","Commission volatility","Emotional labor with prospects","Travel/road warriors","End-of-quarter crunch"],
        constraints=["Call blocks","CRM evening work","Public energy required"],
        contraindications="REBT skills are not treatment for clinical depression after chronic rejection. Sleep restriction clinician-only.",
        high_value_moments=["After lost deal","Pre-discovery call","Pre-pitch","End-of-month quota panic","Post-win comedown"],
        literature_notes="Turner et al. 2024: 4-week online REBT for UK sales pros reduced irrational beliefs and negative-emotion persistence. Sales resilience linked to calling effort after setbacks (correlational). Digital resilience training RCTs in general workers.",
    ),
    extras=[sales_rebt()],
    moments=[
        ("After lost deal / rejection", "Affect label → REBT belief challenge → tiny BA (one next dial) → reappraisal"),
        ("Pre-pitch T-10", "Cyclic sigh or box; process imagery opening; if–then blank recovery"),
        ("End-of-quarter panic", "WOOP on controllables; scheduled worry; protect sleep rails"),
        ("Post-win comedown", "Detachment; avoid alcohol as only reward; social recovery"),
        ("Road travel week", "Light timing; hotel stimulus control; caffeine cutoff"),
    ],
    stack=dict(
        daily=["Morning light","Pre-call breath micro","Caffeine cutoff","Detachment","Optional coherent breathing"],
        high_demand=["Rejection recovery sequence","Pre-pitch PPR","Scheduled worry for quota rumination"],
        quarter_end=["WOOP controllables","Protect sleep","Tiny BA daily pipeline actions"],
        weekly=["REBT worksheet on recurring beliefs","Values compass","Social recovery"],
        escalate="Depression, SI, substance misuse after chronic rejection → clinician; manager coaching for skill vs mindset.",
    ),
    distinctive="Sales: **rejection recovery + irrational target beliefs** are the distinctive layer (REBT trial). Pair with BA to keep pipeline behavior moving. White-space: larger preregistered sales RCTs.",
)

add(
    "real_estate_professionals", "Real Estate Professionals",
    profile=dict(
        who="Residential/commercial agents, brokers; commission + always-on client access.",
        stressors=["24/7 client texts","Deal uncertainty","Weekend open houses","Emotional labor with buyers/sellers","Income volatility","Working during 'vacation'"],
        constraints=["Irregular hours","Car/time between showings","Family boundary conflict"],
        contraindications="Boundary systems need coverage — not willpower alone. Sleep restriction clinician-only.",
        high_value_moments=["Before open house","After deal collapse","Closing day","Client 11pm text urge","Pre/post vacation"],
        literature_notes="RE-specific RCTs thin. Borrow vacation recovery science (work during vacation undermines recovery) + detachment research + boundary trade guidance.",
    ),
    extras=[realestate_boundary()],
    moments=[
        ("11pm client text urge", "If–then: auto-reply + park phone; scheduled worry tomorrow"),
        ("Deal collapse", "Affect label → reappraisal → tiny BA (one next lead action)"),
        ("Open house morning", "Morning light; cyclic sigh; caffeine plan; posture microbreaks"),
        ("Closing day residue", "Detachment ritual; social recovery; no CRM in bed"),
        ("Vacation risk", "Coverage plan; work-free rule; transition ritual on return"),
    ],
    stack=dict(
        daily=["Published availability windows","Morning light","Caffeine cutoff","Detachment ritual"],
        high_demand=["Pre-open-house breath","Post-collapse rejection sequence","Notification batching"],
        weekend=["One protected recovery block","Microbreaks between showings","No laptop-in-bed"],
        weekly=["True day off with coverage","WOOP on boundaries","Social/family recovery"],
        escalate="Burnout, depression, insomnia → clinician; redesign coverage with broker/team.",
    ),
    distinctive="Real estate: **always-on availability** is the core lifestyle pathology. Highest-ROI is boundary/coverage systems + detachment; occupation-specific trials are white-space.",
)

add(
    "journalists_media", "Journalists / Media",
    profile=dict(
        who="Reporters, editors, broadcast journalists; conflict, crime, and deadline news.",
        stressors=["Trauma exposure / secondary trauma","Deadline arousal","Public scrutiny","Moral injury","Irregular breaking-news schedules","Newsroom culture barriers to help-seeking"],
        constraints=["Field conditions","Night desks","Cannot 'unsee' graphic material easily"],
        contraindications="No DIY trauma exposure. Forced single-session debriefing not recommended as default. PTSD → specialist care.",
        high_value_moments=["After graphic assignment","Before live hit","Deadline crunch night","Online harassment spike","Return from conflict zone"],
        literature_notes="Journalism trauma literature: PTSD/depression/burnout/moral injury risks. Supports trauma-informed education, org/peer support, specialist therapists. Mindfulness promising but journalism-specific efficacy limited. CISD alone not superior to leisure.",
    ),
    extras=[journalist_trauma()],
    moments=[
        ("After graphic assignment", "Peer check-in; affect label; protect sleep; referral path if intrusive memories persist"),
        ("Pre-live hit T-10", "Box/cyclic sigh; process cue for first line"),
        ("Deadline night", "Pomodoro-style bursts; caffeine cutoff; wind-down even if short"),
        ("Online harassment", "Affect label; boundary ritual; escalate safety/legal as needed — not only breath"),
        ("Return from conflict zone", "Gradual re-entry; specialist screening; no alcohol-as-primary-coping"),
    ],
    stack=dict(
        daily=["Light when schedule allows","Caffeine cutoff","Detachment","Optional coherent breathing"],
        high_demand=["Pre-live breath","Post-assignment peer check-in","Scheduled worry for story rumination"],
        trauma_assignment=["Peer support","Sleep protection","Specialist referral if symptoms persist","Avoid forced CISD-only"],
        weekly=["Peer support block","Values compass","Social recovery offline"],
        escalate="PTSD, depression, SI, substance → specialist trauma clinician / EAP. Org duty of care essential.",
    ),
    distinctive="Journalists: **trauma-informed pathways** beat generic wellness. Distinctive protocol is peer support + specialist referral, not more breathwork alone. White-space: strong journalism-specific intervention RCTs still scarce.",
)

add(
    "architects_designers", "Architects / Designers",
    profile=dict(
        who="Architects, interior/product designers; studio and freelance.",
        stressors=["Deadline charrettes","Creative block under client revision cycles","CAD/sitting MSD","Perfectionism on aesthetics","Fee pressure / scope creep","Critique vulnerability"],
        constraints=["Long screen sessions","Client meeting performance","Site visit irregularity"],
        contraindications="MSD: pain-free mobility only. Sleep restriction clinician-only during charrette.",
        high_value_moments=["Before client critique","After harsh revision round","Charrette all-nighter risk","Creative block","Site visit travel day"],
        literature_notes="Architect-specific intervention RCTs sparse (white-space). Borrow office/dental ergonomics evidence + ART for creative attention + generic performance anxiety tools.",
    ),
    extras=[architect_msd_creative()],
    moments=[
        ("Before client critique", "Cyclic sigh/box; process imagery of first explanation; if–then for blank"),
        ("Harsh revision round", "Affect label → reappraisal → tiny BA (one next design move)"),
        ("Creative block", "Attention-restoration break 10–20m; then Pomodoro-style restart"),
        ("Charrette night risk", "Caffeine cutoff; ship good-enough milestone; stimulus control; no DIY sleep restriction"),
        ("Long CAD day MSD", "Hourly microbreaks; end-day PMR; ergonomics audit"),
    ],
    stack=dict(
        daily=["Morning light","Hourly posture microbreaks","One deep design block","Caffeine cutoff","Detachment"],
        high_demand=["Pre-critique breath","Post-critique label+reappraisal","Attention-rest on block"],
        charrette=["Protect sleep rails","Tiny BA daily","Microbreaks despite deadline theater"],
        weekly=["Physio/mobility","WOOP on scope boundaries","Social/creative recovery away from screens"],
        escalate="Persistent pain → physio/physician; depression/burnout → clinician; studio culture/workload conversation.",
    ),
    distinctive="Architects/designers: distinctive stack is **MSD microbreaks + creative attention restoration**; occupation-specific trials are white-space — honest label + borrow adjacent evidence.",
)

# -------------------- matrix + main --------------------

def write_matrix(clients):
    path = ROOT/"05_matrix"/"MATRIX_PROFESSIONALS.csv"
    fields = ["slug","title","protocol_count","evidence_A","evidence_B","evidence_C","evidence_D","evidence_E",
              "profession_specific_count","high_value_count","white_space_count","distinctive_one_liner",
              "q_coverage_count"]
    rows = []
    for c in clients:
        ev = {k:0 for k in "ABCDE"}
        prof_n = hv_n = ws_n = 0
        covered = set()
        for p in c["protocols"]:
            ev[p["evidence"]] = ev.get(p["evidence"], 0) + 1
            tags = p["tags"]
            if "Profession-specific" in tags: prof_n += 1
            if "High-value" in tags: hv_n += 1
            if "White-space" in tags or "White-space" in tags: ws_n += 1
            if "White-space" in tags: pass
            if "White-space" in tags or "White-space" in tags:
                ws_n = ws_n  # noop fix below
            for x in str(p["qnums"]).split(","):
                covered.add(x.strip())
        # recount white-space properly
        ws_n = sum(1 for p in c["protocols"] if "White-space" in p["tags"] or "White-space" in p["tags"])
        ws_n = sum(1 for p in c["protocols"] if "White-space" in p["tags"])
        rows.append({
            "slug": c["slug"],
            "title": c["title"],
            "protocol_count": len(c["protocols"]),
            "evidence_A": ev.get("A",0),
            "evidence_B": ev.get("B",0),
            "evidence_C": ev.get("C",0),
            "evidence_D": ev.get("D",0),
            "evidence_E": ev.get("E",0),
            "profession_specific_count": sum(1 for p in c["protocols"] if "Profession-specific" in p["tags"]),
            "high_value_count": sum(1 for p in c["protocols"] if "High-value" in p["tags"]),
            "white_space_count": sum(1 for p in c["protocols"] if "White-space" in p["tags"]),
            "distinctive_one_liner": c["distinctive"][:180].replace("\n"," "),
            "q_coverage_count": len(covered),
        })
    with path.open("w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=fields)
        w.writeheader(); w.writerows(rows)
    return path

def write_synthesis(clients, counts):
    lines = ["# Cluster B Synthesis — Professionals\n", DISCLAIMER, "\n"]
    lines.append(f"**Clients:** {len(clients)}  \n**Total protocol records written:** {sum(counts.values())}  \n**Compiled:** 2026-09-19 IST\n")
    lines.append("\n## Distinctive findings by client\n")
    for c in clients:
        lines.append(f"- **{c['title']}** (`{c['slug']}`): {c['distinctive']} _(n={counts[c['slug']]} protocols)_\n")
    lines.append("\n## Cross-cutting patterns\n")
    lines.append("1. **A/B defaults travel well:** cyclic sighing, coherent breathing, stimulus control (clinician-framed), light timing, implementation intentions, reappraisal, detachment.\n")
    lines.append("2. **Profession-specific pockets are uneven:** strongest in surgery (MSC), law (mindfulness curricula), dentistry (ergonomics), sales (REBT), physicians (coaching meta-signals).\n")
    lines.append("3. **White-space:** consulting-validated micro-protocols; architect RCTs; journalism intervention RCTs; real-estate boundary trials; therapist between-session micro-RCTs.\n")
    lines.append("4. **Burnout honesty:** individual skills are complementary; org workload/culture reforms dominate causal pathway — especially medicine and consulting.\n")
    lines.append("5. **Safety:** CBT-I restriction never auto-prescribed; trauma pathways for journalists/therapists; substance escalation for law.\n")
    (ROOT/"06_synthesis"/"CLUSTER_B_SYNTHESIS.md").write_text("".join(lines))

def write_sources():
    text = f"""# Cluster B Sources (selected)

{DISCLAIMER}

## Cross-cutting
- Yilmaz Balban et al., Cell Rep Med 2023 — cyclic sighing RCT (PubMed 36630953)
- Lehrer & Gevirtz, Front Psychol 2014 — HRVB/resonance breathing
- Sonnentag & Fritz recovery experiences framework
- Gollwitzer implementation intentions; Oettingen WOOP
- Gross emotion regulation / reappraisal; Lieberman affect labeling; Kross self-distancing
- CBT-I / AASM guidance — stimulus control & sleep restriction (clinician-guided)

## Profession-specific highlights
- Physicians: burnout individual-intervention metas 2025 (SMD ~−0.32); coaching vs mindfulness by role; Schlatter 2022 pre-sim breathing; Stefanidis MSC surgical RCTs
- Lawyers: Cho/Gifford Anxious Lawyer; Mindful Pause waitlist comparison; attorney recovery PMC11182056; Brough & Boase coping correlates
- Dentists: participatory ergonomics / physio posture RCTs; self-compassion preliminary
- Software: blurred-boundary online recovery training RCT (BMJ Ment Health 2024); workplace insomnia metas
- Academics: research postgraduate mindfulness RCT; student burnout meta-analysis
- Sales: Turner et al. 2024 REBT for sales irrational beliefs
- Journalists: VA PTSD journalists page; trauma support network white papers; CISD limitations
- Consulting: job demands/WLB/POS burnout papers
- Real estate / architects: sparse occupation RCTs — borrow recovery/ergonomics/ART with white-space labels
"""
    (ROOT/"07_sources"/"CLUSTER_B_SOURCES.md").write_text(text)

def main():
    counts = {}
    for c in CLIENTS:
        n = write_client(c["slug"], c["title"], c["profile"], c["protocols"], c["moments"], c["stack"], c["distinctive"])
        counts[c["slug"]] = n
        print(f"wrote {c['slug']}: {n} protocols")
    mpath = write_matrix(CLIENTS)
    write_synthesis(CLIENTS, counts)
    write_sources()
    print("matrix", mpath)
    print("TOTAL", sum(counts.values()), "across", len(CLIENTS), "clients")

if __name__ == "__main__":
    main()
