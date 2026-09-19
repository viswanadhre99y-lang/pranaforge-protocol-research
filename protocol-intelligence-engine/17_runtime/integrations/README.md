# Integrations (Phase 1 stubs)

These modules define **interfaces only**. None are connected.

| Module | Purpose (future) | Phase 1 |
|--------|------------------|---------|
| `calendar.js` | Free/busy, next event stakes | `status: not_connected` |
| `travel.js` | Flight / TZ shift hints | `status: not_connected` |
| `wearable.js` | Sleep duration / timing (not diagnosis) | `status: not_connected` |
| `messaging.js` | Staff/principal delivery channels | `status: not_connected` |
| `concierge.js` | Concierge app bridge | `status: not_connected` |

Each exports:

```js
{ status: 'not_connected', async fetch() { return { available: false, ... } } }
```

**Do not** invent calendar events, HRV readiness scores, or wearable-derived diagnoses in Phase 1.
