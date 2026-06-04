import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://khnlgyzovgpsxrqabgkw.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtobmxneXpvdmdwc3hycWFiZ2t3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA0MDAyMzUsImV4cCI6MjA5NTk3NjIzNX0.Hd4z7IAhGCp-40M4tFgCV6TWCwt3_LUG2oQZeO0nwvc';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);