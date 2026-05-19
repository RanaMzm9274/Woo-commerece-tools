import { createClient } from "@supabase/supabase-js";

<<<<<<< HEAD
const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL as string | undefined)?.trim();
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined)?.trim();

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase env: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are required.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
=======
const supabaseUrl = "https://bvmgylflejzktwfedimk.supabase.co" as string;
// const supabaseKey =
//   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ2bWd5bGZsZWp6a3R3ZmVkaW1rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkwNjE5MjMsImV4cCI6MjA3NDYzNzkyM30.TKQUGq88qwJYO2WRgQ144N1H5F9iGgBu_XDeGnm1ymU" as string;
const supabaseServiceRoleKey = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ2bWd5bGZsZWp6a3R3ZmVkaW1rIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTA2MTkyMywiZXhwIjoyMDc0NjM3OTIzfQ.2eCGMRcgIzUOInI0-0JR2Ivsi_N-Vm6gOVqm2eSI6I0`;

export const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
>>>>>>> 8c992743900e1e9073f6cca2f5700ab2ef0bf4c0
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storageKey: "diy-auth",
  },
});
<<<<<<< HEAD

// Browser bundle must never expose service-role credentials.
// Keep the symbol for compatibility; move privileged operations to server/edge functions.
export const supabaseAdmin = supabase;
=======
>>>>>>> 8c992743900e1e9073f6cca2f5700ab2ef0bf4c0
