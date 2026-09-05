# Инструкция

## PostgreSQL в Docker

Запустите контейнер PostgreSQL для заданий Slonik (порт `5432`):

```bash
docker run --name postgres-js-sql-slonik \
  -e POSTGRES_USER=js_sql_slonik_user \
  -e POSTGRES_PASSWORD=js_sql_slonik_password \
  -e POSTGRES_DB=js_sql_slonik_db \
  -p 5432:5432 \
  -d postgres:16
```

Проверка, что контейнер работает:

```bash
docker ps
docker exec -it postgres-js-sql-slonik pg_isready -U js_sql_slonik_user -d js_sql_slonik_db
```

Остановка и удаление контейнера:

```bash
docker stop postgres-js-sql-slonik
docker rm postgres-js-sql-slonik
```

## Запуск задания

Перейдите в каталог нужного задания, например:

```bash
cd js-sql-slonik-tasks/1
```

Установка зависимостей:

```bash
npm install
```

По умолчанию используется подключение `postgresql://js_sql_slonik_user:js_sql_slonik_password@127.0.0.1:5432/js_sql_slonik_db`.

Проверка кода:

```bash
npm test -s
```

или:

```bash
make test
```

