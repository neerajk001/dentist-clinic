'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PatientHistory } from './patient-history';
import { TreatmentNoteForm } from './treatment-note-form';
import { getPatientHistory, getTreatmentRecord, type TreatmentRecordWithAppointment } from '@/actions/doctor';
import { ChevronLeft } from 'lucide-react';

interface PatientPanelProps {
  appointmentId: string;
  patientId: string;
  patientName: string;
  patientPhone: string;
  patientEmail: string;
  complaint?: string;
  onClose: () => void;
}

export function PatientPanel({
  appointmentId,
  patientId,
  patientName,
  patientPhone,
  patientEmail,
  complaint,
  onClose,
}: PatientPanelProps) {
  const [history, setHistory] = useState<TreatmentRecordWithAppointment[]>([]);
  const [initialTreatment, setInitialTreatment] = useState<{
    diagnosis?: string;
    prescription?: string;
    followUpNotes?: string;
  } | undefined>(undefined);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [activeTab, setActiveTab] = useState<'treatment' | 'history'>('treatment');

  useEffect(() => {
    loadPatientData();
  }, [patientId, appointmentId]);

  const loadPatientData = async () => {
    setLoadingHistory(true);
    try {
      const [historyData, treatmentData] = await Promise.all([
        getPatientHistory(patientId),
        getTreatmentRecord(appointmentId),
      ]);
      setHistory(historyData || []);
      if (treatmentData) {
        setInitialTreatment({
          diagnosis: treatmentData.diagnosis,
          prescription: treatmentData.prescription,
          followUpNotes: treatmentData.followUpNotes,
        });
      }
    } catch (error) {
      console.error('Failed to load patient data:', error);
    } finally {
      setLoadingHistory(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-gray-50 overflow-y-auto">
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-6 flex items-center gap-4">
          <Button variant="outline" onClick={onClose} className="flex items-center gap-2">
            <ChevronLeft className="w-4 h-4" />
            Back to Appointments
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">{patientName}</h1>
            <p className="text-sm text-gray-600">
              {patientPhone} • {patientEmail}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            {complaint && (
              <Card className="p-6">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Current Complaint</h3>
                <p className="text-gray-900">{complaint}</p>
              </Card>
            )}

            <TreatmentNoteForm
              appointmentId={appointmentId}
              patientId={patientId}
              initialData={initialTreatment}
              onSave={loadPatientData}
            />
          </div>

          <div>
            {loadingHistory ? (
              <Card>
                <div className="p-8 text-center">
                  <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4" />
                  <p className="text-gray-600">Loading patient history...</p>
                </div>
              </Card>
            ) : (
              <PatientHistory history={history} patientName={patientName} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
