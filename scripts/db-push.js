const { neon } = require('@neondatabase/serverless');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const sql = neon(process.env.DATABASE_URL);

async function main() {
  const schema = fs.readFileSync(path.join(__dirname, '../src/lib/schema.sql'), 'utf8');
  const stmts = schema.split(';').map(s => s.trim()).filter(s => s.length > 10);
  for (const stmt of stmts) {
    try {
      await sql.unsafe(stmt + ';');
      console.log('OK:', stmt.slice(0, 50));
    } catch (e) {
      console.warn('SKIP:', e.message.slice(0, 80));
    }
  }
  console.log('DB push complete');
  process.exit(0);
}
main().catch(e => { console.error(e); process.exit(1); });
