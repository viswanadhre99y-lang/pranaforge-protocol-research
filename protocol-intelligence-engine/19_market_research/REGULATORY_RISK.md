# REGULATORY_RISK — PIE (India Phase-1 focus)

**Date:** 2026-09-19 Asia/Calcutta  
**Stance:** Phase 1 is **non-medical** staff decision support for wellness/recovery protocols. Not a clinical instrument. Not SaMD by intent — **intent and claims determine classification**.

*This is market/product risk analysis, not legal advice. Obtain India counsel before paid pilots.*

---

## 1. Primary regimes

### 1.1 CDSCO — Medical Device Software (MDSW) under MDR-2017

**Evidence:** CDSCO published guidance on Medical Device Software under MDR-2017 (final circular reported **21 July 2026**) covering SaMD/SiMD-style software **[E]**.

**Risk trigger (typical):** software with **medical purpose** — diagnosis, clinical monitoring/alerting for disease, prediction/treatment of disease/disorder/pathology, or control of a medical device.

**Lower risk posture (aspirational for PIE Phase 1):**
- Wellness / fitness / performance micro-protocol **selection assist for staff**  
- No disease diagnosis, no treatment claims, no dosing of medicines  
- Crisis language → **escalate to human resources / emergency services**, not “treat depression with breath”  
- Ranking scores labeled **engineering heuristics**  
- CBT-I sleep restriction and clinician-only protocols remain gated  

**Creep risks inside current product:**
- Crisis NLP framed as clinical triage  
- “Confidence” read as medical certainty  
- Outcome “before/after” misused as efficacy claims in marketing  
- Wearable integration implying clinical monitoring  

### 1.2 DPDP Act 2023 (Digital Personal Data Protection)

UHNW + health-adjacent self-reports = sensitive in practice even if not all are “health data” legally.

**Requirements to design for:** notice/consent, purpose limitation, deletion/export, processor contracts, security safeguards, children’s data avoidance, cross-border transfer rules as notified.

**Product implications:** client_id isolation (already), retention limits, staff PIN ≠ full IAM, audit logs access control, FO multiparty ACL before scaling S2.

### 1.3 Advertising / consumer protection

Avoid miracle cure ads; ASCI/consumer law risk if public claims overreach.

### 1.4 Sectoral hospitality rules

Hotels/spas may have internal medical advisor policies; some retreats employ doctors — **contractual** boundary: PIE remains non-diagnostic even if site has clinicians.

### 1.5 WhatsApp / telecom

Meta Business API template & consent rules; spam and impersonation risk for UHNW.

### 1.6 Cross-border / future US/EU

If expanding: FDA wellness guidance vs device; EU MDR/AI Act — out of Phase-1 scope but don’t poison claims globally from India marketing.

---

## 2. Risk register

| ID | Risk | Likelihood | Impact | Mitigation |
|----|------|------------|--------|------------|
| R1 | Marketing claims trip MDSW | Med | High | Claim review checklist; counsel; no disease language |
| R2 | Crisis NLP treated as clinical device | Med | High | UX: “escalate / human help”; not assess/diagnose |
| R3 | DPDP complaint / UHNW leak | Med | Extreme | Minimize data; encryption; ACL; retention |
| R4 | Therapist practices medicine using tool | Low–Med | High | Training; contract; clinician-only flags |
| R5 | Guest interprets staff tip as medical advice | Med | Med | Guest-facing copy controls; staff scripts |
| R6 | Insurer/regulator scrutiny after adverse event | Low | Extreme | Safety gateway; logging; insurance |
| R7 | On-prem demand blocks SaaS | Med | Med | VPC SKU pricing |
| R8 | Competitor paints PIE as unsafe AI | Med | Med | Transparency; silence; human-in-loop |

---

## 3. Allowed vs disallowed claim examples

| Allowed (Phase 1) | Disallowed |
|-------------------|------------|
| “Helps staff pick from wellness protocols” | “Diagnoses anxiety” |
| “Engineering suitability score” | “Clinically validated treatment” |
| “Escalation resources when crisis language detected” | “Detects suicidal depression with medical accuracy” |
| “Historical observations only” (history API) | “Predicts medical deterioration” |
| “Not a medical device” (if accurate per counsel) | “FDA/CDSCO approved” (false) |

---

## 4. Safety product controls (already directionally present)

- Pipeline: Safety → hard exclude → rank  
- Crisis keyword gate (false-positive risk acknowledged)  
- Clinician-only protocol class in catalog philosophy  
- Honesty lines in README / Phase deliveries  
- No fake wearable data  

**Gaps:** multiparty ACL, formal DPIA, counsel memo, multilingual crisis lexicon, insurance.

---

## 5. Go / No-Go for segments

| Segment | Phase-1 regulatory fit |
|---------|------------------------|
| Retreat / hotel spa wellness | **Go** with claim hygiene |
| FO lifestyle desk | **Go** with DPDP rigor |
| Corporate resilience non-clinical | **Caution** |
| Concierge medicine / longevity | **No-Go** until MDSW strategy |
| Consumer mental health chatbot | **No-Go** |

---

## 6. Market-driven architecture constraints

1. Keep hybrid deterministic safety filters — auditability  
2. LLM only for wording after ID chosen (founder rule)  
3. Source_class on state fields  
4. Decision_record immutable-ish logs  
5. Separate “medical mode” product forever if ever pursued — don’t toggle casually  

---

## 7. Validation

Run **Exp-H** (counsel review) before public website claims or brand press.

---

## 8. 10 regulatory questions for counsel

1. Does staff-only protocol ranking constitute MDSW under July 2026 guidance?  
2. Does crisis keyword escalation change the analysis?  
3. Are subjective stress/energy fields “health data” under DPDP?  
4. Consent model for FO multi-principal?  
5. Cross-border hosting OK?  
6. Retention period guidance?  
7. Therapist liability interaction?  
8. Advertising claim pre-clearance?  
9. Ayurveda claims interaction with Drugs & Magic Remedies Act?  
10. If we add HRV, when do we tip into MDSW?
