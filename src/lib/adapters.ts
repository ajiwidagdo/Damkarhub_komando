import type { Personnel, Report } from '../types'

/**
 * Adapter: baris Supabase -> tipe domain KOMANDO.
 *
 * Skema `reports` mirror dengan tipe Report (lihat supabase/setup.sql repo SATRIA).
 * Skema `personil` BELUM punya kolom: pangkat, jabatan, no_hp, dispatch_active,
 * total_laporan — diberi nilai default aman sampai ada migrasi (butuh koordinasi
 * tim SATRIA; dispatch_active dibutuhkan fitur dispatch Prioritas 2).
 */

/** Baris mentah tabel `reports`. */
export function toReport(row: Record<string, unknown>): Report {
  const data = (row.data ?? {}) as Report['data']
  return {
    id: String(row.id ?? ''),
    module: (row.module as Report['module']) ?? 'k',
    data: { ...data, id: String(row.id ?? '') },
    deleted: Boolean(row.deleted),
    updated_at: (row.updated_at as string) ?? '',
    owner: (row.owner as string) ?? '',
    tenant_id: (row.tenant_id as string) ?? '',
    status: ((row.status as string) ?? 'DONE') as Report['status'],
    incident_at: (row.incident_at as string | null) ?? null,
    report_received_at: (row.report_received_at as string | null) ?? null,
  }
}

/** Baris mentah tabel `personil`. `reguNameById` dari tabel `regu`. */
export function toPersonnel(
  row: Record<string, unknown>,
  reguNameById: Map<string, string>,
): Personnel {
  const reguId = row.regu_id as string | null
  return {
    id: String(row.id ?? ''),
    nama: (row.nama as string) ?? '',
    pangkat: '',
    jabatan: '',
    regu: (reguId && reguNameById.get(reguId)) || '',
    no_hp: '',
    dispatch_active: false,
    total_laporan: 0,
  }
}
