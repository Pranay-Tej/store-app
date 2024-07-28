import { env } from '$env/dynamic/private';
import schema from '$lib/schema';
import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';

const pool = new pg.Pool({
	connectionString: env.DATABASE_URL
});

export const db = drizzle(pool, {
	schema,
	logger: true
	// process.env.NODE_ENV === 'development'
});
