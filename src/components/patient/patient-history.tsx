import { Card } from '@/components/ui/card';
import { StatusBadge } from '@/components/ui/status-badge';
import { format } from 'date-fns';
import type { TreatmentRecordWithAppointment } from '@/actions/doctor';

interface PatientHistoryProps {
  history: TreatmentRecordWithAppointment[];
  patientName: string;
}

export function PatientHistory({ history, patientName }: PatientHistoryProps) {
  if (history.length === 0) {
    return (
      <Card>
        <div className="p-8 text-center">
          <div className="text-gray-400 text-4xl mb-4">📋</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Treatment History</h3>
          <p className="text-gray-600">
            {patientName} has no previous treatment records.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Treatment History
        </h2>
        <div className="space-y-4">
          {history.map((record, index) => {
            const appointmentDate = new Date(record.appointment.date);
            return (
              <div
                key={record.id}
                className={`relative pl-8 pb-6 ${
                  index !== history.length - 1 ? 'border-l-2 border-gray-200 ml-2' : 'ml-2'
                }`}
              >
                <div className="absolute left-[-5px] top-0 w-3 h-3 bg-blue-500 rounded-full" />
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {format(appointmentDate, 'MMM dd, yyyy')} • {record.appointment.timeSlot}
                      </p>
                      <p className="text-xs text-gray-500">
                        Dr. {record.doctor.name}
                      </p>
                    </div>
                    <StatusBadge status={record.appointment.status} />
                  </div>

                  {record.appointment.complaint && (
                    <div className="mb-2">
                      <p className="text-xs font-medium text-gray-700 mb-1">Complaint:</p>
                      <p className="text-sm text-gray-600">{record.appointment.complaint}</p>
                    </div>
                  )}

                  <div className="mb-2">
                    <p className="text-xs font-medium text-gray-700 mb-1">Diagnosis:</p>
                    <p className="text-sm text-gray-800">{record.diagnosis}</p>
                  </div>

                  {record.prescription && (
                    <div className="mb-2">
                      <p className="text-xs font-medium text-gray-700 mb-1">Prescription:</p>
                      <p className="text-sm text-gray-600 whitespace-pre-line">
                        {record.prescription}
                      </p>
                    </div>
                  )}

                  {record.followUpNotes && (
                    <div>
                      <p className="text-xs font-medium text-gray-700 mb-1">Follow-up Notes:</p>
                      <p className="text-sm text-gray-600 whitespace-pre-line">
                        {record.followUpNotes}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}
