import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

export async function POST() {
  try {
    const sql = neon(process.env.DATABASE_URL!);
    // Tables are already created via psql migration
    // This endpoint just verifies connectivity
    const result = await sql`SELECT COUNT(*) as count FROM vr_properties`;
    return NextResponse.json({ ok: true, properties: result[0].count });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
