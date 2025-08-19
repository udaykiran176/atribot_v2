import { organizationClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

// Get the base URL for the client (optimized for Netlify)
const getClientBaseURL = () => {
  // Prefer the current browser origin when available to avoid cross-origin issues
  if (typeof window !== 'undefined' && window.location?.origin) {
    return window.location.origin;
  }
  // Fallbacks for SSR/build time
  if (process.env.NODE_ENV === 'production') {
    return process.env.NEXT_PUBLIC_URL || 'https://atribot-1.netlify.app';
  }
  return window.location.origin;
};

export const authClient = createAuthClient({
  baseURL: getClientBaseURL(),
  plugins: [organizationClient()],
});