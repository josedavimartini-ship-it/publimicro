$env:SUPABASE_DB_URL = "postgresql://postgres.irrzpwzyqcubhhjeuakc:P16r8C3_q7%40@aws-0-us-east-1.pooler.supabase.com:6543/postgres"
$env:MIGRATION_FILE = "supabase/migrations/20250105000001_add_neighborhood_data.sql"
node .\scripts\run-neighborhood-migration.js
