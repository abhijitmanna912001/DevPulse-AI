import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(4000),
  DATABASE_URL: z.string().optional(),
  FRONTEND_URL: z.string().url().default('http://localhost:5173'),
  OPENAI_API_KEY: z.string().optional(),
  DEMO_USER_ID: z.string().uuid().default('00000000-0000-4000-8000-000000000001'),
});

export const env = envSchema.parse(process.env);
