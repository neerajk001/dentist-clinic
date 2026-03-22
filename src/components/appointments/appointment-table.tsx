'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { StatusBadge } from '@/components/ui/status-badge';
import { Modal } from '@/components/ui/modal';
import { DatePicker } from '@/components/ui/calendar';
import { TimeSlots } from '@/components/ui/time-slots';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import type { AppointmentWithPatient } from '@/actions/receptionist';

interface AppointmentTableProps {
  appointments: AppointmentWithPatient[];
  onUpdateStatus?: (appointmentId: string, status: string) => Promise<void>;
  onReschedule?: (appointmentId: string, newDate: Date, newTimeSlot: string) => Promise<void>;
  onCancel?: (appointmentId: string) => Promise<void>;
  getAvailableSlots?: (date: Date) => Promise<string[]>;
}

export function AppointmentTable({ appointments, onUpdateStatus, onReschedule, onCancel, getAvailableSlots }: AppointmentTableProps) {
  const [reschedulingAppointment, setReschedulingAppointment] = useState<AppointmentWithPatient | null>(null);
  const [newDate, setNewDate] = useState<Date | undefined>();
  const [newTimeSlot, setNewTimeSlot] = useState<string | null>(null);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  useEffect(() => {
    if (!newDate || !getAvailableSlots) {
      setAvailableSlots([]);
      return;
    }
    setLoadingSlots(true);
    getAvailableSlots(newDate)
      .then(setAvailableSlots)
      .finally(() => setLoadingSlots(false));
  }, [newDate, getAvailableSlots]);

  const handleReschedule = async () => {
    if (reschedulingAppointment && newDate && newTimeSlot) {
      await onReschedule?.(reschedulingAppointment.id, newDate, newTimeSlot);
      setReschedulingAppointment(null);
      setNewDate(undefined);
      setNewTimeSlot(null);
    }
  };

  if (appointments.length === 0) {
    return (
      <Card>
        <div className="p-12 text-center">
          <div className="text-gray-400 text-4xl mb-4">📅</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Appointments</h3>
          <p className="text-gray-600">No appointments scheduled for this date.</p>
        </div>
      </Card>
    );
  }

  return (
    <>
      {/* ── Mobile card list (hidden on md+) ── */}
      <div className="md:hidden space-y-4">
        {appointments.map((appointment) => (
          <Card key={appointment.id}>
            <div className="p-4 space-y-3">
              {/* Header row */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-indigo-900 bg-indigo-50 px-2 py-1 rounded-md">
                  {appointment.timeSlot}
                </span>
                <StatusBadge status={appointment.status} />
              </div>

              {/* Patient info */}
              <div>
                <p className="font-semibold text-gray-900">{appointment.patient.name}</p>
                {appointment.complaint && (
                  <p className="text-xs text-gray-500 mt-0.5">{appointment.complaint}</p>
                )}
              </div>

              {/* Contact */}
              <div className="text-sm text-gray-600 space-y-0.5">
                <p>{appointment.patient.phone}</p>
                <p className="text-xs text-gray-400 truncate">{appointment.patient.email}</p>
              </div>

              {/* Actions */}
              {(onUpdateStatus || onReschedule || onCancel) && (
                <div className="pt-2 border-t border-gray-100 space-y-2">
                  {onUpdateStatus && (
                    <Select
                      options={[
                        { value: 'scheduled', label: 'Scheduled' },
                        { value: 'confirmed', label: 'Confirmed' },
                        { value: 'waiting', label: 'Waiting' },
                        { value: 'in_treatment', label: 'In Treatment' },
                        { value: 'completed', label: 'Completed' },
                        { value: 'no_show', label: 'No Show' },
                      ]}
                      value={appointment.status}
                      onChange={async (e) => {
                        await onUpdateStatus(appointment.id, (e.target as HTMLSelectElement).value);
                      }}
                      className="w-full"
                    />
                  )}
                  <div className="flex gap-2">
                    {onReschedule && (
                      <Button size="sm" variant="outline" className="flex-1" onClick={() => setReschedulingAppointment(appointment)}>
                        Reschedule
                      </Button>
                    )}
                    {onCancel && appointment.status !== 'cancelled' && (
                      <Button size="sm" variant="danger" className="flex-1" onClick={() => onCancel(appointment.id)}>
                        Cancel
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* ── Desktop table (hidden below md) ── */}
      <Card className="hidden md:block">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {appointments.map((appointment) => (
                <tr key={appointment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{appointment.timeSlot}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{appointment.patient.name}</div>
                    {appointment.complaint && (
                      <div className="text-xs text-gray-500 mt-1">{appointment.complaint}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{appointment.patient.phone}</div>
                    <div className="text-xs text-gray-500">{appointment.patient.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={appointment.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Select
                        options={[
                          { value: 'scheduled', label: 'Scheduled' },
                          { value: 'confirmed', label: 'Confirmed' },
                          { value: 'waiting', label: 'Waiting' },
                          { value: 'in_treatment', label: 'In Treatment' },
                          { value: 'completed', label: 'Completed' },
                          { value: 'no_show', label: 'No Show' },
                        ]}
                        value={appointment.status}
                        onChange={async (e) => {
                          await onUpdateStatus?.(appointment.id, (e.target as HTMLSelectElement).value);
                        }}
                        className="w-32"
                      />
                      <Button size="sm" variant="outline" onClick={() => setReschedulingAppointment(appointment)}>
                        Reschedule
                      </Button>
                      {appointment.status !== 'cancelled' && (
                        <Button size="sm" variant="danger" onClick={() => onCancel?.(appointment.id)}>
                          Cancel
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal
        isOpen={!!reschedulingAppointment}
        onClose={() => {
          setReschedulingAppointment(null);
          setNewDate(undefined);
          setNewTimeSlot(null);
        }}
        title="Reschedule Appointment"
      >
        {reschedulingAppointment && (
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm font-medium text-gray-900">Patient: {reschedulingAppointment.patient.name}</p>
              <p className="text-sm text-gray-600">
                Current: {reschedulingAppointment.timeSlot}
              </p>
            </div>

            <div>
              <Label>Select New Date</Label>
              <DatePicker
                selected={newDate}
                onSelect={(date) => {
                  setNewDate(date);
                  if (date) {
                    setNewTimeSlot(null);
                  }
                }}
              />
            </div>

            {newDate && (
              <div>
                <Label>Select New Time</Label>
                {loadingSlots ? (
                  <p className="text-sm text-gray-500 py-2">Loading slots...</p>
                ) : (
                  <TimeSlots
                    availableSlots={availableSlots}
                    selectedSlot={newTimeSlot}
                    onSelectSlot={setNewTimeSlot}
                  />
                )}
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <Button
                onClick={handleReschedule}
                disabled={!newDate || !newTimeSlot}
                className="flex-1"
              >
                Confirm Reschedule
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setReschedulingAppointment(null);
                  setNewDate(undefined);
                  setNewTimeSlot(null);
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
