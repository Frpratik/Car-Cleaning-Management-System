# 🗄️ AuraCar OS — Database & Relational Schema Documentation

## 1. Relational Entity Summary

```
                      ┌───────────────┐
                      │    Society    │
                      └───────┬───────┘
                              │ 1:N
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
┌───────┴───────┐     ┌───────┴───────┐     ┌───────┴───────┐
│ BuildingTower │     │     User      │     │  ServiceJob   │
└───────┬───────┘     └───────┬───────┘     └───────┬───────┘
        │ 1:N                 │ 1:1                 │ 1:1
┌───────┴───────┐     ┌───────┴───────┐     ┌───────┴───────┐
│  ParkingSlot  │     │CustomerProfile│     │ ServiceProof  │
└───────┬───────┘     └───────┬───────┘     └───────────────┘
        │ 1:N                 │ 1:N
┌───────┴───────┐     ┌───────┴───────┐
│    Vehicle    │─────│ Subscription  │
└───────────────┘     └───────────────┘
```

## 2. Key Constraints & Indexes
* **`User`:** `UNIQUE(phoneNumber)`, `UNIQUE(email)`.
* **`Society`:** `UNIQUE(code)`.
* **`BuildingTower`:** `UNIQUE(societyId, name)`.
* **`ParkingSlot`:** `UNIQUE(towerId, level, slotNumber)`, `INDEX(walkingSequence)`.
* **`Vehicle`:** `UNIQUE(registrationNo)`.
* **`ServiceJob`:** `UNIQUE(vehicleId, serviceDate)`, `INDEX(societyId, serviceDate, status)`.
* **`ServiceProof`:** `UNIQUE(jobId)`.
* **`Payment`:** `UNIQUE(razorpayOrderId)`, `UNIQUE(razorpayPaymentId)`.

## 3. Cascade Rules
* Deleting a `BuildingTower` cascades to delete its `ParkingSlot` records.
* Deleting a `ServiceJob` cascades to delete its associated `ServiceProof`.
* Deleting a `User` cascades to delete their `CustomerProfile` / `ProviderProfile`.
