CREATE TABLE IF NOT EXISTS website_cache_versions (
  tenant_id TEXT PRIMARY KEY,
  revision INTEGER NOT NULL DEFAULT 0,
  last_event_id TEXT NOT NULL DEFAULT ''
);
