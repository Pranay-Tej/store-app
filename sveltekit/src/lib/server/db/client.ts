import { env } from '$env/dynamic/private';
import schema from '$lib/schema';
import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';

const pool = new pg.Pool({
	connectionString: env.DATABASE_URL
});

const client = await pool.connect();

export const db = drizzle(client, { schema, logger: process.env.NODE_ENV === 'development' });
