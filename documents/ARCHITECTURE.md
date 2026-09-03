# 🏗️ AuraCar OS — Technical Architecture Document

## 1. System Topology

```
                                      PUBLIC INTERNET
                                             │
                     ┌───────────────────────┴───────────────────────┐
                     │                                               │
            PUBLIC B2B WEBSITE                             AUTHENTICATED PORTALS
       (Hero, Lead Intake, RWA Pitch)              (/login, /app, /provider, /society, /admin)
                     │                                               │
                     └───────────────────────┬───────────────────────┘
                                             │ (REST / JSON / Cookies)
                                  EXPRESS.JS BACKEND SERVER
                          ┌──────────────────┴──────────────────┐
                          │    TENANT ISOLATION MIDDLEWARE      │
                          │  • Token Verification (JWT)         │
                          │  • Tenancy Context (req.societyId)  │
                          │  • Role-Based Guard (RBAC)          │
                          │  • Rate Limiting & Audit Logging    │
                          └──────────────────┬──────────────────┘
                                             │
                   ┌─────────────────────────┼─────────────────────────┐
                   │                         │                         │
            PRISMA CLIENT 6           MIDNIGHT DISPATCH CRON      OBJECT STORAGE (S3/R2)
                   │                         │                         │
            POSTGRESQL 16              12:00 AM WORKER            PRE-SIGNED PUT URLS
        (Tenant-Scoped Models)      (Walking Sequence Sort)     (Service Proof Photos)
```

## 2. Multi-Tenancy Design
* **Shared Database, Shared Schema with Tenant Scoping:** Every business entity includes a mandatory `societyId` foreign key.
* **Query Tenancy Injection:** Backend routes enforce queries to include `where: { societyId: req.user.societyId }` unless the authenticated user is `SUPER_ADMIN`.
* **Zero Cross-Tenant Leakage:** A Society Admin or Resident belonging to Society A cannot access, query, or mutate records belonging to Society B.

## 3. Spatial Slot Routing Algorithm
* To eliminate transit overhead in massive underground basements (e.g. 600+ parking bays), parking slots are tagged with an integer `walkingSequence`.
* The dispatch engine sorts vehicles in ascending walking sequence order:
  $$\text{Slot B2-104 (Seq 1)} \longrightarrow \text{Slot B2-108 (Seq 2)} \longrightarrow \text{Slot B2-112 (Seq 3)}$$
* Cleaners follow this continuous physical path, servicing **28 cars in 2.5 hours** without backtracking.
