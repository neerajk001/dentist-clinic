import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { getAppointmentsByDate } from '@/actions/receptionist';
import { AppointmentsPageClient } from './appointments-client';

interface PageProps {
  searchParams: Promise<{ date?: string }>;
}

export default async function AppointmentsPage({ searchParams }: PageProps) {
  const session = await auth();
  if (!session) redirect('/login');

  const params = await searchParams;
  const dateParam = params.date;
  const selectedDate = dateParam ? new Date(dateParam) : new Date();
  if (isNaN(selectedDate.getTime())) redirect('/dashboard/appointments');

  const appointments = await getAppointmentsByDate(selectedDate);
  const isReceptionist = session.user?.role === 'receptionist';

  return (
    <AppointmentsPageClient
      initialDate={selectedDate}
      initialAppointments={appointments}
      isReceptionist={!!isReceptionist}
    />
  );
}
