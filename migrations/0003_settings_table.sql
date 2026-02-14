-- Settings / Key-Value Store
-- Used for Featured Artwork, CV, Contact Info, etc.

CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT -- JSON or simple string
);

-- Default values (initial seed)
INSERT OR IGNORE INTO settings (key, value) VALUES 
('featuredArtworkId', NULL),
('cv', '{"bio": "", "artistPhoto": "", "education": [], "awards": [], "highlights": []}'),
('contactInfo', '{"email": "", "location": "", "phone": ""}');
