# Test cases (PIE)

**Count:** 110. Ambiguous marked with **AMBIGUOUS**.

Fields: CLIENT · STATE · CONTEXT · GOAL · CONSTRAINTS · DATA · CANDIDATES · EXCLUDED · SELECTED · REASON · MESSAGE · EXPECTED · MEASURE · FOLLOW-UP.

> Ranking rationale is an **engineering heuristic**, not a validated clinical instrument.

### TC001

| Field | Value |
|-------|-------|
| CLIENT | startup_founder |
| STATE | stress=4 energy=3 |
| CONTEXT | desk private; pitch in 25m; gap=360s |
| GOAL | pre_performance |
| CONSTRAINTS | — |
| DATA | calendar high-stakes; self-report |
| CANDIDATES | process-visualization, ppr, cyclic-sighing |
| EXCLUDED | yoga-nidra-nsdr, woop |
| SELECTED | **process-visualization** |
| REASON | need+timing; duration fits |
| MESSAGE | Pitch in 25 min. 5 min process imagery — first 60s of your open only. |
| EXPECTED | starts imagery |
| MEASURE | completion+rating@30m |
| FOLLOW-UP | T-10 sigh offer |

### TC002

| Field | Value |
|-------|-------|
| CLIENT | startup_founder |
| STATE | stress=4 |
| CONTEXT | hallway; pitch in 8m; gap=60s |
| GOAL | micro_reset |
| CONSTRAINTS | public_discrete |
| DATA | calendar |
| CANDIDATES | physiological-sigh-acute, tactical-breath-reset, affect-labeling |
| EXCLUDED | body-scan, pettlep |
| SELECTED | **physiological-sigh-acute** |
| REASON | only micro fits gap; public ok |
| MESSAGE | 8 min out. Three physiological sighs. |
| EXPECTED | 3 sighs done |
| MEASURE | tap complete |
| FOLLOW-UP | none |

### TC003

| Field | Value |
|-------|-------|
| CLIENT | startup_founder |
| STATE | shame high stress=4 |
| CONTEXT | private office post-reject; gap=900s |
| GOAL | emotion_regulate |
| CONSTRAINTS | avoid forced gratitude |
| DATA | self-report |
| CANDIDATES | act-defusion, affect-labeling, behavioral-activation-tiny, gratitude-brief |
| EXCLUDED | gratitude-brief |
| SELECTED | **act-defusion** |
| REASON | post_rejection; gratitude mismatch |
| MESSAGE | Name the thought then one tiny next action. |
| EXPECTED | defusion+tiny BA |
| MEASURE | rating+mood |
| FOLLOW-UP | BA check 2h |

### TC004

| Field | Value |
|-------|-------|
| CLIENT | startup_founder |
| STATE | rumination |
| CONTEXT | 01:10 home in bed |
| GOAL | sleep_prep |
| CONSTRAINTS | no dashboards |
| DATA | time-of-night estimated |
| CANDIDATES | stimulus-control, worry-postpone, wind-down |
| EXCLUDED | aerobic-exercise-stress |
| SELECTED | **stimulus-control** |
| REASON | bed≠sleep educational |
| MESSAGE | If not sleepy, leave bed dim. Park one worry for morning slot. |
| EXPECTED | leaves bed or postpone note |
| MEASURE | sleep onset self-report AM |
| FOLLOW-UP | AM check |

### TC005

| Field | Value |
|-------|-------|
| CLIENT | startup_ceo |
| STATE | stress=3 |
| CONTEXT | board in 40m; private; gap=720s |
| GOAL | pre_performance |
| CONSTRAINTS | — |
| DATA | calendar |
| CANDIDATES | box-breathing, coherent-resonance, ppr |
| EXCLUDED | cyclic-hyperventilation-caution |
| SELECTED | **box-breathing** |
| REASON | private; exec ritual |
| MESSAGE | Board in 40. 4 minutes box breathing — shorten holds if uncomfortable. |
| EXPECTED | completes 4m |
| MEASURE | rating |
| FOLLOW-UP | T-5 micro |

### TC006 **AMBIGUOUS**

| Field | Value |
|-------|-------|
| CLIENT | startup_founder |
| STATE | dread |
| CONTEXT | Sunday afternoon runway scare |
| GOAL | rumination |
| CONSTRAINTS | don't over-intervene |
| DATA | self-report |
| CANDIDATES | worry-postpone, art-brief, values-compass, behavioral-activation-tiny |
| EXCLUDED | — |
| SELECTED | **art-brief** |
| REASON | low urgency chronic; nature before deep cognitive |
| MESSAGE | Optional: 15 min soft-fascination walk. Worry slot at 17:00. |
| EXPECTED | may accept or silence |
| MEASURE | ignore vs complete |
| FOLLOW-UP | 17:00 postpone |

### TC007

| Field | Value |
|-------|-------|
| CLIENT | startup_founder |
| STATE | moral_load |
| CONTEXT | hiring/firing day evening |
| GOAL | emotion_regulate |
| CONSTRAINTS | — |
| DATA | calendar+self-report |
| CANDIDATES | values-compass, affect-labeling, social-connection-micro |
| EXCLUDED | — |
| SELECTED | **values-compass** |
| REASON | CPI hiring/firing moment |
| MESSAGE | Before email: 10 min values compass — one action that fits. |
| EXPECTED | values+action |
| MEASURE | rating |
| FOLLOW-UP | next day |

### TC008

| Field | Value |
|-------|-------|
| CLIENT | startup_founder |
| STATE | stress=5 |
| CONTEXT | co-founder conflict aftermath; private |
| GOAL | emotion_regulate |
| CONSTRAINTS | — |
| DATA | self-report |
| CANDIDATES | affect-labeling, cognitive-reappraisal, exhale-emphasized |
| EXCLUDED | cold-face |
| SELECTED | **affect-labeling** |
| REASON | label then reappraisal sequence |
| MESSAGE | Label precisely then one reappraisal sentence. |
| EXPECTED | label done |
| MEASURE | affect self-report |
| FOLLOW-UP | reappraisal prompt |

### TC009

| Field | Value |
|-------|-------|
| CLIENT | startup_founder |
| STATE | energy=2 |
| CONTEXT | demo day morning |
| GOAL | pre_performance |
| CONSTRAINTS | — |
| DATA | calendar |
| CANDIDATES | ppr, process-visualization, tactical-breath-reset |
| EXCLUDED | yoga-nidra-nsdr |
| SELECTED | **ppr** |
| REASON | performance ritual |
| MESSAGE | Demo Day: 90-sec PPR — same cue sequence. |
| EXPECTED | PPR complete |
| MEASURE | subjective readiness |
| FOLLOW-UP | post-demo SILENCE |

### TC010

| Field | Value |
|-------|-------|
| CLIENT | startup_founder |
| STATE | wired |
| CONTEXT | launch week 23:30 |
| GOAL | sleep_prep |
| CONSTRAINTS | — |
| DATA | self-report |
| CANDIDATES | worry-postpone, wind-down, pmr, 478-breathing |
| EXCLUDED | cyclic-hyperventilation-caution |
| SELECTED | **worry-postpone** |
| REASON | rumination primary |
| MESSAGE | Park launch worries into tomorrow 10-min slot. Then dim wind-down. |
| EXPECTED | note+wind-down |
| MEASURE | sleep diary |
| FOLLOW-UP | AM |

### TC011

| Field | Value |
|-------|-------|
| CLIENT | corporate_ceo |
| STATE | cog_load high |
| CONTEXT | 3 meetings done; 3m gap |
| GOAL | cognitive_reset |
| CONSTRAINTS | — |
| DATA | calendar density |
| CANDIDATES | task-switch-buffer, physiological-sigh-acute, exhale-emphasized |
| EXCLUDED | woop |
| SELECTED | **task-switch-buffer** |
| REASON | meeting streak moment |
| MESSAGE | Three stacked. 90 sec buffer — then one long exhale. |
| EXPECTED | buffer used |
| MEASURE | complete |
| FOLLOW-UP | none |

### TC012

| Field | Value |
|-------|-------|
| CLIENT | corporate_ceo |
| STATE | ok |
| CONTEXT | in_meeting |
| GOAL | any |
| CONSTRAINTS | push channel |
| DATA | activity=in_meeting |
| CANDIDATES | — |
| EXCLUDED | ALL |
| SELECTED | **SILENCE** |
| REASON | receptivity/activity gate |
| MESSAGE | (none) |
| EXPECTED | no push |
| MEASURE | no notification |
| FOLLOW-UP | post-meeting soft |

### TC013

| Field | Value |
|-------|-------|
| CLIENT | senior_executive |
| STATE | orthosomnia_flag |
| CONTEXT | evening checking ring repeatedly |
| GOAL | sleep_prep |
| CONSTRAINTS | reduce wearable nags |
| DATA | behavior pattern |
| CANDIDATES | wind-down |
| EXCLUDED | wearable_readiness_push |
| SELECTED | **SILENCE** |
| REASON | orthosomnia safety |
| MESSAGE | (staff: wind-down offline; mute readiness) |
| EXPECTED | fewer pushes |
| MEASURE | push count |
| FOLLOW-UP | policy |

### TC014

| Field | Value |
|-------|-------|
| CLIENT | corporate_ceo |
| STATE | stress=3 |
| CONTEXT | post-earnings corridor public |
| GOAL | stress_acute |
| CONSTRAINTS | public_discrete |
| DATA | calendar |
| CANDIDATES | physiological-sigh-acute, affect-labeling |
| EXCLUDED | pmr, yoga-nidra-nsdr |
| SELECTED | **physiological-sigh-acute** |
| REASON | public micro |
| MESSAGE | 60 sec: three quiet sighs before the car. |
| EXPECTED | done |
| MEASURE | tap |
| FOLLOW-UP | none |

### TC015

| Field | Value |
|-------|-------|
| CLIENT | venture_capitalists_pe |
| STATE | fatigue |
| CONTEXT | partner meeting T-20 |
| GOAL | pre_performance |
| CONSTRAINTS | — |
| DATA | calendar |
| CANDIDATES | tactical-breath-reset, box-breathing, affect-labeling |
| EXCLUDED | — |
| SELECTED | **tactical-breath-reset** |
| REASON | short+perform |
| MESSAGE | 20 min to partners. 2 min tactical breath reset. |
| EXPECTED | reset |
| MEASURE | rating |
| FOLLOW-UP | none |

### TC016

| Field | Value |
|-------|-------|
| CLIENT | frequent_international_traveler |
| STATE | tz+8 landed |
| CONTEXT | destination morning hotel |
| GOAL | jetlag |
| CONSTRAINTS | — |
| DATA | flight itinerary measured |
| CANDIDATES | morning-light, jetlag-light-melatonin, caffeine-cutoff |
| EXCLUDED | — |
| SELECTED | **morning-light** |
| REASON | A-grade zeitgeber primary |
| MESSAGE | Local morning: 15–20 min outdoor light before more caffeine. |
| EXPECTED | light exposure |
| MEASURE | self-report + next sleep |
| FOLLOW-UP | evening hygiene |

### TC017 **AMBIGUOUS**

| Field | Value |
|-------|-------|
| CLIENT | frequent_international_traveler |
| STATE | crash |
| CONTEXT | 16:00 hotel post-landing |
| GOAL | recovery_rest |
| CONSTRAINTS | — |
| DATA | hours_since_landing=6 |
| CANDIDATES | nap-protocol, yoga-nidra-nsdr |
| EXCLUDED | — |
| SELECTED | **nap-protocol** |
| REASON | if <20m opportunity else NSDR |
| MESSAGE | 20 min nap max — alarm. Or 15 min NSDR if not sleepy (not sleep replacement). |
| EXPECTED | nap or NSDR |
| MEASURE | alertness |
| FOLLOW-UP | evening |

### TC018

| Field | Value |
|-------|-------|
| CLIENT | private_jet_uhnw_traveler |
| STATE | asks 10mg melatonin |
| CONTEXT | staff console |
| GOAL | jetlag |
| CONSTRAINTS | no mega-dose DIY |
| DATA | user request |
| CANDIDATES | jetlag-light-melatonin |
| EXCLUDED | auto_melatonin_10mg |
| SELECTED | **staff_education** |
| REASON | clinician_guided; light-first |
| MESSAGE | Staff: light timing plan; melatonin only low-dose timed if appropriate — not 10mg DIY. |
| EXPECTED | no auto mega-dose |
| MEASURE | staff acceptance |
| FOLLOW-UP | clinician if needed |

### TC019

| Field | Value |
|-------|-------|
| CLIENT | frequent_international_traveler |
| STATE | evening dest |
| CONTEXT | landed evening |
| GOAL | circadian_align |
| CONSTRAINTS | — |
| DATA | local evening |
| CANDIDATES | evening-light-hygiene, wind-down |
| EXCLUDED | morning-light |
| SELECTED | **evening-light-hygiene** |
| REASON | wrong time for morning light |
| MESSAGE | Dim and warm last 2 hours. Protect sleep opportunity. |
| EXPECTED | dimming |
| MEASURE | sleep timing |
| FOLLOW-UP | AM light |

### TC020

| Field | Value |
|-------|-------|
| CLIENT | digital_nomad |
| STATE | sleep_h=5.5 |
| CONTEXT | cafe morning |
| GOAL | sleep_debt |
| CONSTRAINTS | — |
| DATA | wearable duration measured |
| CANDIDATES | morning-light, caffeine-cutoff |
| EXCLUDED | sleep-restriction |
| SELECTED | **morning-light** |
| REASON | duration known; protect day |
| MESSAGE | Short night logged. Morning light + lighter load if you can. |
| EXPECTED | light+load |
| MEASURE | subjective energy |
| FOLLOW-UP | tonight wind-down |

### TC021

| Field | Value |
|-------|-------|
| CLIENT | professional_athlete |
| STATE | arousal high |
| CONTEXT | locker T-10 |
| GOAL | pre_performance |
| CONSTRAINTS | — |
| DATA | schedule |
| CANDIDATES | ppr, centering-ravizza, tactical-breath-reset |
| EXCLUDED | body-scan |
| SELECTED | **ppr** |
| REASON | trained ritual preferred |
| MESSAGE | Your PPR — 60–90 sec. Same cues. |
| EXPECTED | PPR |
| MEASURE | coach observe |
| FOLLOW-UP | post |

### TC022

| Field | Value |
|-------|-------|
| CLIENT | olympic_elite_athletes |
| STATE | requests imagery |
| CONTEXT | private 12m |
| GOAL | skill_rehearsal |
| CONSTRAINTS | — |
| DATA | user pull |
| CANDIDATES | pettlep, process-visualization |
| EXCLUDED | — |
| SELECTED | **pettlep** |
| REASON | user pull+time; B evidence |
| MESSAGE | 12 min PETTLEP — environment details, successful process. |
| EXPECTED | imagery block |
| MEASURE | rating |
| FOLLOW-UP | physical training |

### TC023

| Field | Value |
|-------|-------|
| CLIENT | team_sport_athletes |
| STATE | shame post-loss |
| CONTEXT | private |
| GOAL | rumination |
| CONSTRAINTS | — |
| DATA | self-report |
| CANDIDATES | self-distancing, affect-labeling, behavioral-activation-tiny |
| EXCLUDED | — |
| SELECTED | **self-distancing** |
| REASON | post-loss rumination |
| MESSAGE | 5–8 min third-person writeup — then one recovery action. |
| EXPECTED | write |
| MEASURE | rating |
| FOLLOW-UP | BA |

### TC024

| Field | Value |
|-------|-------|
| CLIENT | actors_performing_artists |
| STATE | pre-curtain |
| CONTEXT | green room |
| GOAL | pre_performance |
| CONSTRAINTS | — |
| DATA | calendar show |
| CANDIDATES | centering-ravizza, ppr, physiological-sigh-acute |
| EXCLUDED | — |
| SELECTED | **centering-ravizza** |
| REASON | performer centering |
| MESSAGE | Curtain soon: breath + focal cue — 60 sec. |
| EXPECTED | centered |
| MEASURE | self ready |
| FOLLOW-UP | none |

### TC025

| Field | Value |
|-------|-------|
| CLIENT | musicians_dancers |
| STATE | asks hyperventilation energy |
| CONTEXT | private |
| GOAL | activation_up |
| CONSTRAINTS | safety screen |
| DATA | user request |
| CANDIDATES | cyclic-sighing, cyclic-hyperventilation-caution |
| EXCLUDED | cyclic-hyperventilation-caution |
| SELECTED | **cyclic-sighing** |
| REASON | prefer safer; caution not automation_ok |
| MESSAGE | Prefer cyclic sighing. Hyperventilation needs screening — not default. |
| EXPECTED | sigh practice |
| MEASURE | rating |
| FOLLOW-UP | none |

### TC026

| Field | Value |
|-------|-------|
| CLIENT | management_consultants |
| STATE | stress=4 |
| CONTEXT | client challenge T-15 |
| GOAL | stress_acute |
| CONSTRAINTS | — |
| DATA | calendar |
| CANDIDATES | physiological-sigh-acute, cognitive-reappraisal, box-breathing |
| EXCLUDED | — |
| SELECTED | **physiological-sigh-acute** |
| REASON | time pressure |
| MESSAGE | 15 min. Three sighs + one reappraisal line. |
| EXPECTED | micro+reappraisal |
| MEASURE | complete |
| FOLLOW-UP | none |

### TC027

| Field | Value |
|-------|-------|
| CLIENT | investment_bankers_ma |
| STATE | all_nighter_risk |
| CONTEXT | 22:00 office |
| GOAL | sleep_hygiene |
| CONSTRAINTS | — |
| DATA | calendar late work |
| CANDIDATES | caffeine-cutoff, wind-down, sleep-consistency |
| EXCLUDED | sleep-restriction |
| SELECTED | **caffeine-cutoff** |
| REASON | actionable policy now |
| MESSAGE | No more caffeine. Protect a wind-down even if short. |
| EXPECTED | stops caffeine |
| MEASURE | sleep timing |
| FOLLOW-UP | AM |

### TC028

| Field | Value |
|-------|-------|
| CLIENT | lawyers |
| STATE | anger |
| CONTEXT | urge to send blast email |
| GOAL | emotion_regulate |
| CONSTRAINTS | — |
| DATA | self-report |
| CANDIDATES | affect-labeling, if-then-gollwitzer, opposite-action |
| EXCLUDED | — |
| SELECTED | **if-then-gollwitzer** |
| REASON | behavior delay send |
| MESSAGE | If urge to send angry email → wait 30 min + label feeling first. |
| EXPECTED | email delayed |
| MEASURE | send timestamp |
| FOLLOW-UP | 30m |

### TC029 **AMBIGUOUS**

| Field | Value |
|-------|-------|
| CLIENT | software_engineers |
| STATE | flow |
| CONTEXT | deep work 90m declared |
| GOAL | focus |
| CONSTRAINTS | do not interrupt |
| DATA | user intent |
| CANDIDATES | pomodoro-ultradian |
| EXCLUDED | — |
| SELECTED | **SILENCE** |
| REASON | flow protection; low push urgency |
| MESSAGE | (none) |
| EXPECTED | no interrupt |
| MEASURE | no push |
| FOLLOW-UP | user pull only |

### TC030

| Field | Value |
|-------|-------|
| CLIENT | software_engineers |
| STATE | context switch overload |
| CONTEXT | desk gap 4m |
| GOAL | cognitive_reset |
| CONSTRAINTS | — |
| DATA | meeting_streak=4 |
| CANDIDATES | task-switch-buffer, art-brief, exhale-emphasized |
| EXCLUDED | — |
| SELECTED | **task-switch-buffer** |
| REASON | streak+gap |
| MESSAGE | Four switches. 2 min buffer — write open loop, then exhale. |
| EXPECTED | buffer |
| MEASURE | complete |
| FOLLOW-UP | none |

### TC031

| Field | Value |
|-------|-------|
| CLIENT | physicians_surgeons |
| STATE | sleep_h=4.2 post-call |
| CONTEXT | clinic AM |
| GOAL | sleep_debt |
| CONSTRAINTS | high_risk_occupation |
| DATA | wearable duration |
| CANDIDATES | morning-light |
| EXCLUDED | stim_performance_hack, cyclic-hyperventilation-caution |
| SELECTED | **morning-light** |
| REASON | protect not hack |
| MESSAGE | Short sleep post-call. Morning light + reduce nonessential load — not a stim protocol. |
| EXPECTED | light+load |
| MEASURE | fatigue self-report |
| FOLLOW-UP | sleep opportunity |

### TC032

| Field | Value |
|-------|-------|
| CLIENT | physicians_surgeons |
| STATE | crisis_language in note |
| CONTEXT | app journal |
| GOAL | safety |
| CONSTRAINTS | — |
| DATA | NLP crisis flag |
| CANDIDATES | — |
| EXCLUDED | ALL_PROTOCOLS |
| SELECTED | **ESCALATE** |
| REASON | safety layer |
| MESSAGE | Crisis resources + consented human path. |
| EXPECTED | escalation shown |
| MEASURE | escalation ack |
| FOLLOW-UP | human |

### TC033

| Field | Value |
|-------|-------|
| CLIENT | hospital_executives |
| STATE | compassion_fatigue |
| CONTEXT | evening home |
| GOAL | recovery_rest |
| CONSTRAINTS | — |
| DATA | self-report |
| CANDIDATES | yoga-nidra-nsdr, values-compass, social-connection-micro |
| EXCLUDED | — |
| SELECTED | **yoga-nidra-nsdr** |
| REASON | recovery; NSDR honesty |
| MESSAGE | 15–20 min NSDR for deep rest — adjunct, not sleep replacement. |
| EXPECTED | NSDR |
| MEASURE | rating energy |
| FOLLOW-UP | none |

### TC034

| Field | Value |
|-------|-------|
| CLIENT | sleep_recovery_seekers |
| STATE | onset insomnia |
| CONTEXT | bed 00:30 not sleepy |
| GOAL | insomnia_behavior |
| CONSTRAINTS | no bipolar flags |
| DATA | self-report |
| CANDIDATES | stimulus-control, worry-postpone, wind-down |
| EXCLUDED | sleep-restriction |
| SELECTED | **stimulus-control** |
| REASON | A-grade educational |
| MESSAGE | Leave bed for dim quiet activity until sleepy. Same wake time tomorrow. |
| EXPECTED | leave bed |
| MEASURE | diary |
| FOLLOW-UP | clinician if persists |

### TC035

| Field | Value |
|-------|-------|
| CLIENT | sleep_recovery_seekers |
| STATE | requests sleep restriction DIY |
| CONTEXT | app |
| GOAL | insomnia_behavior |
| CONSTRAINTS | — |
| DATA | user request |
| CANDIDATES | sleep-restriction |
| EXCLUDED | sleep-restriction_autodosage |
| SELECTED | **clinician_referral** |
| REASON | clinician_only |
| MESSAGE | Sleep restriction is clinician-guided CBT-I. Education + referral only — not DIY titration. |
| EXPECTED | no auto titration steps |
| MEASURE | referral click |
| FOLLOW-UP | clinician |

### TC036

| Field | Value |
|-------|-------|
| CLIENT | sleep_recovery_seekers |
| STATE | wants NSDR to replace sleep |
| CONTEXT | home |
| GOAL | recovery_rest |
| CONSTRAINTS | — |
| DATA | user belief |
| CANDIDATES | yoga-nidra-nsdr |
| EXCLUDED | — |
| SELECTED | **yoga-nidra-nsdr** |
| REASON | adjunct with honesty |
| MESSAGE | NSDR can rest the system — it does not replace physiological sleep. Protect tonight's sleep opportunity. |
| EXPECTED | understands caveat |
| MEASURE | ack + completion |
| FOLLOW-UP | sleep hygiene |

### TC037

| Field | Value |
|-------|-------|
| CLIENT | burnout_seekers |
| STATE | mood=2 energy=2 |
| CONTEXT | home afternoon not crisis |
| GOAL | mood_low |
| CONSTRAINTS | — |
| DATA | self-report |
| CANDIDATES | behavioral-activation-tiny, aerobic-exercise-stress, social-connection-micro |
| EXCLUDED | — |
| SELECTED | **behavioral-activation-tiny** |
| REASON | A-grade BA smallest step |
| MESSAGE | 2–5 min: smallest valued action. |
| EXPECTED | tiny action |
| MEASURE | complete+mood |
| FOLLOW-UP | 1h |

### TC038

| Field | Value |
|-------|-------|
| CLIENT | executive_parents |
| STATE | pregnant |
| CONTEXT | wants 4-7-8 |
| GOAL | sleep_prep |
| CONSTRAINTS | pregnancy |
| DATA | safety_profile |
| CANDIDATES | exhale-emphasized, physiological-sigh-acute, 478-breathing |
| EXCLUDED | 478-breathing_long_holds |
| SELECTED | **exhale-emphasized** |
| REASON | avoid long holds |
| MESSAGE | Skip long holds. Gentle exhale-emphasized breathing 3–5 min. |
| EXPECTED | gentle breath |
| MEASURE | comfort |
| FOLLOW-UP | none |

### TC039

| Field | Value |
|-------|-------|
| CLIENT | senior_executive |
| STATE | cardiovascular_disease |
| CONTEXT | asks cold face plunge |
| GOAL | emotion_dysregulate |
| CONSTRAINTS | cardiac |
| DATA | safety_profile |
| CANDIDATES | tipp, cold-face, physiological-sigh-acute, 54321-grounding |
| EXCLUDED | cold-face, tipp_temperature |
| SELECTED | **54321-grounding** |
| REASON | hard exclude cold |
| MESSAGE | Skip cold stimulation. Try 5-4-3-2-1 grounding instead. |
| EXPECTED | grounding |
| MEASURE | distress delta |
| FOLLOW-UP | none |

### TC040

| Field | Value |
|-------|-------|
| CLIENT | young_professionals |
| STATE | driving |
| CONTEXT | car |
| GOAL | stress_acute |
| CONSTRAINTS | driving |
| DATA | activity |
| CANDIDATES | — |
| EXCLUDED | ALL |
| SELECTED | **SILENCE** |
| REASON | activity gate |
| MESSAGE | (none) |
| EXPECTED | no audio protocol |
| MEASURE | no push |
| FOLLOW-UP | on park |

### TC041

| Field | Value |
|-------|-------|
| CLIENT | public_speakers_creators |
| STATE | pre-keynote T-30 |
| CONTEXT | backstage |
| GOAL | pre_performance |
| CONSTRAINTS | — |
| DATA | calendar |
| CANDIDATES | process-visualization, ppr, cyclic-sighing |
| EXCLUDED | — |
| SELECTED | **process-visualization** |
| REASON | time for process not outcome fantasy |
| MESSAGE | 30 min: process viz of open + if-then for blanking. |
| EXPECTED | viz |
| MEASURE | rating |
| FOLLOW-UP | T-5 PPR |

### TC042

| Field | Value |
|-------|-------|
| CLIENT | sales_professionals |
| STATE | pre-discovery |
| CONTEXT | cafe T-12 |
| GOAL | pre_performance |
| CONSTRAINTS | public_discrete |
| DATA | calendar |
| CANDIDATES | physiological-sigh-acute, if-then-gollwitzer, process-visualization |
| EXCLUDED | pmr |
| SELECTED | **if-then-gollwitzer** |
| REASON | one if-then for open question |
| MESSAGE | If small talk ends → ask discovery Q1. Two quiet sighs first. |
| EXPECTED | plan+sigh |
| MEASURE | call outcome self-rate |
| FOLLOW-UP | none |

### TC043

| Field | Value |
|-------|-------|
| CLIENT | academics_researchers |
| STATE | rumination after review |
| CONTEXT | desk |
| GOAL | rumination |
| CONSTRAINTS | — |
| DATA | self-report |
| CANDIDATES | act-defusion, self-distancing, worry-postpone |
| EXCLUDED | — |
| SELECTED | **act-defusion** |
| REASON | cognitive |
| MESSAGE | 2–5 min defusion on the harsh review sentence. |
| EXPECTED | defusion |
| MEASURE | rating |
| FOLLOW-UP | none |

### TC044

| Field | Value |
|-------|-------|
| CLIENT | competitive_exam_candidates |
| STATE | pre-test AM |
| CONTEXT | home |
| GOAL | pre_performance |
| CONSTRAINTS | — |
| DATA | calendar exam |
| CANDIDATES | ppr, physiological-sigh-acute, worry-postpone |
| EXCLUDED | — |
| SELECTED | **ppr** |
| REASON | short ritual |
| MESSAGE | Exam AM: 2 min PPR + park worries to after-exam slot. |
| EXPECTED | PPR |
| MEASURE | anxiety 1-5 |
| FOLLOW-UP | post |

### TC045

| Field | Value |
|-------|-------|
| CLIENT | diplomats |
| STATE | pre-bilateral |
| CONTEXT | anteroom |
| GOAL | pre_performance |
| CONSTRAINTS | public_discrete |
| DATA | calendar |
| CANDIDATES | centering-ravizza, box-breathing, affect-labeling |
| EXCLUDED | — |
| SELECTED | **centering-ravizza** |
| REASON | composure |
| MESSAGE | 60–90 sec centering before entry. |
| EXPECTED | center |
| MEASURE | staff observe |
| FOLLOW-UP | none |

### TC046

| Field | Value |
|-------|-------|
| CLIENT | pilots_aviation |
| STATE | off_duty fatigue sleep_h=3 |
| CONTEXT | hotel |
| GOAL | sleep_debt |
| CONSTRAINTS | high_risk_occupation |
| DATA | self-report |
| CANDIDATES | nap-protocol |
| EXCLUDED | stim_hack, hyperventilation |
| SELECTED | **nap-protocol** |
| REASON | rest not performance hack |
| MESSAGE | Off duty: 10–20 min nap if safe — prioritize sleep. No stim protocols. |
| EXPECTED | nap/sleep |
| MEASURE | sleep hours |
| FOLLOW-UP | duty fitness separate |

### TC047

| Field | Value |
|-------|-------|
| CLIENT | emergency_responders |
| STATE | post-call arousal |
| CONTEXT | station private |
| GOAL | arousal_down |
| CONSTRAINTS | — |
| DATA | self-report |
| CANDIDATES | physiological-sigh-acute, pmr, 54321-grounding |
| EXCLUDED | — |
| SELECTED | **physiological-sigh-acute** |
| REASON | acute down |
| MESSAGE | Post-call: 2–5 min exhale-heavy sighs or brief PMR jaw/shoulders. |
| EXPECTED | downshift |
| MEASURE | rating |
| FOLLOW-UP | none |

### TC048

| Field | Value |
|-------|-------|
| CLIENT | high_cognitive_load_knowledge_workers |
| STATE | fatigue |
| CONTEXT | window available 10m |
| GOAL | cognitive_fatigue |
| CONSTRAINTS | — |
| DATA | self-report |
| CANDIDATES | art-brief, task-switch-buffer, pomodoro-ultradian |
| EXCLUDED | — |
| SELECTED | **art-brief** |
| REASON | ART soft fascination |
| MESSAGE | 10 min: sky/trees/window — soft attention, no phone. |
| EXPECTED | break |
| MEASURE | focus return |
| FOLLOW-UP | work block |

### TC049

| Field | Value |
|-------|-------|
| CLIENT | performance_optimization_seekers |
| STATE | wants manifestation script |
| CONTEXT | app |
| GOAL | goal_clarity |
| CONSTRAINTS | no LoA as science |
| DATA | user request |
| CANDIDATES | process-visualization, woop, if-then-gollwitzer |
| EXCLUDED | loa_manifestation |
| SELECTED | **process-visualization** |
| REASON | process not supernatural |
| MESSAGE | Process visualization + one if-then — not magical manifestation. |
| EXPECTED | process+plan |
| MEASURE | rating |
| FOLLOW-UP | woop optional |

### TC050

| Field | Value |
|-------|-------|
| CLIENT | executive_power_couples |
| STATE | post social marathon |
| CONTEXT | home 22:00 |
| GOAL | sleep_prep |
| CONSTRAINTS | — |
| DATA | calendar social |
| CANDIDATES | wind-down, pmr, evening-light-hygiene |
| EXCLUDED | — |
| SELECTED | **wind-down** |
| REASON | T_sleep |
| MESSAGE | Social residue: 30 min wind-down — dim lights, light PMR optional. |
| EXPECTED | wind-down |
| MEASURE | sleep onset |
| FOLLOW-UP | AM |

### TC051

| Field | Value |
|-------|-------|
| CLIENT | startup_founders |
| STATE | stress=5 |
| CONTEXT | elevator gap=45s |
| GOAL | micro_reset |
| CONSTRAINTS | — |
| DATA | — |
| CANDIDATES | physiological-sigh-acute |
| EXCLUDED | pmr |
| SELECTED | **physiological-sigh-acute** |
| REASON | gap only fits micro |
| MESSAGE | 3 sighs in elevator |
| EXPECTED | done |
| MEASURE | tap |
| FOLLOW-UP | none |

### TC052

| Field | Value |
|-------|-------|
| CLIENT | corporate_ceos_c_suite |
| STATE | ok |
| CONTEXT | DND mode |
| GOAL | any |
| CONSTRAINTS | push |
| DATA | — |
| CANDIDATES | — |
| EXCLUDED | ALL |
| SELECTED | **SILENCE** |
| REASON | DND |
| MESSAGE | (none) |
| EXPECTED | no push |
| MEASURE | cap |
| FOLLOW-UP | none |

### TC053

| Field | Value |
|-------|-------|
| CLIENT | frequent_international_travelers |
| STATE | preflight 8h |
| CONTEXT | lounge |
| GOAL | travel |
| CONSTRAINTS | — |
| DATA | calendar |
| CANDIDATES | caffeine-cutoff |
| EXCLUDED | sleep-restriction |
| SELECTED | **caffeine-cutoff** |
| REASON | policy card |
| MESSAGE | Cutoff caffeine now for overnight leg |
| EXPECTED | adherence |
| MEASURE | sleep |
| FOLLOW-UP | landing |

### TC054 **AMBIGUOUS**

| Field | Value |
|-------|-------|
| CLIENT | management_consultants |
| STATE | decision fatigue est |
| CONTEXT | late afternoon desk |
| GOAL | cognitive_reset |
| CONSTRAINTS | — |
| DATA | estimated density |
| CANDIDATES | art-brief |
| EXCLUDED | woop |
| SELECTED | **art-brief** |
| REASON | low conf need→ART |
| MESSAGE | 10 min window greenery |
| EXPECTED | complete |
| MEASURE | focus |
| FOLLOW-UP | none |

### TC055

| Field | Value |
|-------|-------|
| CLIENT | lawyers |
| STATE | rumination 23:00 |
| CONTEXT | home |
| GOAL | sleep_prep |
| CONSTRAINTS | — |
| DATA | self-report |
| CANDIDATES | worry-postpone |
| EXCLUDED | aerobic-exercise-stress |
| SELECTED | **worry-postpone** |
| REASON | night |
| MESSAGE | Park case worry for 07:30 slot |
| EXPECTED | note |
| MEASURE | diary |
| FOLLOW-UP | AM |

### TC056

| Field | Value |
|-------|-------|
| CLIENT | startup_ceos |
| STATE | post term-sheet alcohol urge |
| CONTEXT | evening |
| GOAL | emotion_regulate |
| CONSTRAINTS | alcohol_cap_staff |
| DATA | staff observe |
| CANDIDATES | pmr |
| EXCLUDED | gratitude-brief |
| SELECTED | **pmr** |
| REASON | downshift without binge |
| MESSAGE | PMR 10m + alcohol cap staff rule |
| EXPECTED | adherence |
| MEASURE | rating |
| FOLLOW-UP | AM |

### TC057

| Field | Value |
|-------|-------|
| CLIENT | professional_athletes |
| STATE | muscle tension |
| CONTEXT | hotel night before |
| GOAL | sleep_prep |
| CONSTRAINTS | — |
| DATA | self-report |
| CANDIDATES | pmr |
| EXCLUDED | cyclic-hyperventilation-caution |
| SELECTED | **pmr** |
| REASON | tension |
| MESSAGE | Abbreviated PMR 10m |
| EXPECTED | tension down |
| MEASURE | rating |
| FOLLOW-UP | sleep |

### TC058

| Field | Value |
|-------|-------|
| CLIENT | actors_performing_artists |
| STATE | blank fear |
| CONTEXT | T-5 |
| GOAL | micro_reset |
| CONSTRAINTS | — |
| DATA | — |
| CANDIDATES | physiological-sigh-acute |
| EXCLUDED | values-compass |
| SELECTED | **physiological-sigh-acute** |
| REASON | time |
| MESSAGE | One sigh + restart cue |
| EXPECTED | recovered |
| MEASURE | observe |
| FOLLOW-UP | none |

### TC059

| Field | Value |
|-------|-------|
| CLIENT | venture_capitalists_pe |
| STATE | partner conflict |
| CONTEXT | private 12m |
| GOAL | emotion_regulate |
| CONSTRAINTS | — |
| DATA | — |
| CANDIDATES | cognitive-reappraisal |
| EXCLUDED | cold-face |
| SELECTED | **cognitive-reappraisal** |
| REASON | A-grade reappraisal |
| MESSAGE | Reappraisal 8m |
| EXPECTED | done |
| MEASURE | rating |
| FOLLOW-UP | none |

### TC060

| Field | Value |
|-------|-------|
| CLIENT | wealth_managers |
| STATE | client loss call after |
| CONTEXT | private |
| GOAL | emotion_regulate |
| CONSTRAINTS | — |
| DATA | — |
| CANDIDATES | affect-labeling |
| EXCLUDED | gratitude-brief |
| SELECTED | **affect-labeling** |
| REASON | label first |
| MESSAGE | Label feeling 2m before next call |
| EXPECTED | done |
| MEASURE | mood |
| FOLLOW-UP | none |

### TC061

| Field | Value |
|-------|-------|
| CLIENT | family_office_uhnw |
| STATE | EA asks during meeting |
| CONTEXT | in_meeting |
| GOAL | pre_performance |
| CONSTRAINTS | staff channel |
| DATA | staff |
| CANDIDATES | ppr |
| EXCLUDED | — |
| SELECTED | **staff_queue_ppr** |
| REASON | staff τ; queue for after |
| MESSAGE | (staff card queued) |
| EXPECTED | delivered after |
| MEASURE | accept |
| FOLLOW-UP | after |

### TC062

| Field | Value |
|-------|-------|
| CLIENT | digital_nomads |
| STATE | hemisphere-balancing myth ask |
| CONTEXT | app |
| GOAL | cognitive_reset |
| CONSTRAINTS | no E-tier |
| DATA | user request |
| CANDIDATES | exhale-emphasized |
| EXCLUDED | nadi_myth_claims |
| SELECTED | **exhale-emphasized** |
| REASON | avoid unsupported claims |
| MESSAGE | Slow exhale breathing — no hemisphere claims |
| EXPECTED | done |
| MEASURE | rating |
| FOLLOW-UP | none |

### TC063

| Field | Value |
|-------|-------|
| CLIENT | irregular_schedule_shift_adjacent |
| STATE | post night shift |
| CONTEXT | home morning |
| GOAL | sleep_prep |
| CONSTRAINTS | — |
| DATA | — |
| CANDIDATES | wind-down |
| EXCLUDED | morning-light |
| SELECTED | **wind-down** |
| REASON | protect day sleep |
| MESSAGE | Blackout + wind-down for day sleep |
| EXPECTED | sleep |
| MEASURE | hours |
| FOLLOW-UP | none |

### TC064

| Field | Value |
|-------|-------|
| CLIENT | executive_parents |
| STATE | kid chaos then Zoom T-6 |
| CONTEXT | home hallway |
| GOAL | micro_reset |
| CONSTRAINTS | — |
| DATA | calendar |
| CANDIDATES | physiological-sigh-acute |
| EXCLUDED | body-scan |
| SELECTED | **physiological-sigh-acute** |
| REASON | gap |
| MESSAGE | 3 sighs before Zoom |
| EXPECTED | done |
| MEASURE | tap |
| FOLLOW-UP | none |

### TC065

| Field | Value |
|-------|-------|
| CLIENT | high_profile_families |
| STATE | media stress |
| CONTEXT | private |
| GOAL | stress_acute |
| CONSTRAINTS | — |
| DATA | — |
| CANDIDATES | 54321-grounding |
| EXCLUDED | tipp |
| SELECTED | **54321-grounding** |
| REASON | grounding first |
| MESSAGE | 5-4-3-2-1 for 3m |
| EXPECTED | distress down |
| MEASURE | rating |
| FOLLOW-UP | none |

### TC066

| Field | Value |
|-------|-------|
| CLIENT | journalists_media |
| STATE | deadline spike |
| CONTEXT | desk 5m |
| GOAL | stress_acute |
| CONSTRAINTS | — |
| DATA | — |
| CANDIDATES | exhale-emphasized |
| EXCLUDED | yoga-nidra-nsdr |
| SELECTED | **exhale-emphasized** |
| REASON | duration |
| MESSAGE | 5 min exhale pace |
| EXPECTED | done |
| MEASURE | rating |
| FOLLOW-UP | none |

### TC067

| Field | Value |
|-------|-------|
| CLIENT | real_estate_professionals |
| STATE | pre-open-house |
| CONTEXT | car parked |
| GOAL | pre_performance |
| CONSTRAINTS | — |
| DATA | — |
| CANDIDATES | ppr |
| EXCLUDED | nap-protocol |
| SELECTED | **ppr** |
| REASON | perform |
| MESSAGE | 90s PPR before door |
| EXPECTED | done |
| MEASURE | rating |
| FOLLOW-UP | none |

### TC068

| Field | Value |
|-------|-------|
| CLIENT | dentists |
| STATE | between patients |
| CONTEXT | clinic private 3m |
| GOAL | muscle_tension |
| CONSTRAINTS | — |
| DATA | — |
| CANDIDATES | brief-pmr-acute |
| EXCLUDED | aerobic-exercise-stress |
| SELECTED | **brief-pmr-acute** |
| REASON | micro PMR |
| MESSAGE | Jaw/shoulders PMR 2m |
| EXPECTED | tension |
| MEASURE | tap |
| FOLLOW-UP | none |

### TC069

| Field | Value |
|-------|-------|
| CLIENT | psychologists_therapists |
| STATE | after heavy session |
| CONTEXT | office |
| GOAL | recovery_rest |
| CONSTRAINTS | — |
| DATA | — |
| CANDIDATES | art-brief |
| EXCLUDED | cyclic-hyperventilation-caution |
| SELECTED | **art-brief** |
| REASON | soft reset |
| MESSAGE | 10 min soft fascination or brief walk |
| EXPECTED | done |
| MEASURE | rating |
| FOLLOW-UP | none |

### TC070

| Field | Value |
|-------|-------|
| CLIENT | coaches_sports_execs |
| STATE | pre-team talk |
| CONTEXT | locker |
| GOAL | pre_performance |
| CONSTRAINTS | — |
| DATA | — |
| CANDIDATES | centering-ravizza |
| EXCLUDED | sleep-restriction |
| SELECTED | **centering-ravizza** |
| REASON | perform |
| MESSAGE | Centering 60s |
| EXPECTED | done |
| MEASURE | observe |
| FOLLOW-UP | none |

### TC071

| Field | Value |
|-------|-------|
| CLIENT | combat_motorsport_athletes |
| STATE | pre-grid |
| CONTEXT | public |
| GOAL | micro_reset |
| CONSTRAINTS | — |
| DATA | — |
| CANDIDATES | tactical-breath-reset |
| EXCLUDED | yoga-nidra-nsdr |
| SELECTED | **tactical-breath-reset** |
| REASON | micro |
| MESSAGE | Tactical breath 4 cycles |
| EXPECTED | done |
| MEASURE | tap |
| FOLLOW-UP | none |

### TC072

| Field | Value |
|-------|-------|
| CLIENT | political_public_officials |
| STATE | pre-debate |
| CONTEXT | green room |
| GOAL | pre_performance |
| CONSTRAINTS | — |
| DATA | — |
| CANDIDATES | process-visualization |
| EXCLUDED | cyclic-hyperventilation-caution |
| SELECTED | **process-visualization** |
| REASON | process |
| MESSAGE | Process viz opening 8m |
| EXPECTED | done |
| MEASURE | rating |
| FOLLOW-UP | T-5 |

### TC073

| Field | Value |
|-------|-------|
| CLIENT | military_special_ops_adjacent |
| STATE | training recovery |
| CONTEXT | home evening |
| GOAL | recovery_rest |
| CONSTRAINTS | — |
| DATA | — |
| CANDIDATES | pmr |
| EXCLUDED | cold-face |
| SELECTED | **pmr** |
| REASON | recovery |
| MESSAGE | PMR 15m |
| EXPECTED | done |
| MEASURE | rating |
| FOLLOW-UP | none |

### TC074

| Field | Value |
|-------|-------|
| CLIENT | young_professionals |
| STATE | inertia scroll |
| CONTEXT | sofa |
| GOAL | inertia |
| CONSTRAINTS | — |
| DATA | self-report |
| CANDIDATES | behavioral-activation-tiny |
| EXCLUDED | sleep-restriction |
| SELECTED | **behavioral-activation-tiny** |
| REASON | BA |
| MESSAGE | Stand and 2-min tidy or walk |
| EXPECTED | action |
| MEASURE | mood |
| FOLLOW-UP | 1h |

### TC075

| Field | Value |
|-------|-------|
| CLIENT | sleep_recovery_seekers |
| STATE | caffeine 17:00 sensitive |
| CONTEXT | home |
| GOAL | sleep_hygiene |
| CONSTRAINTS | — |
| DATA | — |
| CANDIDATES | caffeine-cutoff |
| EXCLUDED | tipp |
| SELECTED | **caffeine-cutoff** |
| REASON | hygiene |
| MESSAGE | Stop caffeine now — 8h+ before bed target |
| EXPECTED | adherence |
| MEASURE | sleep |
| FOLLOW-UP | none |

### TC076

| Field | Value |
|-------|-------|
| CLIENT | startup_founders |
| STATE | goal Sunday planning 20m |
| CONTEXT | desk |
| GOAL | goal_clarity |
| CONSTRAINTS | — |
| DATA | user pull |
| CANDIDATES | woop |
| EXCLUDED | physiological-sigh-acute |
| SELECTED | **woop** |
| REASON | A-grade WOOP |
| MESSAGE | WOOP one wish 10–15m |
| EXPECTED | plan quality |
| MEASURE | follow plan |
| FOLLOW-UP | week |

### TC077

| Field | Value |
|-------|-------|
| CLIENT | software_engineers |
| STATE | habit design |
| CONTEXT | desk |
| GOAL | behavior_change |
| CONSTRAINTS | — |
| DATA | — |
| CANDIDATES | habit-stacking |
| EXCLUDED | pettlep |
| SELECTED | **habit-stacking** |
| REASON | micro design |
| MESSAGE | After coffee → 1 sigh cycle |
| EXPECTED | stack |
| MEASURE | adherence 7d |
| FOLLOW-UP | 7d |

### TC078

| Field | Value |
|-------|-------|
| CLIENT | corporate_ceos_c_suite |
| STATE | chronic stress user pull 15m |
| CONTEXT | office |
| GOAL | stress_chronic |
| CONSTRAINTS | — |
| DATA | user pull |
| CANDIDATES | coherent-resonance |
| EXCLUDED | stimulus-control |
| SELECTED | **coherent-resonance** |
| REASON | B paced breathing |
| MESSAGE | 15m ~6 breath/min comfortable |
| EXPECTED | complete |
| MEASURE | rating |
| FOLLOW-UP | none |

### TC079 **AMBIGUOUS**

| Field | Value |
|-------|-------|
| CLIENT | entrepreneurs_sme_owners |
| STATE | avoidance of hard call |
| CONTEXT | desk |
| GOAL | emotion_regulate |
| CONSTRAINTS | — |
| DATA | — |
| CANDIDATES | opposite-action |
| EXCLUDED | cold-face |
| SELECTED | **opposite-action** |
| REASON | check facts first |
| MESSAGE | If avoidance unjustified → dial 2 min now |
| EXPECTED | call made |
| MEASURE | binary |
| FOLLOW-UP | none |

### TC080

| Field | Value |
|-------|-------|
| CLIENT | burnout_seekers |
| STATE | loneliness evening |
| CONTEXT | home |
| GOAL | mood_lift |
| CONSTRAINTS | — |
| DATA | — |
| CANDIDATES | social-connection-micro |
| EXCLUDED | cyclic-hyperventilation-caution |
| SELECTED | **social-connection-micro** |
| REASON | safe social |
| MESSAGE | 2–5 min genuine check-in to safe person |
| EXPECTED | sent |
| MEASURE | mood |
| FOLLOW-UP | none |

### TC081

| Field | Value |
|-------|-------|
| CLIENT | frequent_international_travelers |
| STATE | landing+pitch same day |
| CONTEXT | hotel then venue |
| GOAL | jetlag+perform |
| CONSTRAINTS | — |
| DATA | itinerary |
| CANDIDATES | morning-light |
| EXCLUDED | sleep-restriction |
| SELECTED | **SEQUENCE_light_nap_ppr** |
| REASON | sequence |
| MESSAGE | Follow landing sequence card |
| EXPECTED | sequence adherence |
| MEASURE | pitch readiness |
| FOLLOW-UP | post-pitch |

### TC082

| Field | Value |
|-------|-------|
| CLIENT | senior_executives |
| STATE | push cap already 3 |
| CONTEXT | afternoon mild stress |
| GOAL | stress_acute |
| CONSTRAINTS | cap |
| DATA | — |
| CANDIDATES | physiological-sigh-acute |
| EXCLUDED | — |
| SELECTED | **SILENCE** |
| REASON | daily cap |
| MESSAGE | (none) |
| EXPECTED | no 4th push |
| MEASURE | cap metric |
| FOLLOW-UP | none |

### TC083

| Field | Value |
|-------|-------|
| CLIENT | startup_founders |
| STATE | panic_breath_intolerance |
| CONTEXT | acute stress |
| GOAL | stress_acute |
| CONSTRAINTS | panic_breath |
| DATA | safety |
| CANDIDATES | 54321-grounding |
| EXCLUDED | cyclic-sighing |
| SELECTED | **54321-grounding** |
| REASON | breath exclude |
| MESSAGE | Grounding 5-4-3-2-1 |
| EXPECTED | distress |
| MEASURE | rating |
| FOLLOW-UP | none |

### TC084 **AMBIGUOUS**

| Field | Value |
|-------|-------|
| CLIENT | olympic_elite_athletes |
| STATE | trauma_sensitive |
| CONTEXT | wants long body scan |
| GOAL | sleep_prep |
| CONSTRAINTS | trauma |
| DATA | safety |
| CANDIDATES | mbsr-breath-anchor |
| EXCLUDED | body-scan_forced_lie |
| SELECTED | **mbsr-breath-anchor** |
| REASON | choice architecture |
| MESSAGE | Offer seated breath anchor; skip forced long supine scan |
| EXPECTED | choice |
| MEASURE | comfort |
| FOLLOW-UP | none |

### TC085

| Field | Value |
|-------|-------|
| CLIENT | management_consultants |
| STATE | smart goals ask |
| CONTEXT | planning |
| GOAL | goal_clarity |
| CONSTRAINTS | — |
| DATA | — |
| CANDIDATES | smart-caveats |
| EXCLUDED | tipp |
| SELECTED | **smart-caveats** |
| REASON | planning |
| MESSAGE | Rewrite one vague goal to testable next action |
| EXPECTED | done |
| MEASURE | clarity |
| FOLLOW-UP | none |

### TC086

| Field | Value |
|-------|-------|
| CLIENT | physicians_surgeons |
| STATE | bipolar_spectrum flag |
| CONTEXT | asks bright light box DIY |
| GOAL | jetlag |
| CONSTRAINTS | bipolar |
| DATA | safety |
| CANDIDATES | morning-light |
| EXCLUDED | clinical_light_box_DIY |
| SELECTED | **morning-light** |
| REASON | clinician for boxes |
| MESSAGE | Outdoor gentle light; clinical boxes with clinician only |
| EXPECTED | no DIY box |
| MEASURE | staff |
| FOLLOW-UP | clinician |

### TC087

| Field | Value |
|-------|-------|
| CLIENT | public_speakers_creators |
| STATE | post talk high |
| CONTEXT | green room |
| GOAL | arousal_down |
| CONSTRAINTS | — |
| DATA | — |
| CANDIDATES | physiological-sigh-acute |
| EXCLUDED | woop |
| SELECTED | **physiological-sigh-acute** |
| REASON | down |
| MESSAGE | After talk: 3 sighs — skip more caffeine |
| EXPECTED | done |
| MEASURE | rating |
| FOLLOW-UP | none |

### TC088

| Field | Value |
|-------|-------|
| CLIENT | investment_bankers_ma |
| STATE | rumination modeling error |
| CONTEXT | desk 10m |
| GOAL | rumination |
| CONSTRAINTS | — |
| DATA | — |
| CANDIDATES | self-distancing |
| EXCLUDED | nap-protocol |
| SELECTED | **self-distancing** |
| REASON | cognitive |
| MESSAGE | Third-person analysis 8m then one fix action |
| EXPECTED | done |
| MEASURE | rating |
| FOLLOW-UP | none |

### TC089

| Field | Value |
|-------|-------|
| CLIENT | digital_nomads |
| STATE | asks detox breath cleanse |
| CONTEXT | app |
| GOAL | stress_acute |
| CONSTRAINTS | no E-tier |
| DATA | user request |
| CANDIDATES | cyclic-sighing |
| EXCLUDED | detox_claim |
| SELECTED | **cyclic-sighing** |
| REASON | unsupported exclude |
| MESSAGE | Cyclic sighing for mood/arousal — not detox |
| EXPECTED | done |
| MEASURE | rating |
| FOLLOW-UP | none |

### TC090

| Field | Value |
|-------|-------|
| CLIENT | team_sport_athletes |
| STATE | outcome-only fantasy viz |
| CONTEXT | locker |
| GOAL | pre_performance |
| CONSTRAINTS | — |
| DATA | — |
| CANDIDATES | process-visualization |
| EXCLUDED | outcome_fantasy |
| SELECTED | **process-visualization** |
| REASON | process>outcome |
| MESSAGE | Process viz — skills/cues not trophy fantasy |
| EXPECTED | done |
| MEASURE | coach |
| FOLLOW-UP | none |

### TC091

| Field | Value |
|-------|-------|
| CLIENT | wealth_managers |
| STATE | values conflict client pressure |
| CONTEXT | private 20m |
| GOAL | goal_clarity |
| CONSTRAINTS | — |
| DATA | — |
| CANDIDATES | values-compass |
| EXCLUDED | tactical-breath-reset |
| SELECTED | **values-compass** |
| REASON | moral |
| MESSAGE | Values compass 15m + one boundary action |
| EXPECTED | done |
| MEASURE | rating |
| FOLLOW-UP | none |

### TC092

| Field | Value |
|-------|-------|
| CLIENT | startup_ceos |
| STATE | receptivity 0.2 |
| CONTEXT | desk gap ok |
| GOAL | stress_acute |
| CONSTRAINTS | push |
| DATA | rec low |
| CANDIDATES | physiological-sigh-acute |
| EXCLUDED | — |
| SELECTED | **SILENCE** |
| REASON | receptivity gate |
| MESSAGE | (none) |
| EXPECTED | no push |
| MEASURE | log reason |
| FOLLOW-UP | staff may see |

### TC093

| Field | Value |
|-------|-------|
| CLIENT | frequent_international_travelers |
| STATE | melatonin + pregnancy |
| CONTEXT | travel |
| GOAL | jetlag |
| CONSTRAINTS | pregnancy |
| DATA | safety |
| CANDIDATES | morning-light |
| EXCLUDED | melatonin_auto |
| SELECTED | **morning-light** |
| REASON | exclude melatonin auto |
| MESSAGE | Light timing only; melatonin via clinician if ever |
| EXPECTED | light |
| MEASURE | sleep |
| FOLLOW-UP | clinician |

### TC094

| Field | Value |
|-------|-------|
| CLIENT | software_engineers |
| STATE | pomodoro request |
| CONTEXT | desk |
| GOAL | focus |
| CONSTRAINTS | — |
| DATA | user pull |
| CANDIDATES | pomodoro-ultradian |
| EXCLUDED | ppr |
| SELECTED | **pomodoro-ultradian** |
| REASON | user pull |
| MESSAGE | 25/5 or 50/10 — flex if in flow |
| EXPECTED | block done |
| MEASURE | complete |
| FOLLOW-UP | none |

### TC095

| Field | Value |
|-------|-------|
| CLIENT | corporate_ceos_c_suite |
| STATE | autogenic interest |
| CONTEXT | home 15m |
| GOAL | sleep_prep |
| CONSTRAINTS | — |
| DATA | user pull |
| CANDIDATES | autogenic |
| EXCLUDED | cyclic-hyperventilation-caution |
| SELECTED | **autogenic** |
| REASON | C evidence ok user pull |
| MESSAGE | Autogenic heaviness/warmth 10–15m |
| EXPECTED | done |
| MEASURE | rating |
| FOLLOW-UP | none |

### TC096

| Field | Value |
|-------|-------|
| CLIENT | lawyers |
| STATE | affect label only |
| CONTEXT | courthouse discrete 2m |
| GOAL | emotion_regulate |
| CONSTRAINTS | — |
| DATA | — |
| CANDIDATES | affect-labeling |
| EXCLUDED | pmr |
| SELECTED | **affect-labeling** |
| REASON | micro |
| MESSAGE | Silently label: I feel X and Y |
| EXPECTED | done |
| MEASURE | tap |
| FOLLOW-UP | none |

### TC097

| Field | Value |
|-------|-------|
| CLIENT | entrepreneurs_sme_owners |
| STATE | payroll dread |
| CONTEXT | desk |
| GOAL | behavior_change |
| CONSTRAINTS | — |
| DATA | — |
| CANDIDATES | if-then-gollwitzer |
| EXCLUDED | yoga-nidra-nsdr |
| SELECTED | **if-then-gollwitzer** |
| REASON | A-grade |
| MESSAGE | If 09:00 → open payroll sheet for 10 min |
| EXPECTED | done |
| MEASURE | adherence |
| FOLLOW-UP | day |

### TC098

| Field | Value |
|-------|-------|
| CLIENT | sleep_recovery_seekers |
| STATE | sleep consistency ask |
| CONTEXT | home week |
| GOAL | sleep_hygiene |
| CONSTRAINTS | — |
| DATA | — |
| CANDIDATES | sleep-consistency |
| EXCLUDED | cold-face |
| SELECTED | **sleep-consistency** |
| REASON | B |
| MESSAGE | Fixed wake ±30 min for 7 days |
| EXPECTED | adherence |
| MEASURE | diary |
| FOLLOW-UP | 7d |

### TC099 **AMBIGUOUS**

| Field | Value |
|-------|-------|
| CLIENT | hospital_executives |
| STATE | TIPP request cardiac unknown |
| CONTEXT | private |
| GOAL | crisis_emotion |
| CONSTRAINTS | unknown cardiac |
| DATA | safety |
| CANDIDATES | 54321-grounding |
| EXCLUDED | tipp |
| SELECTED | **54321-grounding** |
| REASON | screen unknown |
| MESSAGE | Grounding first until cardiac cleared |
| EXPECTED | done |
| MEASURE | distress |
| FOLLOW-UP | staff |

### TC100

| Field | Value |
|-------|-------|
| CLIENT | startup_founders |
| STATE | all scores low |
| CONTEXT | vague low urgency afternoon |
| GOAL | unknown |
| CONSTRAINTS | push |
| DATA | low conf need |
| CANDIDATES | — |
| EXCLUDED | — |
| SELECTED | **SILENCE** |
| REASON | tau_select |
| MESSAGE | (none) |
| EXPECTED | silence |
| MEASURE | log |
| FOLLOW-UP | none |

### TC101

| Field | Value |
|-------|-------|
| CLIENT | startup_founders |
| STATE | live blank during pitch |
| CONTEXT | stage |
| GOAL | micro_reset |
| CONSTRAINTS | — |
| DATA | — |
| CANDIDATES | physiological-sigh-acute |
| EXCLUDED | woop |
| SELECTED | **physiological-sigh-acute** |
| REASON | only micro |
| MESSAGE | One sigh + restart line |
| EXPECTED | recovered |
| MEASURE | observe |
| FOLLOW-UP | none |

### TC102 **AMBIGUOUS**

| Field | Value |
|-------|-------|
| CLIENT | private_jet_uhnw_traveler |
| STATE | EA calendar wrong stakes |
| CONTEXT | false high stakes tag |
| GOAL | pre_performance |
| CONSTRAINTS | — |
| DATA | noisy calendar |
| CANDIDATES | physiological-sigh-acute |
| EXCLUDED | — |
| SELECTED | **SILENCE_or_staff_confirm** |
| REASON | ambiguous calendar |
| MESSAGE | Staff confirm stakes before push |
| EXPECTED | human confirm |
| MEASURE | accept |
| FOLLOW-UP | none |

### TC103 **AMBIGUOUS**

| Field | Value |
|-------|-------|
| CLIENT | physicians_surgeons |
| STATE | untreated OSA flag |
| CONTEXT | asks long NSDR lying |
| GOAL | recovery |
| CONSTRAINTS | OSA |
| DATA | safety |
| CANDIDATES | staff_screen |
| EXCLUDED | yoga-nidra-nsdr_unsupervised |
| SELECTED | **staff_screen** |
| REASON | OSA caution |
| MESSAGE | Screen OSA; don't delay medical care |
| EXPECTED | referral? |
| MEASURE | staff |
| FOLLOW-UP | clinician |

### TC104

| Field | Value |
|-------|-------|
| CLIENT | sales_professionals |
| STATE | forced gratitude after lost deal |
| CONTEXT | app streak |
| GOAL | mood |
| CONSTRAINTS | — |
| DATA | — |
| CANDIDATES | act-defusion |
| EXCLUDED | gratitude-brief |
| SELECTED | **act-defusion** |
| REASON | forced gratitude risk |
| MESSAGE | Defusion > forced thanks |
| EXPECTED | done |
| MEASURE | rating |
| FOLLOW-UP | none |

### TC105

| Field | Value |
|-------|-------|
| CLIENT | management_consultants |
| STATE | acute abdominal post-surgery |
| CONTEXT | home |
| GOAL | stress |
| CONSTRAINTS | acute_injury |
| DATA | safety |
| CANDIDATES | exhale-emphasized |
| EXCLUDED | diaphragmatic |
| SELECTED | **exhale-emphasized** |
| REASON | contra belly focus |
| MESSAGE | Gentle exhale only |
| EXPECTED | comfort |
| MEASURE | rating |
| FOLLOW-UP | none |

### TC106

| Field | Value |
|-------|-------|
| CLIENT | corporate_ceos_c_suite |
| STATE | MBSR breath 20m |
| CONTEXT | office quiet |
| GOAL | stress_chronic |
| CONSTRAINTS | — |
| DATA | user pull |
| CANDIDATES | mbsr-breath-anchor |
| EXCLUDED | tipp |
| SELECTED | **mbsr-breath-anchor** |
| REASON | B |
| MESSAGE | Sit 10–20m breath anchor |
| EXPECTED | complete |
| MEASURE | rating |
| FOLLOW-UP | none |

### TC107

| Field | Value |
|-------|-------|
| CLIENT | frequent_international_travelers |
| STATE | nap then keynote 30m |
| CONTEXT | hotel |
| GOAL | fatigue+perform |
| CONSTRAINTS | — |
| DATA | — |
| CANDIDATES | nap-protocol |
| EXCLUDED | long_nap |
| SELECTED | **nap-protocol** |
| REASON | inertia risk |
| MESSAGE | 10–15m nap max; alarm; water on wake |
| EXPECTED | alert |
| MEASURE | readiness |
| FOLLOW-UP | keynote |

### TC108

| Field | Value |
|-------|-------|
| CLIENT | startup_founders |
| STATE | prior_negative on box-breathing |
| CONTEXT | T-20 pitch |
| GOAL | pre_performance |
| CONSTRAINTS | — |
| DATA | history |
| CANDIDATES | physiological-sigh-acute |
| EXCLUDED | box-breathing |
| SELECTED | **physiological-sigh-acute** |
| REASON | history penalty |
| MESSAGE | Prefer sigh — you rated box low before |
| EXPECTED | done |
| MEASURE | rating |
| FOLLOW-UP | none |

### TC109

| Field | Value |
|-------|-------|
| CLIENT | young_professionals |
| STATE | fear in real danger |
| CONTEXT | street |
| GOAL | emotion |
| CONSTRAINTS | safety_threat |
| DATA | safety |
| CANDIDATES | — |
| EXCLUDED | opposite-action |
| SELECTED | **ESCALATE_or_safety** |
| REASON | do not opposite real danger |
| MESSAGE | Seek safety / emergency if needed |
| EXPECTED | safe |
| MEASURE | ack |
| FOLLOW-UP | human |

### TC110

| Field | Value |
|-------|-------|
| CLIENT | executive_parents |
| STATE | hard parenting moment |
| CONTEXT | home 8m |
| GOAL | emotion_regulate |
| CONSTRAINTS | — |
| DATA | — |
| CANDIDATES | affect-labeling |
| EXCLUDED | cyclic-hyperventilation-caution |
| SELECTED | **affect-labeling** |
| REASON | label |
| MESSAGE | Label + one values-aligned repair action |
| EXPECTED | done |
| MEASURE | rating |
| FOLLOW-UP | none |

## Coverage
- Client mix: founders/CEOs, travelers, athletes/performers, consultants/IB/lawyers, physicians, sleep seekers, knowledge workers, UHNW/family, duty roles.
- Includes SILENCE, ESCALATE, clinician_only, pregnancy/cardiac, NSDR honesty, no LoA.
- Ambiguous cases expect human/staff judgment.
