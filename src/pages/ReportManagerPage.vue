<template>
  <div class="space-y-4">
    <div>
      <p class="text-xs text-muted">Pengelola Laporan</p>
      <h2 class="text-2xl font-extrabold">Pengelola Laporan</h2>
      <p class="text-sm text-muted">Kelola, pantau, dan unduh seluruh laporan operasional DAMKARHUB</p>
    </div>

    <Card class="flex flex-wrap items-end gap-3 p-4">
      <div>
        <label class="mb-1.5 block text-xs font-semibold text-muted">Periode Laporan</label>
        <Select v-model="period" class="w-44"><option>Agustus 2025</option><option>Juli 2025</option></Select>
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

      <table class="w-full text-sm">
        <thead>
          <tr class="border-b border-line bg-background/60 text-left text-xs text-muted">
            <th class="w-10 px-4 py-3" /><th class="px-2 py-3">No.</th>
            <th v-for="c in columns" :key="c" class="px-2 py-3 font-semibold">{{ c }}</th>
            <th class="px-4 py-3 text-right">Aksi</th>
          </tr>
        </thead>
        <tbody>
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
                    <button class="flex h-7 w-7 items-center justify-center rounded-md bg-brand-600 text-white hover:bg-brand-500" aria-label="Lihat"><Eye class="h-3.5 w-3.5" /></button>
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
import { computed, ref } from 'vue'
import { Search, ChevronDown, Eye, Pencil, Trash2, Printer, FileSpreadsheet } from '@lucide/vue'
import Card from '../components/ui/Card.vue'
import Button from '../components/ui/Button.vue'
import Select from '../components/ui/Select.vue'

interface Row { id: string; no: string; cells: string[] }
interface Group { id: string; no: number; title: string; summary: string; rows: Row[] }

const period = ref('Agustus 2025')
const category = ref<'k' | 'nk' | 'sos'>('k')
const q = ref('')
const expanded = ref<Set<string>>(new Set(['g1']))

const categoryLabel = computed(() => ({ k: 'Kebakaran', nk: 'Penyelamatan', sos: 'Sosialisasi' }[category.value]))
const columns = computed(() => category.value === 'k'
  ? ['Tanggal', 'Jenis', 'Nama', 'Penyebab', 'Objek', 'Kerugian (Rp)']
  : category.value === 'nk'
    ? ['Tanggal', 'Jenis', 'Nama', 'Alamat', 'Objek', 'Keterangan']
    : ['Tanggal', 'Nama', 'Alamat', 'Peserta', 'Keterangan'])

const groups: Record<string, Group[]> = {
  k: [
    { id: 'g1', no: 1, title: '01 Agu 2025 08:15 — Lokasi: Jl. Merdeka No. 12, Kota Banjar', summary: 'Total Kerugian: Rp 200.000.000', rows: [
      { id: 'r11', no: '1.1', cells: ['01 Agu 2025', 'Kebakaran Bangunan', 'Bpk. Ahmad', 'Korsleting Listrik', 'Rumah Tinggal', '150.000.000'] },
      { id: 'r12', no: '1.2', cells: ['01 Agu 2025', 'Kebakaran Bangunan', 'Ibu Siti', 'Korsleting Listrik', 'Rumah Tinggal', '50.000.000'] },
    ]},
    { id: 'g2', no: 2, title: '03 Agu 2025 19:45 — Lokasi: Jl. Raya Ciamis, Kec. Ciamis', summary: 'Total Kerugian: Rp 120.000.000', rows: [
      { id: 'r21', no: '2.1', cells: ['03 Agu 2025', 'Kebakaran Kendaraan', 'Sdr. Rian', 'Korsleting Mesin', 'Mobil Pribadi', '80.000.000'] },
      { id: 'r22', no: '2.2', cells: ['03 Agu 2025', 'Kebakaran Kendaraan', 'Sdr. Dedi', 'Kebocoran BBM', 'Sepeda Motor', '40.000.000'] },
    ]},
  ],
  nk: [
    { id: 'g3', no: 1, title: '02 Agu 2025 — Evakuasi & Penyelamatan', summary: '3 Kejadian', rows: [
      { id: 'r31', no: '1.1', cells: ['02 Agu 2025', 'Evakuasi Hewan', '-', 'Jl. Cendana No. 12', 'Ular', 'Masuk rumah warga'] },
      { id: 'r32', no: '1.2', cells: ['02 Agu 2025', 'Evakuasi Manusia', 'Sdr. Raka', 'Jl. Raya Banjar', 'Lift', 'Terjebak di lift'] },
      { id: 'r33', no: '1.3', cells: ['03 Agu 2025', 'Evakuasi Hewan', '-', 'Komp. Griya Indah', 'Kucing', 'Terjebak di atap'] },
    ]},
  ],
  sos: [
    { id: 'g4', no: 1, title: '05 Agu 2025 — Sosialisasi Pencegahan Kebakaran di Sekolah', summary: 'Total Peserta: 185', rows: [
      { id: 'r41', no: '1.1', cells: ['05 Agu 2025', 'SDN 1 Banjar', 'Jl. Pendidikan No. 12', '120', 'Edukasi APAR'] },
      { id: 'r42', no: '1.2', cells: ['05 Agu 2025', 'SDN 2 Banjar', 'Jl. Pahlawan No. 45', '65', 'Edukasi APAR'] },
    ]},
  ],
}

const filteredGroups = computed(() => {
  const qs = q.value.toLowerCase()
  const list = groups[category.value] ?? []
  if (!qs) return list
  return list.map((g) => ({
    ...g,
    rows: g.rows.filter((r) => r.cells.some((c) => c.toLowerCase().includes(qs))),
  })).filter((g) => g.rows.length)
})

const totalRows = computed(() => filteredGroups.value.reduce((s, g) => s + g.rows.length, 0))
const summaryLabel = computed(() => category.value === 'k' ? 'Total Kerugian' : 'Total Peserta')
const summaryValue = computed(() => category.value === 'k' ? 'Rp 320.000.000' : category.value === 'sos' ? '185 Orang' : '-')

function toggle(id: string) {
  if (expanded.value.has(id)) expanded.value.delete(id)
  else expanded.value.add(id)
}
function exportPdf() { alert('Export PDF (mock)') }
function exportCsv() { alert('Export CSV (mock)') }
</script>
