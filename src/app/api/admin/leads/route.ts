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

  const leads = await sql`
    SELECT l.*, p.title as property_title
    FROM vr_leads l
    LEFT JOIN vr_properties p ON p.id = l.property_id
    ORDER BY l.created_at DESC
    LIMIT 200
  `;
  return NextResponse.json({ leads });
}

export async function PATCH(req: Request) {
  const { userId } = await auth();
  if (!userId || !(await isAdmin(userId)))
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id, status } = await req.json();
  await sql`UPDATE vr_leads SET status = ${status} WHERE id = ${id}`;
  return NextResponse.json({ ok: true });
}
