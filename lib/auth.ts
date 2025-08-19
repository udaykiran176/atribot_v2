import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

import { db } from "@/db/drizzle";
import { schema } from "@/db/schema";

// Get the base URL for the current environment (optimized for Netlify)
const getBaseURL = () => {
  // In production on Netlify, use the URL from environment variables
  if (process.env.NODE_ENV === 'production') {
    // Netlify provides URL for the main site; Google OAuth cannot whitelist dynamic preview domains
    // so we prefer the main site URL here to avoid redirect_uri_mismatch on previews
    return process.env.URL || 'https://atribot-1.netlify.app';
  }
  // For development, use NEXT_PUBLIC_APP_URL or default to localhost
  return process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
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