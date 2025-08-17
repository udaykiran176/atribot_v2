import { organizationClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

// Get the base URL for the client (optimized for Netlify)
const getClientBaseURL = () => {
  // In production on Netlify, use the URL from environment variables
  if (process.env.NODE_ENV === 'production') {
    // Netlify provides this environment variable
    return process.env.NEXT_PUBLIC_URL || 'https://atribot-1.netlify.app';
  }
  // For development, use NEXT_PUBLIC_APP_URL or default to localhost
  return process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
};

export const authClient = createAuthClient({
  baseURL: getClientBaseURL(),
  plugins: [organizationClient()],
});