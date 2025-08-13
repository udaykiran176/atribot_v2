import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

import { db } from "@/db/drizzle";
import { schema } from "@/db/schema";

// Get the base URL for the current environment
const getBaseURL = () => {
    if (process.env.VERCEL_URL) {
        return `https://${process.env.VERCEL_URL}`;
    }
    if (process.env.BETTER_AUTH_URL) {
        return process.env.BETTER_AUTH_URL;
    }
    return "http://localhost:3000";
};

// Validate required environment variables
const validateEnv = () => {
    const required = ['GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET'];
    const missing = required.filter(key => !process.env[key]);
    
    if (missing.length > 0) {
        console.error('Missing required environment variables:', missing);
        throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
    }
};

// Validate environment variables
validateEnv();

export const auth = betterAuth({
    baseURL: getBaseURL(),
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        },
    },
   
    database: drizzleAdapter(db, {
        provider: "pg",
        schema,
    }),

});