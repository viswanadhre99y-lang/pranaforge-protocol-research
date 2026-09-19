# TC004 Residual-C Analysis (stimulus-control sleep family)

**Date:** 2026-09-19 (Asia/Calcutta)  
**Branch:** `pie/golden-tc004-deferral`  
**Baseline (main post PR #6):** full soft **110/110**, pie.spec exact **63/110**, dump exact **74/110**, holdout soft **22/22**, residual **C ranked_too_low: TC004 only**.  
**Constraint:** No `GOAL_PROTOCOL_BOOST` expansion; no case-id hacks; no silent golden edits; prefer deferral over overfitting exact on soft-100.

---

## Verdict: **GOLDEN_AMBIGUITY** (defer — do not force exact)

Not a clean systemic engine miss in the stimulus-control sleep family. Soft already agrees via author candidates. Exact/top-3 chase would overfit a dual-valid CBT-I night case.

---

## 1. Golden contract

| Field | Value |
|-------|-------|
| id | TC004 |
| client | startup_founder |
| state | rumination |
| context | 01:10 home in bed |
| goal | **sleep_prep** (not `insomnia_behavior`) |
| candidates | stimulus-control, **worry-postpone**, wind-down |
| selected | **stimulus-control** |
| reason | bed≠sleep educational |
| message | "If not sleepy, leave bed dim. **Park one worry for morning slot.**" |
| expected (behavior) | "**leaves bed or postpone note**" |
| ambiguous flag | false |

Twin family case **TC034** (`goal=insomnia_behavior`, bed 00:30 not sleepy) already ranks **stimulus-control #1** (exact). Family works when the goal names insomnia-behavior intent.

---

## 2. Live ranking (cold, main)

| Rank | protocol_id | score | Notes |
|-----:|-------------|------:|-------|
| 1 | **worry-postpone** | 1.136 | ∈ golden.candidates → **soft OK** |
| 2 | pmr | 0.968 | sleep_prep GOAL affinity; ∉ candidates |
| 3 | mbsr-breath-anchor | 0.930 | sleep_prep GOAL affinity; ∉ candidates |
| 4 | **stimulus-control** | 0.889 | survived filters; **outside Top-3 → C** |
| 5 | body-scan | 0.874 | |
| 8 | wind-down | 0.654 | ∈ candidates but low |

**Soft:** true (top1 ∈ candidates).  
**Exact:** false.  
**ABC:** C `ranked_too_low`.  
**Exclusions for expected:** none (not B).

### Score breakdown (selected vs top1)

| Feature / term | worry-postpone | stimulus-control |
|----------------|---------------:|-----------------:|
| need_match | 0.99 | 0.99 |
| context_match | 0.25 | 0.29 |
| timing (1am_spiral) | 0.95 | 0.95 |
| evidence | 0.80 (B) | **1.00 (A)** |
| feasibility / duration_fit | 0.60 | **0.80** (briefing dose) |
| expected_benefit | 0.70 | 0.84 |
| adherence_prob | **0.77** | **0.20** (floor; uses raw catalog 3600s) |
| penalties | 0 | **0.08** (`complexity_high`, energy≤3) |
| final_score | **1.136** | **0.889** |

Mapped: `place=bedroom`, `gap=600s`, `event=1am_spiral`, `goal=sleep_prep`.  
`EVENT_NEED['1am_spiral']` already includes `insomnia_behavior`; GOAL boost table for `insomnia_behavior` is **not** applied because `input.goal` is `sleep_prep` only (by design of current goal-boost loop).

Existing affinities already favor stimulus-control on this event (`EVENT_PROTOCOL_BOOST['1am_spiral']['stimulus-control']=0.2` vs worry 0.12; `sleep_prep` GOAL row has stimulus 0.18 with need-dupe subtract). Still insufficient to beat worry + sleep_prep breath/PMR stack for **exact** or even Top-3.

---

## 3. Why this is golden ambiguity (not systemic fix)

1. **Author soft set already endorses top1.** Soft agreement rule: top ∈ candidates. Engine chose `worry-postpone`, which is explicitly listed. Residual C is exact/top-3 preference, not soft failure.
2. **Behavioral expected is OR.** Measure text accepts leave-bed **or** postpone-note — i.e. either CBT-I component succeeds the case narrative.
3. **Message is dual-protocol.** Staff copy teaches stimulus-control *and* worry-postpone in one line.
4. **Family already exact under the sharper goal.** TC034 (`insomnia_behavior`) → stimulus-control #1. TC004’s broader `sleep_prep` + rumination state legitimately elevates scheduled-worry.
5. **Soft-100 baseline.** Mandate: prefer deferral over overfitting exact. Closing C would need ~+0.05 (Top-3) or ~+0.25 (exact #1) of stimulus-specific headroom without expanding `GOAL_PROTOCOL_BOOST` — high risk of chasing one narrative ID.
6. **Optional engine hygiene ≠ justification to force exact.** Feasibility already skips complexity shrink for `prescription_briefing`, but score still applies `complexity_high` (−0.08) to stimulus-control (only high-complexity prescription-like sleep card). Exempting that would likely place stimulus at ~0.97 → Top-3 / clear C **without** exact, and is still a near-single-protocol lever. Deferred as optional future hygiene, not required to “fix” an ambiguous golden.

---

## 4. What we will **not** do

- Expand or retune `GOAL_PROTOCOL_BOOST` rows/keys.
- Case-id `if (id === 'TC004')` hacks.
- Silent edit of `test_cases.jsonl` selected/candidates.
- Force exact by overweighting stimulus-control on `1am_spiral` until it beats worry-postpone.

---

## 5. Human review (see GOLDEN_DATA_ISSUES.md §11)

**human_review = yes.** Proposed corrections (pick one; do not silent-edit in this pass):

| Option | Change | Rationale |
|--------|--------|-----------|
| A | Set `ambiguous: true` | Dual-valid candidates; OR expected measure |
| B | Keep selected; accept soft-only / residual C | Educational preference among soft-ok CBT-I set |
| C | Change `goal` → `insomnia_behavior` (like TC034) | If bed≠sleep is primary intent |
| D | Change `selected` → `worry-postpone` | If rumination-first / message postpone clause is primary |

**Engine status:** unchanged. Soft 110/110 preserved. No Playwright re-run needed (no code change).

---

## 6. Metrics (unchanged — deferred)

| Slice | Soft | Exact (pie.spec) | Notes |
|-------|-----:|-----------------:|-------|
| Full 110 | 110/110 | 63/110 | before = after |
| Holdout 22 | 22/22 | (unchanged) | |
| TC004 | soft ✓ | exact ✗ | still **C** |
| GOAL boost expanded | **false** | | confirmed |

