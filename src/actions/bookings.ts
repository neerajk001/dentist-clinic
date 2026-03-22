'use server';

import { z } from 'zod';
import { supabase } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { getScheduleSettings } from './schedule_settings';
import { format } from 'date-fns';

function getAllowedBookingDateStrings() {
  const tomorrow = new Date();
  tomorrow.setHours(0, 0, 0, 0);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const dayAfterTomorrow = new Date(tomorrow);
  dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1);

  return [format(tomorrow, 'yyyy-MM-dd'), format(dayAfterTomorrow, 'yyyy-MM-dd')];
}

export async function getAvailableSlots(date: Date, serviceDuration: number = 30) {
  const settings = await getScheduleSettings();
  const dateStr = format(date, 'yyyy-MM-dd');
  const allowedDates = getAllowedBookingDateStrings();

  // Booking is limited to tomorrow and day after tomorrow only.
  if (!allowedDates.includes(dateStr)) {
    return [];
  }

  // 1. Check if date is within booking window
  if (dateStr < settings.global.startDate || dateStr > settings.global.endDate) {
    return [];
  }

  // 2. Check if entire day is blocked
  if (settings.global.blockedDays.includes(dateStr)) {
    return [];
  }

  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  // Fetch existing appointments
  const { data: existingAppointments } = await supabase
    .from('appointments')
    .select('date, duration, end_time')
    .gte('date', startOfDay.toISOString())
    .lte('date', endOfDay.toISOString())
    .in('status', ['scheduled', 'confirmed']);

  const availableSlots: string[] = [];

  // Generate slots dynamically based on configured shifts
  settings.global.shifts.forEach((shift) => {
    // Parse shift start/end relative to the selected date
    const [startH, startM] = shift.startTime.split(':').map(Number);
    const [endH, endM] = shift.endTime.split(':').map(Number);
    
    let currentTime = new Date(startOfDay);
    currentTime.setHours(startH, startM, 0, 0);

    const shiftEnd = new Date(startOfDay);
    shiftEnd.setHours(endH, endM, 0, 0);

    while (currentTime < shiftEnd) {
      const slotStart = new Date(currentTime);
      const slotEnd = new Date(currentTime.getTime() + serviceDuration * 60000);

      // Verify slot doesn't break out of the shift bounds
      if (slotEnd > shiftEnd) {
        break;
      }

      // Check if this specific slot time is blocked by admin
      const timeString = slotStart.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
      const isSlotBlockedByAdmin = settings.global.blockedSlots.some(s => s.date === dateStr && s.time === timeString);

      if (!isSlotBlockedByAdmin) {
        // Check for overlaps with already booked appointments in DB
        let isOverlapping = false;
        for (const apt of (existingAppointments || [])) {
          const aptStart = new Date(apt.date);
          const aptEnd = apt.end_time ? new Date(apt.end_time) : new Date(aptStart.getTime() + (apt.duration || 30) * 60000);

          if (slotStart < aptEnd && slotEnd > aptStart) {
            isOverlapping = true;
            break;
          }
        }

        if (!isOverlapping) {
          availableSlots.push(timeString);
        }
      }

      // Increment by the shift's block progression (or exact service duration, we'll use shift.slotDuration)
      currentTime.setMinutes(currentTime.getMinutes() + shift.slotDuration);
    }
  });

  return availableSlots;
}

const bookingSchema = z.object({
  date: z.coerce.date(),
  timeSlot: z.string(), // "09:00"
  serviceId: z.string(),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  complaint: z.string().optional(),
});

export type BookingFormData = z.infer<typeof bookingSchema>;

export async function bookAppointment(formData: BookingFormData) {
  try {
    const validated = bookingSchema.parse(formData);
    const settings = await getScheduleSettings();
    const service = settings.availableServices.find((s) => s.id === validated.serviceId);

    if (!service) {
      return { success: false, error: 'Invalid service selected.' };
    }

    const duration = service.duration;
    const selectedDateStr = format(new Date(validated.date), 'yyyy-MM-dd');
    const allowedDates = getAllowedBookingDateStrings();

    if (!allowedDates.includes(selectedDateStr)) {
      return { success: false, error: 'Bookings are available only for tomorrow and day after tomorrow.' };
    }

    // Parse selected date and time
    const appointmentDate = new Date(validated.date);
    const [hours, minutes] = validated.timeSlot.split(':');
    appointmentDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);

    const slots = await getAvailableSlots(new Date(validated.date), duration);
    if (!slots.includes(validated.timeSlot)) {
      return {
        success: false,
        error: 'This time slot is not available for the selected date. Please choose another slot.'
      };
    }

    const appointmentEndTime = new Date(appointmentDate.getTime() + duration * 60000);

    // Double-check overlap (race condition prevention)
    const { data: existing } = await supabase
      .from('appointments')
      .select('*')
      .lt('date', appointmentEndTime.toISOString())
      .gt('end_time', appointmentDate.toISOString())
      .in('status', ['scheduled', 'confirmed'])
      .limit(1);

    if (existing && existing.length > 0) {
      return {
        success: false,
        error: 'This time slot is no longer available. Please select another time.'
      };
    }

    // Find or create patient
    let patient;
    const { data: existingPatient } = await supabase
      .from('patients')
      .select('*')
      .eq('phone', validated.phone)
      .single();

    if (!existingPatient) {
      // Email not collected on public booking; use placeholder (DB requires email)
      const placeholderEmail = `p-${validated.phone}@noemail.local`;
      const { data: newPatient, error: patientError } = await supabase
        .from('patients')
        .insert({
          name: validated.name,
          email: placeholderEmail,
          phone: validated.phone,
        })
        .select()
        .single();

      if (patientError) {
        return { success: false, error: 'Failed to create patient record.' };
      }
      patient = newPatient;
    } else {
      // Update only name; keep existing email
      const { data: updatedPatient } = await supabase
        .from('patients')
        .update({
          name: validated.name,
        })
        .eq('id', existingPatient.id)
        .select()
        .single();
      patient = updatedPatient || existingPatient;
    }

    // Get first doctor
    const { data: doctor } = await supabase
      .from('users')
      .select('*')
      .eq('role', 'doctor')
      .limit(1)
      .single();

    if (!doctor) {
      return { success: false, error: 'No doctors available at this time.' };
    }

    // Create appointment
    const { data: appointment, error: aptError } = await supabase
      .from('appointments')
      .insert({
        patient_id: patient.id,
        doctor_id: doctor.id,
        date: appointmentDate.toISOString(),
        duration: duration,
        end_time: appointmentEndTime.toISOString(),
        service_type: service.name,
        time_slot: `${validated.timeSlot} - ${appointmentEndTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}`,
        complaint: validated.complaint || '',
        status: 'scheduled',
      })
      .select()
      .single();

    if (aptError || !appointment) {
      console.error('Appointment creation error:', aptError);
      return { success: false, error: 'Failed to book appointment. Please try again.' };
    }

    revalidatePath('/book');
    revalidatePath('/dashboard');

    return {
      success: true,
      data: {
        appointmentId: appointment.id,
        date: appointment.date,
        timeSlot: appointment.time_slot,
        patientName: patient.name,
      },
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.issues.map((e) => e.message).join(', ')
      };
    }
    console.error('Booking error:', error);
    return {
      success: false,
      error: 'Failed to book appointment. Please try again.'
    };
  }
}
