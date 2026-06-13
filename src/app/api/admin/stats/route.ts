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

  const [props]     = await sql`SELECT COUNT(*) as total FROM vr_properties`;
  const [avail]     = await sql`SELECT COUNT(*) as total FROM vr_properties WHERE status='available'`;
  const [leads]     = await sql`SELECT COUNT(*) as total FROM vr_leads`;
  const [newLeads]  = await sql`SELECT COUNT(*) as total FROM vr_leads WHERE status='new'`;
  const [favs]      = await sql`SELECT COUNT(*) as total FROM vr_favorites`;
  const byType      = await sql`SELECT type, COUNT(*) as total FROM vr_properties GROUP BY type`;
  const byOp        = await sql`SELECT operation, COUNT(*) as total FROM vr_properties GROUP BY operation`;
  const recentLeads = await sql`
    SELECT l.name, l.email, l.created_at, p.title as property
    FROM vr_leads l LEFT JOIN vr_properties p ON p.id = l.property_id
    ORDER BY l.created_at DESC LIMIT 5
  `;

  return NextResponse.json({
    properties: { total: props.total, available: avail.total },
    leads:      { total: leads.total, new: newLeads.total },
    favorites:  { total: favs.total },
    byType, byOp, recentLeads,
  });
}
