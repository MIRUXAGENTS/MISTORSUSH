import { createClient } from '@supabase/supabase-js';

const S_URL = 'https://iaqbtwsothmkdjapstkq.supabase.co';
const S_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlhcWJ0d3NvdGhta2RqYXBzdGtxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQyNjE0ODYsImV4cCI6MjA4OTgzNzQ4Nn0.ye0QGkypstTfxGjCkytn_x7bwsa-2tNiq3EIEulsvV0';

export const sb = createClient(S_URL, S_KEY);
