import { NextResponse } from 'next/server';
import { auth, clerkClient } from '@clerk/nextjs/server';
import sql from '@/lib/db';

async function isAdmin(userId: string) {
  try {
    const clerk = await clerkClient();
    const user = await clerk.users.getUser(userId);
    return user.publicMetadata?.role === 'admin' || user.privateMetadata?.role === 'admin';
  } catch { return false; }
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const { userId } = await auth();
  if (!userId || !(await isAdmin(userId)))
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const b = await req.json();
  const id = parseInt(params.id);
  await sql`
    UPDATE vr_properties SET
      title      = COALESCE(${b.title}, title),
      description= COALESCE(${b.description}, description),
      price      = COALESCE(${b.price}, price),
      type       = COALESCE(${b.type}, type),
      operation  = COALESCE(${b.operation}, operation),
      status     = COALESCE(${b.status}, status),
      area_m2    = COALESCE(${b.area_m2}, area_m2),
      rooms      = COALESCE(${b.rooms}, rooms),
      bathrooms  = COALESCE(${b.bathrooms}, bathrooms),
      parking    = COALESCE(${b.parking}, parking),
      city       = COALESCE(${b.city}, city),
      state      = COALESCE(${b.state}, state),
      featured   = COALESCE(${b.featured}, featured),
      images     = COALESCE(${b.images}, images),
      amenities  = COALESCE(${b.amenities}, amenities),
      updated_at = NOW()
    WHERE id = ${id}
  `;
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const { userId } = await auth();
  if (!userId || !(await isAdmin(userId)))
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await sql`DELETE FROM vr_properties WHERE id = ${parseInt(params.id)}`;
  return NextResponse.json({ ok: true });
}
