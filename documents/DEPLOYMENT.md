# 🚀 AuraCar OS — Production Deployment Guide

## 1. Production Docker Containerization

```dockerfile
# Multi-stage production build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
COPY prisma ./prisma/
RUN npm ci
RUN npx prisma generate
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci --omit=dev
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server ./server
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

EXPOSE 5000
CMD ["node", "--loader", "tsx", "server/index.ts"]
```

## 2. Zero-Downtime Deployment Checklist
1. **Set Environment Variables:** Configure `DATABASE_URL`, `JWT_SECRET`, `RAZORPAY_KEY_ID`, `SMTP_HOST` in your secrets manager (e.g. AWS Secrets Manager, Render, Railway).
2. **Apply Database Migrations:** Run `npx prisma migrate deploy` in the pre-deployment release phase.
3. **Build Frontend Bundle:** Compile static assets using `npm run build`.
4. **Health Check Validation:** Ensure `/api/health` returns HTTP 200 before routing live traffic.
