import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { Module, Report } from '../types'
import { mockReports } from '../mocks/reports'

export const useReportStore = defineStore('report', () => {
  const reports = ref<Report[]>(mockReports)

  const byModule = (m: Module) => computed(() => reports.value.filter((r) => r.module === m && !r.deleted))
  const k = byModule('k')
  const nk = byModule('nk')
  const sos = byModule('sos')

  const total = computed(() => reports.value.filter((r) => !r.deleted).length)

  const byId = (id: string) => computed(() => reports.value.find((r) => r.id === id))

  const moduleLabel: Record<Module, string> = { k: 'Kebakaran', nk: 'Non Kebakaran', sos: 'Sosialisasi' }

  return { reports, k, nk, sos, total, byId, moduleLabel }
})
