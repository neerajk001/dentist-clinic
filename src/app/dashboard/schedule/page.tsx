'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getScheduleSettings, updateGlobalSchedule, toggleDayBlock, toggleSlotBlock, ScheduleSettings, Shift, BlockedSlot } from '@/actions/schedule_settings';
import { format, addDays, isSameDay, parseISO } from 'date-fns';

export default function ScheduleSettingsPage() {
  const [settings, setSettings] = useState<ScheduleSettings['global'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    setLoading(true);
    const data = await getScheduleSettings();
    setSettings(data.global);
    setLoading(false);
  }



  async function handleSaveRange() {
    if (!settings) return;
    setSaving(true);
    await updateGlobalSchedule({ 
      startDate: settings.startDate, 
      endDate: settings.endDate 
    });
    setSaving(false);
  }

  async function handleUpdateShift(index: number, key: keyof Shift, value: any) {
    if (!settings) return;
    const newShifts = [...settings.shifts];
    newShifts[index] = { ...newShifts[index], [key]: value };
    setSettings({ ...settings, shifts: newShifts });
  }

  async function handleSaveShifts() {
    if (!settings) return;
    setSaving(true);
    await updateGlobalSchedule({ shifts: settings.shifts });
    setSaving(false);
  }

  async function handleToggleDayBlock(dateStr: string) {
    await toggleDayBlock(dateStr);
    await loadSettings();
  }

  async function handleToggleSlotBlock(dateStr: string, timeStr: string) {
    await toggleSlotBlock(dateStr, timeStr);
    await loadSettings();
  }

  // Generate slots for the currently selected date based on shifts
  const generateSlotsForSelectedDate = () => {
    if (!selectedDate || !settings) return [];
    
    // Check if the whole day is blocked
    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    const isDayBlocked = settings.blockedDays.includes(dateStr);
    
    if (isDayBlocked) return [];

    let generatedTimes: string[] = [];
    settings.shifts.forEach((shift) => {
      let current = new Date(`1970-01-01T${shift.startTime}:00`);
      const end = new Date(`1970-01-01T${shift.endTime}:00`);
      
      while (current < end) {
        generatedTimes.push(current.toTimeString().substring(0, 5));
        current.setMinutes(current.getMinutes() + shift.slotDuration);
      }
    });
    return generatedTimes;
  }

  if (loading) return <div className="p-8">Loading schedule settings...</div>;
  if (!settings) return <div className="p-8">Error loading settings.</div>;

  const dateStr = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : null;
  const isSelectedDayBlocked = dateStr ? settings.blockedDays.includes(dateStr) : false;
  const todaySlots = generateSlotsForSelectedDate();

  return (
    <div className="max-w-5xl mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking Schedule Configuration</h1>
        <p className="text-gray-500">Fully control clinic availability, shifts, and booking slots.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-8">
          {/* Booking Window */}
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold mb-4">Availability Window</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                <Input 
                  type="date" 
                  value={settings.startDate} 
                  onChange={(e) => setSettings({...settings, startDate: e.target.value})} 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                <Input 
                  type="date" 
                  value={settings.endDate} 
                  onChange={(e) => setSettings({...settings, endDate: e.target.value})} 
                />
              </div>
            </div>
            <Button onClick={handleSaveRange} disabled={saving} className="mt-4 bg-[#18181b] text-white">
              {saving ? 'Saving...' : 'Save Availability Window'}
            </Button>
          </section>

          {/* Shift Configuration */}
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold mb-4">Daily Shifts</h2>
            <div className="space-y-6">
              {settings.shifts.map((shift, idx) => (
                <div key={shift.id} className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="font-semibold text-gray-800 mb-3">{shift.name}</div>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Start Time</label>
                      <Input type="time" value={shift.startTime} onChange={(e) => handleUpdateShift(idx, 'startTime', e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">End Time</label>
                      <Input type="time" value={shift.endTime} onChange={(e) => handleUpdateShift(idx, 'endTime', e.target.value)} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Slot Duration (Minutes)</label>
                    <Input type="number" value={shift.slotDuration} onChange={(e) => handleUpdateShift(idx, 'slotDuration', Number(e.target.value))} />
                  </div>
                </div>
              ))}
            </div>
            <Button onClick={handleSaveShifts} disabled={saving} className="mt-6 bg-[#18181b] text-white">
              {saving ? 'Saving...' : 'Save Shifts Configuration'}
            </Button>
          </section>
        </div>

        {/* Blocking Panel */}
        <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold mb-4">Slot Blocking Control</h2>
          <p className="text-sm text-gray-500 mb-6">Select a date to block specific slots or the entire day. Blocked slots will immediately disappear from the public booking page.</p>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
             {/* Using standard date input as calendar picker fallback */}
             <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Date to Edit</label>
                <Input type="date" value={dateStr || ''} onChange={(e) => setSelectedDate(e.target.value ? new Date(e.target.value) : undefined)} />
             </div>
          </div>

          {dateStr && (
            <div className="mb-6 p-4 rounded-xl border-dashed border-2 flex items-center justify-between bg-gray-50 border-gray-200">
              <div>
                <span className="font-semibold block">{format(parseISO(dateStr), 'MMMM d, yyyy')}</span>
                <span className="text-xs text-gray-500">{isSelectedDayBlocked ? 'Entire day is blocked out.' : 'This day is open for booking.'}</span>
              </div>
              <Button 
                variant={isSelectedDayBlocked ? 'danger' : 'outline'} 
                className={isSelectedDayBlocked ? 'bg-red-600 hover:bg-red-700 text-white' : 'border-red-200 text-red-600 hover:bg-red-50'}
                onClick={() => handleToggleDayBlock(dateStr)}
              >
                {isSelectedDayBlocked ? 'Unblock Full Day' : 'Block Full Day'}
              </Button>
            </div>
          )}

          {!isSelectedDayBlocked ? (
            <div>
              <h3 className="font-bold text-gray-800 mb-3 block">Block Specific Slots</h3>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {todaySlots.map(time => {
                  const isBlocked = settings.blockedSlots.some(bs => bs.date === dateStr && bs.time === time);
                  return (
                    <button
                      key={time}
                      onClick={() => dateStr && handleToggleSlotBlock(dateStr, time)}
                      className={`py-2 px-1 text-xs rounded-lg font-medium transition-all ${
                        isBlocked 
                          ? 'bg-red-100 text-red-700 border border-red-200 line-through' 
                          : 'bg-green-50 text-green-700 border border-green-200 hover:bg-green-100'
                      }`}
                    >
                      {time}
                    </button>
                  );
                })}
                {todaySlots.length === 0 && <span className="text-gray-400 text-sm italic col-span-3">No slots available for this day configuration.</span>}
              </div>
            </div>
          ) : (
             <div className="h-32 flex items-center justify-center border rounded-xl bg-gray-50 text-gray-400 text-sm">
               Individual slots cannot be managed while full day is blocked.
             </div>
          )}
        </section>
      </div>


    </div>
  );
}
