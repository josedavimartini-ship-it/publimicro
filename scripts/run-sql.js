const { Client } = require("pg");
const fs = require("fs");
const path = require("path");

const DB_URL = process.env.SUPABASE_DB_URL;
if (!DB_URL) {
  console.error("ERROR: Please set SUPABASE_DB_URL environment variable.");
  process.exit(1);
}

const sqlFiles = [
  "apps/publimicro/sql/01_create_profiles.sql",
  "apps/publimicro/sql/02_create_ads.sql",
  "apps/publimicro/sql/03_create_visits.sql",
  "apps/publimicro/sql/04_create_proposals.sql",
  "apps/publimicro/sql/05_create_bids.sql",
  "apps/publimicro/sql/06_create_sitios.sql",
];

async function run() {
  const client = new Client({
    connectionString: DB_URL,
    ssl: { rejectUnauthorized: false },
  });

  await client.connect();
  console.log("Connected to Supabase.");

  await client.query('CREATE EXTENSION IF NOT EXISTS "pgcrypto";');
  console.log('Ensured extension "pgcrypto".');

  for (const rel of sqlFiles) {
    const filePath = path.resolve(process.cwd(), rel);
    const sql = fs.readFileSync(filePath, "utf8");
    console.log(`\n=== Running ${rel} ===`);
    await client.query(sql);
    console.log(`OK: ${rel}`);
  }

  try {
    console.log("\nAttempting to create storage bucket 'imagens-sitios'...");
    await client.query(`select storage.create_bucket('imagens-sitios', public => true);`);
    console.log("Bucket created.");
  } catch (e) {
    console.log("Bucket step:", e.message);
  }

  await client.end();
  console.log("\nAll SQL executed successfully.");
}

run().catch((err) => {
  console.error("SQL runner failed:", err);
  process.exit(1);
});
