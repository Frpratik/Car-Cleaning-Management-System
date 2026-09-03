import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('5000'),
  APP_URL: z.string().default('http://localhost:3000'),
  API_URL: z.string().default('http://localhost:5000'),
  DATABASE_URL: z.string().default('postgresql://auracar_admin:secure_password@localhost:5432/auracar_db?schema=public'),
  JWT_SECRET: z.string().min(16).default('development_jwt_secret_key_32_characters_minimum_12345'),
  JWT_EXPIRES_IN: z.string().default('7d'),
  COOKIE_SECRET: z.string().default('development_cookie_secret_key_12345'),
  SUPER_ADMIN_EMAIL: z.string().email().default('superadmin@auracar.com'),
  SUPER_ADMIN_PHONE: z.string().default('9900000000'),
  SUPER_ADMIN_INITIAL_PASSWORD: z.string().default('SuperAdmin@AuraCar2026!'),
  RAZORPAY_KEY_ID: z.string().default('rzp_test_sample_123456'),
  RAZORPAY_KEY_SECRET: z.string().default('sample_secret_key_123456'),
  SMTP_HOST: z.string().default('smtp.resend.com'),
  SMTP_PORT: z.string().default('587'),
  SMTP_USER: z.string().default('resend'),
  SMTP_PASS: z.string().default('placeholder'),
  SMTP_FROM: z.string().default('AuraCar Operations <notifications@auracar.com>')
});

export const env = envSchema.parse(process.env);
