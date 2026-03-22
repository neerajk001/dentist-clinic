'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { StatusBadge } from '@/components/ui/status-badge';
import { Button } from '@/components/ui/button';
import type { AppointmentWithPatient } from '@/actions/doctor';
import { PatientPanel } from '@/components/patient/patient-panel';

interface DoctorAppointmentsListProps {
  appointments: AppointmentWithPatient[];
}

export function DoctorAppointmentsList({
  appointments,
}: DoctorAppointmentsListProps) {
  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentWithPatient | null>(null);

  if (appointments.length === 0) {
    return (
      <Card>
        <div className="p-12 text-center">
          <div className="text-gray-400 text-4xl mb-4">📅</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Appointments Today</h3>
          <p className="text-gray-600">
            You don't have any appointments scheduled for today.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <>
      {/* ── Mobile card list ── */}
      <div className="md:hidden space-y-4">
        {appointments.map((appointment) => (
          <Card key={appointment.id}>
            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-indigo-900 bg-indigo-50 px-2 py-1 rounded-md">
                  {appointment.timeSlot}
                </span>
                <StatusBadge status={appointment.status} />
              </div>

              <div>
                <p className="font-semibold text-gray-900">{appointment.patient.name}</p>
                <p className="text-xs text-gray-500 mt-0.5">{appointment.patient.phone}</p>
              </div>

              {appointment.complaint && (
                <p className="text-sm text-gray-600 bg-gray-50 rounded-lg px-3 py-2 line-clamp-2">
                  {appointment.complaint}
                </p>
              )}

              <Button
                size="sm"
                className={`w-full ${appointment.treatmentRecord ? 'bg-green-600 hover:bg-green-700' : ''}`}
                onClick={() => setSelectedAppointment(appointment)}
              >
                {appointment.treatmentRecord ? 'View / Edit Treatment' : 'Add Treatment Notes'}
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* ── Desktop table ── */}
      <Card className="hidden md:block">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Complaint</th>
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
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{appointment.patient.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{appointment.patient.phone}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-600 max-w-xs truncate">
                      {appointment.complaint || '-'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={appointment.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Button
                      size="sm"
                      onClick={() => setSelectedAppointment(appointment)}
                      className={appointment.treatmentRecord ? 'bg-green-600 hover:bg-green-700' : ''}
                    >
                      {appointment.treatmentRecord ? 'View / Edit' : 'Add Treatment'}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {selectedAppointment && (
        <PatientPanel
          appointmentId={selectedAppointment.id}
          patientId={selectedAppointment.patient.id}
          patientName={selectedAppointment.patient.name}
          patientPhone={selectedAppointment.patient.phone}
          patientEmail={selectedAppointment.patient.email}
          complaint={selectedAppointment.complaint}
          onClose={() => setSelectedAppointment(null)}
        />
      )}
    </>
  );
}
