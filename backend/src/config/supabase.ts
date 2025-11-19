import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Client pour les opérations publiques (avec RLS)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Client admin pour les opérations qui nécessitent des privilèges élevés (bypass RLS)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
