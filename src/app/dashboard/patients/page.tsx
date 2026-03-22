import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { PatientsPageClient } from './patients-client';

export default async function PatientsPage() {
  const session = await auth();
  if (!session) redirect('/login');

  return <PatientsPageClient />;
}
