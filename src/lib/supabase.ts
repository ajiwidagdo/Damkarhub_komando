import { createClient, type SupabaseClient } from '@supabase/supabase-js'

/**
 * Supabase client untuk KOMANDO.
 *
 * Kredensial dibaca dari environment (Vite):
 *   VITE_SUPABASE_URL
 *   VITE_SUPABASE_ANON_KEY
 *
 * Jangan commit file .env.local — gunakan .env.example sebagai acuan.
 * Jika env belum diisi, aplikasi berjalan dalam mode mock (data lokal).
 */

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

export const isSupabaseConfigured = Boolean(url && anonKey)

if (!isSupabaseConfigured) {
  console.warn('[supabase] VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY belum diisi — mode mock aktif.')
}

export const supabase: SupabaseClient = createClient(url ?? '', anonKey ?? '')

/** Keluar: hapus sesi Supabase + flag mock lama, lalu kembali ke /login. */
export async function signOut(): Promise<void> {
  if (isSupabaseConfigured) {
    await supabase.auth.signOut()
  }
  localStorage.removeItem('komando_auth')
}
