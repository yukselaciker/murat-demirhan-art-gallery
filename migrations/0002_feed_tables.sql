-- Migration: 0002_feed_tables
-- Created: 2025-12-12
-- Description: Feed posts with emoji reactions system

-- Posts table (artist updates/feed)
CREATE TABLE IF NOT EXISTS posts (
    id TEXT PRIMARY KEY,
    title TEXT,
    body TEXT,
    images_json TEXT,  -- JSON array of R2 keys
    created_at TEXT NOT NULL,
    status TEXT DEFAULT 'draft' CHECK(status IN ('published', 'draft'))
);

CREATE INDEX IF NOT EXISTS idx_posts_status ON posts(status);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);

-- Emoji reactions aggregated counts
CREATE TABLE IF NOT EXISTS reactions (
    post_id TEXT NOT NULL,
    emoji TEXT NOT NULL CHECK(emoji IN ('heart', 'fire', 'clap', 'wow')),
    count INTEGER DEFAULT 0,
    PRIMARY KEY (post_id, emoji),
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
);

-- Individual reaction events (for anti-spam)
CREATE TABLE IF NOT EXISTS reaction_events (
    post_id TEXT NOT NULL,
    emoji TEXT NOT NULL,
    viewer_hash TEXT NOT NULL,
    created_at TEXT NOT NULL,
    UNIQUE (post_id, emoji, viewer_hash),
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_reaction_events_post ON reaction_events(post_id);
