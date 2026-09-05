import assert from "node:assert/strict";
import test, { after, beforeEach } from "node:test";
import { sql } from "slonik";
import solution from "../solution.js";
import { createTestPool } from "../database.js";

const pool = await createTestPool();

beforeEach(async () => {
  await pool.query(sql.unsafe`DROP TABLE IF EXISTS articles`);
  await pool.query(sql.unsafe`
    CREATE TABLE articles(
      id SERIAL PRIMARY KEY,
      title VARCHAR(255),
      description VARCHAR(255)
    )
  `);
});

after(async () => {
  await pool.end();
});

test("добавляет статьи с помощью безопасных параметров", async () => {
  const articles = [
    {
      title: "Статья 1",
      description:
        "'); INSERT INTO articles (title, description) VALUES ('Взлом', 'Ошибка",
    },
    {
      title: "Статья 2",
      description: "Описание статьи 2",
    },
  ];

  const ids = await solution(articles);
  assert.deepEqual(ids, [1, 2]);

  const result = await pool.any(sql.unsafe`
    SELECT title, description
    FROM articles
    ORDER BY id
  `);

  assert.deepEqual(result.map((article) => ({ ...article })), articles);
});
