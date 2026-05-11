import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hpnesoyqvsozsglphdpp.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhwbmVzb3lxdnNvenNnbHBoZHBwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg1MTA4ODgsImV4cCI6MjA5NDA4Njg4OH0.ERs2-MIouf8dvcOhYr3HoOlfPjeghzLWXpO9tuZu7UM';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true, // Crucial: Save session to localStorage
    autoRefreshToken: true, // Keep session alive
    detectSessionInUrl: true // Handle OAuth/Email links
  }
});