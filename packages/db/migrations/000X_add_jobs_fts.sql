-- Create full-text search index for jobs
CREATE INDEX jobs_fts_idx
ON jobs
USING GIN (
  to_tsvector(
    'english',
    coalesce(title, '') || ' ' || coalesce(description, '')
  )
);
