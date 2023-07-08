import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    DATABASE_URL: z.string().url(),
    NODE_ENV: z.enum(["development", "test", "production"]),
    CLERK_SECRET_KEY: z.string(),
    CLERK_WEBHOOK_SECRET: z.string(),
    RESEND_API_KEY: z.string(),
    FROM_EMAIL_ADDRESS: z.string(),
    FROM_EMAIL_NAME: z.string(),
    DEVELOPMENT_EMAIL_OVERRIDE: z.string().optional(),
    VERCEL_URL: z.string().optional(),
    RCMD_BASE_URL: z.string().optional(),
    RCMD_DEV_BASE_URL: z.string().optional(),
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string(),
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    NODE_ENV: process.env.NODE_ENV,
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
    CLERK_WEBHOOK_SECRET: process.env.CLERK_WEBHOOK_SECRET,
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    FROM_EMAIL_ADDRESS: process.env.FROM_EMAIL_ADDRESS,
    FROM_EMAIL_NAME: process.env.FROM_EMAIL_NAME,
    DEVELOPMENT_EMAIL_OVERRIDE: process.env.DEVELOPMENT_EMAIL_OVERRIDE,
    VERCEL_URL: process.env.VERCEL_URL,
    RCMD_BASE_URL: process.env.RCMD_BASE_URL,
    RCMD_DEV_BASE_URL: process.env.RCMD_DEV_BASE_URL,
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
   * This is especially useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
});
