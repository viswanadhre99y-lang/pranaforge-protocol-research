# JTBD — Jobs To Be Done (PIE)

**Date:** 2026-09-19 Asia/Calcutta  
**Method:** Jobs as progress the buyer hires a product to make — functional, emotional, social. Separates staff vs principal vs org jobs.

---

## Core job (beachhead)

> **When** a high-value guest/principal has limited minutes and a high-stakes context,  
> **I want to** select (or withhold) the right micro-protocol quickly and defensibly,  
> **so I can** deliver consistent care without over-intervening or inventing medical claims.

**Primary hirer:** Staff (therapist, lifestyle lead, spa manager)  
**Economic hirer:** Retreat GM / FO principal budget / hotel spa P&L  
**Beneficiary:** UHNW / luxury guest

---

## Job map (staff)

| Step | Job | Current solution | PIE assist |
|------|-----|------------------|------------|
| 1 | Capture state & constraints | Forms, chat, memory | Nested client_state + sources |
| 2 | Screen safety | Tribal knowledge | Safety gateway + hard excludes |
| 3 | Generate options | Memory / binder | Catalog candidates |
| 4 | Rank fit (time, place, goal) | Intuition | Weighted rank + dose |
| 5 | Decide intervene vs silence | Guilt / upsell pressure | SILENCE first-class |
| 6 | Explain why | Verbal improvisation | Explanation + confidence |
| 7 | Deliver | Human / audio / text | Modality heuristic |
| 8 | Record outcome | Rarely | Rating + response graph |
| 9 | Learn next time | Memory | Per client_id graph |
| 10 | Hand off to colleague | WhatsApp lore | Decision records + history API |

---

## Functional jobs by persona

### Staff wellness director
- Standardize quality across therapists  
- Onboard juniors faster  
- Defend choices to medical advisors / owners  
- Protect house IP (opaque vault IDs)

### Lifestyle manager (FO)
- Not miss pre-event recovery windows  
- Coordinate across trainer/chef/travel  
- Keep principal uninterrupted (discretion)  
- Cover when lead is offline

### Spa manager (hotel)
- Fill treatment rooms with right upsell  
- Personalize without lengthening intake  
- Reduce guest complaints about “wrong” treatment  

### Principal / guest (beneficiary job)
- Feel regulated before performance moments  
- Avoid being nagged  
- Trust that advice isn’t random or medical overreach  

---

## Emotional & social jobs

| Job type | Statement |
|----------|-----------|
| Emotional (staff) | “I don’t want to be the weak link when the senior is away.” |
| Emotional (principal) | “I want calm control without another wellness lecture.” |
| Social (retreat) | “We are the most personalized house in India.” |
| Social (FO) | “Our desk never looks disorganized mid-travel.” |
| Avoidance | “Don’t make me look like I’m practicing medicine without a license.” |

---

## Job stories (format)

1. **When** a founder lands at 2am before a board, **I want** a 8-minute discrete protocol (or silence), **so** they sleep enough to perform — without a clinical claim.  
2. **When** two therapists disagree on breath vs bodywork, **I want** an evidence-graded rationale, **so** we align without ego.  
3. **When** a guest mentions dark ideation in notes, **I want** escalation — not a breathing script.  
4. **When** only 3 minutes exist between meetings, **I want** dose shrink / text modality, **so** we don’t prescribe an impossible 20-min session.  
5. **When** the same guest returns in 6 months, **I want** their response graph, **so** we don’t repeat failed protocols.

---

## Forces (switch interview lens)

| Force | Toward PIE | Against PIE |
|-------|------------|-------------|
| Push (pain) | Inconsistency, handoff failure, junior errors | “We’ve always done WhatsApp” |
| Pull (magnet) | Explainability, safety, personalization theater that is real | Shiny ChatGPT free |
| Anxiety | AI wrong advice; privacy leak; regulatory | Change fatigue |
| Habit | Binder + senior intuition | New UI mid-shift |

---

## Outcomes buyers hire (desired progress metrics)

| Metric | Owner |
|--------|-------|
| Time-to-recommendation < 60s | Staff |
| % recommendations with logged rationale | Ops |
| Reduction in contraindicated suggestions | Safety |
| Guest/principal subjective rating | Quality |
| Therapist training hours to competency | HR |
| Repeat booking / desk retention | Revenue (lagging) |

**Non-outcomes (do not promise):** disease treatment, biomarker improvement claims, clinical remission.

---

## Competing jobs (same moment)

- Upsell longer spa package (revenue job) vs silence (care job) — PIE must not be hijacked purely as upsell engine  
- Entertainment / distraction vs recovery  
- Medical workup vs wellness micro-protocol  

---

## JTBD → product requirements (market-driven architecture)

1. Staff-speed UX (iPad / laptop)  
2. Explicit silence  
3. Source_class honesty on state fields  
4. Audit log / decision_record  
5. client_id isolation  
6. No diagnostic language in UI copy  
7. Outcomes that update rank without claiming causality  

---

## 10 JTBD validation questions

1. What job were you trying to get done the last time a guest was unhappy with a protocol choice?  
2. What did you hire instead of software?  
3. What does “done” look like in 10 minutes?  
4. When is silence the right job?  
5. Which emotional risk is worse: over-intervene or under-intervene?  
6. Who gets blamed when a protocol feels wrong?  
7. What social status does personalization confer to your brand?  
8. Which steps of the job map are painful vs sacred human?  
9. Would you hire PIE for training, live decisions, or reporting?  
10. If Top-3 is wrong 20% of the time, is the job still done?
