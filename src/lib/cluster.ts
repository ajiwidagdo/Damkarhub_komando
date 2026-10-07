import type { Report } from '../types'

/**
 * Clustering insiden — sesuai ARAHAN-Cluster-Insiden-KOMANDO (2026-10-06):
 * "Insiden" = hasil pengelompokan otomatis dari `reports`. Laporan yang
 * lokasinya berdekatan + waktunya berdekatan = 1 insiden. Tidak ada tabel baru.
 *
 * Threshold (ditentukan saat implementasi, mudah diubah di sini):
 * - Jendela waktu: laporan dalam X jam yang sama dianggap satu kejadian.
 * - Lokasi: kecamatan + kelurahan yang sama (koordinat GPS jarang terisi di
 *   data live, sehingga jarak Haversine tidak bisa diandalkan).
 * - Jenis + modul yang sama (kebakaran rumah ≠ kebakaran lahan).
 */

/** Jendela waktu cluster: laporan dalam rentang ini = kandidat 1 insiden. */
export const CLUSTER_TIME_WINDOW_MS = 3 * 60 * 60 * 1000 // 3 jam

export interface ClusterSeed {
  id: string
  at: number // epoch ms (incident_at, fallback report_received_at / updated_at)
  module: Report['module']
  jenis: string
  kel: string
  kec: string
}

export interface AutoCluster {
  id: string
  reportIds: string[]
  latestAt: number
  key: string // kunci grup, untuk debug
}

function norm(s: string | undefined | null): string {
  return (s ?? '').trim().toLowerCase()
}

function reportTime(r: Report): number {
  const raw = r.incident_at || r.report_received_at || r.updated_at
  const t = raw ? Date.parse(raw) : NaN
  return Number.isNaN(t) ? 0 : t
}

export function toSeed(r: Report): ClusterSeed {
  const d = r.data ?? ({} as Report['data'])
  return {
    id: r.id,
    at: reportTime(r),
    module: r.module,
    jenis: norm((d as { jenis?: string }).jenis),
    kel: norm((d as { kel?: string }).kel),
    kec: norm((d as { kec?: string }).kec),
  }
}

/**
 * Usulkan cluster dari daftar laporan (sudah terurut waktu menaik).
 * Algoritma greedy: untuk tiap laporan, cari cluster yang kuncinya cocok
 * (modul+jenis+kec+kel sama) dan selisih waktu <= jendela; kalau tidak ada,
 * buat cluster baru.
 */
export function proposeClusters(reports: Report[]): AutoCluster[] {
  const seeds = reports
    .filter((r) => !r.deleted)
    .map(toSeed)
    .filter((s) => s.at > 0)
    .sort((a, b) => a.at - b.at)

  const clusters: AutoCluster[] = []
  let n = 0

  for (const s of seeds) {
    const key = `${s.module}|${s.jenis}|${s.kec}|${s.kel}`
    const target = clusters.find(
      (c) => c.key === key && Math.abs(s.at - c.latestAt) <= CLUSTER_TIME_WINDOW_MS,
    )
    if (target) {
      target.reportIds.push(s.id)
      target.latestAt = Math.max(target.latestAt, s.at)
    } else {
      n += 1
      clusters.push({ id: `auto-${n}`, reportIds: [s.id], latestAt: s.at, key })
    }
  }
  return clusters
}

/** Badge huruf: 0->A, 1->B, ... 25->Z, 26->AA, dst. */
export function badgeFor(index: number): string {
  let i = index
  let s = ''
  do {
    s = String.fromCharCode(65 + (i % 26)) + s
    i = Math.floor(i / 26) - 1
  } while (i >= 0)
  return s
}

/** Parse "lat, lng" -> [lat, lng] | null */
export function parseKoordinat(raw: string | undefined | null): [number, number] | null {
  if (!raw) return null
  const m = String(raw).split(',').map((p) => parseFloat(p.trim()))
  if (m.length === 2 && m[0] !== undefined && m[1] !== undefined && m.every((v) => Number.isFinite(v)))
    return [m[0], m[1]]
  return null
}
