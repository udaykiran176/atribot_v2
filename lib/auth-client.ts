import { organizationClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

// Get the base URL for the client
const getClientBaseURL = () => {

  // Default to localhost for development
  return process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
};

export const authClient = createAuthClient({
  baseURL: getClientBaseURL(),
  plugins: [organizationClient()],
});