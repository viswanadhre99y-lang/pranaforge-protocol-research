# Protocol catalog

## File
`catalog.jsonl` — **50** lines, one JSON object per public protocol from `../../_protocols.json`, enriched with selection tags.

## What was enriched (not invented)
- `need_tags`, `context_tags`, `moment_tags` — engineering labels for filtering/ranking
- Duration seconds parsed/derived from existing minimum/typical/buckets
- `contraindication_tags` extracted from existing `avoid` prose
- Flags: `clinician_only`, `clinician_guided`, `automation_ok`, `nsdr_not_sleep_replacement`

**No new RCTs, no fake effect sizes, no proprietary asana/pranic steps.**

## How to extend
1. Author protocol in parent library style (purpose, steps, evidence grade, sources, avoid/risks).
2. Assign `evidence_A_to_E` honestly; if unsupported → **E** and keep out of auto-rank.
3. Add selection tags using controlled vocab in `../01_schema/PROTOCOL_SCHEMA.md`.
4. Set `automation_ok=false` for high-risk / clinician titration.
5. Append one JSONL line; run schema required-field check.
6. Add ≥2 test cases in `../13_test_cases/`.

## Vault IP stays out
Do **not** paste Daily Forge or other vault recipes into this catalog. Opaque IDs only, if product needs a selectable reminder.

## Counts (seed)
| Evidence | n |
|----------|---|
| A | 8 |
| B | 21 |
| C | 20 |
| D | 1 |
| E | 0 in seed |

Clinician-only seed: `sleep-restriction`.  
Not automation: sleep-restriction, stimulus-control, jetlag-light-melatonin, tipp, cold-face, cyclic-hyperventilation-caution.
