'use server';

import fs from 'fs';
import path from 'path';
import { revalidatePath } from 'next/cache';

const dataDir = path.join(process.cwd(), 'data');
const dbFile = path.join(dataDir, 'schedule-settings.json');

// Ensure data folder and file exist
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

export interface Shift {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  slotDuration: number; // in minutes
}

export interface BlockedSlot {
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
}

export interface ServiceItem {
  id: string;
  name: string;
  duration: number; // minutes
  price: number;
  description: string;
}

export interface ScheduleSettings {
  global: {
    startDate: string; // YYYY-MM-DD
    endDate: string; // YYYY-MM-DD
    shifts: Shift[];
    blockedDays: string[]; // YYYY-MM-DD
    blockedSlots: BlockedSlot[];
  };
  services: {
    [serviceId: string]: {
      hasCustomSettings: boolean;
      startDate: string;
      endDate: string;
      shifts: Shift[];
      blockedDays: string[];
      blockedSlots: BlockedSlot[];
    };
  };
  availableServices: ServiceItem[];
}

const defaultSettings: ScheduleSettings = {
  global: {
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    shifts: [
      { id: '1', name: 'Morning Shift', startTime: '09:00', endTime: '13:00', slotDuration: 30 },
      { id: '2', name: 'Evening Shift', startTime: '16:00', endTime: '20:00', slotDuration: 30 },
    ],
    blockedDays: [],
    blockedSlots: [],
  },
  services: {},
  availableServices: [
    { id: 'cleaning', name: 'Teeth Cleaning', duration: 30, price: 500, description: 'Routine cleaning' },
    { id: 'filling', name: 'Tooth Filling', duration: 40, price: 800, description: 'Restoration' },
    { id: 'root-canal', name: 'Root Canal', duration: 60, price: 1500, description: 'Complex treatment' },
    { id: 'implants', name: 'Dental Implants', duration: 45, price: 2500, description: 'Permanent solution' },
    { id: 'checkup', name: 'Consultation', duration: 20, price: 200, description: 'General checkup' },
  ],
};

if (!fs.existsSync(dbFile)) {
  fs.writeFileSync(dbFile, JSON.stringify(defaultSettings, null, 2), 'utf-8');
}

export async function getScheduleSettings(): Promise<ScheduleSettings> {
  try {
    const raw = fs.readFileSync(dbFile, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    return defaultSettings;
  }
}

export async function updateGlobalSchedule(data: Partial<ScheduleSettings['global']>) {
  const current = await getScheduleSettings();
  const updated = {
    ...current,
    global: {
      ...current.global,
      ...data,
    },
  };
  fs.writeFileSync(dbFile, JSON.stringify(updated, null, 2), 'utf-8');
  revalidatePath('/book');
  revalidatePath('/dashboard/schedule');
  return { success: true };
}

export async function toggleDayBlock(date: string) {
  const current = await getScheduleSettings();
  let blockedDays = [...current.global.blockedDays];
  if (blockedDays.includes(date)) {
    blockedDays = blockedDays.filter((d) => d !== date);
  } else {
    blockedDays.push(date);
  }
  return updateGlobalSchedule({ blockedDays });
}

export async function toggleSlotBlock(date: string, time: string) {
  const current = await getScheduleSettings();
  let blockedSlots = [...current.global.blockedSlots];
  const activeIndex = blockedSlots.findIndex((s) => s.date === date && s.time === time);
  if (activeIndex >= 0) {
    blockedSlots.splice(activeIndex, 1);
  } else {
    blockedSlots.push({ date, time });
  }
  return updateGlobalSchedule({ blockedSlots });
}

export async function updateServices(services: ServiceItem[]) {
  const current = await getScheduleSettings();
  const updated = {
    ...current,
    availableServices: services,
  };
  fs.writeFileSync(dbFile, JSON.stringify(updated, null, 2), 'utf-8');
  revalidatePath('/book');
  revalidatePath('/dashboard/schedule');
  return { success: true };
}
