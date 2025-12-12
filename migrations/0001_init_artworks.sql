-- Migration: 0001_init_artworks
-- Created: 2025-12-12
-- Description: Initial artworks table for Murat Demirhan Art Gallery

CREATE TABLE IF NOT EXISTS artworks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    year INTEGER,
    technique TEXT,
    size TEXT,
    image_url TEXT,
    category TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_artworks_category ON artworks(category);
CREATE INDEX IF NOT EXISTS idx_artworks_year ON artworks(year);
CREATE INDEX IF NOT EXISTS idx_artworks_created_at ON artworks(created_at DESC);
