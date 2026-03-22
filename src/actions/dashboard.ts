'use server';

import { supabase } from '@/lib/db';

export interface DashboardStats {
  totalAppointments: number;
  todaysAppointments: number;
  totalPatients: number;
  treatmentsCount: number;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const today = new Date();
  const startOfDay = new Date(today);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(today);
  endOfDay.setHours(23, 59, 59, 999);

  const [appointmentsRes, todayRes, patientsRes, treatmentsRes] = await Promise.all([
    supabase.from('appointments').select('id', { count: 'exact', head: true }),
    supabase
      .from('appointments')
      .select('id', { count: 'exact', head: true })
      .gte('date', startOfDay.toISOString())
      .lte('date', endOfDay.toISOString())
      .not('status', 'in', '(cancelled,no_show)'),
    supabase.from('patients').select('id', { count: 'exact', head: true }),
    supabase.from('treatments').select('id', { count: 'exact', head: true }),
  ]);

  return {
    totalAppointments: appointmentsRes.count ?? 0,
    todaysAppointments: todayRes.count ?? 0,
    totalPatients: patientsRes.count ?? 0,
    treatmentsCount: treatmentsRes.count ?? 0,
  };
}

export interface RecentActivityItem {
  id: string;
  type: 'appointment' | 'patient';
  title: string;
  subtitle: string;
  date: string;
}

export async function getRecentActivity(limit = 10): Promise<RecentActivityItem[]> {
  // Try with patient join first
  const { data: appointments, error } = await supabase
    .from('appointments')
    .select(`
      id,
      date,
      time_slot,
      status,
      created_at,
      patient:patients(id, name)
    `)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    // Fallback: fetch appointments only (no join) so dashboard still works
    const { data: appointmentsOnly } = await supabase
      .from('appointments')
      .select('id, date, time_slot, status, created_at')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (appointmentsOnly?.length) {
      return appointmentsOnly.map((apt: Record<string, unknown>) => ({
        id: String(apt.id),
        type: 'appointment' as const,
        title: 'Appointment',
        subtitle: `${apt.time_slot} • ${apt.status}`,
        date: String(apt.created_at),
      }));
    }
    return [];
  }

  return (appointments || []).map((apt: Record<string, unknown>) => {
    const patient = apt.patient as { name?: string } | { name?: string }[] | null;
    const name = Array.isArray(patient) ? patient[0]?.name : patient?.name;
    return {
      id: String(apt.id),
      type: 'appointment' as const,
      title: name ?? 'Unknown',
      subtitle: `${apt.time_slot} • ${apt.status}`,
      date: String(apt.created_at),
    };
  });
}
