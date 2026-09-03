# 🛠️ AuraCar OS — Operational Runbook & Handbook

## 1. Daily Morning Dispatch Lifecycle
* **12:00 AM (Midnight):** Automated `MidnightJobDispatcher` worker runs, generating the daily morning manifest for all active societies.
* **05:30 AM (Cleaner Arrival):** Cleaning specialists check in at society security gates, open the Provider Field App, and begin following the basement walking sequence.
* **06:00 AM – 08:00 AM (Execution):** Cleaners clean vehicles according to the 3-step color-coded protocol (Green body, Yellow glass, Tyre gloss), snapping before/after photos at each slot.
* **08:00 AM (Completion Audit):** Society Admins and Super Admin review the completion rate ($\ge 98.5\%$).

## 2. Emergency Failover & Cleaner Absence
* If a cleaner does not check in by 05:45 AM, the Society Admin opens the Operations Console and taps **"Re-assign Cleaner"** on the unserviced slot cluster, transferring the manifest to a backup specialist in seconds.

## 3. Handling Customer Disputes & Damage Claims
1. Resident submits a claim for *Missed Spots* or *Scratch Concern*.
2. Ticket appears in the Society Admin **"Disputes & Complaints"** queue.
3. Admin audits the morning timestamped before vs after high-resolution photo logs.
4. If valid, Admin executes 1-Click **"Issue ₹200 Refund / Credit"** and schedules complimentary buffing.
