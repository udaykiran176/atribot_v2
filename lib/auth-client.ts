import { organizationClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

// Get the base URL for the client
const getClientBaseURL = () => {
  // Use NEXT_PUBLIC_VERCEL_URL for Vercel, then NEXT_PUBLIC_BETTER_AUTH_URL, then fallback to localhost
  return (
    process.env.NEXT_PUBLIC_VERCEL_URL 
      ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
      : process.env.NEXT_PUBLIC_BETTER_AUTH_URL || 'http://localhost:3000'
  );
};

export const authClient = createAuthClient({
  baseURL: getClientBaseURL(),
  plugins: [organizationClient()],
});