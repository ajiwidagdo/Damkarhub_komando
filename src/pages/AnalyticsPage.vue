<template>
  <div class="space-y-4">
    <div class="flex flex-wrap items-end justify-between gap-3">
      <div>
        <h2 class="text-2xl font-extrabold">Dasbor Analitik</h2>
        <p class="text-sm text-muted">Ringkasan performa operasional dalam periode yang dipilih</p>
      </div>
      <div class="flex flex-wrap gap-2">
        <Select v-model="period" class="w-40">
          <option>Agustus 2025</option><option>Juli 2025</option><option>Juni 2025</option>
        </Select>
        <Select v-model="kategori" class="w-44">
          <option value="semua">Semua Kategori</option>
          <option value="k">Kebakaran</option>
          <option value="nk">Penyelamatan</option>
          <option value="sos">Sosialisasi</option>
        </Select>
        <Button><Download class="h-4 w-4" /> Cetak Laporan</Button>
      </div>
    </div>

    <!-- 6 stat cards -->
    <div class="grid grid-cols-2 gap-4 xl:grid-cols-6">
      <StatCard label="Total Laporan Masuk" value="25" :delta="12" up :icon="FileText" color="#2563eb" />
      <StatCard v-if="showK" label="Total Kebakaran" value="15" suffix="51%" :delta="37" :up="false" :icon="Flame" color="#dc2626" />
      <StatCard v-if="showNK" label="Total Penyelamatan" value="8" suffix="42%" :delta="37" up :icon="PawPrint" color="#2563eb" />
      <StatCard v-if="showSOS" label="Total Sosialisasi" value="2" suffix="7%" :delta="6" :up="false" :icon="Megaphone" color="#10b981" />
      <StatCard label="Rata-rata Respon Time" value="12 menit" :delta="28" :up="false" :icon="Clock" color="#1e3a5f" />
      <StatCard label="Total Jarak Tempuh" value="342 km" :delta="14" up :icon="Route" color="#1e3a5f" />
    </div>

    <!-- Charts row 1 -->
    <div class="grid gap-4 xl:grid-cols-3">
      <Card class="p-5 xl:col-span-1">
        <div class="mb-4 flex items-center justify-between">
          <h3 class="text-sm font-bold">Tren Laporan Masuk</h3>
          <Select v-model="trenMode" class="w-28 !h-8 text-xs"><option>Harian</option><option>Mingguan</option></Select>
        </div>
        <LazyChart type="line" :options="trenOptions" :series="trenSeries" />
      </Card>
      <Card class="p-5">
        <h3 class="mb-4 text-sm font-bold">Rincian Jenis Laporan</h3>
        <LazyChart type="donut" :options="jenisOptions" :series="[15, 8, 2]" />
      </Card>
      <Card class="p-5">
        <h3 class="mb-4 text-sm font-bold">Rasio Jam Operasi</h3>
        <LazyChart type="bar" :options="jamOptions" :series="[{ name: 'Kejadian', data: [8, 9, 5, 3] }]" />
      </Card>
    </div>

    <!-- Charts row 2 -->
    <div class="grid gap-4 xl:grid-cols-3">
      <Card v-if="showK" class="p-5">
        <div class="mb-4 flex items-center justify-between">
          <h3 class="flex items-center gap-2 text-sm font-bold"><Flame class="h-4 w-4 text-damkar-500" /> Rincian Kebakaran</h3>
          <button class="text-xs font-semibold text-brand-600 hover:underline">Lihat Detail →</button>
        </div>
        <LazyChart type="donut" :options="kebakaranOptions" :series="[7, 4, 2, 1, 1]" />
      </Card>
      <Card v-if="showNK" class="p-5">
        <div class="mb-4 flex items-center justify-between">
          <h3 class="flex items-center gap-2 text-sm font-bold"><PawPrint class="h-4 w-4 text-brand-500" /> Rincian Penyelamatan</h3>
          <button class="text-xs font-semibold text-brand-600 hover:underline">Lihat Detail →</button>
        </div>
        <div class="space-y-3 pt-2">
          <div v-for="r in penyelamatan" :key="r.label">
            <div class="mb-1 flex justify-between text-xs"><span>{{ r.label }}</span><span class="font-bold">{{ r.value }}</span></div>
            <div class="h-2.5 overflow-hidden rounded-full bg-background"><div class="h-full rounded-full" :style="{ width: (r.value / 4 * 100) + '%', background: r.color }" /></div>
          </div>
        </div>
      </Card>
      <Card v-if="showSOS" class="p-5">
        <div class="mb-4 flex items-center justify-between">
          <h3 class="flex items-center gap-2 text-sm font-bold"><Megaphone class="h-4 w-4 text-sos-500" /> Rincian Sosialisasi</h3>
          <button class="text-xs font-semibold text-brand-600 hover:underline">Lihat Detail →</button>
        </div>
        <div class="space-y-3 pt-2">
          <div v-for="r in sosialisasi" :key="r.label">
            <div class="mb-1 flex justify-between text-xs"><span>{{ r.label }}</span><span class="font-bold">{{ r.value }}</span></div>
            <div class="h-2.5 overflow-hidden rounded-full bg-background"><div class="h-full rounded-full" :style="{ width: (r.value / 2 * 100) + '%', background: r.color }" /></div>
          </div>
        </div>
      </Card>
    </div>

    <!-- Rankings -->
    <div class="grid gap-4 xl:grid-cols-3">
      <Card class="p-5">
        <div class="mb-4 flex items-center justify-between">
          <h3 class="flex items-center gap-2 text-sm font-bold"><Trophy class="h-4 w-4 text-rescue-500" /> Peringkat Regu Piket</h3>
          <Select v-model="rankMode" class="w-28 !h-8 text-xs"><option>Bulan Ini</option><option>Tahun Ini</option></Select>
        </div>
        <table class="w-full text-sm">
          <thead><tr class="text-left text-xs text-muted"><th class="py-2">#</th><th>Regu</th><th class="text-right">Penanganan</th></tr></thead>
          <tbody>
            <tr v-for="(r, i) in reguRank" :key="r.nama" class="border-t border-line">
              <td class="py-2.5 font-bold">{{ i + 1 }}</td><td>{{ r.nama }}</td><td class="text-right font-bold">{{ r.value }}</td>
            </tr>
          </tbody>
        </table>
      </Card>
      <Card class="p-5">
        <div class="mb-4 flex items-center justify-between">
          <h3 class="flex items-center gap-2 text-sm font-bold"><Medal class="h-4 w-4 text-rescue-500" /> Peringkat Petugas</h3>
          <Select v-model="rankMode" class="w-28 !h-8 text-xs"><option>Bulan Ini</option><option>Tahun Ini</option></Select>
        </div>
        <table class="w-full text-sm">
          <thead><tr class="text-left text-xs text-muted"><th class="py-2">#</th><th>Nama Petugas</th><th class="text-right">Penanganan</th></tr></thead>
          <tbody>
            <tr v-for="(r, i) in petugasRank" :key="r.nama" class="border-t border-line">
              <td class="py-2.5 font-bold">{{ i + 1 }}</td><td>{{ r.nama }}</td><td class="text-right font-bold">{{ r.value }}</td>
            </tr>
          </tbody>
        </table>
      </Card>
      <Card class="p-5">
        <h3 class="mb-4 flex items-center gap-2 text-sm font-bold"><Map class="h-4 w-4 text-sos-500" /> Sebaran Pelayanan</h3>
        <div class="space-y-2.5 pt-1">
          <div v-for="w in wilayahSebaran" :key="w.nama" class="flex items-center gap-3">
            <span class="h-3 w-3 shrink-0 rounded-sm" :style="{ background: w.color }" />
            <span class="flex-1 text-sm">{{ w.nama }}</span>
            <span class="text-sm font-bold">{{ w.value }}</span>
          </div>
        </div>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { FileText, Flame, PawPrint, Megaphone, Clock, Route, Download, Trophy, Medal, Map } from '@lucide/vue'
import Card from '../components/ui/Card.vue'
import Button from '../components/ui/Button.vue'
import Select from '../components/ui/Select.vue'
import StatCard from '../components/ui/StatCard.vue'
import LazyChart from '../components/charts/LazyChart.vue'

const period = ref('Agustus 2025')
const kategori = ref<'semua' | 'k' | 'nk' | 'sos'>('semua')
const trenMode = ref('Harian')
const rankMode = ref('Bulan Ini')

const showK = computed(() => kategori.value === 'semua' || kategori.value === 'k')
const showNK = computed(() => kategori.value === 'semua' || kategori.value === 'nk')
const showSOS = computed(() => kategori.value === 'semua' || kategori.value === 'sos')

const trenSeries = [
  { name: 'Kebakaran', data: [2, 3, 2, 4, 3, 5, 4, 3, 4, 2, 3, 4, 3, 2, 4, 3, 5, 4, 3, 2, 3, 4, 2, 3, 4, 3, 2, 4, 3, 4, 3] },
  { name: 'Penyelamatan', data: [1, 1, 2, 1, 2, 1, 1, 2, 1, 1, 2, 1, 1, 2, 1, 2, 1, 1, 2, 1, 1, 2, 1, 1, 1, 2, 1, 1, 2, 1, 1] },
  { name: 'Sosialisasi', data: [0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0] },
]
const trenOptions = {
  xaxis: { categories: Array.from({ length: 31 }, (_, i) => `${i + 1} Agu`) },
  colors: ['#dc2626', '#2563eb', '#10b981'],
  stroke: { curve: 'smooth', width: 2 },
}

const jenisOptions = {
  labels: ['Kebakaran', 'Penyelamatan', 'Sosialisasi'],
  colors: ['#dc2626', '#2563eb', '#10b981'],
  legend: { position: 'bottom' },
  plotOptions: { pie: { donut: { labels: { show: true, total: { show: true, label: 'Total Laporan' } } } } },
}

const jamOptions = {
  xaxis: { categories: ['Pagi\n06-12', 'Siang\n12-18', 'Malam\n18-00', 'Dini Hari\n00-06'] },
  colors: ['#f59e0b', '#f97316', '#2563eb', '#8b5cf6'],
  plotOptions: { bar: { borderRadius: 6, distributed: true } },
  legend: { show: false },
}

const kebakaranOptions = {
  labels: ['Rumah', 'Hutan/Lahan', 'Pabrik', 'Kendaraan', 'Lainnya'],
  colors: ['#dc2626', '#f97316', '#2563eb', '#f59e0b', '#94a3b8'],
  legend: { position: 'right' },
  plotOptions: { pie: { donut: { labels: { show: true, total: { show: true, label: 'Kejadian' } } } } },
}

const penyelamatan = [
  { label: 'Evakuasi Hewan', value: 4, color: '#2563eb' },
  { label: 'Penyelamatan Manusia', value: 2, color: '#10b981' },
  { label: 'Evakuasi Sarang Tawon', value: 1, color: '#8b5cf6' },
  { label: 'Lainnya', value: 1, color: '#94a3b8' },
]
const sosialisasi = [
  { label: 'Pelajar', value: 1, color: '#10b981' },
  { label: 'Instansi Pemerintah', value: 1, color: '#2563eb' },
  { label: 'Perusahaan/Swasta', value: 0, color: '#f59e0b' },
  { label: 'Masyarakat Umum', value: 0, color: '#94a3b8' },
]

const reguRank = [
  { nama: 'Regu 1 (Mako)', value: 12 },
  { nama: 'Regu 2 (Pos Purwaharja)', value: 8 },
  { nama: 'Regu 3 (Pos Langensari)', value: 6 },
  { nama: 'Regu 4 (Pos Pataruman)', value: 4 },
  { nama: 'Regu 5 (Pos Lainnya)', value: 3 },
]
const petugasRank = [
  { nama: 'Andi Pratama', value: 8 },
  { nama: 'Budi Santoso', value: 7 },
  { nama: 'Cepi Rahman', value: 6 },
  { nama: 'Deni Kurniawan', value: 5 },
  { nama: 'Eko Saputra', value: 4 },
]
const wilayahSebaran = [
  { nama: 'Kota Banjar', value: 18, color: '#1d4ed8' },
  { nama: 'Purwaharja', value: 4, color: '#60a5fa' },
  { nama: 'Langensari', value: 2, color: '#93c5fd' },
  { nama: 'Pataruman', value: 1, color: '#bfdbfe' },
  { nama: 'Lainnya', value: 0, color: '#e2e8f0' },
]
</script>
