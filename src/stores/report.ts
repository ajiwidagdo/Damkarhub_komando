import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { Module, Report } from '../types'
import { mockReports } from '../mocks/reports'
import { isSupabaseConfigured, supabase } from '../lib/supabase'
import { toReport } from '../lib/adapters'

const REPORT_COLUMNS =
  'id,module,data,deleted,updated_at,owner,tenant_id,status,incident_at,report_received_at'

export const useReportStore = defineStore('report', () => {
  // Mock sebagai state awal — diganti data Supabase saat fetch berhasil.
  const reports = ref<Report[]>(mockReports)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const usingLiveData = ref(false)

  const byModule = (m: Module) => computed(() => reports.value.filter((r) => r.module === m && !r.deleted))
  const k = byModule('k')
  const nk = byModule('nk')
  const sos = byModule('sos')

  const total = computed(() => reports.value.filter((r) => !r.deleted).length)

  const byId = (id: string) => computed(() => reports.value.find((r) => r.id === id))

  const moduleLabel: Record<Module, string> = { k: 'Kebakaran', nk: 'Non Kebakaran', sos: 'Sosialisasi' }

  async function fetchReports(): Promise<void> {
    if (!isSupabaseConfigured) return
    loading.value = true
    error.value = null
    try {
      const { data, error: err } = await supabase
        .from('reports')
        .select(REPORT_COLUMNS)
        .order('updated_at', { ascending: false })
        .limit(500)
      if (err) throw err
      reports.value = (data ?? []).map((row) => toReport(row as Record<string, unknown>))
      usingLiveData.value = true
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Gagal memuat laporan'
    } finally {
      loading.value = false
    }
  }

  let channel: ReturnType<typeof supabase.channel> | null = null

  /** Realtime: setiap perubahan tabel reports -> muat ulang daftar. */
  function subscribeRealtime(): void {
    if (!isSupabaseConfigured || channel) return
    channel = supabase
      .channel('komando-reports')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'reports' }, () => {
        void fetchReports()
      })
      .subscribe()
  }

  function unsubscribeRealtime(): void {
    if (channel) {
      void supabase.removeChannel(channel)
      channel = null
    }
  }

  // Ambil data real + subscribe saat store pertama dipakai.
  void fetchReports()
  subscribeRealtime()

  // Muat ulang (+ subscribe ulang realtime) setiap sesi auth berubah:
  // login baru, atau sesi pulih dari storage setelah refresh halaman.
  // Tanpa ini, fetch yang jalan sebelum sesi siap akan gagal RLS dan
  // tidak pernah dicoba ulang -> data mock tampil selamanya.
  supabase.auth.onAuthStateChange((event) => {
    if (event === 'SIGNED_IN' || event === 'INITIAL_SESSION') {
      unsubscribeRealtime()
      subscribeRealtime()
      void fetchReports()
    }
  })

  return {
    reports, k, nk, sos, total, byId, moduleLabel,
    loading, error, usingLiveData,
    fetchReports, subscribeRealtime, unsubscribeRealtime,
  }
})
