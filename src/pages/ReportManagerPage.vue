<template>
  <div class="space-y-4">
    <div class="flex flex-wrap items-end justify-between gap-3">
      <div>
        <h2 class="text-2xl font-extrabold">Pengelola Laporan</h2>
        <p class="text-sm text-muted">Kelola dan unduh seluruh laporan operasional</p>
      </div>
      <span v-if="reportStore.usingLiveData" class="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-600">● Data Live</span>
      <span v-else class="rounded-full bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-600">● Data Contoh</span>
    </div>

    <Card class="flex flex-wrap items-end gap-3 p-4">
      <div>
        <label class="mb-1.5 block text-xs font-semibold text-muted">Periode Laporan</label>
        <Select v-model="period" class="w-44">
          <option v-for="p in periods" :key="p" :value="p">{{ periodLabel(p) }}</option>
        </Select>
      </div>
      <div>
        <label class="mb-1.5 block text-xs font-semibold text-muted">Kategori Laporan</label>
        <Select v-model="category" class="w-44">
          <option value="k">Kebakaran</option>
          <option value="nk">Penyelamatan</option>
          <option value="sos">Sosialisasi</option>
        </Select>
      </div>
      <div class="ml-auto flex gap-2">
        <Button @click="exportPdf"><Printer class="h-4 w-4" /> Cetak Laporan PDF</Button>
        <Button variant="success" @click="exportCsv"><FileSpreadsheet class="h-4 w-4" /> Cetak Laporan CSV</Button>
      </div>
    </Card>

    <Card class="overflow-hidden">
      <div class="flex items-center justify-between border-b border-line p-4">
        <h3 class="font-bold">Data Laporan {{ categoryLabel }}</h3>
        <div class="flex w-72 items-center gap-2 rounded-lg border border-line bg-background px-3 py-2">
          <Search class="h-4 w-4 shrink-0 text-muted" />
          <input v-model="q" placeholder="Cari laporan…" class="w-full bg-transparent text-sm outline-none placeholder:text-muted" />
        </div>
      </div>

      <div v-if="reportStore.loading" class="p-8 text-center text-sm text-muted">Memuat laporan…</div>
      <table v-else class="w-full text-sm">
        <thead>
          <tr class="border-b border-line bg-background/60 text-left text-xs text-muted">
            <th class="w-10 px-4 py-3" /><th class="px-2 py-3">No.</th>
            <th v-for="c in columns" :key="c" class="px-2 py-3 font-semibold">{{ c }}</th>
            <th class="px-4 py-3 text-right">Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="!filteredGroups.length">
            <td :colspan="columns.length + 3" class="px-4 py-8 text-center text-sm text-muted">
              Belum ada laporan pada periode/kategori ini.
            </td>
          </tr>
          <template v-for="g in filteredGroups" :key="g.id">
            <tr class="cursor-pointer border-b border-line bg-brand-600/5 hover:bg-brand-600/10" @click="toggle(g.id)">
              <td class="px-4 py-3"><ChevronDown :class="['h-4 w-4 text-muted transition-transform', expanded.has(g.id) && 'rotate-180']" /></td>
              <td class="px-2 py-3 font-extrabold">{{ g.no }}</td>
              <td class="px-2 py-3 font-semibold" :colspan="columns.length">{{ g.title }}</td>
              <td class="px-4 py-3 text-right text-xs font-bold text-brand-600">{{ g.summary }}</td>
            </tr>
            <template v-if="expanded.has(g.id)">
              <tr v-for="r in g.rows" :key="r.id" class="border-b border-line/60 hover:bg-background/60">
                <td />
                <td class="px-2 py-3 text-muted">{{ r.no }}</td>
                <td v-for="(v, i) in r.cells" :key="i" class="px-2 py-3">{{ v }}</td>
                <td class="px-4 py-3">
                  <div class="flex justify-end gap-1">
                    <button class="flex h-7 w-7 items-center justify-center rounded-md bg-brand-600 text-white hover:bg-brand-500" aria-label="Lihat" @click.stop="viewReport(r.id)"><Eye class="h-3.5 w-3.5" /></button>
                    <button class="flex h-7 w-7 items-center justify-center rounded-md bg-brand-600 text-white hover:bg-brand-500" aria-label="Ubah"><Pencil class="h-3.5 w-3.5" /></button>
                    <button class="flex h-7 w-7 items-center justify-center rounded-md bg-damkar-600 text-white hover:bg-damkar-500" aria-label="Hapus"><Trash2 class="h-3.5 w-3.5" /></button>
                  </div>
                </td>
              </tr>
            </template>
          </template>
        </tbody>
      </table>

      <div class="flex items-center justify-between border-t border-line p-4">
        <div class="flex gap-1.5">
          <button v-for="p in [1, 2, 3]" :key="p" :class="['flex h-8 w-8 items-center justify-center rounded-lg text-sm font-semibold', p === 1 ? 'bg-brand-600 text-white' : 'border border-line text-muted hover:text-ink']">{{ p }}</button>
        </div>
        <p class="text-xs text-muted">Tampilkan <span class="font-bold text-ink">10</span> per halaman</p>
      </div>
    </Card>

    <div class="flex items-center justify-between rounded-xl border border-damkar-500/20 bg-damkar-500/5 p-4">
      <div><p class="text-xs text-muted">{{ summaryLabel }}</p><p class="text-2xl font-extrabold text-damkar-500">{{ summaryValue }}</p></div>
      <div class="text-right"><p class="text-xs text-muted">Jumlah Laporan</p><p class="text-xl font-extrabold">{{ totalRows }} Kejadian</p></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { Search, ChevronDown, Eye, Pencil, Trash2, Printer, FileSpreadsheet } from '@lucide/vue'
import Card from '../components/ui/Card.vue'
import Button from '../components/ui/Button.vue'
import Select from '../components/ui/Select.vue'
import { useReportStore } from '../stores/report'
import { useIncidentStore, type IncidentCategory } from '../stores/incident'
import type { Module, Report } from '../types'

interface Row { id: string; no: string; cells: string[] }
interface Group { id: string; no: number; title: string; summary: string; rows: Row[] }

const router = useRouter()
const reportStore = useReportStore()
const incidentStore = useIncidentStore()

const category = ref<Module>('k')
const q = ref('')
const expanded = ref<Set<string>>(new Set())

const categoryLabel = computed(() => ({ k: 'Kebakaran', nk: 'Penyelamatan', sos: 'Sosialisasi' }[category.value]))
const columns = computed(() => category.value === 'k'
  ? ['Tanggal', 'Jenis', 'Nama', 'Penyebab', 'Objek', 'Kerugian (Rp)']
  : category.value === 'nk'
    ? ['Tanggal', 'Jenis', 'Nama', 'Alamat', 'Objek', 'Keterangan']
    : ['Tanggal', 'Nama', 'Alamat', 'Peserta', 'Keterangan'])

// Periode diambil dari data live (YYYY-MM); default = bulan terbaru
const periods = computed(() => {
  const set = new Set<string>()
  for (const r of reportStore.reports) {
    const raw = r.incident_at || r.report_received_at
    if (raw && raw.length >= 7) set.add(raw.slice(0, 7))
  }
  return [...set].sort().reverse()
})
const period = ref('')
watch(periods, (p) => { if (!period.value && p.length) period.value = p[0] ?? '' }, { immediate: true })
const periodLabel = (ym: string) => {
  const d = new Date(ym + '-02')
  return d.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })
}

const catOf = (m: Module): IncidentCategory => (m === 'k' ? 'darurat' : m === 'nk' ? 'penyelamatan' : 'terjadwal')

function num(v: unknown): number {
  if (typeof v === 'number') return v
  const n = parseInt(String(v ?? '').replace(/[^0-9]/g, ''), 10)
  return Number.isNaN(n) ? 0 : n
}
function fmtRp(v: unknown): string {
  const n = num(v)
  return n > 0 ? 'Rp ' + n.toLocaleString('id-ID') : '-'
}
function fmtDate(raw: string | null | undefined): string {
  if (!raw) return '-'
  const d = new Date(raw)
  return Number.isNaN(d.getTime()) ? '-' : d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
}

function cellsFor(m: Module, r: Report): string[] {
  const d = (r.data ?? {}) as unknown as Record<string, unknown>
  const str = (k: string) => String(d[k] ?? '').trim() || '-'
  const tgl = fmtDate(r.incident_at || r.report_received_at)
  const alamat = [d.lokasiDetail, d.kel, d.kec].filter((v) => String(v ?? '').trim()).join(', ') || '-'
  if (m === 'k') return [tgl, str('jenis'), str('pNama'), str('penyebab'), str('objekTerbakar'), fmtRp(d.kerugian)]
  if (m === 'nk') return [tgl, str('jenis'), str('pNama') !== '-' ? str('pNama') : str('idNama'), alamat, str('objekTerbakar'), str('keterangan')]
  return [tgl, str('tempat') !== '-' ? str('tempat') : str('pNama'), alamat, str('peserta') !== '-' ? str('peserta') : str('jumlahPeserta'), str('keterangan')]
}

// Grup = cluster insiden (sumber kebenaran tunggal, sama dengan Pusat Komando)
const groups = computed<Group[]>(() => {
  const byId = new Map(reportStore.reports.map((r) => [r.id, r]))
  return incidentStore.incidents
    .filter((i) => i.category === catOf(category.value))
    .filter((i) => !period.value || i.reportIds.some((id) => (byId.get(id)?.incident_at || '').startsWith(period.value)))
    .map((inc, idx) => {
      const rs = incidentStore.reportsOf(inc.id)
      return {
        id: inc.id,
        no: idx + 1,
        title: `Insiden ${inc.badge} — ${inc.title} — ${inc.address} — ${inc.dateLabel}`,
        summary: `${inc.reportCount} Laporan`,
        rows: rs.map((r, j) => ({ id: r.id, no: `${idx + 1}.${j + 1}`, cells: cellsFor(category.value, r) })),
      }
    })
})

// Buka grup pertama otomatis saat data tersedia
watch(groups, (gs) => {
  const first = gs[0]
  if (!expanded.value.size && first) expanded.value.add(first.id)
}, { immediate: true })

const filteredGroups = computed(() => {
  const qs = q.value.toLowerCase()
  if (!qs) return groups.value
  return groups.value.map((g) => ({
    ...g,
    rows: g.rows.filter((r) => r.cells.some((c) => c.toLowerCase().includes(qs))),
  })).filter((g) => g.rows.length)
})

const totalRows = computed(() => filteredGroups.value.reduce((s, g) => s + g.rows.length, 0))
const summaryLabel = computed(() => category.value === 'k' ? 'Total Kerugian' : 'Total Peserta')
const summaryValue = computed(() => {
  const rs = incidentStore.incidents
    .filter((i) => i.category === catOf(category.value))
    .flatMap((i) => incidentStore.reportsOf(i.id))
  if (category.value === 'k') {
    const total = rs.reduce((s, r) => s + num((r.data as unknown as Record<string, unknown>)?.kerugian), 0)
    return total > 0 ? 'Rp ' + total.toLocaleString('id-ID') : '-'
  }
  if (category.value === 'sos') {
    const total = rs.reduce((s, r) => {
      const d = r.data as unknown as Record<string, unknown>
      return s + num(d?.peserta ?? d?.jumlahPeserta)
    }, 0)
    return total > 0 ? total.toLocaleString('id-ID') + ' Orang' : '-'
  }
  return '-'
})

function toggle(id: string) {
  if (expanded.value.has(id)) expanded.value.delete(id)
  else expanded.value.add(id)
}
function viewReport(id: string) {
  router.push({ name: 'report-detail', params: { id } })
}
// Format export SATRIA (10 field standar) TIDAK berubah — masih menunggu implementasi;
// hanya sumber data tabel yang diganti dari mock ke live.
function exportPdf() { alert('Export PDF (mock)') }
function exportCsv() { alert('Export CSV (mock)') }
</script>
