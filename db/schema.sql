PRAGMA foreign_keys=OFF;
BEGIN TRANSACTION;
CREATE TABLE "user" (
    "id" integer PRIMARY KEY,
    "disabled" integer NOT NULL DEFAULT 0,
    "username" text NOT NULL,
    "password" text NOT NULL
);
CREATE TABLE "news" (
    "id" integer PRIMARY KEY,
    "deleted" integer NOT NULL DEFAULT 0,
    "title" text NOT NULL,
    "body" text NOT NULL,
    "date" datetime NOT NULL
);
CREATE TABLE "location" (
    "id" integer PRIMARY KEY,
    "name" text UNIQUE NOT NULL,
    "latitude" real,
    "longitude" real,
    "description" text
);
CREATE TABLE "group" (
    "id" integer PRIMARY KEY,
    "name" text UNIQUE NOT NULL,
    "prefix" text UNIQUE NOT NULL,
    "description" text,
    "location_id" integer,
    FOREIGN KEY("location_id") REFERENCES "location"("id")
);
CREATE TABLE "photo" (
    "id" integer PRIMARY KEY,
    "deleted" integer NOT NULL DEFAULT 0,
    "group_id" integer NOT NULL,
    "name" text UNIQUE NOT NULL,
    "description" text,
    FOREIGN KEY("group_id") REFERENCES "group"("id")
);
CREATE TABLE "comment" (
    "id" integer PRIMARY KEY,
    "deleted" integer NOT NULL DEFAULT 0,
    "type" text NOT NULL DEFAULT "photo",
    "date" datetime NOT NULL,
    "nick" text NOT NULL,
    "message" text NOT NULL,
    "response" text,
    "photo_id" integer,
    FOREIGN KEY("photo_id") REFERENCES "photo"("id")
);
COMMIT;
