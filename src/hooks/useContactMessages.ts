import { useState } from 'react';
import { supabase, ContactMessage } from '../lib/supabase';
import toast from 'react-hot-toast';

export function useContactMessages() {
  const [loading, setLoading] = useState(false);

  const sendContactMessage = async (messageData: Omit<ContactMessage, 'id' | 'status' | 'created_at'>) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('contact_messages')
        .insert([messageData])
        .select()
        .single();

      if (error) throw error;

      toast.success('Message sent successfully! We will get back to you soon.');
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send message';
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { sendContactMessage, loading };
}