import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prismaClient } from "@/common/prisma";
import { Config } from "./config";

export const auth = betterAuth({
  baseURL: Config.siteUrl,
  trustedOrigins: [Config.siteUrl],
  database: prismaAdapter(prismaClient, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
  },
});
