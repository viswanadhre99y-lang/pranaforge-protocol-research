# MOAT_AND_DATA_FLYWHEEL — PIE

**Date:** 2026-09-19 Asia/Calcutta  
**Honesty:** Early-stage product; moat is **prospective**, not proven. Soft golden ~84.5% is an internal engineering metric, not a market moat.

---

## 1. Moat candidates (ranked by realism for Phase 1)

| Rank | Moat type | Today | Path | Fragility |
|------|-----------|-------|------|-----------|
| 1 | **Workflow embedding in staff ops** | Staff console exists | Become default during intake | Churn if UI friction |
| 2 | **House catalog + opaque vault IP** | Design present | White-label proprietary cards | Brands may insource |
| 3 | **Decision audit + safety posture** | Gateway + decision_record | Trust with advisors/GMs | Must stay non-clinical |
| 4 | **Personal response graphs (per client_id)** | Phase 2 file-backed | Longitudinal outcomes | Cold start; small N |
| 5 | **CPI moment library (India UHNW contexts)** | Scenario maps in research pack | Continuously enrich | Copyable if published |
| 6 | **Explainable hybrid ranker** | Heuristic weights | Tuned on outcomes | Weights reverse-engineerable |
| 7 | **Brand relationships (retreats/FO)** | None yet | Distribution lock | Relationship risk |
| 8 | **Regulatory know-how (staying non-MDSW)** | Boundary articulated | Counsel + process | Policy shifts |
| — | Model weights / LLM | Not core | Optional wording only | Commodity |
| — | Consumer brand | None | Avoid early | Calm-scale impossible soon |

**Non-moats:** Meditation content volume; generic chatbot UX; claiming clinical accuracy.

---

## 2. Data flywheel (target state)

```
Staff recommendation
    → delivery + modality
    → outcome rating (+ optional before/after subjective)
    → response_graph[client_id][protocol_id]
    → better rank / dose / modality priors
    → higher staff trust & usage
    → more outcomes
```

### Flywheel fuels
- **Labeled decisions** (candidates, exclusions, selected, silence)  
- **Context tags** (event, place_class, minutes)  
- **Client-type priors** (CPI) refined by outcomes  
- **Negative knowledge** (what to avoid) — often more valuable  

### Flywheel inhibitors
- Staff skip logging outcomes  
- Ratings are social politeness (inflated)  
- Multi-property without shared schema  
- Privacy constraints blocking cross-learning  

### Cross-client learning policy (critical)
- **Default:** per-client graphs only; population priors aggregated with consent & k-anonymity  
- **Never:** train marketing claims of medical efficacy from ratings  
- **UHNW:** prefer property-local / FO-local learning over global pool  

---

## 3. Defensibility vs substitutes

| Attack | Defense |
|--------|---------|
| ChatGPT for therapists | Auditability, safety hard-excludes, catalog governance, silence policy |
| WhatsApp notes | Structured history API, handoff, training mode |
| Calm for guests | Different buyer; staff loop |
| In-house Excel | Maintenance cost; safety NLP; versioned cards |

---

## 4. IP angles (non-legal; from founder pack)

Commodity: meditation audio, generic HRV UX.  
More defensible: UHNW moment decision graphs + staff console workflow + privacy multiparty access + travel-circuit priors + explainable ranker on evidence-graded catalog + vault firewall.

**Action:** Keep vault methods as opaque IDs; don’t publish full weight tuning that encodes house secrets.

---

## 5. Economic moat (switching costs)

- Historical decision_records & graphs locked to client_ids  
- Therapist muscle memory on UI  
- House catalog CMS content  
- SOPs referencing PIE outputs  
- Training certifications (O5)

Switching cost is **process**, not data gravity alone — design export to respect DPDP while keeping UX sticky.

---

## 6. Anti-moat behaviors (avoid)

- Overfitting golden set for vanity soft-agreement  
- Fake wearable feeds (destroys trust forever with UHNW)  
- Spamming principals (one bad push = permanent block)  
- Medical claim creep for fundraising  

---

## 7. Moat milestones (evidence gates)

| Gate | Signal |
|------|--------|
| M1 | 3 properties log ≥500 outcomes with ≥70% staff weekly active use |
| M2 | Response graph improves proximal ratings vs baseline A/B |
| M3 | Buyer cites “cannot go back to WhatsApp notes” in renewal |
| M4 | Second property in same brand adopts without full re-sale |
| M5 | House catalog > public catalog in usage share |

Until M1–M2, treat moat talk as **hypothesis**.

---

## 8. 10 moat/flywheel questions

1. Will staff reliably rate outcomes for 30 days?  
2. Is rating correlated with any operational KPI?  
3. Can we detect polite-5-star noise?  
4. Do graphs transfer across contexts?  
5. Minimum viable N per client?  
6. Will brands allow anonymized cross-learning?  
7. What’s the switching narrative of a churned customer?  
8. Does explainability reduce or increase override rate?  
9. Which data is toxic if leaked (UHNW)?  
10. What proprietary prior is uniquely Indian UHNW?
