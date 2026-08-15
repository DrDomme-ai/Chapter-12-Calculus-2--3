import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client using Vite env vars. Provide these in your local
// .env: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY. Do NOT commit secrets.
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || ''
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

export default supabase
