import { NextResponse } from 'next/server';
import { auth, clerkClient } from '@clerk/nextjs/server';

// Bootstrap: solo funciona si no hay admins todavía, o si el ADMIN_SECRET coincide
export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'No auth' }, { status: 401 });

  const { secret } = await req.json();
  const ADMIN_SECRET = process.env.ADMIN_BOOTSTRAP_SECRET || 'vrealty-admin-2024';

  if (secret !== ADMIN_SECRET) {
    return NextResponse.json({ error: 'Invalid secret' }, { status: 403 });
  }

  const clerk = await clerkClient();
  await clerk.users.updateUserMetadata(userId, {
    publicMetadata: { role: 'admin' },
  });

  return NextResponse.json({ ok: true, message: 'Admin role granted' });
}
