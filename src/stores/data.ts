import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { FleetStatus, FleetUnit, Personnel } from '../types'
import { mockFleet, mockPersonnel, mockRatings, mockPopular, mockFunniest } from '../mocks/personnel'
import { isSupabaseConfigured, supabase } from '../lib/supabase'
import { toPersonnel } from '../lib/adapters'

export const usePersonnelStore = defineStore('personnel', () => {
  // Mock sebagai state awal — diganti data Supabase saat fetch berhasil.
  const personnel = ref<Personnel[]>(mockPersonnel)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const usingLiveData = ref(false)

  const activeCount = computed(() => personnel.value.filter((p) => p.dispatch_active).length)

  async function fetchPersonnel(): Promise<void> {
    if (!isSupabaseConfigured) return
    loading.value = true
    error.value = null
    try {
      const [{ data: reguRows, error: reguErr }, { data: personilRows, error: personilErr }] =
        await Promise.all([
          supabase.from('regu').select('id,nama').order('nama', { ascending: true }),
          supabase.from('personil').select('id,nama,regu_id').order('nama', { ascending: true }),
        ])
      if (reguErr) throw reguErr
      if (personilErr) throw personilErr
      const reguNameById = new Map<string, string>(
        ((reguRows ?? []) as Record<string, unknown>[]).map((r) => [String(r.id), String(r.nama ?? '')]),
      )
      personnel.value = ((personilRows ?? []) as Record<string, unknown>[]).map((row) =>
        toPersonnel(row, reguNameById),
      )
      usingLiveData.value = true
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Gagal memuat personil'
    } finally {
      loading.value = false
    }
  }

  // Ambil data real saat store pertama dipakai, dan muat ulang setiap
  // sesi auth berubah (login / sesi pulih setelah refresh) agar tidak
  // terjebak di data mock bila fetch pertama jalan sebelum sesi siap.
  void fetchPersonnel()
  supabase.auth.onAuthStateChange((event) => {
    if (event === 'SIGNED_IN' || event === 'INITIAL_SESSION') void fetchPersonnel()
  })

  return { personnel, activeCount, loading, error, usingLiveData, fetchPersonnel }
})

export const useFleetStore = defineStore('fleet', () => {
  const fleet = ref<FleetUnit[]>(mockFleet)

  const statusLabel: Record<FleetStatus, string> = {
    siap: 'Siap Operasi',
    tugas: 'Bertugas',
    perawatan: 'Perawatan',
  }

  function add(unit: Omit<FleetUnit, 'id'>) {
    fleet.value.push({ ...unit, id: `f${Date.now()}` })
  }

  function update(id: string, patch: Partial<FleetUnit>) {
    const unit = fleet.value.find((f) => f.id === id)
    if (unit) Object.assign(unit, patch)
  }

  function remove(id: string) {
    fleet.value = fleet.value.filter((f) => f.id !== id)
  }

  return { fleet, statusLabel, add, update, remove }
})

export const useSurveyStore = defineStore('survey', () => {
  const ratings = ref(mockRatings)
  const popular = ref(mockPopular)
  const funniest = ref(mockFunniest)

  const totalVotes = computed(() => ratings.value.reduce((s, r) => s + r.count, 0))
  const avgRating = computed(() => {
    const t = totalVotes.value
    if (!t) return 0
    return ratings.value.reduce((s, r) => s + r.rating * r.count, 0) / t
  })

  return { ratings, popular, funniest, totalVotes, avgRating }
})
