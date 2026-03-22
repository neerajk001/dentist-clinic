import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function ReceptionistLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  if (session.user?.role !== 'receptionist') {
    redirect('/dashboard');
  }

  // The parent /dashboard/layout.tsx already provides Sidebar + Navbar.
  // This layout only enforces the receptionist-role guard.
  return <>{children}</>;
}

