#!/usr/bin/env bash
set -euo pipefail

FILE="${1:-}"
if [ -z "$FILE" ]; then
  echo "Usage: scripts/db-apply.sh supabase/migrations/<file>.sql"
  exit 1
fi

if [ -z "${SUPABASE_DB_URL:-}" ]; then
  echo "Error: SUPABASE_DB_URL is not set in your environment."
  echo "Set it to your Supabase Postgres connection string (use the 'Password' connection string)."
  exit 1
fi

echo "Applying migration: $FILE"
psql "$SUPABASE_DB_URL" -v ON_ERROR_STOP=1 -f "$FILE"
echo "Done."
