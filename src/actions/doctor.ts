'use server';

import { z } from 'zod';
import { supabase } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export interface AppointmentWithPatient {
  id: string;
  patient: { id: string; name: string; phone: string; email: string };
  doctor: { id: string; name: string };
  date: string;
  timeSlot: string;
  complaint?: string;
  status: string;
  notes?: string;
  treatmentRecord?: string;
  createdAt: string;
}

export async function getTodaysAppointments() {
  const today = new Date();
  const startOfDay = new Date(today);
  startOfDay.setHours(0, 0, 0, 0);
  
  const endOfDay = new Date(today);
  endOfDay.setHours(23, 59, 59, 999);

  const { data: appointments, error } = await supabase
    .from('appointments')
    .select(`
      *,
      patient:patients(*),
      doctor:users(*),
      treatment_record:treatment_records(*)
    `)
    .gte('date', startOfDay.toISOString())
    .lte('date', endOfDay.toISOString())
    .not('status', 'in', '(cancelled,no_show)')
    .order('date', { ascending: true });

  if (error) {
    console.warn('Error fetching appointments:', error);
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
    treatmentRecord: apt.treatment_record_id,
    createdAt: apt.created_at,
  }));
}

export interface TreatmentRecordWithAppointment {
  id: string;
  appointment: {
    id: string;
    date: string;
    timeSlot: string;
    status: string;
    complaint?: string;
  };
  doctor: {
    id: string;
    name: string;
  };
  diagnosis: string;
  prescription: string;
  followUpNotes: string;
  createdAt: string;
  updatedAt: string;
}

export async function getPatientHistory(patientId: string) {
  const { data: treatmentRecords, error } = await supabase
    .from('treatment_records')
    .select(`
      *,
      appointment:appointments(*),
      doctor:users(*)
    `)
    .eq('patient_id', patientId)
    .order('created_at', { ascending: false });

  if (error) {
    console.warn('Error fetching patient history:', error);
    return [];
  }

  return (treatmentRecords || []).map((record: any) => ({
    id: record.id,
    appointment: {
      id: record.appointment.id,
      date: record.appointment.date,
      timeSlot: record.appointment.time_slot,
      status: record.appointment.status,
      complaint: record.appointment.complaint,
    },
    doctor: {
      id: record.doctor.id,
      name: record.doctor.name,
    },
    diagnosis: record.diagnosis,
    prescription: record.prescription,
    followUpNotes: record.follow_up_notes,
    createdAt: record.created_at,
    updatedAt: record.updated_at,
  }));
}

const treatmentNoteSchema = z.object({
  appointmentId: z.string(),
  patientId: z.string(),
  diagnosis: z.string().min(1, 'Diagnosis is required'),
  prescription: z.string().optional(),
  followUpNotes: z.string().optional(),
});

export async function saveTreatmentNote(data: z.infer<typeof treatmentNoteSchema>) {
  try {
    const validated = treatmentNoteSchema.parse(data);

    // Check if treatment record already exists
    const { data: existingRecord } = await supabase
      .from('treatment_records')
      .select('*')
      .eq('appointment_id', validated.appointmentId)
      .single();

    let treatmentRecord;

    if (existingRecord) {
      // Update existing record
      const { data, error } = await supabase
        .from('treatment_records')
        .update({
          diagnosis: validated.diagnosis,
          prescription: validated.prescription || '',
          follow_up_notes: validated.followUpNotes || '',
        })
        .eq('id', existingRecord.id)
        .select()
        .single();

      if (error) {
        return { success: false, error: 'Failed to update treatment note' };
      }
      treatmentRecord = data;
    } else {
      // Get doctor from appointment
      const { data: appointment } = await supabase
        .from('appointments')
        .select('doctor_id')
        .eq('id', validated.appointmentId)
        .single();

      if (!appointment) {
        return { success: false, error: 'Appointment not found' };
      }

      // Create new record
      const { data, error } = await supabase
        .from('treatment_records')
        .insert({
          patient_id: validated.patientId,
          appointment_id: validated.appointmentId,
          doctor_id: appointment.doctor_id,
          diagnosis: validated.diagnosis,
          prescription: validated.prescription || '',
          follow_up_notes: validated.followUpNotes || '',
        })
        .select()
        .single();

      if (error) {
        return { success: false, error: 'Failed to create treatment note' };
      }
      treatmentRecord = data;

      // Update appointment with treatment record reference
      await supabase
        .from('appointments')
        .update({ treatment_record_id: treatmentRecord.id })
        .eq('id', validated.appointmentId);
    }

    revalidatePath('/dashboard/doctor');

    return {
      success: true,
      data: {
        treatmentRecordId: treatmentRecord.id,
      },
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.issues.map((e) => e.message).join(', '),
      };
    }
    console.warn('Save treatment note error:', error);
    return { success: false, error: 'Failed to save treatment note' };
  }
}

export async function getTreatmentRecord(appointmentId: string) {
  const { data: treatmentRecord, error } = await supabase
    .from('treatment_records')
    .select('*')
    .eq('appointment_id', appointmentId)
    .single();

  if (error || !treatmentRecord) {
    return null;
  }

  return {
    id: treatmentRecord.id,
    diagnosis: treatmentRecord.diagnosis,
    prescription: treatmentRecord.prescription,
    followUpNotes: treatmentRecord.follow_up_notes,
    createdAt: treatmentRecord.created_at,
    updatedAt: treatmentRecord.updated_at,
  };
}
