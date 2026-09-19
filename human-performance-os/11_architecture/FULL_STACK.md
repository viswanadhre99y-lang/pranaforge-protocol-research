# Technology architecture (conceptual)

```
┌─────────────────────────────────────────────┐
│ Sources: HealthKit/Oura/WHOOP, Calendar,     │
│ Travel, Self-report, Staff notes (opt-in)    │
└─────────────────┬───────────────────────────┘
                  ▼
┌─────────────────────────────────────────────┐
│ Ingestion + normalization (server or edge)   │
│ PII vault | encryption | audit log           │
└─────────────────┬───────────────────────────┘
                  ▼
┌───────────────┬───────────────┬─────────────┐
│ Profile store │ Context store │ State model │
└───────┬───────┴───────┬───────┴──────┬──────┘
        └───────────────┼──────────────┘
                        ▼
              Event detector (rules)
                        ▼
              Receptivity gate
                        ▼
         Decision engine (rules → bandits)
                        ▼
         Protocol catalog (metadata)
                        ▼
         Message composer + channel router
                        ▼
     Client app / WhatsApp / Staff console
                        ▼
              Outcome collector → Learning
```

## Suggested Phase-1 stack
- **Backend:** Node/Python service on private VPC  
- **DB:** Postgres (profile, events) + object store for raw exports  
- **Queues:** event-driven (calendar webhooks, wearable daily sync)  
- **Rules:** JSONLogic / Drools-like or in-code rules with tests  
- **Feature store (later):** personal baselines  
- **LLM:** optional for *wording only* after protocol ID chosen — never for clinical inference  
- **Mobile:** thin client; on-device activity if possible  

## Existing platforms to study (not endorse)
Apple Health / HealthKit, Google Fit, Oura API, WHOOP API, Garmin, Personicle-style context research, HeartSteps JITAI, Empatica (clinical-ish), Headspace/Calm (content, weak context), Whoop Coach, Levels (metabolic — different domain), athletic HRV apps (HRV4Training).
