import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function DoctorLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  if (session.user?.role !== 'doctor') {
    redirect('/dashboard');
  }

  // The parent /dashboard/layout.tsx already provides Sidebar + Navbar.
  // This layout only enforces the doctor-role guard.
  return <>{children}</>;
}

