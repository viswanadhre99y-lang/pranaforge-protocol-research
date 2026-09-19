# Message engine (PIE)

Extends HPOS messaging with selection-aware copy rules.

## Formula
`[Observed context] + [Why now] + [Single action + protocol name] + [Duration] + [Skip/Silence OK]`

## Channel policy
| Channel | Cap | Notes |
|---------|-----|-------|
| Push unsolicited | ≤3/day default | silence-first |
| Staff console | uncapped suggestions | human delivers |
| User pull / in-app | on demand | still safety-filter |
| WhatsApp opt-in | same as push caps | consent layered |

## Tone by receptivity
- Low gap / low receptivity: ≤12 words + deep link  
- Medium: 1–2 sentences + why-now  
- High / evening reflective: short stack OK (still one primary CTA)

## Copy rules
1. Name **one** protocol (backup can be “or 3 sighs”).  
2. Never claim diagnosis (“your HRV shows anxiety”).  
3. Wearable language: “sleep looked short last night” only if measured duration; hedge stages.  
4. NSDR: always “deep rest — not a sleep replacement.”  
5. Melatonin: never mega-dose instructions in auto copy.  
6. No guilt streaks; no LoA metaphysics as science.  
7. Clinician-only: “This usually needs a clinician” — no titration steps.  
8. Include skip affordance on every push.

## Silence policy (first-class)
Emit `action=silence` with reason codes when:
- receptivity < τ  
- top score < τ_select  
- activity gate  
- daily cap hit  
- orthosomnia / annoyance pattern  
- ambiguous need with low confidence  

Staff may still see muted recommendations.

## Templates (illustrative)
| Code | Template |
|------|----------|
| PRE_PITCH_T10 | “Pitch in {n} min. 60 sec — double inhale, long exhale ×3.” |
| POST_LAND_AM | “New timezone morning. 10 min outdoor light beats another espresso.” |
| T_SLEEP_WORRY | “Mind looping. Park one worry for tomorrow’s 10-min slot — then dim wind-down.” |
| NSDR_ADJUNCT | “Wired but horizontal: 15 min NSDR for rest — not a substitute for sleep.” |
| SILENCE_MEETING | (no message) |
| ESCALATE | Crisis resources + consented human path — no protocol CTA |

## LLM use
Optional **wording only** after protocol_id chosen. Forbidden: inventing steps for vault IP; changing clinical contraindications; adding medical claims.
