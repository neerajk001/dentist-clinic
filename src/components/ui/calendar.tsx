'use client';

import { useState } from 'react';
import { DayPicker } from 'react-day-picker';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './button';

interface DatePickerProps {
  selected?: Date;
  onSelect?: (date: Date | undefined) => void;
  disabled?: (date: Date) => boolean;
}

export function DatePicker({ selected, onSelect, disabled }: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (date: Date | undefined) => {
    onSelect?.(date);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <Button
        type="button"
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className={cn('w-full justify-start text-left font-normal', !selected && 'text-muted-foreground')}
      >
        <CalendarIcon className="mr-2 h-4 w-4" />
        {selected ? format(selected, 'PPP') : 'Pick a date'}
      </Button>
      
      {isOpen && (
        <div className="absolute top-full left-0 z-50 mt-2 p-4 bg-white rounded-lg shadow-lg border border-gray-200">
          <DayPicker
            mode="single"
            selected={selected}
            onSelect={handleSelect}
            disabled={disabled}
            initialFocus
            className="rounded-md"
          />
        </div>
      )}
    </div>
  );
}
