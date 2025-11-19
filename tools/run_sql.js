const fs = require('fs');
const { Client } = require('pg');

async function main() {
  const sqlPath = process.argv[2];
  const conn = process.env.PG_CONN;
  if (!sqlPath) {
    console.error('Usage: node run_sql.js <path-to-sql-file>');
    process.exit(2);
  }
  if (!conn) {
    console.error('Environment variable PG_CONN is required (postgres connection string)');
    process.exit(2);
  }

  const sql = fs.readFileSync(sqlPath, 'utf8');
  const client = new Client({ connectionString: conn });
  try {
    await client.connect();
    console.log('Connected to DB, executing SQL file:', sqlPath);
    // Execute as a single multi-statement query
    await client.query('BEGIN');
    await client.query(sql);
    await client.query('COMMIT');
    console.log('SQL executed successfully.');
  } catch (err) {
    try { await client.query('ROLLBACK'); } catch (e) {}
    console.error('Error executing SQL:', err.message || err);
    process.exitCode = 1;
  } finally {
    await client.end();
  }
}

main();
