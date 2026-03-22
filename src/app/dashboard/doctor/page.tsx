import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { getTodaysAppointments } from '@/actions/doctor';
import { DoctorAppointmentsList } from '@/components/appointments/doctor-appointments-list';

export default async function DoctorDashboardPage() {
  const session = await auth();
  if (!session) redirect('/login');
  if (session.user?.role !== 'doctor') redirect('/dashboard');

  const appointments = await getTodaysAppointments();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Patients Today</h1>
        <p className="text-gray-600 mt-1">View today&apos;s appointments and add treatment notes.</p>
      </div>

      <DoctorAppointmentsList appointments={appointments} />
    </div>
  );
}
