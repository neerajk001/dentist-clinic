'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { DatePicker } from '@/components/ui/calendar';
import { AppointmentTable } from '@/components/appointments/appointment-table';
import { Modal } from '@/components/ui/modal';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  getAvailableSlots,
  updateAppointmentStatus,
  rescheduleAppointment,
  cancelAppointment,
  createAppointmentManual,
  type AppointmentWithPatient,
} from '@/actions/receptionist';

interface AppointmentsPageClientProps {
  initialDate: Date;
  initialAppointments: AppointmentWithPatient[];
  isReceptionist: boolean;
}

export function AppointmentsPageClient({
  initialDate,
  initialAppointments,
  isReceptionist,
}: AppointmentsPageClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dateParam = searchParams.get('date');
  const currentDate = dateParam ? new Date(dateParam) : initialDate;
  const appointments = initialAppointments;

  const [showNewModal, setShowNewModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [formDate, setFormDate] = useState<Date | undefined>(currentDate);
  const [formSlot, setFormSlot] = useState<string | null>(null);
  const [formName, setFormName] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formComplaint, setFormComplaint] = useState('');
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      router.push(`/dashboard/appointments?date=${format(date, 'yyyy-MM-dd')}`);
    }
  };

  const refresh = () => router.refresh();

  const handleUpdateStatus = async (appointmentId: string, status: string) => {
    await updateAppointmentStatus({
      appointmentId,
      status: status as 'scheduled' | 'confirmed' | 'waiting' | 'in_treatment' | 'completed' | 'no_show' | 'cancelled',
    });
    refresh();
  };

  const handleReschedule = async (appointmentId: string, newDate: Date, newTimeSlot: string) => {
    await rescheduleAppointment({ appointmentId, newDate, newTimeSlot });
    refresh();
  };

  const handleCancel = async (appointmentId: string) => {
    await cancelAppointment(appointmentId);
    refresh();
  };

  const loadSlots = async (date: Date) => {
    return getAvailableSlots(date);
  };

  const openNewModal = () => {
    setFormDate(currentDate);
    setFormSlot(null);
    setFormName('');
    setFormPhone('');
    setFormEmail('');
    setFormComplaint('');
    setCreateError(null);
    loadSlots(currentDate).then(setAvailableSlots);
    setShowNewModal(true);
  };

  const handleCreateAppointment = async () => {
    if (!formDate || !formSlot || !formName.trim() || !formPhone.trim() || !formEmail.trim()) {
      setCreateError('Please fill name, phone, email, date and time slot.');
      return;
    }
    setCreating(true);
    setCreateError(null);
    const result = await createAppointmentManual({
      date: formDate,
      timeSlot: formSlot,
      name: formName.trim(),
      phone: formPhone.trim(),
      email: formEmail.trim(),
      complaint: formComplaint.trim() || undefined,
    });
    setCreating(false);
    if (result.success) {
      setShowNewModal(false);
      refresh();
    } else {
      setCreateError(result.error ?? 'Failed to create appointment');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Appointments</h1>
          <p className="text-gray-600 mt-1">View and manage appointments by date.</p>
        </div>
        <div className="flex items-center gap-3">
          <DatePicker
            selected={currentDate}
            onSelect={handleDateSelect}
          />
          {isReceptionist && (
            <Button onClick={openNewModal}>New Appointment</Button>
          )}
        </div>
      </div>

      <AppointmentTable
        appointments={appointments}
        onUpdateStatus={isReceptionist ? handleUpdateStatus : undefined}
        onReschedule={isReceptionist ? handleReschedule : undefined}
        onCancel={isReceptionist ? handleCancel : undefined}
        getAvailableSlots={loadSlots}
      />

      {isReceptionist && (
        <Modal
          isOpen={showNewModal}
          onClose={() => setShowNewModal(false)}
          title="New Appointment"
        >
          <div className="space-y-4">
            {createError && (
              <p className="text-sm text-red-600 bg-red-50 p-2 rounded">{createError}</p>
            )}
            <div>
              <Label>Date</Label>
              <DatePicker
                selected={formDate}
                onSelect={(d) => {
                  setFormDate(d);
                  setFormSlot(null);
                  if (d) loadSlots(d).then(setAvailableSlots);
                }}
              />
            </div>
            {formDate && (
              <div>
                <Label>Time slot</Label>
                <div className="grid grid-cols-2 gap-2">
                  {availableSlots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setFormSlot(slot)}
                      className={`px-3 py-2 rounded border text-sm ${
                        formSlot === slot ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-300'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <div>
              <Label>Patient name</Label>
              <Input
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="Full name"
              />
            </div>
            <div>
              <Label>Phone</Label>
              <Input
                value={formPhone}
                onChange={(e) => setFormPhone(e.target.value)}
                placeholder="Phone number"
              />
            </div>
            <div>
              <Label>Email</Label>
              <Input
                type="email"
                value={formEmail}
                onChange={(e) => setFormEmail(e.target.value)}
                placeholder="Email"
              />
            </div>
            <div>
              <Label>Complaint (optional)</Label>
              <Textarea
                value={formComplaint}
                onChange={(e) => setFormComplaint(e.target.value)}
                placeholder="Reason for visit"
                rows={2}
              />
            </div>
            <div className="flex gap-3 pt-2">
              <Button onClick={handleCreateAppointment} disabled={creating} className="flex-1">
                {creating ? 'Creating...' : 'Create Appointment'}
              </Button>
              <Button variant="outline" onClick={() => setShowNewModal(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
