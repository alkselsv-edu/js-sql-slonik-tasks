import { createPool } from "slonik";

export const databaseUrl =
  process.env.DATABASE_URL ??
  "postgresql://js_sql_slonik_user:js_sql_slonik_password@127.0.0.1:5432/js_sql_slonik_db";

export const createTestPool = () => createPool(databaseUrl);
