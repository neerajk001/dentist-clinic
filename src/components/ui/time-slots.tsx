'use client';

import { cn } from '@/lib/utils';

interface TimeSlotsProps {
  availableSlots: string[];
  selectedSlot: string | null;
  onSelectSlot: (slot: string) => void;
}

export function TimeSlots({ availableSlots, selectedSlot, onSelectSlot }: TimeSlotsProps) {
  if (!availableSlots.length) {
    return (
      <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-gray-600">No available time slots for this date.</p>
        <p className="text-sm text-gray-500 mt-1">Please select a different date.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {availableSlots.map((slot) => (
        <button
          key={slot}
          type="button"
          onClick={() => onSelectSlot(slot)}
          className={cn(
            'px-4 py-3 rounded-lg border text-sm font-medium transition-all',
            selectedSlot === slot
              ? 'bg-blue-600 border-blue-600 text-white'
              : 'bg-white border-gray-300 text-gray-700 hover:border-blue-500 hover:bg-blue-50'
          )}
        >
          {slot}
        </button>
      ))}
    </div>
  );
}
