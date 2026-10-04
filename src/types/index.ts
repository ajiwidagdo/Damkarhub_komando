/* Mirror schema Fireman — reports + personil (mock Komando) */

export type Module = 'k' | 'nk' | 'sos'
export type ReportStatus = 'DRAFT' | 'DONE'

export interface ReportData {
  id: string
  data_schema_version: string
  tanggal: string
  pukul: string
  jenis: string
  lokasiDetail: string
  dusun: string
  rtrw: string
  kel: string
  kec: string
  kabkota: string
  koordinat: string
  kronologi: string
  tindakan: string
  kendala: string[]
  unsur: string
  regu: string
  personil: string
  keterangan: string
  // K
  pNama?: string
  penyebab?: string
  objekTerbakar?: string
  // NK
  idNama?: string
  idUsia?: string
  // SOS
  tempat?: string
  kategori?: string
}

export interface Report {
  id: string
  module: Module
  data: ReportData
  deleted: boolean
  updated_at: string
  owner: string
  tenant_id: string
  status: ReportStatus
  incident_at: string | null
  report_received_at: string | null
}

export interface Personnel {
  id: string
  nama: string
  pangkat: string
  jabatan: string
  regu: string
  no_hp: string
  dispatch_active: boolean
  total_laporan: number
}

export type FleetStatus = 'siap' | 'tugas' | 'perawatan'

export interface FleetUnit {
  id: string
  nama: string
  jenis: string
  plat: string
  status: FleetStatus
  keterangan: string
}

export interface SurveyRating {
  rating: 1 | 2 | 3 | 4 | 5
  count: number
}

export interface LeaderboardEntry {
  nama: string
  detail: string
  votes: number
}
