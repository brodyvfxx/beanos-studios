-- Beanos Studios — D1 database schema
-- Run this once against your D1 database (instructions below in chat).

CREATE TABLE IF NOT EXISTS ratings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  film_id TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS comments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  film_id TEXT NOT NULL,
  name TEXT,
  message TEXT NOT NULL,
  likes INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_ratings_film ON ratings(film_id);
CREATE INDEX IF NOT EXISTS idx_comments_film ON comments(film_id);
