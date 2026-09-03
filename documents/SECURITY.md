# 🔒 AuraCar OS — Security & Compliance Architecture

## 1. Authentication & Token Management
* **Password Hashing:** Passwords hashed using `bcryptjs` with salt rounds = 12.
* **JWT Signing:** Access tokens signed using HMAC-SHA256 with a 32-character minimum secret.
* **Storage:** Tokens delivered via HTTP-Only, SameSite, Secure cookies to mitigate XSS token theft.

## 2. Authorization & RBAC Matrix

| Role | Scope | Permissions |
| :--- | :--- | :--- |
| **`SUPER_ADMIN`** | Global | Full platform control, B2B lead management, society provisioning, global GMV. |
| **`SOCIETY_ADMIN`** | Society | Manage towers, slots, cleaners, resident approvals, and dispute resolution for their society only. |
| **`CUSTOMER`** | Vehicle | Register vehicle, activate subscription, pause service, view proof, submit ratings and complaints. |
| **`PROVIDER`** | Route | View assigned morning basement slots, upload before/after photos, mark complete. |

## 3. IDOR & Broken Object Reference Protection
* All API endpoints verify that the target object's `societyId` matches `req.user.societyId`.
* Direct ID manipulation across tenants triggers an immediate **403 Forbidden** response.

## 4. Payment Security & Tamper Protection
* Razorpay checkout signatures verified using cryptographic HMAC-SHA256:
  $$\text{Expected Signature} = \text{HMAC-SHA256}(\text{order\_id} \parallel \text{"\|"} \parallel \text{payment\_id}, \text{RAZORPAY\_KEY\_SECRET})$$
* Subscriptions are only marked `ACTIVE` after cryptographic verification passes.

## 5. Storage Security
* Uploads to S3/R2 are granted via short-lived (5-minute expiry) pre-signed PUT URLs.
* Strict content-type whitelisting (`image/jpeg`, `image/png`, `image/webp`) prevents malicious file upload vulnerabilities.
