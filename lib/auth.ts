import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

import { db } from "@/db/drizzle";
import { schema } from "@/db/schema";

// Get the base URL for Netlify or local development
const getBaseURL = () => {
  return process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
};

// Configure social providers only when credentials exist
const socialProviders: Record<string, unknown> = {};
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  socialProviders.google = {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  };
} else {
  console.warn(
    "Google OAuth env missing (GOOGLE_CLIENT_ID/GOOGLE_CLIENT_SECRET). Social login is disabled."
  );
}

export const auth = betterAuth({
  baseURL: getBaseURL(),
  socialProviders: socialProviders as any,
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
});