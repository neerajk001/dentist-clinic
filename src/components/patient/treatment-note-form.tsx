'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { saveTreatmentNote } from '@/actions/doctor';

const treatmentNoteSchema = z.object({
  appointmentId: z.string(),
  patientId: z.string(),
  diagnosis: z.string().min(1, 'Diagnosis is required'),
  prescription: z.string().optional(),
  followUpNotes: z.string().optional(),
});

type TreatmentNoteFormValues = z.infer<typeof treatmentNoteSchema>;

interface TreatmentNoteFormProps {
  appointmentId: string;
  patientId: string;
  initialData?: {
    diagnosis?: string;
    prescription?: string;
    followUpNotes?: string;
  };
  onSave?: () => void;
}

export function TreatmentNoteForm({
  appointmentId,
  patientId,
  initialData,
  onSave,
}: TreatmentNoteFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<TreatmentNoteFormValues>({
    resolver: zodResolver(treatmentNoteSchema),
    defaultValues: {
      appointmentId,
      patientId,
      diagnosis: initialData?.diagnosis || '',
      prescription: initialData?.prescription || '',
      followUpNotes: initialData?.followUpNotes || '',
    },
  });

  const onSubmit = async (data: TreatmentNoteFormValues) => {
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      const result = await saveTreatmentNote(data);

      if (result.success) {
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          onSave?.();
        }, 2000);
      } else {
        setError(result.error || 'Failed to save treatment note');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full">
      <div className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Treatment Notes</h2>

        {success && (
          <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
            Treatment notes saved successfully!
          </div>
        )}

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="diagnosis">Diagnosis *</Label>
            <Textarea
              id="diagnosis"
              rows={3}
              placeholder="Enter diagnosis..."
              {...register('diagnosis')}
              className={errors.diagnosis ? 'border-red-500' : ''}
            />
            {errors.diagnosis && (
              <p className="mt-1 text-sm text-red-600">{errors.diagnosis.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="prescription">Prescription</Label>
            <Textarea
              id="prescription"
              rows={4}
              placeholder="Enter prescription..."
              {...register('prescription')}
            />
          </div>

          <div>
            <Label htmlFor="followUpNotes">Follow-up Notes</Label>
            <Textarea
              id="followUpNotes"
              rows={3}
              placeholder="Enter follow-up notes..."
              {...register('followUpNotes')}
            />
          </div>

          <Button
            type="submit"
            isLoading={isSubmitting}
            disabled={!isDirty}
            className="w-full"
          >
            {isSubmitting ? 'Saving...' : 'Save Treatment Notes'}
          </Button>
        </form>
      </div>
    </Card>
  );
}
