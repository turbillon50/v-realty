import { NextResponse } from 'next/server';
import sql from '@/lib/db';
import fs from 'fs';
import path from 'path';

export async function POST() {
  try {
    const schemaPath = path.join(process.cwd(), 'src/lib/schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    // Execute each statement
    const stmts = schema.split(';').map(s => s.trim()).filter(s => s.length > 10);
    for (const stmt of stmts) {
      await sql.unsafe(stmt + ';');
    }
    return NextResponse.json({ ok: true, message: 'Schema applied' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
