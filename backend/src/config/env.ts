import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(4000),
  DATABASE_URL: z.string().optional(),
  FRONTEND_URL: z.string().url().default('http://localhost:5173'),
  OPENAI_API_KEY: z.string().optional(),
  DEMO_USER_ID: z.string().default('default-demo-user'),
});

export const env = envSchema.parse(process.env);
