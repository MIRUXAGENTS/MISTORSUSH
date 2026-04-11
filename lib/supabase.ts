import { createClient } from '@supabase/supabase-js';

const S_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const S_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const sb = createClient(S_URL, S_KEY);
