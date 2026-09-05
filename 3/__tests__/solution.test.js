import assert from "node:assert/strict";
import test, { after, beforeEach } from "node:test";
import { sql } from "slonik";
import solution from "../solution.js";
import { createTestPool } from "../database.js";

const pool = await createTestPool();

beforeEach(async () => {
  await pool.query(sql.unsafe`DROP TABLE IF EXISTS books`);
  await pool.query(sql.unsafe`
    CREATE TABLE books(
      title VARCHAR(255),
      author VARCHAR(255)
    )
  `);
});

after(async () => {
  await pool.end();
});

test("добавляет книгу через пул Slonik", async () => {
  const book = {
    title: "Война и мир",
    author: "Лев Толстой",
  };

  await solution(book);

  const books = await pool.any(sql.unsafe`
    SELECT title, author FROM books
  `);

  assert.deepEqual(books.map((item) => ({ ...item })), [book]);
});
