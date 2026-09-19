# System architecture

## Pipeline (mermaid)

```mermaid
flowchart TD
  subgraph ingest [Ingest]
    CAL[Calendar/TZ]
    WEAR[Wearables sleep duration]
    SR[Self-report]
    STAFF[Staff observations]
    SAFE[Safety/crisis signals]
  end

  subgraph fuse [State fusion]
    SV[Client State Vector]
    NEED[Need inference]
    REC[Receptivity]
  end

  subgraph decide [Decision service]
    GATE[Safety + receptivity gates]
    FILT[Hard filters]
    RANK[Weighted ranker]
    THR{score >= tau?}
    SIL[SILENCE]
    ESC[ESCALATE]
    PICK[Select top + backup]
  end

  subgraph deliver [Delivery]
    MSG[Message engine]
    CON[Staff console]
    APP[Principal app]
  end

  subgraph learn [Learning]
    LOG[Decision + outcome log]
    PRF[Personal response graph]
    BAND[Optional bandits later]
  end

  CAT[Protocol catalog JSONL] --> FILT
  CAT --> RANK
  SPEC[score_spec.json] --> RANK

  CAL --> SV
  WEAR --> SV
  SR --> SV
  STAFF --> SV
  SAFE --> GATE

  SV --> NEED --> GATE
  SV --> REC --> GATE
  GATE -->|crisis| ESC
  GATE -->|low receptivity| SIL
  GATE -->|ok| FILT --> RANK --> THR
  THR -->|no| SIL
  THR -->|yes| PICK --> MSG
  PICK --> CON
  MSG --> APP
  CON --> APP
  PICK --> LOG
  SIL --> LOG
  ESC --> LOG
  APP --> LOG
  LOG --> PRF --> RANK
  LOG --> BAND
  BAND -.->|rerank safe set| RANK
```

## Components
| Component | Responsibility |
|-----------|----------------|
| Catalog service | Versioned protocol cards + vault opaque IDs |
| State service | Belief vector, freshness, source_class |
| Decision service | Gates, filters, rank, silence |
| Message service | Templates; optional LLM wording |
| Staff console | Propose/accept for UHNW Phase-1 |
| Outcome store | Postgres decision traces |
| Bandit worker | Optional; never bypasses safety |

## Phase-1 stack suggestion
Postgres + rules engine (or OPA-like policy) + calendar sync + staff web console + mobile/WhatsApp opt-in later. On-device ML later.

## Trust boundary
LLM cannot select protocols unsupervised; cannot emit vault steps; cannot override hard excludes.
