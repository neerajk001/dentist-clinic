'use client';

import { useState, useEffect, useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format, addDays, isSameDay } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { bookAppointment, getAvailableSlots } from '@/actions/bookings';
import { ServiceItem } from '@/actions/schedule_settings';
import { Check, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

/** Convert 24h slot "HH:mm" to 12h display e.g. "9:00 AM", "2:30 PM" */
function formatSlot12h(slot24: string): string {
  const [h, m] = slot24.split(':').map(Number);
  const date = new Date(2000, 0, 1, h ?? 0, m ?? 0);
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
}

// Services are now passed dynamically via the new admin settings
// and fallback strictly if prop is somehow missing during rendering

const bookingFormSchema = z.object({
  date: z.date({ message: 'Please select a date' }),
  timeSlot: z.string().min(1, 'Please select a time slot'),
  name: z.string().min(2, 'Name is required'),
  phone: z.string().min(10, 'Valid phone number required'),
  complaint: z.string().optional(),
});

type BookingFormValues = z.infer<typeof bookingFormSchema>;

interface BookingFormProps {
  minDateStr?: string;
  maxDateStr?: string;
  onBookingComplete?: (data: { date: string; timeSlot: string; patientName: string }) => void;
}

export function BookingForm({ minDateStr, maxDateStr, onBookingComplete }: BookingFormProps) {
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorHeader, setErrorHeader] = useState<string | null>(null);

  // Refs for scrolling to sections
  const dateSectionRef = useRef<HTMLDivElement>(null);
  const timeSectionRef = useRef<HTMLDivElement>(null);
  const detailsSectionRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors, isValid },
  } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    mode: 'onChange', // Validate as user fills so "Confirm Booking" enables when form is valid
    defaultValues: {
      date: undefined,
      timeSlot: '',
      name: '',
      phone: '',
    },
  });

  const selectedDate = watch('date');
  const selectedTimeSlot = watch('timeSlot');
  const watchedName = watch('name');
  const watchedPhone = watch('phone');

  // Enable button when all required fields are filled
  const nameValid = typeof watchedName === 'string' && watchedName.trim().length >= 2;
  const phoneValid = typeof watchedPhone === 'string' && watchedPhone.replace(/\D/g, '').length >= 10;
  const canSubmit = !!selectedDate && !!selectedTimeSlot && nameValid && phoneValid;

  // Scroll Helpers
  const scrollTo = (ref: React.RefObject<HTMLDivElement | null>) => {
    if (ref.current) {
      setTimeout(() => {
        ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  };

  // Show only two booking choices: tomorrow and day after tomorrow.
  const upcomingDates: Date[] = [];
  const tomorrow = addDays(new Date(), 1);
  const dayAfterTomorrow = addDays(new Date(), 2);

  const candidates = [tomorrow, dayAfterTomorrow];
  if (minDateStr && maxDateStr) {
    const startDate = new Date(`${minDateStr}T00:00:00`);
    const endDate = new Date(`${maxDateStr}T00:00:00`);

    for (const date of candidates) {
      const normalized = new Date(date);
      normalized.setHours(0, 0, 0, 0);
      if (normalized >= startDate && normalized <= endDate) {
        upcomingDates.push(normalized);
      }
    }
  } else {
    upcomingDates.push(...candidates);
  }

  useEffect(() => {
    if (selectedDate) {
      fetchAvailableSlots(selectedDate);
    } else {
      setAvailableSlots([]);
    }
  }, [selectedDate]);

  const fetchAvailableSlots = async (date: Date) => {
    setIsLoadingSlots(true);
    try {
      const dateString = format(date, 'yyyy-MM-dd');
      const slots = await getAvailableSlots(dateString as any);
      setAvailableSlots(slots);
      if (selectedTimeSlot && !slots.includes(selectedTimeSlot)) {
        setValue('timeSlot', ''); // Reset invalid slot
      }
    } catch (err) {
      console.error(err);
      setAvailableSlots([]);
    } finally {
      setIsLoadingSlots(false);
    }
  };

  const onDateSelect = (date: Date) => {
    setValue('date', date, { shouldValidate: true });
    scrollTo(timeSectionRef);
  };

  const onTimeSelect = (slot: string) => {
    setValue('timeSlot', slot, { shouldValidate: true });
    scrollTo(detailsSectionRef);
  };

  const onSubmit = async (data: BookingFormValues) => {
    setIsSubmitting(true);
    setErrorHeader(null);

    try {
      const result = await bookAppointment({
        date: format(data.date, 'yyyy-MM-dd') as any, // Send as string to Server Action
        timeSlot: data.timeSlot,
        name: data.name,
        phone: data.phone,
        complaint: data.complaint || '', // Now reads dynamically from the UI
      });

      if (result.success && result.data) {
        setSuccess(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        onBookingComplete?.(result.data);
      } else {
        setErrorHeader(result.error || 'Failed to book');
        setIsSubmitting(false);
      }
    } catch (err) {
      console.error(err);
      setErrorHeader('Network error. Please try again.');
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center animate-in zoom-in duration-300">
        <div className="w-24 h-24 bg-black rounded-full flex items-center justify-center mb-6 shadow-xl shadow-gray-200">
          <Check className="w-12 h-12 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">BOOKED!</h2>
        <p className="text-gray-900 mb-8 text-lg">
          Your appointment has been confirmed.
        </p>
        <Button
          onClick={() => window.location.reload()}
          className="w-full max-w-xs h-14 rounded-full bg-black text-white hover:bg-gray-800 font-bold text-lg"
        >
          Done
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto pb-12">
      {errorHeader && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 font-medium border border-red-100 flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-red-600"></div>
          {errorHeader}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start max-w-5xl mx-auto">

        {/* Column 1: Date & Time */}
        <div className="flex flex-col gap-6 h-full">
          {/* Section 1: Date */}
          <section
            ref={dateSectionRef}
            className="bg-white p-6 sm:p-8 rounded-[2rem] shadow-xl shadow-indigo-900/5 border border-gray-100 transition-opacity duration-300 opacity-100"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-8 h-8 rounded-full bg-indigo-900 text-white flex items-center justify-center font-bold text-sm">1</div>
              <h2 className="text-lg font-bold uppercase tracking-wider text-indigo-900">Select Date</h2>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {upcomingDates.map((date, i) => {
                const isSelected = selectedDate && isSameDay(date, selectedDate);
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => onDateSelect(date)}
                    className={cn(
                      "flex flex-col items-center justify-center py-3 rounded-2xl border transition-all duration-200",
                      isSelected
                        ? "bg-indigo-900 text-white border-indigo-900 shadow-md scale-[1.05]"
                        : "bg-gray-50 text-gray-900 border-gray-200 hover:border-gray-400 hover:bg-gray-100"
                    )}
                  >
                    <span className={cn("text-[10px] font-bold uppercase mb-1", isSelected ? "text-[#00d4ff]" : "text-gray-500")}>
                      {format(date, 'EEE')}
                    </span>
                    <span className={cn("text-xl font-black", isSelected ? "text-white" : "text-indigo-900")}>
                      {format(date, 'd')}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Section 3: Time */}
          <section
            ref={timeSectionRef}
            className={cn(
              "bg-white p-6 sm:p-8 rounded-[2rem] shadow-xl shadow-indigo-900/5 border border-gray-100 flex-1 transition-opacity duration-300",
              !selectedDate ? "opacity-40 pointer-events-none" : "opacity-100"
            )}
          >
            <div className="flex items-center gap-4 mb-6">
              <div className={cn("w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors", isLoadingSlots ? "bg-[#00d4ff] text-indigo-900" : "bg-indigo-900 text-white")}>
                {isLoadingSlots ? <div className="w-4 h-4 border-2 border-indigo-900/30 border-t-indigo-900 rounded-full animate-spin" /> : "2"}
              </div>
              <h2 className="text-lg font-bold uppercase tracking-wider text-indigo-900">Select Time</h2>
            </div>

            {availableSlots.length === 0 && !isLoadingSlots ? (
              <div className="py-12 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-300 text-gray-500">
                {selectedDate ? "No slots available" : "Select a date first"}
              </div>
            ) : (
              <div className="max-h-[220px] overflow-y-auto pr-2 custom-scrollbar">
                <div className="grid grid-cols-2 gap-3">
                  {availableSlots.map((slot) => {
                    const isSelected = selectedTimeSlot === slot;
                    return (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => onTimeSelect(slot)}
                        className={cn(
                          "py-3 px-2 rounded-xl text-sm font-bold border transition-all duration-200",
                          isSelected
                            ? "bg-[#00d4ff] text-indigo-900 border-[#00d4ff] shadow-md scale-[1.02]"
                            : "bg-gray-50 text-indigo-900 border-gray-200 hover:border-indigo-900 hover:bg-gray-100"
                        )}
                      >
                        {formatSlot12h(slot)}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </section>
        </div>

        {/* Column 2: Details & Summary */}
        <section
          ref={detailsSectionRef}
          className={cn(
            "bg-indigo-900 p-6 sm:p-8 rounded-[2rem] shadow-xl shadow-indigo-900/20 text-white h-full flex flex-col relative overflow-hidden transition-opacity duration-300",
            !selectedTimeSlot ? "opacity-40 pointer-events-none grayscale" : "opacity-100"
          )}
        >
          {/* Decorative background glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#00d4ff]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

          <div className="flex items-center gap-4 mb-6 relative z-10">
            <div className="w-8 h-8 rounded-full bg-[#00d4ff] text-indigo-900 flex items-center justify-center font-bold text-sm">3</div>
            <h2 className="text-lg font-bold uppercase tracking-wider">Your Details</h2>
          </div>

          <div className="space-y-6 mb-8 flex-1 relative z-10">
            <div className="space-y-1.5">
              <Label className="uppercase text-[10px] font-bold tracking-widest text-[#00d4ff]">Full Name</Label>
              <Input
                {...register('name')}
                placeholder="John Doe"
                className="bg-white/10 border-transparent focus-visible:ring-[#00d4ff] focus-visible:border-transparent text-white font-semibold placeholder:text-white/40 rounded-xl h-12"
              />
              {errors.name && <p className="text-red-400 font-medium text-[10px]">{errors.name.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label className="uppercase text-[10px] font-bold tracking-widest text-[#00d4ff]">Phone Number</Label>
              <Input
                {...register('phone')}
                placeholder="+1 (555) 000-0000"
                type="tel"
                className="bg-white/10 border-transparent focus-visible:ring-[#00d4ff] focus-visible:border-transparent text-white font-semibold placeholder:text-white/40 rounded-xl h-12"
              />
              {errors.phone && <p className="text-red-400 font-medium text-[10px]">{errors.phone.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label className="uppercase text-[10px] font-bold tracking-widest text-[#00d4ff]">Reason for Visit (Optional)</Label>
              <Textarea
                {...register('complaint')}
                placeholder="e.g. Toothache, Routine Checkup, Cleaning Consultation"
                className="bg-white/10 border-transparent focus-visible:ring-[#00d4ff] focus-visible:border-transparent text-white font-semibold placeholder:text-white/40 rounded-xl resize-none h-20"
              />
            </div>
          </div>

          {/* Summary Card */}
          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 relative z-10 mb-6 border border-white/10">
            <h3 className="text-[10px] uppercase font-bold text-[#00d4ff] tracking-widest opacity-80 mb-4">Summary</h3>

            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm font-medium">
                <span className="opacity-80">Service</span>
                <span className="font-bold">Consultation</span>
              </div>
              <div className="flex justify-between items-center text-sm font-medium">
                <span className="opacity-80">Date</span>
                <span className="font-bold">{selectedDate ? format(selectedDate, 'E, d MMM yyyy') : '-'}</span>
              </div>
              <div className="flex justify-between items-center text-sm font-medium">
                <span className="opacity-80">Time</span>
                <span className="font-bold">{selectedTimeSlot ? formatSlot12h(selectedTimeSlot) : '-'}</span>
              </div>
            </div>
          </div>

          <Button
            type="submit"
            disabled={!canSubmit || isSubmitting}
            isLoading={isSubmitting}
            className="w-full h-14 rounded-xl bg-[#00d4ff] text-indigo-900 font-black text-lg uppercase tracking-wider hover:bg-[#00c0f0] shadow-xl hover:-translate-y-1 transition-transform disabled:bg-white/20 disabled:text-white/40 disabled:hover:transform-none relative z-10"
          >
            {isSubmitting ? 'Confirming...' : 'Book Now'}
          </Button>
          {!canSubmit && (
            <p className="text-[10px] text-center text-[#00d4ff]/70 font-bold uppercase tracking-widest mt-4">
              Complete all steps to proceed
            </p>
          )}
        </section>

      </form>
    </div>
  );
}
