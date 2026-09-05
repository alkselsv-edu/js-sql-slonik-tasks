import assert from "node:assert/strict";
import test, { after, beforeEach } from "node:test";
import { sql } from "slonik";
import solution from "../solution.js";
import { createTestPool } from "../database.js";

const pool = await createTestPool();

beforeEach(async () => {
  await pool.query(sql.unsafe`DROP TABLE IF EXISTS articles`);
});

after(async () => {
  await pool.end();
});

test("создаёт таблицу articles и добавляет запись", async () => {
  await solution();

  const articles = await pool.any(sql.unsafe`
    SELECT title, description FROM articles
  `);

  assert.ok(articles.length > 0);
  assert.equal(typeof articles[0].title, "string");
  assert.equal(typeof articles[0].description, "string");
});
