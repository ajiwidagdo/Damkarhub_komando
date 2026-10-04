import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { FleetStatus, FleetUnit } from '../types'
import { mockFleet, mockPersonnel, mockRatings, mockPopular, mockFunniest } from '../mocks/personnel'

export const usePersonnelStore = defineStore('personnel', () => {
  const personnel = ref(mockPersonnel)
  const activeCount = computed(() => personnel.value.filter((p) => p.dispatch_active).length)
  return { personnel, activeCount }
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
