# 📖 AuraCar OS — Business Flows & Operations Manual

This document provides a complete, understandable, non-technical explanation of how **AuraCar OS** operates commercially and functionally in real-world residential communities.

---

## 🏛️ 1. How a Society is Sold & Created

```
Inbound Website Lead ──► Super Admin Review ──► 1-Click Provision Tenant ──► Single-Use Invite Token
```

1. **Lead Generation:** The Resident Welfare Association (RWA) President or Facility Manager visits the public website (`https://auracar.com`) and submits their society details (Name, Contact Person, Phone, Email, Estimated Flat Count, City).
2. **Review & Qualification:** The lead appears in real-time in the **Company Super Admin Command Center** under `B2B Leads`.
3. **Provisioning:** Super Admin clicks **"Provision Tenant"**. The system creates:
   * A dedicated `Society` record with unique code (e.g. `PSP-BLR`).
   * An immutable `CommissionRule` (e.g., 40% platform margin, ₹22/car cleaner payout).
   * A cryptographically secure, single-use `InvitationToken` (valid for 7 days).

---

## 🔑 2. How Society Admin Receives Access & Activates

```
Invitation Link ──► Set Secure Password ──► Account Activated ──► 9-Step Setup Wizard
```

1. **Single-Use Invite Link:** The RWA Manager receives a secure setup link (`https://auracar.com/setup-account?token=...`).
2. **Account Creation:** The manager enters their full name, mobile number, and creates their own password.
3. **One-Time Token Redemption:** Once submitted, the token is permanently marked `isRedeemed: true` and cannot be reused.
4. **No Default Passwords:** The system never creates or displays default temporary passwords like `Admin@Temp2026`.

---

## 🏢 3. How Society Admin Configures the Society

The RWA Manager opens the **9-Step Setup Checklist**:

1. **Profile:** Confirms society name and mandates the **100% Waterless Cleaning Policy** to satisfy municipal groundwater bans.
2. **Building Towers:** Adds physical towers (e.g. `Tower 1 Oak`, 24 floors). The system creates building tower and floor entities.
3. **Parking Structures:** Selects active levels (`Basement 1`, `Basement 2`, `Podium`).
4. **Parking Slots & Walking Order:** Adds slots (e.g. `B1-101`, `B1-102`) with sequential walking order numbers (`Seq 1`, `Seq 2`).
5. **Pricing Plans:** Configures monthly subscription prices for:
   * **Daily Pure-Gloss** (6 days/week, Mon–Sat)
   * **Alternate Day Care** (3 days/week, Mon-Wed-Fri)
   * **Weekly Care** (Every Saturday)
6. **Assign Cleaners:** Enrolls verified cleaning specialists (Name, Phone, Badge Number) with a max capacity limit of 28 cars per cleaner.
7. **Resident Join Link:** Generates the society's invite link (`https://auracar.com/join/PSP-BLR`).
8. **Time Windows:** Sets morning operational window (05:30 AM to 08:00 AM).
9. **Launch:** Activates operations for resident onboarding.

---

## 🚗 4. How Residents Join, Register Vehicles & Subscribe

```
Resident Join Link ──► Register Flat ──► Add Vehicle & Slot ──► Select Plan ──► Razorpay Checkout
```

1. **Join Link:** Resident receives the link via society WhatsApp/MyGate group.
2. **Registration:** Enters mobile number, full name, and apartment unit.
3. **Vehicle & Slot Mapping:**
   * Selects their Tower, Parking Level, and Slot (e.g. `Tower 1 • Basement 1 • #B1-101`).
   * Enters Vehicle Make, Model, Color, and Registration Number (`KA 05 MN 3829`).
4. **Subscription Activation:**
   * Selects subscription plan.
   * Server calculates the price based on vehicle category (Hatchback vs Sedan vs SUV).
   * Resident completes Razorpay UPI AutoPay checkout.
   * Subscription is marked `ACTIVE` with a 30-day billing cycle.

---

## ⚡ 5. How Morning Jobs Are Generated Automatically

```
Midnight Cron Worker (12:00 AM) ──► Filter Active Subscriptions ──► Check Vacation Pauses ──► Sort by Walking Sequence ──► Deploy Cleaners
```

1. **Automated Dispatch:** At 12:00 AM daily, the server cron worker evaluates all active societies.
2. **Holiday & Pause Checks:**
   * Sundays are skipped for Daily plans.
   * Cars in an active **Vacation Pause** have job creation suppressed.
3. **Ascending Spatial Routing:** Cars are sorted in ascending order of parking slot walking sequence (`B1-101 (Seq 1) -> B1-102 (Seq 2)`).
4. **Cleaner Balancing:** Allocated in clusters of up to 28 cars per verified cleaning specialist.

---

## 🧽 6. How Cleaners Perform Work & Capture Proof

```
Mobile Manifest Route ──► Arrive at Slot ──► Watermarked Before Photo ──► 3-Microfiber Clean ──► After Photo ──► Mark Complete
```

1. **Mobile Field App:** Cleaner opens `https://auracar.com` on their smartphone.
2. **Step-by-Step Route:** Follows the ordered slot manifest without wandering across basements.
3. **Cryptographic Watermark Camera:** In-app camera stamps current date, time, and parking slot on the photos.
4. **Underground Offline Mode:** If basement has 0 cellular signal, photos queue in local storage and auto-sync when cellular returns.
5. **Mark Complete:** Cleaner marks the car complete and advances to the next slot.

---

## ⭐ 7. Customer Verification, Ratings & Disputes

```
Resident Wakes Up ──► Interactive Before/After Split Slider ──► 1-5★ Rating ──► Optional Dispute / Refund
```

1. **Proof Slider:** Resident inspects high-resolution before and after photos on an interactive split slider.
2. **Rating:** Rates service 1–5 stars with review text.
3. **Dispute Handling:** If a spot was missed, resident files a ticket. The Society Admin reviews photos and can issue a ₹200 credit/refund with 1 click.

---

## 💰 8. How Money Flows

$$\text{Resident Subscription (₹1,099/mo)} \longrightarrow \begin{cases} \text{Cleaner Compensation: ₹22/car (₹616/morning for 28 cars)} \\ \text{Consumables (Polymer fluid & microfibers): ₹3/car} \\ \text{Society Maintenance Fund Share: Configurable 0–10\%} \\ \text{Platform Gross Revenue: 40–42.4\%} \end{cases}$$
