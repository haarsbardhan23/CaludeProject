import { drizzle } from 'drizzle-orm/neon-http';
import { relations } from './schema';

const db = drizzle({ connection: process.env.DATABASE_URL!, relations });

export { db } ;
