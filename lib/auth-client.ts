import { organizationClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

// Always use the production URL to prevent Netlify branch URLs
const PRODUCTION_URL = "https://atribot-1.netlify.app";

// Get the base URL for the client
const getClientBaseURL = () => {
  if (typeof window === 'undefined') {
    // Server-side: Use environment variable or default to production
    return process.env.NEXT_PUBLIC_APP_URL || PRODUCTION_URL;
  }
  
  // Client-side: Always use the production URL
  return PRODUCTION_URL;
};

export const authClient = createAuthClient({
  baseURL: getClientBaseURL(),
  plugins: [organizationClient()],
});