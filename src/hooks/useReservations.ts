import { useState } from 'react';
import { supabase, Reservation } from '../lib/supabase';
import toast from 'react-hot-toast';

export function useReservations() {
  const [loading, setLoading] = useState(false);

  const createReservation = async (reservationData: Omit<Reservation, 'id' | 'status' | 'created_at' | 'updated_at'>) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('reservations')
        .insert([reservationData])
        .select()
        .single();

      if (error) throw error;

      toast.success('Reservation submitted successfully! We will confirm your booking shortly.');
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create reservation';
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createReservation, loading };
}