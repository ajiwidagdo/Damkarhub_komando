<template>
  <div class="space-y-4">
    <div>
      <h2 class="text-2xl font-extrabold">Pengaturan & Manajemen Akun</h2>
      <p class="text-sm text-muted">Kelola instansi, akun petugas, level akses, dan status berlangganan sistem DAMKARHUB</p>
    </div>

    <div class="flex flex-wrap gap-2">
      <button
        v-for="t in tabs"
        :key="t.key"
        :class="cn('flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors', tab === t.key ? 'bg-brand-600 text-white shadow' : 'border border-line bg-surface text-muted hover:text-ink')"
        @click="tab = t.key"
      >
        <component :is="t.icon" class="h-4 w-4" /> {{ t.label }}
      </button>
    </div>

    <!-- Informasi Tenant -->
    <div v-if="tab === 'tenant'" class="grid gap-4 xl:grid-cols-3">
      <Card class="p-5 xl:col-span-2">
        <div class="mb-4 flex items-center justify-between">
          <h3 class="font-bold">Informasi Instansi (Tenant)</h3>
          <Button size="sm" variant="outline">Edit Informasi</Button>
        </div>
        <dl class="grid gap-3 text-sm sm:grid-cols-2">
          <div><dt class="text-xs text-muted">Nama Instansi</dt><dd class="font-semibold">Dinas Pemadam Kebakaran Kota Banjar</dd></div>
          <div><dt class="text-xs text-muted">Wilayah Yuridiksi</dt><dd class="font-semibold">Kota Banjar, Jawa Barat</dd></div>
          <div><dt class="text-xs text-muted">Alamat</dt><dd class="font-semibold">Jl. Letjen Suwarto No. 45, Banjar</dd></div>
          <div><dt class="text-xs text-muted">Telepon</dt><dd class="font-semibold">(0265) 7423456</dd></div>
          <div><dt class="text-xs text-muted">Email</dt><dd class="font-semibold">damkar@banjarkota.go.id</dd></div>
          <div><dt class="text-xs text-muted">Website</dt><dd class="font-semibold text-brand-600">https://damkar.banjarkota.go.id</dd></div>
        </dl>
      </Card>
      <Card class="p-5">
        <div class="mb-4 flex items-center justify-between">
          <h3 class="font-bold">Kontak Admin</h3>
          <Button size="sm" variant="outline">Edit Kontak</Button>
        </div>
        <dl class="space-y-3 text-sm">
          <div><dt class="text-xs text-muted">Nama Admin</dt><dd class="font-semibold">Budi Santoso</dd></div>
          <div><dt class="text-xs text-muted">Jabatan</dt><dd class="font-semibold">Kepala Subbagian TU</dd></div>
          <div><dt class="text-xs text-muted">Telepon</dt><dd class="font-semibold">0812 3456 7890</dd></div>
          <div><dt class="text-xs text-muted">Email</dt><dd class="font-semibold">admin@banjarkota.go.id</dd></div>
        </dl>
      </Card>
    </div>

    <!-- Akun Petugas -->
    <Card v-if="tab === 'akun'" class="overflow-hidden">
      <div class="flex flex-wrap items-center justify-between gap-3 p-4">
        <div><h3 class="font-bold">Manajemen Akun Petugas</h3><p class="text-xs text-muted">Kelola akun petugas aplikasi lapangan dan sistem komando</p></div>
        <div class="flex gap-2">
          <div class="flex w-56 items-center gap-2 rounded-lg border border-line bg-background px-3 py-2">
            <Search class="h-4 w-4 text-muted" /><input v-model="q" placeholder="Cari nama, ID…" class="w-full bg-transparent text-sm outline-none" />
          </div>
          <Button size="sm"><Plus class="h-4 w-4" /> Tambah Akun</Button>
        </div>
      </div>
      <table class="w-full text-sm">
        <thead><tr class="border-y border-line bg-background/60 text-left text-xs text-muted">
          <th class="px-4 py-3">No.</th><th class="px-2 py-3">ID Akun</th><th class="px-2 py-3">Nama</th>
          <th class="px-2 py-3">Level</th><th class="px-2 py-3">Status</th><th class="px-4 py-3 text-right">Aksi</th>
        </tr></thead>
        <tbody>
          <tr v-for="(p, i) in akunFiltered" :key="p.id" class="border-b border-line/60 last:border-0">
            <td class="px-4 py-3 text-muted">{{ i + 1 }}</td>
            <td class="px-2 py-3 font-mono text-xs">FIR-{{ p.id.replace('p', '00') }}</td>
            <td class="px-2 py-3 font-medium">{{ p.nama }}</td>
            <td class="px-2 py-3"><Badge :variant="i % 4 === 3 ? 'warning' : 'muted'">{{ i % 4 === 3 ? 'Koordinator' : 'Petugas' }}</Badge></td>
            <td class="px-2 py-3"><span class="flex items-center gap-2"><Switch :model-value="p.dispatch_active" @update:model-value="(v: boolean) => p.dispatch_active = v" /><span class="text-xs">{{ p.dispatch_active ? 'Aktif' : 'Nonaktif' }}</span></span></td>
            <td class="px-4 py-3"><div class="flex justify-end gap-1">
              <button class="flex h-7 w-7 items-center justify-center rounded-md bg-brand-600 text-white"><Pencil class="h-3.5 w-3.5" /></button>
              <button class="flex h-7 w-7 items-center justify-center rounded-md bg-damkar-600 text-white"><Trash2 class="h-3.5 w-3.5" /></button>
            </div></td>
          </tr>
        </tbody>
      </table>
    </Card>

    <!-- Level Akses -->
    <div v-if="tab === 'level'" class="grid gap-4 md:grid-cols-3">
      <Card v-for="l in levels" :key="l.nama" class="p-5">
        <h3 class="font-bold">{{ l.nama }}</h3>
        <p class="mt-1 text-xs text-muted">{{ l.desc }}</p>
        <ul class="mt-3 space-y-1.5 text-sm">
          <li v-for="f in l.fitur" :key="f" class="flex items-center gap-2"><Check class="h-4 w-4 text-sos-500" /> {{ f }}</li>
        </ul>
      </Card>
    </div>

    <!-- Langganan -->
    <div v-if="tab === 'langganan'" class="grid gap-4 xl:grid-cols-2">
      <Card class="p-5">
        <h3 class="mb-4 font-bold">Status Langganan</h3>
        <div class="flex items-center gap-3">
          <span class="flex h-12 w-12 items-center justify-center rounded-full bg-sos-500/10"><Check class="h-6 w-6 text-sos-500" /></span>
          <div><p class="text-lg font-extrabold text-sos-500">Aktif</p><p class="text-xs text-muted">Berlangganan hingga 30 Sep 2025</p></div>
          <Button size="sm" class="ml-auto">Perpanjang</Button>
        </div>
        <div class="mt-4 grid grid-cols-2 gap-3 text-sm">
          <div class="rounded-lg bg-background p-3"><p class="text-xs text-muted">Paket</p><p class="font-bold">Professional</p></div>
          <div class="rounded-lg bg-background p-3"><p class="text-xs text-muted">Kapasitas</p><p class="font-bold">50 akun <span class="text-muted font-normal">(32 dipakai)</span></p></div>
        </div>
      </Card>
      <Card class="p-5">
        <h3 class="mb-4 font-bold">Histori Tagihan</h3>
        <table class="w-full text-sm">
          <thead><tr class="text-left text-xs text-muted"><th class="py-2">Periode</th><th class="text-right">Jumlah</th><th class="text-right">Status</th></tr></thead>
          <tbody>
            <tr v-for="h in histori" :key="h.periode" class="border-t border-line">
              <td class="py-2.5">{{ h.periode }}</td><td class="text-right font-semibold">Rp 1.500.000</td>
              <td class="text-right"><Badge variant="success">Lunas</Badge></td>
            </tr>
          </tbody>
        </table>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { Building2, Users, Lock, CreditCard, Search, Plus, Pencil, Trash2, Check } from '@lucide/vue'
import Card from '../components/ui/Card.vue'
import Button from '../components/ui/Button.vue'
import Badge from '../components/ui/Badge.vue'
import Switch from '../components/ui/Switch.vue'
import { cn } from '../lib/utils'
import { usePersonnelStore } from '../stores/data'

const store = usePersonnelStore()
const tab = ref<'tenant' | 'akun' | 'level' | 'langganan'>('tenant')
const q = ref('')

const tabs = [
  { key: 'tenant' as const, label: 'Informasi Tenant', icon: Building2 },
  { key: 'akun' as const, label: 'Manajemen Akun Petugas', icon: Users },
  { key: 'level' as const, label: 'Level Akses', icon: Lock },
  { key: 'langganan' as const, label: 'Status Langganan', icon: CreditCard },
]

const akunFiltered = computed(() => {
  const s = q.value.toLowerCase()
  if (!s) return store.personnel
  return store.personnel.filter((p) => p.nama.toLowerCase().includes(s))
})

const levels = [
  { nama: 'Petugas', desc: 'Akses aplikasi lapangan', fitur: ['Buat laporan', 'Terima dispatch', 'Lihat riwayat sendiri'] },
  { nama: 'Koordinator', desc: 'Akses komando terbatas', fitur: ['Semua fitur Petugas', 'Kelola regu', 'Lihat analitik'] },
  { nama: 'Admin', desc: 'Akses penuh', fitur: ['Semua fitur Koordinator', 'Kelola akun', 'Pengaturan tenant'] },
]

const histori = [
  { periode: 'Agustus 2025' }, { periode: 'Juli 2025' }, { periode: 'Juni 2025' },
  { periode: 'Mei 2025' }, { periode: 'April 2025' },
]
</script>
