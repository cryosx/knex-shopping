DROP DATABASE IF EXISTS knex_shopping;
DROP USER IF EXISTS knex_shopping_user;
CREATE USER knex_shopping_user;
CREATE DATABASE knex_shopping WITH OWNER
knex_shopping_user;

\c knex_shopping knex_shopping_user

DROP TABLE IF EXISTS cart;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS products;

CREATE TABLE IF NOT EXISTS users
(
  id serial NOT NULL PRIMARY KEY,
  email varchar(255) NOT NULL,
  password varchar(255) NOT NULL,
  created_at timestamp without time zone NOT NULL DEFAULT now(),
  updated_at timestamp without time zone NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS products
(
  id serial NOT NULL PRIMARY KEY,
  title varchar(255) NOT NULL,
  description text NOT NULL,
  inventory integer NOT NULL DEFAULT 0,
  price decimal(8,2) NOT NULL,
  created_at timestamp without time zone NOT NULL DEFAULT now(),
  updated_at timestamp without time zone NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS cart
(
  id serial PRIMARY KEY,
  user_id integer NOT NULL REFERENCES users (id),
  products_id integer NOT NULL REFERENCES products (id),
  created_at timestamp without time zone NOT NULL DEFAULT now(),
  updated_at timestamp without time zone NOT NULL DEFAULT now()
);

INSERT INTO users (email, password)
VALUES ('test@test.com','test');

-- SELECT *
-- FROM users;