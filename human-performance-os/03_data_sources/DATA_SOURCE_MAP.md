# Data source map

## Wearables (realistic)
| Platform | Useful exports | Weak / proprietary | API notes |
|----------|----------------|--------------------|-----------|
| Apple Watch / HealthKit | HR, some HRV, sleep analysis, workouts | Stages imperfect | HealthKit on-device; user grant |
| Oura | Sleep duration, RHR, HRV series, temp trends | Readiness composite unproven as outcome driver | Oura API v2 |
| WHOOP | Sleep duration, RHR, HRV, strain-like load | Recovery score composite | WHOOP developer API OAuth scopes |
| Garmin | Activities, sleep, stress *estimate*, Body Battery | Vendor stress algorithms opaque | Garmin Connect IQ / Health API (restricted) |
| Fitbit/Google | Steps, sleep, HR | Similar stage limits | Fitbit Web API |

**Validation takeaway:** Good enough for **sleep/wake timing & duration**; poor for precise sleep staging; treat Recovery/Readiness as UX hints, not clinical truth (Miller 2022; Chinoy 2021; orthosomnia risk Baron 2017).

## Smartphone
| Signal | Utility | Ethics |
|--------|---------|--------|
| Calendar | Highest ROI context | Scope to free/busy + user-tagged events |
| Local time / TZ | Essential | Low sensitivity |
| Motion / activity recognition | Coarse activity | On-device preferred |
| Location (place class) | home/office/hotel/airport | Coarse geofence only; never stalking |
| Screen time | Weak load proxy | Easy to misread; optional |
| Notifications / messages content | **Avoid** | High privacy risk |

## Travel
- Calendar flight strings + user confirm  
- TripIt / airline APIs if client connects  
- Jet-lag: light timing protocols from circadian science (not mega-dose melatonin DIY in product copy)

## Self-report
- EMA / micro-check-ins (see JITAI literature)  
- Post-protocol 1-tap: Better / Same / Worse  

## Staff / concierge layer (PranaForge-specific)
- Principal file notes (opt-in)  
- Session schedule (Daily Forge booked)  
- Hotel context (floor runner)  
**Never** auto-scrape guest WhatsApp without explicit product design + consent.
