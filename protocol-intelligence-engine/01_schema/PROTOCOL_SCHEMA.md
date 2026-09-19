# Protocol schema (human)

Machine schema: `PROTOCOL_SCHEMA.json`. Catalog instances: `../02_protocol_catalog/catalog.jsonl` (50 public protocols).

## Why a schema exists
PIE cannot rank prose PDFs. Every selectable intervention is a **card** with:
1. Content fields (what it is, steps if public, evidence)
2. Selection metadata (need/context/moment tags, duration, safety, automation)

## Field groups

### Identity
| Field | Notes |
|-------|-------|
| `protocol_id` | Stable slug. Vault IP = opaque ID only |
| `is_vault_ip` | If true: no proprietary steps in payload; staff/session reminder only |
| `source_library` | Public research vs vault-opaque vs licensed |

### Evidence & science honesty
| Field | Notes |
|-------|-------|
| `evidence_A_to_E` | Inherited from parent library. **E = do not sell as science** |
| `research_notes` / `sources` | Citations; do not invent RCTs |
| `nsdr_not_sleep_replacement` | Hard product rule for yoga-nidra-nsdr |
| `clinician_only` | Today: `sleep-restriction` (CBT-I) |
| `clinician_guided` | Educational OK; titration/clinical use → clinician |

### Selection metadata (required for ranking)
| Field | Role in PIE |
|-------|-------------|
| `need_tags` | Match inferred client need |
| `context_tags` | Place/privacy/equipment feasibility |
| `moment_tags` | Align with CPI moments (pre_pitch, post_landing, …) |
| `min/max/recommended_duration_sec` | Gap fit; hard-filter if `max > available` |
| `arousal_direction` | Prevent "activation" when need is sleep_prep |
| `intensity` / `complexity` | Friction & receptivity gates |
| `privacy_ok` | Content OK under consent (≠ permission to infer mental illness) |
| `automation_ok` | May enter auto-suggest set |
| `contraindication_tags` | Hard exclude overlap with client safety profile |
| `followup_min` | Closed-loop measure cadence |

## Vault IP rule
Daily Forge / Emotional Load / Clarity / Stress-Field **methods never appear as steps**. If a session is relevant, catalog may contain:
```json
{"protocol_id":"vault:daily-forge-am","is_vault_ip":true,"steps_public":[],"delivery_channels":["session_reminder","staff_prompt"]}
```
Staff or principal already knows the method offline.

## Evidence grades (A–E)
| Grade | Meaning | Product posture |
|-------|---------|-----------------|
| A | Guidelines / multiple quality trials | Prefer when ties |
| B | Good studies; limits remain | Default strong |
| C | Preliminary / mixed | OK with honest copy |
| D | Traditional / experiential | Optional; label clearly |
| E | Unsupported | **Exclude from scientific ranking; never auto-select as "evidence-based"** |

## Non-goals of the schema
- Not a clinical coding system (no ICD claims)
- Not a validated psychometric instrument
- Composite ranking weights live in `../05_ranking/score_spec.json`, not inside each protocol
