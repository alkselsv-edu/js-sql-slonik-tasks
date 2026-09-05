# Общие принципы работы

## solution.js

Реализуйте и экспортируйте по умолчанию асинхронную функцию.

Функция должна с помощью Slonik:

1. Создать таблицу `articles` с полями:

```sql
id SERIAL PRIMARY KEY
title VARCHAR(255)
description VARCHAR(255)
```

2. Добавить в таблицу как минимум одну запись.
3. Закрыть пул соединений перед завершением работы.

Для подключения используйте `databaseUrl`, импортированный из `database.js`.

Пример:

```js
await solution();

const articles = await pool.any(sql.unsafe`
  SELECT title, description FROM articles
`);

console.log(articles.length > 0); // true
```
