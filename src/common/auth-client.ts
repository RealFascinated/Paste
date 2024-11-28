import { createAuthClient } from "better-auth/react";
import { Config } from "@/common/config";

export const authClient = createAuthClient({
  baseURL: Config.siteUrl,
});
