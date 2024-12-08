import { neon } from '@neondatabase/serverless';

let sql;

if (!sql) {
  sql = neon(process.env.DATABASE_URL);
}

export { sql };
