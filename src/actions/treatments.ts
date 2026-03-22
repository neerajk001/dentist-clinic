'use server';

import { supabase } from '@/lib/db';

export interface TreatmentRow {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  createdAt: string;
}

export async function getTreatments(): Promise<TreatmentRow[]> {
  const { data, error } = await supabase
    .from('treatments')
    .select('*')
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching treatments:', error);
    return [];
  }

  return (data || []).map((t: { id: string; name: string; description: string; price: number; duration: number; created_at: string }) => ({
    id: t.id,
    name: t.name,
    description: t.description || '',
    price: Number(t.price),
    duration: t.duration,
    createdAt: t.created_at,
  }));
}
