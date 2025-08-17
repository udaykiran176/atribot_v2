import { organizationClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

// Get the base URL for the client
const getClientBaseURL = () => {
  if (process.env.NEXT_PUBLIC_APP_URL) return process.env.NEXT_PUBLIC_APP_URL;
  if (typeof window !== 'undefined') return window.location.origin;
  if (process.env.NEXT_PUBLIC_BETTER_AUTH_URL) return process.env.NEXT_PUBLIC_BETTER_AUTH_URL;
  return "http://localhost:3000";
};

export const authClient = createAuthClient({
  baseURL: getClientBaseURL(),
  plugins: [organizationClient()],
});