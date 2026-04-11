import { createClient } from '@supabase/supabase-js';

/**
 * Server-side Supabase client for SSR
 * Uses environment variables directly (not NEXT_PUBLIC_*)
 * This should only be used in Server Components and API routes
 */
export function createServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  
  return createClient(url, key, {
    auth: {
      persistSession: false,
    },
  });
}

export interface SupabaseProduct {
  id: number;
  name: string;
  name_en: string;
  name_he: string;
  price: number;
  ingredients: string;
  ingredients_en: string;
  ingredients_he: string;
  is_available: boolean;
  category: string;
  image_url?: string;
}

/**
 * Fetch all products from Supabase (server-side)
 * Includes revalidation cache for ISR
 */
export async function fetchProducts(revalidate?: number): Promise<SupabaseProduct[]> {
  const supabase = createServerClient();
  
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .neq('category', 'system_config')
    .order('id', { ascending: true });

  if (error) {
    console.error('Supabase fetch error:', error.message);
    return [];
  }

  return data || [];
}

/**
 * Check site status (server-side)
 */
export async function fetchSiteStatus(): Promise<boolean> {
  const supabase = createServerClient();
  
  const { data, error } = await supabase
    .from('config')
    .select('is_active')
    .eq('key', 'site_status')
    .single();

  if (error || !data) {
    return true; // Default to active if config doesn't exist
  }

  return data.is_active;
}
