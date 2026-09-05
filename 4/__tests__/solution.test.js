import assert from "node:assert/strict";
import test, { after, beforeEach } from "node:test";
import { sql } from "slonik";
import solution from "../solution.js";
import { createTestPool } from "../database.js";

const pool = await createTestPool();

beforeEach(async () => {
  await pool.query(sql.unsafe`
    DROP TABLE IF EXISTS orders, rooms, users
  `);
  await pool.query(sql.unsafe`
    CREATE TABLE rooms(
      id SERIAL PRIMARY KEY,
      room_number INT NOT NULL UNIQUE,
      places INT NOT NULL,
      status VARCHAR(255) NOT NULL
    )
  `);
  await pool.query(sql.unsafe`
    CREATE TABLE users(
      id SERIAL PRIMARY KEY,
      username VARCHAR(255) NOT NULL,
      phone VARCHAR(255) NOT NULL
    )
  `);
  await pool.query(sql.unsafe`
    CREATE TABLE orders(
      id SERIAL PRIMARY KEY,
      user_id INT NOT NULL REFERENCES users(id),
      room_id INT NOT NULL REFERENCES rooms(id),
      price INT NOT NULL
    )
  `);
  await pool.query(sql.unsafe`
    INSERT INTO rooms (room_number, places, status)
    VALUES (2, 2, 'free'), (3, 5, 'reserved')
  `);
});

after(async () => {
  await pool.end();
});

test("создаёт бронирование в одной транзакции", async () => {
  const user = {
    username: "Иван",
    phone: "+123456789",
  };

  await solution(user, 2, 1000);

  const users = await pool.any(sql.unsafe`SELECT username, phone FROM users`);
  const orders = await pool.any(sql.unsafe`SELECT room_id, price FROM orders`);
  const room = await pool.one(
    sql.unsafe`SELECT status FROM rooms WHERE id = 1`
  );

  assert.deepEqual(users.map((item) => ({ ...item })), [user]);
  assert.deepEqual(orders.map((item) => ({ ...item })), [
    { room_id: 1, price: 1000 },
  ]);
  assert.deepEqual({ ...room }, { status: "reserved" });
});

test("откатывает изменения, если комната недоступна", async () => {
  const user = {
    username: "Иван",
    phone: "+123456789",
  };

  await assert.rejects(() => solution(user, 3, 1000));

  const users = await pool.any(sql.unsafe`SELECT username, phone FROM users`);
  const orders = await pool.any(sql.unsafe`SELECT room_id, price FROM orders`);
  const room = await pool.one(
    sql.unsafe`SELECT status FROM rooms WHERE room_number = 3`
  );

  assert.deepEqual(users, []);
  assert.deepEqual(orders, []);
  assert.deepEqual({ ...room }, { status: "reserved" });
});
