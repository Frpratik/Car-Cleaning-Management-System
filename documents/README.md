# 🚗 AuraCar OS — Production Multi-Tenant Platform Manual

> **The Operating System for Recurring Residential Vehicle Maintenance in Gated Communities.**

---

## 1. Product Overview
**AuraCar OS** turns car cleaning into an invisible, recurring morning utility for residents in apartment complexes, gated societies, and corporate campuses. Instead of haggling with unreliable unorganized cleaners or wasting groundwater with dirty buckets, residents subscribe to high-precision, 100% waterless exterior care executed between **5:30 AM and 8:00 AM** at their designated basement parking slot.

---

## 2. Business Model & Unit Economics
* **B2B2C Commercial Model:** AuraCar partners directly with Resident Welfare Associations (RWAs) and Facility Directors to secure exclusive society-wide servicing clearance.
* **Pricing Tiers:**
  * **Daily Pure-Gloss (Mon–Sat):** ₹1,099/month (Hatchback/Sedan) | ₹1,299/month (SUV)
  * **Alternate Days (Mon-Wed-Fri):** ₹799/month (Hatchback/Sedan) | ₹899/month (SUV)
  * **Weekly Deep Care:** ₹499/month
* **Unit Economics & Margins:**
  * **Cleaner Payout:** ₹22 per car cleaned (A cleaner servicing 28 cars/day earns ₹16,016/month for 2.5 hrs/day).
  * **Consumables & Microfibers:** ₹3 per car.
  * **Platform Net Contribution Margin:** **42.4%**.
  * **Customer LTV:CAC Ratio:** **43.3x** (CAC ₹180 via society RWA partnership, 12M LTV ₹7,800).

---

## 3. Architecture Overview
AuraCar OS is structured as a **Multi-Tenant SaaS application** with client-server separation:
* **Frontend Client:** React 18 with TypeScript, Vite bundler, and custom CSS design tokens (Anti-AI high-contrast obsidian dark palette).
* **Backend API Server:** Node.js/Express with TypeScript, hardened with `helmet`, `cors`, `cookie-parser`, and strict Zod request schema validation.
* **Database Layer:** PostgreSQL 16 managed via Prisma ORM with tenant-scoped models and compound unique indexes.
* **Storage Pipeline:** S3 / Cloudflare R2 pre-signed upload URL generator for high-res service proof photos.
* **Payments Engine:** Razorpay Subscriptions / Orders with cryptographic HMAC-SHA256 signature verification and webhooks.

---

## 4. Four-Tier Role Architecture (RBAC)
$$\text{OUR COMPANY (Super Admin)} \longrightarrow \text{SOCIETY (Society Admin / RWA)} \longrightarrow \text{RESIDENT (Car Owner)} \longleftrightarrow \text{SERVICE PROVIDER (Cleaner)}$$

1. **👑 SUPER ADMIN (Our Company):**
   * Global platform control, inbound B2B lead pipeline, society tenant provisioning, macro revenue monitoring, and immutable audit logs.
2. **🏢 SOCIETY ADMIN (RWA / Facility Manager):**
   * Tenant-isolated operations: 9-step initial setup wizard, building towers, parking structures, slot mapping, cleaner attendance, and resident dispute resolution.
3. **🚗 CUSTOMER (Resident / Car Owner):**
   * Controlled onboarding via society link (`/join/CODE`), vehicle registration, subscription activation, 14-day schedule calendar, 1-tap vacation pause, photo proof inspection, 1–5★ rating, and dispute filing.
4. **🧽 SERVICE PROVIDER (Cleaner Specialist):**
   * Field execution: Basement route sorted by ascending walking sequence (*B2-104 $\rightarrow$ B2-108*), camera viewfinder with cryptographic timestamp watermark, offline photo queue with zero-signal auto-sync.

---

## 5. Multi-Tenant Architecture & Isolation
Every tenant-sensitive entity (`User`, `BuildingTower`, `ParkingSlot`, `Vehicle`, `Subscription`, `ServiceJob`, `Complaint`) is scoped to a specific `societyId`.
* **Backend Enforcement:** The `enforceTenantIsolation` middleware checks `req.user.societyId` and prevents cross-society data leakage.
* **Zero Client-Side Trust:** API endpoints reject requests targeting resources from another society with **403 Forbidden**.

---

## 6. End-to-End User Flows
1. **Public Discovery $\rightarrow$ Inbound Enquiry:** RWA visitor submits "Bring to Your Society" form on the public landing page.
2. **Super Admin Provisioning:** Super Admin reviews lead $\rightarrow$ clicks "Provision Tenant" $\rightarrow$ generates Society Admin temporary setup credentials.
3. **Society Admin Onboarding:** Society Admin logs in $\rightarrow$ completes 9-step checklist (Towers $\rightarrow$ Slots $\rightarrow$ Services $\rightarrow$ Cleaners $\rightarrow$ Copy Resident Join Link) $\rightarrow$ launches society.
4. **Resident Registration:** Resident accesses `/join/PLH-BLR` $\rightarrow$ registers vehicle & slot $\rightarrow$ activates subscription with Razorpay UPI Autopay.
5. **Midnight Dispatch Worker:** At 12:00 AM, the server-side cron generates morning work orders ordered by basement walking sequence.
6. **Morning Cleaning & Proof:** Cleaner arrives at 5:30 AM $\rightarrow$ follows spatial route $\rightarrow$ snaps before/after photos $\rightarrow$ marks complete.
7. **Customer Verification:** Resident receives notification at 6:45 AM $\rightarrow$ reviews photo proof slider $\rightarrow$ rates 5 stars.

---

## 7. Authentication & Security
* **Password Security:** Passwords hashed with `bcryptjs` (cost factor 12).
* **Session Tokens:** Signed JWT tokens stored in HTTP-only, SameSite secure cookies.
* **First-Login Force Reset:** Society Admins created with temporary passwords must set a new password on initial sign-in (`mustResetPassword: true`).

---

## 8. Database Models & Schema
See [`prisma/schema.prisma`](../prisma/schema.prisma) for complete definitions of:
* `User`, `CustomerProfile`, `ProviderProfile`, `AdminProfile`
* `Society`, `SocietyEnquiry`, `SocietyOnboarding`, `CommissionRule`, `AuditLog`
* `BuildingTower`, `ParkingSlot`, `Vehicle`, `ServicePlan`, `Subscription`, `ServiceJob`, `ServiceProof`, `Payment`, `Rating`, `Complaint`

---

## 9. API Reference
See [`/documents/API.md`](./API.md) for full REST endpoints:
* `POST /api/auth/login`, `POST /api/auth/register`, `GET /api/auth/me`, `POST /api/auth/logout`
* `POST /api/enquiries`, `GET /api/enquiries`, `PATCH /api/enquiries/:id/status`
* `POST /api/societies`, `GET /api/societies`, `GET /api/societies/:id`, `POST /api/societies/:id/towers`, `POST /api/societies/:id/slots`
* `POST /api/payments/create-order`, `POST /api/payments/verify-signature`, `POST /api/payments/webhook`

---

## 10. Environment Variables
See [`.env.example`](../.env.example):
```env
NODE_ENV=production
PORT=5000
DATABASE_URL=postgresql://auracar_admin:secure_password@localhost:5432/auracar_db?schema=public
JWT_SECRET=production_jwt_signing_key_min_32_characters_long
RAZORPAY_KEY_ID=rzp_live_key
RAZORPAY_KEY_SECRET=rzp_live_secret
SMTP_HOST=smtp.resend.com
SMTP_PORT=587
SMTP_USER=resend
SMTP_PASS=re_api_key
SMTP_FROM="AuraCar Operations <notifications@auracar.com>"
S3_ENDPOINT=https://your-account-id.r2.cloudflarestorage.com
S3_BUCKET_NAME=auracar-service-proofs
```

---

## 11. Local Development Setup
```bash
# 1. Clone repository
git clone https://github.com/Frpratik/Car-Cleaning-Management-System.git
cd CCA

# 2. Install dependencies
npm install

# 3. Generate Prisma client
npx prisma generate

# 4. Start concurrent development servers (API Server on :5000, Vite Client on :3000)
npm run dev
```

---

## 12. Database Migrations
```bash
# Push schema changes to development database
npx prisma db push

# Create deployable migration for production
npx prisma migrate dev --name init_multitenant_schema

# Apply migrations in production
npx prisma migrate deploy
```

---

## 13. Automated Testing
```bash
# Execute the 17-point production smoke test suite
npx tsx server/tests/smokeTest.ts
```

---

## 14. Production Build & Deployment
```bash
# Build optimized production bundle
npm run build

# Start production server
npm run start
```

---

## 15. Recurring Job Generation Engine
The server-side `MidnightJobDispatcher.runDailyDispatch()` executes at 12:00 AM. It:
1. Queries all active societies and subscriptions.
2. Excludes vacation-paused vehicles.
3. Checks frequency rules (`DAILY` = Mon–Sat, `ALTERNATE_DAYS` = Mon/Wed/Fri, `WEEKLY` = Sat).
4. Sorts by basement `walkingSequence` in ascending order.
5. Performs idempotent `upsert` on `ServiceJob` using compound key `[vehicleId, serviceDate]`.

---

## 16. Vacation Pause Billing Protection
When a resident pauses service for $N$ days (e.g. 5 days), the engine shifts the `nextBillingDate` forward by $+N$ days automatically so residents never pay for days they are away.

---

## 17. Dispute & Complaint Resolution
Residents can report *Missed Spots, Damage Concerns, or Late Service*. Society Admins audit the claim against morning before/after photo logs and execute 1-Click **Resolve** or **Issue ₹200 Refund / Credit**.

---

## 18. Troubleshooting Guide
* **Port 5000 Already in Use:** Change `PORT=5001` in `.env`.
* **Prisma Client Out of Sync:** Run `npx prisma generate`.
* **CORS Blocked in Local Dev:** Ensure `APP_URL=http://localhost:3000` is present in `.env`.

---

## 19. Known Limitations & Deferred Features
* Real-time GPS cleaner location tracking in basement 2 is deferred in favor of offline slot sequence checklists due to zero underground cellular/satellite signal.

---

## 20. Commercial Launch Checklist
* [x] Multi-Tenant PostgreSQL Schema
* [x] 4-Tier RBAC Middleware
* [x] Public B2B Lead Intake Funnel
* [x] Super Admin Society Provisioning
* [x] 9-Step Society Admin Onboarding Wizard
* [x] Idempotent Midnight Job Dispatch Worker
* [x] Razorpay HMAC-SHA256 Signature Verification
* [x] S3/R2 Pre-Signed Upload URL Pipeline
* [x] 17-Point Automated Smoke Test Suite (`17 PASSED / 0 FAILED`)
* [x] Full Documentation Suite in `/documents`
