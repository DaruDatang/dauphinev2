import { createClient } from '@supabase/supabase-js';

export default async function handler(request, response) {
  const supabaseUrl = 'https://pgibgjnrhciyxqdoyxfh.supabase.co';
  const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBnaWJnam5yaGNpeXhxZG95eGZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI3ODkwMjAsImV4cCI6MjA4ODM2NTAyMH0.be5LR4tH7j86-WfX7fqlpWRx5Br5sHjNObUuDejJAu4';

  if (!supabaseUrl || !supabaseAnonKey) {
    return response.status(500).json({ error: 'Missing environment variables in Vercel' });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    await supabase.from('feedbacks').select('id').limit(1);
    
    return response.status(200).json({ 
      success: true, 
      message: 'Supabase heartbeat triggered successfully via Vercel Cron' 
    });
  } catch (err) {
    return response.status(500).json({ error: err.message });
  }
}