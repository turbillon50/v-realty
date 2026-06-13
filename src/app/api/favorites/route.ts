import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import sql from '@/lib/db';

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const favs = await sql`
    SELECT p.* FROM vr_favorites f
    JOIN vr_properties p ON p.id = f.property_id
    WHERE f.clerk_user_id = ${userId}
    ORDER BY f.created_at DESC
  `;
  return NextResponse.json({ favorites: favs });
}

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { property_id } = await req.json();
  await sql`
    INSERT INTO vr_favorites (clerk_user_id, property_id) VALUES (${userId}, ${property_id})
    ON CONFLICT DO NOTHING
  `;
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { property_id } = await req.json();
  await sql`DELETE FROM vr_favorites WHERE clerk_user_id = ${userId} AND property_id = ${property_id}`;
  return NextResponse.json({ ok: true });
}
