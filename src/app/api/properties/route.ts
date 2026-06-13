import { NextResponse } from 'next/server';
import sql from '@/lib/db';

export async function GET() {
  try {
    const properties = await sql`
      SELECT id, title, price, price_currency, type, operation, status,
             area_m2, rooms, bathrooms, parking, city, state, featured, images, amenities
      FROM vr_properties
      WHERE status = 'available'
      ORDER BY featured DESC, created_at DESC
    `;
    return NextResponse.json({ properties });
  } catch (error) {
    console.error('DB Error:', error);
    return NextResponse.json({ properties: [], error: 'DB error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, description, price, type, operation, area_m2, rooms, bathrooms, parking, city, state, images, amenities } = body;
    const [p] = await sql`
      INSERT INTO vr_properties (title, description, price, type, operation, area_m2, rooms, bathrooms, parking, city, state, images, amenities)
      VALUES (${title}, ${description}, ${price}, ${type}, ${operation}, ${area_m2}, ${rooms}, ${bathrooms}, ${parking}, ${city}, ${state}, ${images}, ${amenities})
      RETURNING id
    `;
    return NextResponse.json({ id: p.id });
  } catch (error) {
    return NextResponse.json({ error: 'Error creating property' }, { status: 500 });
  }
}
