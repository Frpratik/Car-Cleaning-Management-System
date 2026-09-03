# 📡 AuraCar OS — REST API Specification

## 1. Authentication Endpoints

### `POST /api/auth/login`
* **Request:** `{ "phoneNumber": "9845012345", "password": "secure_password" }`
* **Response:** `{ "success": true, "token": "jwt_token", "user": { "id": "...", "role": "..." } }`

### `POST /api/auth/register`
* **Request:** `{ "fullName": "Arjun Nambiar", "phoneNumber": "9845012345", "password": "...", "societyId": "uuid", "apartmentNumber": "Tower 1 - 1204" }`
* **Response:** `201 Created`

### `GET /api/auth/me`
* **Headers:** `Authorization: Bearer <token>`
* **Response:** `{ "success": true, "user": { ... } }`

---

## 2. Public B2B Lead Enquiries

### `POST /api/enquiries`
* **Public:** No authentication required.
* **Request:** `{ "societyName": "Prestige Lakeside Habitat", "contactPerson": "RWA Head", "email": "rwa@prestige.com", "phoneNumber": "9845000000", "city": "Bengaluru", "estimatedUnits": 600 }`
* **Response:** `201 Created`

### `GET /api/enquiries`
* **Protected:** `SUPER_ADMIN` only.
* **Response:** `{ "success": true, "count": 12, "enquiries": [ ... ] }`

---

## 3. Society & Tenant Management

### `POST /api/societies`
* **Protected:** `SUPER_ADMIN` only.
* **Request:** `{ "name": "Godrej Eternity", "code": "GE-BLR", "addressLine": "Kanakapura Rd", "locality": "South Bengaluru", "city": "Bengaluru", "pincode": "560062", "adminFullName": "RWA Secretary", "adminEmail": "rwa@godrej.com", "adminPhone": "9900112233" }`
* **Response:** `201 Created` with generated temporary onboarding credentials.

### `GET /api/societies/:societyId`
* **Protected:** `SUPER_ADMIN` or `SOCIETY_ADMIN` (Strict Tenant Scoped).
* **Response:** Society profile, towers, parking slots, and onboarding state.

---

## 4. Payments & Webhooks

### `POST /api/payments/create-order`
* **Request:** `{ "subscriptionId": "uuid", "amount": 1099 }`
* **Response:** `{ "success": true, "order": { "id": "order_xxx", "amount": 109900, "key": "rzp_xxx" } }`

### `POST /api/payments/verify-signature`
* **Request:** `{ "razorpayOrderId": "...", "razorpayPaymentId": "...", "razorpaySignature": "...", "subscriptionId": "uuid" }`
* **Response:** `{ "success": true, "message": "Subscription activated." }`
