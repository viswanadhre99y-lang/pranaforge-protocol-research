# PRODUCT_OPPORTUNITIES — PIE

**Date:** 2026-09-19 Asia/Calcutta  
**Constraint:** India Phase-1 non-medical; build on staff Top-3 sandbox (soft golden ~84.5% Phase 2).

---

## Opportunity thesis

Macro demand for **luxury personalization + wellness status** is evidenced (Kotak, Knight Frank). Software demand for **protocol selection OS** is hypothesized. Best opportunities sit where humans already deliver care and need decision support — not where consumers want another chatbot.

---

## Opportunity portfolio

### O1 — Staff Protocol Copilot for retreats (P0)
**Offer:** Top-3 + silence + explanation + safety + outcomes on property Wi-Fi/VPN.  
**Why now:** Personalization arms race at ₹2L/night stays; junior therapist shortage.  
**Evidence:** UHNI retreat behavior **[E]**; product already matches job **[E]**.  
**Missing:** Paid WTP.  
**Wishlist features + 10 questions:** see below.

### O2 — Family-office Recovery Desk (P0)
**Offer:** Multi-principal client_id isolation, moment tags (board, flight), WhatsApp-assisted *staff* prompts (not autonomous spam).  
**Why now:** Human lifestyle cost high; travel-heavy principals.  
**Risk:** Privacy ACL gaps in product today.

### O3 — Hotel spa “gap-fit” recommender (P1)
**Offer:** Dose shrink to available minutes; modality text for public spaces; PMS-light CSV import.  
**Why now:** Oberoi-class lifestyle frameworks expanding **[E]**; spa utilization pressure.

### O4 — House catalog white-label (P1)
**Offer:** Map PIE ranker onto *their* protocol cards (evidence grades optional); vault-opaque IDs for proprietary methods.  
**Why now:** Brands fear IP leakage; founder vault firewall already designed.

### O5 — Trainer academy / certification overlay (P2)
**Offer:** Soft-golden style scenarios for staff training; not live guest decisions.  
**Why:** Lower regulatory risk; lands budget in L&D.

### O6 — Context fabric (calendar/travel) (P2 after WTP)
**Offer:** Real integrations replacing stubs.  
**Only if:** Experiments show staff change behavior with context fields filled.

### O7 — Consumer thin client (Avoid Y1)
Push notifications to principals — high churn risk vs Calm; damages UHNW trust if wrong.

### O8 — Clinical longevity OS (Avoid Phase 1)
High narrative TAM; wrong regulatory box.

---

## Feature wishlist (prioritized) with discovery questions

### F1 — Explainable Top-3 + SILENCE (shipped core)
1. Do explanations change therapist trust?  
2. Which explanation fields matter (need, context, evidence, history)?  
3. Is SILENCE ever selected in live ops?  
4. Does confidence score help or confuse?  
5. Want vernacular (Hindi) explanations?  
6. Print/PDF for guest?  
7. Compare two therapists’ picks?  
8. Max candidates shown: 3 or 5?  
9. Need “force override” with reason code?  
10. Audit export for insurers/advisors?

### F2 — Safety gateway hardening
1. False-positive rate acceptable?  
2. Escalation resource list by city?  
3. Who reviews crisis flags?  
4. Multilingual crisis phrases?  
5. Guest-visible vs staff-only alerts?  
6. Liability wording needs?  
7. Integration to on-call clinician (still non-diagnostic)?  
8. Logging retention period?  
9. Training for staff on gateway?  
10. Red-team test cadence?

### F3 — Personal response graph UX
1. Do staff open history before recommending?  
2. Min N ratings before trusting graph?  
3. Show “worked in investor_meeting context”?  
4. Family-member separation UX?  
5. Decay old ratings?  
6. Guest can see own graph?  
7. Export on request (DPDP)?  
8. Conflict when graph vs evidence grade?  
9. Modality preference learning value?  
10. Fear of “profiling”?

### F4 — Dose / modality variants (shipped heuristic)
1. Micro dose used in public settings?  
2. Audio vs text preference by guest type?  
3. Staff-led still dominant?  
4. Need script packs per modality?  
5. Timer embedded?  
6. Offline mode?  
7. Accessibility (vision/hearing)?  
8. Language packs?  
9. Brand voice constraints?  
10. Measure completion by modality?

### F5 — Calendar / travel context (stub → real)
1. Will properties share calendar data?  
2. Google vs Outlook vs Opera?  
3. Flight API worth it?  
4. Timezone handoff errors today?  
5. Pre-pitch T-30 automation wanted or feared?  
6. Consent UX for principals?  
7. Battery of false triggers OK?  
8. Staff confirmation required always?  
9. ROI vs manual tag entry?  
10. Who owns integration project?

### F6 — WhatsApp staff assist (India-native)
1. Business API already in use?  
2. Templates approved?  
3. Guest vs staff messaging?  
4. Risk of principal seeing “bot”?  
5. Encryption / FO policy?  
6. Media (audio protocol) send?  
7. Opt-in language?  
8. Spam caps?  
9. Human takeover SLA?  
10. Metric: response time?

### F7 — White-label house catalog
1. How many proprietary protocols?  
2. Evidence grading appetite?  
3. Who maintains cards?  
4. Need CMS UI?  
5. Versioning workflow?  
6. Cross-property sharing rules?  
7. Pay more for private catalog?  
8. Import from Excel?  
9. Ayurveda taxonomy mapping?  
10. Legal review of card text?

### F8 — Outcomes & ROI dashboard for GM
1. Which KPI moves purchase?  
2. NPS link possible?  
3. Therapist adherence to Top-3?  
4. Silence rate as quality metric?  
5. Revenue upsell attribution ethics?  
6. Benchmark vs peer properties?  
7. Weekly email digest?  
8. Board-ready PDF?  
9. Data residency display?  
10. Success story permissions?

### F9 — Multiparty UHNW ACL (not built)
1. Roles: principal, spouse, EA, trainer, doctor?  
2. Field-level redaction needs?  
3. Break-glass access?  
4. Session watermarking?  
5. On-prem / VPC demand?  
6. SSO (Okta)?  
7. Device control?  
8. Audit to family counsel?  
9. Cross-border travel data?  
10. Price premium for ACL?

### F10 — Context-awareness demand test widget
Simple UI: toggle “use upcoming event tag” on/off; measure staff pick change rate + rating delta.  
Questions: 1–10 as in VALIDATION_EXPERIMENTS Exp-C.

---

## What to sell (packaging)

| Package | Includes | Not includes |
|---------|----------|--------------|
| **PIE Staff Seat** | Ranker, safety, outcomes, 50 public cards | Medical advice, wearables |
| **PIE House Catalog** | Private cards + versioning | Content creation studio unlimited |
| **PIE Desk (FO)** | Multi-client isolation + history | Autonomous principal push |
| **PIE Brand** | Multi-site analytics | PMS replacement |

---

## Architecture implications (market-driven)

- Keep hybrid rules+rank (auditability sells)  
- Invest in decision_record export (buyer trust)  
- Delay bandits until outcome volume  
- Prioritize WhatsApp *staff* channel over consumer app  
- Design DPDP consent + deletion from day 1 of paid pilots  
- Maintain non-medical copy deck reviewed by counsel  

---

## What NOT to build (opportunity discipline)

- Symptom→diagnosis flows  
- Biomarker treatment plans  
- Autonomous nagging agents  
- Mass-market content marketplace  
- Fake demo integrations  
- “Share of $6T wellness” dashboards for fundraising theater without SOM math  
