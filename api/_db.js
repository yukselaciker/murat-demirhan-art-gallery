import pkg from 'pg';

const { Pool } = pkg;

const connectionString =
  process.env.SUPABASE_CONNECTION_STRING ||
  process.env.SUPABASE_DB_URL ||
  process.env.DATABASE_URL;

let pool;

export function hasDatabaseConnection() {
  return Boolean(connectionString);
}

function getPool() {
  if (pool) return pool;

  if (!connectionString) {
    throw new Error(
      'Missing SUPABASE_CONNECTION_STRING (e.g. postgresql://user:pass@host:5432/db)',
    );
  }

  pool = new Pool({
    connectionString,
    ssl: connectionString.includes('supabase.co')
      ? { rejectUnauthorized: false }
      : undefined,
  });

  pool.on('error', (err) => {
    console.error('[db] Unexpected error on idle client', err);
  });

  return pool;
}

export async function query(text, params) {
  const client = await getPool().connect();

  try {
    return await client.query(text, params);
  } finally {
    client.release();
  }
}

export async function ensureTable(sql) {
  await query(sql);
}
