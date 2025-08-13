import { config } from "dotenv";
import { drizzle } from 'drizzle-orm/neon-http';
import { schema } from './schema';
import { neon } from '@neondatabase/serverless';

config({ path: ".env" }); // or .env.local

export const db = drizzle(process.env.DATABASE_URL!, { schema });

export const sql = neon(process.env.DATABASE_URL!);
