import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import type { Module, Report } from '../types'
import { useReportStore } from './report'
import { badgeFor, parseKoordinat, proposeClusters } from '../lib/cluster'

/**
 * Insiden = agregasi (cluster) dari reports.
 * Sesuai ARAHAN-Cluster-Insiden-KOMANDO (2026-10-06): tidak ada tabel baru.
 * Sistem mengusulkan cluster otomatis; operator mengonfirmasi (hybrid):
 * setujui / gabung / pisah. Keputusan operator disimpan sesi-lokal
 * (tidak ada perubahan skema DB).
 */

export type IncidentCategory = 'darurat' | 'penyelamatan' | 'terjadwal' | 'lainnya'
export type ClusterStatus = 'usulan' | 'disetujui'

export const categoryMeta: Record<IncidentCategory, { label: string; color: string; bg: string }> = {
  darurat: { label: 'DARURAT', color: '#dc2626', bg: '#dc2626' },
  penyelamatan: { label: 'PENYELAMATAN', color: '#f59e0b', bg: '#f59e0b' },
  terjadwal: { label: 'TERJADWAL', color: '#2563eb', bg: '#2563eb' },
  lainnya: { label: 'LAINNYA', color: '#64748b', bg: '#64748b' },
}

export interface IncidentView {
  id: string
  badge: string
  status: ClusterStatus
  category: IncidentCategory
  title: string
  address: string
  time: string
  dateLabel: string
  lat: number | null
  lng: number | null
  coords: string
  phone: string
  reportIds: string[]
  reportCount: number
}

const moduleToCategory = (m: Module): IncidentCategory =>
  m === 'k' ? 'darurat' : m === 'nk' ? 'penyelamatan' : 'terjadwal'

function fmtTime(ms: number): string {
  return new Date(ms).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }).replace('.', ':')
}

function fmtDate(ms: number): string {
  return new Date(ms).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
}

function latestAtOf(ids: string[], byId: Map<string, Report>): number {
  let t = 0
  for (const id of ids) {
    const r = byId.get(id)
    if (!r) continue
    const raw = r.incident_at || r.report_received_at || r.updated_at
    const ms = raw ? Date.parse(raw) : NaN
    if (!Number.isNaN(ms)) t = Math.max(t, ms)
  }
  return t
}

export const useIncidentStore = defineStore('incident', () => {
  const reportStore = useReportStore()

  // Grup manual operator (hasil gabung/pisah): groupId -> reportIds
  const manualGroups = ref<Record<string, string[]>>({})
  // Cluster yang sudah disetujui operator
  const approved = ref<Record<string, boolean>>({})
  const seq = ref(0)

  const incidents = computed<IncidentView[]>(() => {
    const reports = reportStore.reports.filter((r) => !r.deleted)
    const byId = new Map(reports.map((r) => [r.id, r]))
    const assigned = new Set<string>()
    const groups: { id: string; reportIds: string[] }[] = []

    // 1. Grup manual operator lebih dulu
    for (const [gid, ids] of Object.entries(manualGroups.value)) {
      const valid = ids.filter((id) => byId.has(id))
      if (!valid.length) continue
      valid.forEach((id) => assigned.add(id))
      groups.push({ id: gid, reportIds: valid })
    }

    // 2. Sisanya: cluster otomatis
    const rest = reports.filter((r) => !assigned.has(r.id))
    for (const c of proposeClusters(rest)) {
      // id stabil: tanggal + kunci grup (tetap walau laporan baru masuk)
      const d = new Date(c.latestAt)
      const ymd = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`
      const slug = c.key.replace(/[^a-z0-9]+/gi, '-').slice(0, 40)
      groups.push({ id: `a-${ymd}-${slug || 'x'}`, reportIds: c.reportIds })
    }

    // 3. Urut aktivitas terbaru -> badge A, B, C...
    groups.sort((a, b) => latestAtOf(b.reportIds, byId) - latestAtOf(a.reportIds, byId))

    return groups.map((g, i) => {
      const rs = g.reportIds.map((id) => byId.get(id)!).filter(Boolean)
      const first = rs[0]
      const d0 = (first?.data ?? {}) as unknown as Record<string, string>
      const latest = latestAtOf(g.reportIds, byId)

      let lat: number | null = null
      let lng: number | null = null
      let coords = ''
      for (const r of rs) {
        const p = parseKoordinat((r.data as unknown as Record<string, string>)?.koordinat)
        if (p) { [lat, lng] = p; coords = `${p[0].toFixed(4)}, ${p[1].toFixed(4)}`; break }
      }

      const lokasi = [d0.lokasiDetail, d0.kel, d0.kec].filter(Boolean).join(', ')
      return {
        id: g.id,
        badge: badgeFor(i),
        status: (approved.value[g.id] ? 'disetujui' : 'usulan') as ClusterStatus,
        category: moduleToCategory(first?.module ?? 'k'),
        title: d0.jenis || 'Insiden',
        address: lokasi || '-',
        time: latest ? fmtTime(latest) : '-',
        dateLabel: latest ? fmtDate(latest) : '-',
        lat, lng, coords,
        phone: d0.pHP || '',
        reportIds: g.reportIds,
        reportCount: g.reportIds.length,
      }
    })
  })

  function approve(id: string): void {
    approved.value[id] = true
  }

  function unapprove(id: string): void {
    delete approved.value[id]
  }

  /** Gabung beberapa insiden menjadi 1 grup manual. */
  function merge(ids: string[]): string | null {
    const all = new Set<string>()
    for (const inc of incidents.value) {
      if (ids.includes(inc.id)) inc.reportIds.forEach((r) => all.add(r))
    }
    if (all.size < 2) return null
    seq.value += 1
    const gid = `m${seq.value}`
    manualGroups.value[gid] = [...all]
    // id grup lama yang manual ikut dilebur
    for (const id of ids) {
      if (id.startsWith('m')) delete manualGroups.value[id]
      delete approved.value[id]
    }
    approved.value[gid] = true // hasil gabungan dianggap keputusan operator
    return gid
  }

  /**
   * Pisah: pindahkan report terpilih menjadi grup manual baru.
   * Sisanya tetap (grup manual) atau kembali di-cluster otomatis.
   */
  function split(incidentId: string, reportIds: string[]): string | null {
    const inc = incidents.value.find((i) => i.id === incidentId)
    if (!inc || reportIds.length === 0 || reportIds.length >= inc.reportIds.length) return null
    seq.value += 1
    const gid = `m${seq.value}`
    manualGroups.value[gid] = [...reportIds]
    if (incidentId.startsWith('m')) {
      manualGroups.value[incidentId] = inc.reportIds.filter((id) => !reportIds.includes(id))
    }
    // laporan terpilih keluar dari grup asal -> grup asal jadi usulan lagi
    delete approved.value[incidentId]
    return gid
  }

  function resetOverrides(): void {
    manualGroups.value = {}
    approved.value = {}
  }

  function reportsOf(incidentId: string): Report[] {
    const inc = incidents.value.find((i) => i.id === incidentId)
    if (!inc) return []
    const byId = new Map(reportStore.reports.map((r) => [r.id, r]))
    return inc.reportIds.map((id) => byId.get(id)!).filter(Boolean)
  }

  return {
    incidents, manualGroups, approved,
    approve, unapprove, merge, split, resetOverrides, reportsOf,
  }
})
