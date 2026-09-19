# TC004 Residual-C Results — DEFERRED (golden ambiguity)

**Date:** 2026-09-19 (Asia/Calcutta)  
**Branch:** `pie/golden-tc004-deferral`  
**Verdict:** GOLDEN_AMBIGUITY — no ranker/catalog change; docs only.

## Metrics (before = after)

| Slice | Soft | Exact (pie.spec) | Dump exact | Residual C |
|-------|-----:|-----------------:|-----------:|------------|
| Full 110 | **110/110** | **63/110** | 74/110 | **TC004** (still C) |
| Holdout 22 | **22/22** | unchanged | — | — |

- TC004: soft ✓, exact ✗, abc **C** unchanged  
- `GOAL_PROTOCOL_BOOST` expanded: **false**  
- Playwright: **not re-run** (no code change)  
- Production readiness: **not claimed**

See `TC004_ANALYSIS.md` and `GOLDEN_DATA_ISSUES.md` §11.
