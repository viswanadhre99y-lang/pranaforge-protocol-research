# Phase 1 schemas

Runtime builders live in `17_runtime/schemas/`. This folder documents the shapes.

| Schema | Builder | Notes |
|--------|---------|-------|
| ClientState | `client_state.js` | Dimensions `{value, source, confidence?}`; sources: observed\|self_reported\|inferred\|unknown. **No medical diagnoses.** |
| Context | `context.js` | who/where/when/activity/privacy/travel/event abstractions; no fake calendar |
| Moment/Event | `moment.js` | type + optional phase before\|during\|after\|recovery_after_event |
| ProtocolCard upgrade | `protocol_card.js` | version, duration bands, public_discrete, modality, evidence_class, graph ids |
| DecisionRecord | `decision_record.js` | Full auditable snapshot |
| Explanation | `explanation.js` | `{selected_id, positives, penalties, confidence}` from features |
| Confidence | `confidence.js` | Heuristic 0–1 (engineering only) |

See JSON files alongside this README for illustrative shapes.
