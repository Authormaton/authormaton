import 'server-only';
import { z } from 'zod';

/**
 * @example
 * // To access environment variables:
 * // 1. Import the `env` object: `import { env } from '@/lib/env';`
 * // 2. Access variables directly: `env.AUTH_SECRET`, `env.NEXT_PUBLIC_API_URL`
 *
 * // Note: This file is for server-side environment variables only.
 * // For client-side access, variables must be prefixed with `NEXT_PUBLIC_`.
 */

const envSchema = z.object({
  APP_ENV: z.enum(['development', 'production']).default('production'),
  AUTH_SECRET: z.string().min(32, 'AUTH_SECRET must be at least 32 characters long'),
  NEXT_PUBLIC_API_URL: z.string().url().default('http://localhost:3000'),
  NEXT_PUBLIC_APP_URL: z.string().url().default('http://localhost:3000'),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error('❌ Invalid environment variables:', _env.error.format());
  throw new Error('Invalid environment variables');
}

export const env = _env.data;

export const IS_PRODUCTION = env.APP_ENV === 'production';