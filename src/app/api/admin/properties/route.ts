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

export async function GET() {
  const { userId } = await auth();
  if (!userId || !(await isAdmin(userId)))
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const props = await sql`
    SELECT p.*,
      (SELECT COUNT(*) FROM vr_leads l WHERE l.property_id = p.id) as lead_count
    FROM vr_properties p
    ORDER BY p.created_at DESC
  `;
  return NextResponse.json({ properties: props });
}

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId || !(await isAdmin(userId)))
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const b = await req.json();
  const [p] = await sql`
    INSERT INTO vr_properties
      (title, description, price, price_currency, type, operation, status,
       area_m2, rooms, bathrooms, parking, address, city, state, featured, images, amenities)
    VALUES
      (${b.title}, ${b.description||''}, ${b.price}, ${b.price_currency||'MXN'},
       ${b.type}, ${b.operation}, ${b.status||'available'},
       ${b.area_m2||null}, ${b.rooms||null}, ${b.bathrooms||null}, ${b.parking||0},
       ${b.address||''}, ${b.city||''}, ${b.state||''}, ${b.featured||false},
       ${b.images||[]}, ${b.amenities||[]})
    RETURNING id
  `;
  return NextResponse.json({ id: p.id });
}
