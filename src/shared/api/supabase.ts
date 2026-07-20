import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/shared/types/database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Отсутствуют VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY. Заполните .env по образцу .env.example.'
  );
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
