const { Client } = require("pg");
const fs = require("fs");

const DB_URL = process.env.SUPABASE_DB_URL;
if (!DB_URL) {
  console.error("ERROR: Please set SUPABASE_DB_URL environment variable.");
  process.exit(1);
}

const sqlFile = process.argv[2];
if (!sqlFile) {
  console.error("Usage: node run-migration.js <path-to-sql-file>");
  process.exit(1);
}

async function run() {
  const client = new Client({
    connectionString: DB_URL,
    ssl: { rejectUnauthorized: false },
  });

  await client.connect();
  console.log("Connected to Supabase.");

  const sql = fs.readFileSync(sqlFile, "utf8");
  console.log(`\n=== Running ${sqlFile} ===`);
  await client.query(sql);
  console.log(`✅ Migration completed successfully!`);

  await client.end();
}

run().catch((err) => {
  console.error("❌ Migration failed:", err);
  process.exit(1);
});
