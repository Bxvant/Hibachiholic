set client_min_messages to warning;

-- DANGER: this is NOT how to do it in the real world.
-- `drop schema` INSTANTLY ERASES EVERYTHING.
drop schema "public" cascade;

create schema "public";

CREATE TABLE "users" (
  "userId" serial PRIMARY KEY,
  "username" text,
  "hashedPassword" text,
  "createdAt" timestamptz not NULL default now()
);

CREATE TABLE "menuItems" (
  "menuItemId" serial PRIMARY KEY,
  "name" text,
  "description" text,
  "price" integer,
  "imageUrl" text,
  "createdAt" timestamptz not NULL default now()
);

CREATE TABLE "favorites" (
  "favoriteId" serial PRIMARY KEY,
  "userId" integer,
  "menuItemId" integer unique,
  "createdAt" timestamptz not NULL default now()
);

CREATE TABLE "cart" (
  "cartId" serial PRIMARY KEY,
  "userId" integer,
  "menuItemId" integer,
  "quantity" integer,
  "createdAt" timestamptz not NULL default now()
);

ALTER TABLE "favorites" ADD FOREIGN KEY ("userId") REFERENCES "users" ("userId");

ALTER TABLE "favorites" ADD FOREIGN KEY ("menuItemId") REFERENCES "menuItems" ("menuItemId");

ALTER TABLE "cart" ADD FOREIGN KEY ("userId") REFERENCES "users" ("userId");

ALTER TABLE "cart" ADD FOREIGN KEY ("menuItemId") REFERENCES "menuItems" ("menuItemId");
