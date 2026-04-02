'use client';

import { useState, useRef, useEffect } from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/style.css';
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
  const wrapperRef = useRef<HTMLDivElement>(null);

  const handleSelect = (date: Date | undefined) => {
    onSelect?.(date);
    setIsOpen(false);
  };

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <div className="relative" ref={wrapperRef}>
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
        <div className="absolute top-full left-0 z-50 mt-2 p-3 bg-white rounded-xl shadow-xl border border-gray-200">
          <DayPicker
            mode="single"
            selected={selected}
            onSelect={handleSelect}
            disabled={disabled}
            style={{
              '--rdp-accent-color': '#312e81',
              '--rdp-accent-background-color': '#eef2ff',
              '--rdp-day-height': '32px',
              '--rdp-day-width': '32px',
              '--rdp-day_button-height': '32px',
              '--rdp-day_button-width': '32px',
              fontSize: '13px',
              color: '#000',
            } as React.CSSProperties}
            classNames={{
              month_caption: 'text-black font-semibold text-sm mb-1',
              weekday: 'text-black font-medium text-xs',
              day: 'text-black',
              day_button: 'text-black hover:bg-gray-100 rounded-md',
              selected: 'bg-indigo-900 text-white rounded-md',
              today: 'font-bold text-indigo-900',
              nav: 'text-black',
              chevron: 'fill-black',
            }}
          />
        </div>
      )}
    </div>
  );
}

