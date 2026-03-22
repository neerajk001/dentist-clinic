import { redirect } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { auth } from '@/lib/auth';
import { getDashboardStats, getRecentActivity } from '@/actions/dashboard';
import { format } from 'date-fns';

export default async function DashboardPage() {
  const session = await auth();
  if (!session) redirect('/login');

  const [stats, recentActivity] = await Promise.all([
    getDashboardStats(),
    getRecentActivity(10),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {session.user?.name}
        </h1>
        <p className="text-gray-600 mt-1">
          Here is an overview of your dental clinic activities.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Appointments</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{stats.totalAppointments}</p>
            </div>
            <div className="text-4xl">📅</div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Today&apos;s Appointments</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{stats.todaysAppointments}</p>
            </div>
            <div className="text-4xl">📋</div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Patients</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{stats.totalPatients}</p>
            </div>
            <div className="text-4xl">👥</div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Treatments Available</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{stats.treatmentsCount}</p>
            </div>
            <div className="text-4xl">💊</div>
          </div>
        </Card>
      </div>

      <Card title="Recent Activity">
        {recentActivity.length === 0 ? (
          <p className="text-gray-600 text-center py-8">No recent activity to display.</p>
        ) : (
          <div className="divide-y divide-gray-100">
            {recentActivity.map((item) => (
              <div key={item.id} className="py-4 first:pt-0">
                <p className="font-medium text-gray-900">{item.title}</p>
                <p className="text-sm text-gray-500">{item.subtitle}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {format(new Date(item.date), 'MMM d, yyyy · h:mm a')}
                </p>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
