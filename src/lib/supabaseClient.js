import { createClient } from '@supabase/supabase-js';

const rawUrl = import.meta.env.VITE_SUPABASE_URL;
const rawKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const validateUrl = (url) => {
  if (!url || typeof url !== 'string') return false;
  const cleanedUrl = url.trim();
  return cleanedUrl.startsWith('https://') || cleanedUrl.startsWith('http://');
};

const supabaseUrl = validateUrl(rawUrl)
  ? rawUrl.trim()
  : 'https://njjhdpxdjyypijuoznfw.supabase.co';

const supabaseAnonKey = rawKey && rawKey !== 'undefined' && rawKey !== 'null'
  ? rawKey.trim()
  : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5qamhkcHhkanl5cGlqdW96bmZ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIzMzA5NDQsImV4cCI6MjA5NzkwNjk0NH0.qhRDiCty2ZuAjVHl-0xt9aBOVWjXGdEfFwYCVOkE6e4';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);