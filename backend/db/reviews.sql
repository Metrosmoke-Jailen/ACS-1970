CREATE TABLE IF NOT EXISTS reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    -- no FK yet; add REFERENCES users(id) ON DELETE CASCADE when users table exists
    user_id INTEGER NOT NULL,
    target_type TEXT NOT NULL CHECK (target_type IN ('movie')),
    target_id INTEGER NOT NULL,
    rating INTEGER CHECK (rating BETWEEN 1 AND 10),
    body TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (
        user_id,
        target_type,
        target_id
    )
);