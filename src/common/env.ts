import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  server: {
    LOG_LEVEL: z.enum(["debug", "info", "warn", "error"]),

    S3_ENDPOINT: z.string(),
    S3_USE_SSL: z.boolean(),
    S3_PORT: z.number(),
    S3_ACCESS_KEY: z.string(),
    S3_SECRET_KEY: z.string(),
    S3_BUCKET: z.string(),
  },

  client: {},

  /**
   * This is the environment variables that are available on the server.
   */
  runtimeEnv: {
    LOG_LEVEL: process.env.LOG_LEVEL ?? "info",
    
    // S3
    S3_ENDPOINT: process.env.S3_ENDPOINT,
    S3_USE_SSL: Boolean(process.env.S3_USE_SSL),
    S3_PORT: Number(process.env.S3_PORT),
    S3_ACCESS_KEY: process.env.S3_ACCESS_KEY,
    S3_SECRET_KEY: process.env.S3_SECRET_KEY,
    S3_BUCKET: process.env.S3_BUCKET,
  },

  /**
   * This is the prefix for the environment variables that are available on the client.
   */
  clientPrefix: "NEXT_PUBLIC_",

  /**
   * Makes it so that empty strings are treated as undefined.
   * `SOME_VAR: z.string()` and `SOME_VAR=''` will throw an error.
   */
  emptyStringAsUndefined: true,

  /**
   * Whether to skip validation of the environment variables.
   */
  skipValidation: true,

  /**
   * Whether to check if the environment variables are valid.
   */
  isServer: process.env.NEXT_PUBLIC_APPLICATION_NAME === "backend",
});