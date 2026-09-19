# MARKET_RESEARCH — PranaForge Protocol Intelligence Engine (PIE)

**Prepared:** 2026-09-19 Asia/Calcutta  
**Product inspected:** `17_runtime/` (V1.1 + Phase 1 Client State + Phase 2 Response Graph), `19_architecture/PHASE1_DELIVERY.md`, `PHASE2_DELIVERY.md`  
**Boundary:** India-first, **non-medical Phase 1**; engineering heuristics ≠ clinical instruments; ~78–84% soft golden agreement on staff Top-3 ranking sandbox.

---

## 0. Product definition (today vs future)

### Today (shipped reality — evidence from repo)

| Attribute | Reality |
|-----------|---------|
| Surface | **Internal staff** Top-3 protocol ranking sandbox (PIN auth) |
| Catalog | 50 evidence-graded public protocol cards |
| Inputs | Nested `client_state` + `context` + goal/constraints (legacy flat still accepted) |
| Pipeline | Safety → hard exclude → candidates → weighted rank |
| Outputs | Top-3 + SILENCE option + explanation/confidence + decision_record |
| Learning | Rating-primary; Phase 2 personal response graph (per `client_id`, isolated) |
| Soft golden | **78.2%** (Phase 1) → **84.5%** (Phase 2); exact golden still low (~24–32%) |
| Integrations | Stubs only (calendar/travel/wearable/messaging/concierge) — **no fake data** |
| Not claimed | Clinical validation, consumer app, SSO/UHNW ACLs, bandits, production readiness |

**Honesty line (product):** Useful closeness on schedule/travel/sleep-timing/pre-stakes micro-protocols. Cannot claim continuous emotional omniscience or medical treatment. Win = right small help, often silence, trusted brand.

### Future aspiration (founder thesis — not yet validated as market product)

India-first **UHNW recovery overlay**: staff-in-loop protocol intelligence for high-stakes moments (pre-pitch, post-landing, conflict, sleep spiral), with calendar/context awareness, dose/modality variants, silence-first JITAI, and eventual multiparty privacy — still **non-medical** until deliberately re-scoped under CDSCO MDSW / clinician oversight.

---

## 1. Market validation overview

### 1.1 Macro wellness (context only — NOT PranaForge TAM)

| Source | Figure | Year | Use for PIE |
|--------|-------|------|-------------|
| GWI Global Wellness Economy Monitor 2025 | **$6.8T** wellness economy (2024); ~$9.8T by 2029 @ ~7.6% CAGR | 2024–29 | **Context ceiling only** — includes beauty, food, real estate, tourism, etc. |
| GWI 2024 Monitor | $6.3T (2023) → ~$9T by 2028 | 2023–28 | Same caveat |
| McKinsey Future of Wellness 2025 | **~$2T** global *consumer* wellness; US >$500B @ 4–5% | 2025 | Closer to consumer spend; still far broader than protocol selection software |
| McKinsey 2024 | $1.8T global consumer wellness; US $480B | 2024 | Prior year |

**Rule:** Never equate GWI $6T+ or even McKinsey $2T to PIE addressable revenue. PIE sells decision support / staff workflow / protocol ranking — a thin slice of mental wellness + spa ops + concierge workflow + executive recovery tooling.

### 1.2 Adjacent sectors with partial relevance (still not = PIE TAM)

| Sector (GWI 2024 sizes) | Size | Relevance to PIE |
|-------------------------|------|------------------|
| Wellness tourism | ~$894B (2024) | Buyer of *experiences*; PIE could sit under staff/ops at retreats |
| Mental wellness | ~$268B (2024) | Content + coaching overlap; PIE is selection OS not content library |
| Spas | ~$157B (2024) | Staff protocol pickers could augment therapist menus |
| Longevity clinics (syndicated estimates) | ~$4–16B (wide range; low confidence) | Clinical-adjacent; **out of Phase-1 non-medical boundary** |
| US concierge medicine | ~$7–8B (2025) | Clinical membership; substitute for “always-on care,” not same product |
| Executive health programs (syndicated) | ~$8–9B (2024–25) | Corporate buyer; often medical screening-heavy |

Syndicated market-research house figures (Research Intelo, Market Intelo, TrendX, etc.) are **lower confidence** than GWI/McKinsey/Knight Frank/Capgemini and should be treated as directional only.

### 1.3 India wealth & luxury wellness demand (stronger PIE signal)

| Evidence | Figure | Source | Implication |
|----------|-------|--------|-------------|
| India UHNWIs ($30M+) | **19,877** (early 2026); forecast **25,217** by 2031 (+27%) | Knight Frank Wealth Report 2026 | Thin but growing tip-of-pyramid |
| India HNWIs | **390,100**; wealth **$1.645T** (2025) | Capgemini World Wealth Report 2026 | Broader pool; most not UHNW recovery buyers |
| Wellness as luxury inflation | Wellness prices **+14.3%/yr** since 2022 (steepest in Kotak Private Luxury Index) | Kotak Private / Business Standard Nov 2025 | Willingness to pay for curated wellness |
| UHNI wellness behavior | **81%** increased wellness spend; **~10%** of annual spend on health/wellness; **60%+** visited retreat in 3 yrs; **1/3** rank retreats top luxury experience | Kotak Private Top of Pyramid / KPLI | Demand for *experiences + personalization*, not apps per se |
| Retreat ticket | Some stays **₹2 lakh/night** (~$2.3–2.4k) with no demand softening | Business Standard / Kotak | Extreme WTP for human-delivered programs |
| India wellness tourism | Mordor: **$27.92B (2025)** → $38.22B by 2030 @ 6.48% CAGR | Mordor via NDTV/Barchart | Large tourism pool; PIE would capture software/service attach, not tourism GMV |
| India spa market | **~$3.87B (2025)** → ~$6.4B by 2031 @ ~8.8% | Ken Research | Ops/software attach opportunity |
| India luxury spa | **~$1.79B (2025)** | Deep Market Insights (lower confidence) | Premium tier |
| Family offices India | ~**300** (2024–25), up from ~45 in 2018 | Industry press / Julius Baer commentary | Concierge + lifestyle ops buyers |

### 1.4 What is validated vs not

| Claim | Status |
|-------|--------|
| UHNW/HNW India spend more on wellness experiences | **Evidence** (Kotak, Knight Frank, Capgemini, retreat pricing) |
| Luxury hotels/spas need better protocol *selection* software | **Assumption** — problem interviews required |
| Staff Top-3 picker has WTP as SaaS | **Missing** — no paid pilots yet |
| Context-aware JITAI beats WhatsApp+human notes | **Hypothesis** — experiment required |
| Consumer AI coaching apps are primary competitors | **Partial** — more often substitutes for B2C; B2B staff loop is different |
| Clinical longevity clinics need PIE Phase 1 | **Contradicted by Phase-1 boundary** — defer |

---

## 2. Bottom-up TAM / SAM / SOM (scenarios)

**Method:** org counts × realistic annual software/service spend for a *protocol-intelligence / staff decision* layer — **not** client wellness GMV.

Currency: USD. Assumptions labeled **[A]**. Evidence labeled **[E]**.

### 2.1 Relevant spend unit (what PIE could charge)

| Offer type | Assumed ACV range **[A]** | Rationale |
|------------|---------------------------|-----------|
| Single-site staff console SaaS | $6k–$24k / yr | Analog: niche spa/clinic SaaS seats; BetterUp is higher but human-coach heavy |
| Multi-property / retreat chain | $40k–$120k / yr | Multi-site seats + catalog + outcomes |
| Family office / UHNW desk seat | $12k–$60k / yr / household desk | Lifestyle manager tooling; humans remain expensive ($120k–$300k+ salary **[E]**) |
| Hotel brand pilot | $25k–$80k / yr | Limited properties + training |
| White-label / embedded API | $50k–$250k / yr | Later; not Phase-1 |

### 2.2 Org counts (India Phase-1 focus + selective global)

| Pool | Count | Confidence | Notes |
|------|------:|------------|-------|
| India classified 5★ hotels | ~823 (Apr 2025) **[E]** | Medium | Not all have serious wellness desks |
| India luxury pipeline rooms / hotels | ~77 luxury hotels under development cited in press **[E]** | Low–med | Directional |
| India dedicated luxury spa/wellness resorts (directory-class) | ~30–80 **[A]** | Low | Spa directories list ~30; true “program” resorts fewer |
| India premium wellness retreat brands (Ananda, Vana, Atmantan, Amanbagh-class) | ~15–40 **[A]** | Medium | High fit |
| India family offices | ~300 **[E]** | Medium | Growing |
| India UHNW households | ~20k **[E]** | High count; low convert | Direct B2C UHNW is hard; desk intermediaries better |
| India HNWI | ~390k **[E]** | High count; poor Phase-1 fit | Too broad |
| India corporate executive-health buyers (large cos / PE-backed) | ~500–2,000 **[A]** | Low | Often medical; boundary risk |
| Global longevity / executive clinics (ex-India) | hundreds–low thousands **[A]** | Low | Out of Phase-1 medical boundary |

### 2.3 TAM (theoretical, 5-year, protocol-intelligence software+services attach)

**Definition:** Annual budget that *could* be spent on staff-facing protocol selection / recovery overlay software among India luxury wellness operators + India family-office lifestyle desks + select India hotel spa desks — **excluding** medical device / clinical claims products.

| Scenario | Formula sketch | Annual $ |
|----------|----------------|----------|
| **Conservative TAM** | 200 high-fit orgs × $20k | **$4M** |
| **Base TAM** | (50 retreats × $60k) + (150 hotel spas × $15k) + (80 family desks × $25k) + (20 corporate wellness desks × $40k) | **$3M + $2.25M + $2M + $0.8M ≈ $8M** |
| **Optimistic TAM (India software attach)** | 400 orgs × $35k avg | **$14M** |
| **Expanded TAM (India + select SEA/ME luxury + FO desks, still non-medical)** | 1,000 orgs × $40k | **$40M** |

**Not TAM:** $6.8T GWI, $2T McKinsey, $28B India wellness tourism GMV, $4B longevity clinics.

### 2.4 SAM (reachable with current product shape: staff Top-3 + safety + outcomes)

Product-market fit shape today = **B2B staff console**, not consumer app.

| Scenario | Who | Annual $ |
|----------|-----|----------|
| **Conservative SAM** | 40 India retreat/spa desks willing to trial staff tooling | 40 × $12k = **$0.48M** |
| **Base SAM** | 25 retreats + 40 hotel spas + 20 FO desks | (25×$40k)+(40×$15k)+(20×$30k) = **$1M + $0.6M + $0.6M = $2.2M** |
| **Optimistic SAM** | Base × 2.5 (brand rollouts, multi-site) | **~$5.5M** |

### 2.5 SOM (3-year capture — disciplined)

| Scenario | Logic | Annual ARR by Y3 |
|----------|-------|------------------|
| **Pessimistic SOM** | 5 paying logos, $15k ACV | **$75k** |
| **Base SOM** | 12 logos (mix retreat/hotel/FO), blended $28k | **~$336k** |
| **Optimistic SOM** | 25 logos, blended $40k + 1 brand deal $150k | **~$1.15M** |

**Interpretation:** PIE is a **niche B2B wedge** first. Macro wellness headlines do not fund Series A math by themselves; proof = paid pilots + retention + outcome logs.

### 2.6 Sensitivity (what moves the number)

1. **ACV** (seat vs site vs brand) — 3–5× swing  
2. **Medical creep** — unlocks longevity clinic SAM but triggers CDSCO MDSW  
3. **Consumer app** — expands TAM optics, collapses differentiation vs Calm/Headspace/Wysa  
4. **WhatsApp-only delivery** — lowers ACV; may raise adoption in India  

---

## 3. Problem / workflow reality (buyer jobs)

### Current substitute workflow (dominant)

1. Client arrives / messages on **WhatsApp**  
2. Staff recall prior notes (paper, Excel, Notion, memory)  
3. Therapist/coach picks familiar 3–5 protocols from training or house menu  
4. Delivery is human-led; outcomes rarely structured  
5. Next visit: tribal knowledge, not a response graph  

**Pain:** inconsistency across staff, weak handoff, no audit trail, over-intervention (no silence policy), cannot scale house IP without leaking it, no client_id isolation across households.

### PIE insertion point

Staff console: given state/context → Top-3 + silence + why → deliver → rate → personal graph. Fits **existing human delivery**, does not require replacing therapists.

---

## 4. Demand signals by category (summary)

| Category | Demand signal | Fit to Phase-1 PIE | Risk |
|----------|---------------|--------------------|------|
| Luxury wellness retreats (India) | Strong spend + personalization race | **High** | Ops change management |
| Luxury hotel spas | Medium; spa is ancillary revenue | **Medium** | Low software budgets |
| Family office / lifestyle desks | High human cost; need consistency | **High** | Privacy, multiparty ACL not built |
| Concierge / executive medicine | Strong spend | **Low (Phase 1)** | Medical device boundary |
| Longevity clinics | Hot narrative | **Out of scope Phase 1** | Clinical claims |
| Consumer AI coaching | Large volume | **Low** | Commodity chatbots |
| Corporate wellness | Budget exists | **Medium-low** | Procurement; medicalization |
| UHNW direct B2C | Extreme WTP for humans | **Low early** | Trust, sales cycle, privacy |

---

## 5. Critical unanswered market questions

1. Will a retreat GM pay **>$1k/mo** for staff Top-3 vs training binders?  
2. Does context-awareness (calendar/travel) change **staff behavior** enough to justify integration cost?  
3. Is the buyer the **spa director, medical director, FO lifestyle lead, or brand digital?**  
4. Do UHNW clients accept AI-assisted recommendations if a human still delivers?  
5. Can outcomes (ratings) become a **retention metric** buyers care about?  
6. Does silence-as-feature differentiate or feel like “product did nothing”?  
7. India-only catalog priors vs global protocols — localization WTP?  

*(Experiments in `VALIDATION_EXPERIMENTS.md`.)*

---

## 6. What NOT to build (market-driven)

- Consumer meditation content farm competing with Calm/Headspace  
- Diagnostic / disease-management claims (CDSCO MDSW) in Phase 1  
- Fake wearable/calendar data to demo “magic”  
- Autonomous spam push to UHNW phones without staff gate  
- Equating product success to capturing a % of $6T wellness  
- Full clinical EHR / prescribing workflows  
- Bandits before outcome volume and safety auditability  

---

## 7. Evidence vs assumption ledger (short)

| Item | E / A |
|------|-------|
| Soft golden 78–84%; staff sandbox exists | **E** (repo) |
| India UHNW ~19.9k; HNWI ~390k | **E** (KF / Capgemini) |
| UHNI wellness spend up; retreats status | **E** (Kotak) |
| Bottom-up ACV $6–60k | **A** |
| Staff picker is preferred GTM | **A** (consistent with product; unvalidated WTP) |
| Competitors listed in COMPETITOR_MAP | Mixed E/A |

See `SOURCES.md` for URLs (access ~2026-09-19).
