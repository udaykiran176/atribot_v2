import { organizationClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

// Get the base URL for the client (optimized for Netlify)
const getClientBaseURL = () => {
  // Prefer the current browser origin when available to avoid cross-origin issues
  if (typeof window !== 'undefined' && window.location?.origin) {
    return window.location.origin;
  }
  // Fallbacks for SSR/build time
  // Prefer explicitly configured public URL
  if (process.env.NEXT_PUBLIC_URL && process.env.NEXT_PUBLIC_URL.length > 0) {
    return process.env.NEXT_PUBLIC_URL;
  }
  // Common platform-specific envs
  if (process.env.VERCEL_URL && process.env.VERCEL_URL.length > 0) {
    return `https://${process.env.VERCEL_URL}`;
  }
  if (process.env.NETLIFY_URL && process.env.NETLIFY_URL.length > 0) {
    return `https://${process.env.NETLIFY_URL}`;
  }
  // Production default (your deployed site)
  if (process.env.NODE_ENV === 'production') {
    return 'https://atribot-1.netlify.app';
  }
  // Local development default
  return 'http://localhost:3000';
};

export const authClient = createAuthClient({
  baseURL: getClientBaseURL(),
  plugins: [organizationClient()],
});