import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qyhhdykrsmhqujrjmnle.supabase.co';
const supabaseAnonKey = 'sb_publishable_gLwMLo7DmaA9cLEUw67pOA_KG96DX5A';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
