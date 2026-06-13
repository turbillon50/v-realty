import { auth, currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { clerkClient } from '@clerk/nextjs/server';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const { userId } = await auth();
  if (!userId) redirect('/sign-in');

  const clerk = await clerkClient();
  const user = await clerk.users.getUser(userId);
  const role = user.publicMetadata?.role || user.privateMetadata?.role;

  if (role !== 'admin') {
    redirect('/?error=unauthorized');
  }

  return <>{children}</>;
}
