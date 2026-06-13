import { NextResponse } from 'next/server';
import sql from '@/lib/db';

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    const [p] = await sql`SELECT * FROM vr_properties WHERE id = ${parseInt(params.id)}`;
    if (!p) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ property: p });
  } catch {
    return NextResponse.json({ error: 'DB error' }, { status: 500 });
  }
}
