import fs from 'node:fs';
import path from 'node:path';
import Database from 'better-sqlite3';

const defaultPath = path.resolve(process.cwd(), 'data', 'fitmatch.db');
const databasePath = process.env.DATABASE_URL || defaultPath;
const databaseDir = path.dirname(databasePath);

if (!fs.existsSync(databaseDir)) {
  fs.mkdirSync(databaseDir, { recursive: true });
}

const db = new Database(databasePath);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS outfits (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    occasion TEXT NOT NULL,
    weather TEXT NOT NULL,
    vibe TEXT NOT NULL,
    color_preference TEXT,
    description TEXT,
    items TEXT NOT NULL,
    accessories TEXT,
    image_url TEXT,
    favorite INTEGER DEFAULT 0,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );
`);

export default db;
