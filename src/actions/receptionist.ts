'use server';

import { z } from 'zod';
import { supabase } from '@/lib/db';
import { revalidatePath } from 'next/cache';

const BOOKING_SLOTS = [
  '09:00-10:00',
  '10:00-11:00',
  '11:00-12:00',
  '14:00-15:00',
  '15:00-16:00',
  '16:00-17:00',
  '17:00-18:00',
];

export interface AppointmentWithPatient {
  id: string;
  patient: { id: string; name: string; phone: string; email: string };
  doctor: { id: string; name: string };
  date: string;
  timeSlot: string;
  complaint?: string;
  status: string;
  notes?: string;
  createdAt: string;
}

export async function getAppointmentsByDate(date: Date) {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  const { data: appointments, error } = await supabase
    .from('appointments')
    .select(`
      *,
      patient:patients(*),
      doctor:users(*)
    `)
    .gte('date', startOfDay.toISOString())
    .lte('date', endOfDay.toISOString())
    .order('date', { ascending: true });

  if (error) {
    console.error('Error fetching appointments:', error);
    return [];
  }

  return (appointments || []).map((apt: any) => ({
    id: apt.id,
    patient: {
      id: apt.patient.id,
      name: apt.patient.name,
      phone: apt.patient.phone,
      email: apt.patient.email,
    },
    doctor: {
      id: apt.doctor.id,
      name: apt.doctor.name,
    },
    date: apt.date,
    timeSlot: apt.time_slot,
    complaint: apt.complaint,
    status: apt.status,
    notes: apt.notes,
    createdAt: apt.created_at,
  }));
}

export async function searchPatients(query: string) {
  const { data: patients, error } = await supabase
    .from('patients')
    .select('*')
    .or(`name.ilike.%${query}%,phone.ilike.%${query}%,email.ilike.%${query}%`)
    .order('created_at', { ascending: false })
    .limit(20);

  if (error) {
    console.error('Error searching patients:', error);
    return [];
  }

  return (patients || []).map((patient) => ({
    id: patient.id,
    name: patient.name,
    phone: patient.phone,
    email: patient.email,
    createdAt: patient.created_at,
  }));
}

const updateStatusSchema = z.object({
  appointmentId: z.string(),
  status: z.enum(['scheduled', 'confirmed', 'waiting', 'in_treatment', 'completed', 'no_show', 'cancelled']),
});

export async function updateAppointmentStatus(data: z.infer<typeof updateStatusSchema>) {
  try {
    const validated = updateStatusSchema.parse(data);

    const { data: appointment, error } = await supabase
      .from('appointments')
      .update({ status: validated.status })
      .eq('id', validated.appointmentId)
      .select(`*, patient:patients(*)`)
      .single();

    if (error || !appointment) {
      return { success: false, error: 'Appointment not found' };
    }

    revalidatePath('/dashboard/receptionist');
    revalidatePath('/dashboard/appointments');

    return {
      success: true,
      data: {
        appointmentId: appointment.id,
        status: appointment.status,
      },
    };
  } catch (error) {
    console.error('Update status error:', error);
    return { success: false, error: 'Failed to update appointment status' };
  }
}

const rescheduleSchema = z.object({
  appointmentId: z.string(),
  newDate: z.coerce.date(),
  newTimeSlot: z.string(),
});

export async function rescheduleAppointment(data: z.infer<typeof rescheduleSchema>) {
  try {
    const validated = rescheduleSchema.parse(data);

    // Check if the new slot is available
    const { data: existingAppointment } = await supabase
      .from('appointments')
      .select('*')
      .neq('id', validated.appointmentId)
      .eq('time_slot', validated.newTimeSlot)
      .in('status', ['scheduled', 'confirmed', 'waiting', 'in_treatment'])
      .single();

    if (existingAppointment) {
      return { success: false, error: 'This time slot is already booked' };
    }

    const appointmentDate = new Date(validated.newDate);
    const [hours, minutes] = validated.newTimeSlot.split('-')[0].split(':');
    appointmentDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);

    const { data: appointment, error } = await supabase
      .from('appointments')
      .update({
        date: appointmentDate.toISOString(),
        time_slot: validated.newTimeSlot,
        status: 'scheduled',
      })
      .eq('id', validated.appointmentId)
      .select(`*, patient:patients(*)`)
      .single();

    if (error || !appointment) {
      return { success: false, error: 'Appointment not found' };
    }

    revalidatePath('/dashboard/receptionist');
    revalidatePath('/dashboard/appointments');

    return {
      success: true,
      data: {
        appointmentId: appointment.id,
        date: appointment.date,
        timeSlot: appointment.time_slot,
      },
    };
  } catch (error) {
    console.error('Reschedule error:', error);
    return { success: false, error: 'Failed to reschedule appointment' };
  }
}

export async function cancelAppointment(appointmentId: string) {
  try {
    const { data: appointment, error } = await supabase
      .from('appointments')
      .update({ status: 'cancelled' })
      .eq('id', appointmentId)
      .select(`*, patient:patients(*)`)
      .single();

    if (error || !appointment) {
      return { success: false, error: 'Appointment not found' };
    }

    revalidatePath('/dashboard/receptionist');
    revalidatePath('/dashboard/appointments');

    return { success: true, data: { appointmentId } };
  } catch (error) {
    console.error('Cancel error:', error);
    return { success: false, error: 'Failed to cancel appointment' };
  }
}

const createAppointmentSchema = z.object({
  date: z.coerce.date(),
  timeSlot: z.string(),
  patientId: z.string().optional(),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  email: z.string().email('Invalid email address'),
  complaint: z.string().optional(),
});

export async function createAppointmentManual(data: z.infer<typeof createAppointmentSchema>) {
  try {
    const validated = createAppointmentSchema.parse(data);

    const startOfDay = new Date(validated.date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(validated.date);
    endOfDay.setHours(23, 59, 59, 999);

    // Check if slot is available
    const { data: existingAppointment } = await supabase
      .from('appointments')
      .select('*')
      .gte('date', startOfDay.toISOString())
      .lte('date', endOfDay.toISOString())
      .eq('time_slot', validated.timeSlot)
      .in('status', ['scheduled', 'confirmed', 'waiting', 'in_treatment'])
      .single();

    if (existingAppointment) {
      return {
        success: false,
        error: 'This time slot is already booked.'
      };
    }

    // Find or create patient
    let patient;
    if (validated.patientId) {
      const { data } = await supabase
        .from('patients')
        .select('*')
        .eq('id', validated.patientId)
        .single();
      patient = data;
    } else {
      const { data } = await supabase
        .from('patients')
        .select('*')
        .eq('phone', validated.phone)
        .single();
      patient = data;
    }

    if (!patient) {
      const { data: newPatient, error } = await supabase
        .from('patients')
        .insert({
          name: validated.name,
          email: validated.email,
          phone: validated.phone,
        })
        .select()
        .single();

      if (error) {
        return { success: false, error: 'Failed to create patient' };
      }
      patient = newPatient;
    } else {
      // Update patient info
      await supabase
        .from('patients')
        .update({
          name: validated.name,
          email: validated.email,
        })
        .eq('id', patient.id);
    }

    // Get first doctor
    const { data: doctor } = await supabase
      .from('users')
      .select('*')
      .eq('role', 'doctor')
      .limit(1)
      .single();

    if (!doctor) {
      return {
        success: false,
        error: 'No doctors available.'
      };
    }

    const appointmentDate = new Date(validated.date);
    const [hours, minutes] = validated.timeSlot.split('-')[0].split(':');
    appointmentDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);

    // Calculate end time (default 30 min duration)
    const endTime = new Date(appointmentDate.getTime() + 30 * 60000);

    const { data: appointment, error: aptError } = await supabase
      .from('appointments')
      .insert({
        patient_id: patient.id,
        doctor_id: doctor.id,
        date: appointmentDate.toISOString(),
        duration: 30,
        end_time: endTime.toISOString(),
        service_type: 'General Checkup',
        time_slot: validated.timeSlot,
        complaint: validated.complaint || '',
        status: 'scheduled',
      })
      .select(`*, patient:patients(*)`)
      .single();

    if (aptError || !appointment) {
      return { success: false, error: 'Failed to create appointment' };
    }

    revalidatePath('/dashboard/receptionist');
    revalidatePath('/dashboard/appointments');

    return {
      success: true,
      data: {
        appointmentId: appointment.id,
        date: appointment.date,
        timeSlot: appointment.time_slot,
      },
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.issues.map((e) => e.message).join(', ')
      };
    }
    console.error('Create appointment error:', error);
    return {
      success: false,
      error: 'Failed to create appointment.'
    };
  }
}

export async function getAvailableSlots(date: Date) {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  const { data: bookedAppointments } = await supabase
    .from('appointments')
    .select('time_slot')
    .gte('date', startOfDay.toISOString())
    .lte('date', endOfDay.toISOString())
    .in('status', ['scheduled', 'confirmed', 'waiting', 'in_treatment']);

  const bookedSlots = new Set((bookedAppointments || []).map((apt: any) => apt.time_slot));

  return BOOKING_SLOTS.filter((slot) => !bookedSlots.has(slot));
}
