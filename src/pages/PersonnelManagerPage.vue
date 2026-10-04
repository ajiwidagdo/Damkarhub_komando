<template>
  <div class="space-y-4">
    <div>
      <h2 class="text-2xl font-extrabold">Manajemen Personel</h2>
      <p class="text-sm text-muted">Kelola data anggota yang digunakan pada aplikasi petugas lapangan</p>
    </div>

    <Card class="flex flex-wrap items-center justify-between gap-3 p-4">
      <div>
        <h3 class="font-bold">Daftar Anggota</h3>
        <p class="text-xs text-muted">Data ini akan menjadi sumber pilihan pada aplikasi petugas lapangan</p>
      </div>
      <div class="flex gap-2">
        <div class="flex w-64 items-center gap-2 rounded-lg border border-line bg-background px-3 py-2">
          <Search class="h-4 w-4 shrink-0 text-muted" />
          <input v-model="q" placeholder="Cari ID, nama, atau regu…" class="w-full bg-transparent text-sm outline-none placeholder:text-muted" />
        </div>
        <Button @click="openAdd"><Plus class="h-4 w-4" /> Tambah Personel</Button>
      </div>
    </Card>

    <Card class="overflow-hidden">
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b border-line bg-background/60 text-left text-xs text-muted">
            <th class="px-4 py-3 font-semibold">No.</th><th class="px-2 py-3 font-semibold">Nomor Induk / ID</th>
            <th class="px-2 py-3 font-semibold">Nama Lengkap</th><th class="px-2 py-3 font-semibold">Regu Piket</th>
            <th class="px-2 py-3 font-semibold">Status</th><th class="px-2 py-3 font-semibold">Keterangan</th>
            <th class="px-4 py-3 text-right font-semibold">Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(p, i) in filtered" :key="p.id" class="border-b border-line/60 last:border-0 hover:bg-background/60">
            <td class="px-4 py-3 text-muted">{{ i + 1 }}</td>
            <td class="px-2 py-3 font-mono text-xs">DMK-{{ p.id.replace('p', '00') }}</td>
            <td class="px-2 py-3 font-medium">{{ p.nama }}</td>
            <td class="px-2 py-3">{{ p.regu }}</td>
            <td class="px-2 py-3">
              <span class="flex items-center gap-2">
                <Switch :model-value="p.dispatch_active" @update:model-value="(v: boolean) => p.dispatch_active = v" />
                <span :class="['text-xs font-semibold', p.dispatch_active ? 'text-sos-500' : 'text-muted']">{{ p.dispatch_active ? 'Aktif' : 'Nonaktif' }}</span>
              </span>
            </td>
            <td class="px-2 py-3 text-muted">-</td>
            <td class="px-4 py-3">
              <div class="flex justify-end gap-1">
                <button class="flex h-7 w-7 items-center justify-center rounded-md bg-brand-600 text-white hover:bg-brand-500" aria-label="Ubah"><Pencil class="h-3.5 w-3.5" /></button>
                <button class="flex h-7 w-7 items-center justify-center rounded-md bg-damkar-600 text-white hover:bg-damkar-500" aria-label="Hapus"><Trash2 class="h-3.5 w-3.5" /></button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="flex items-center justify-between border-t border-line p-4">
        <div class="flex gap-1.5">
          <button v-for="p in [1, 2, 3]" :key="p" :class="['flex h-8 w-8 items-center justify-center rounded-lg text-sm font-semibold', p === 1 ? 'bg-brand-600 text-white' : 'border border-line text-muted hover:text-ink']">{{ p }}</button>
        </div>
        <p class="text-xs text-muted">Tampilkan <span class="font-bold text-ink">15</span> per halaman</p>
      </div>
    </Card>

    <Dialog v-model="dialog">
      <div class="mb-4 flex items-center justify-between">
        <h3 class="text-base font-bold">Tambah Personel</h3>
        <button class="text-muted hover:text-ink" @click="dialog = false" aria-label="Tutup"><X class="h-5 w-5" /></button>
      </div>
      <div class="grid grid-cols-2 gap-3">
        <div><label class="mb-1.5 block text-xs font-semibold">Nomor Induk / ID</label><Input v-model="form.id" placeholder="Contoh: DMK-0016" /></div>
        <div><label class="mb-1.5 block text-xs font-semibold">Regu Piket</label>
          <Select v-model="form.regu"><option>Regu 1</option><option>Regu 2</option><option>Regu 3</option><option>Regu 4</option></Select>
        </div>
        <div class="col-span-2"><label class="mb-1.5 block text-xs font-semibold">Nama Lengkap</label><Input v-model="form.nama" placeholder="Masukkan nama lengkap" /></div>
        <div><label class="mb-1.5 block text-xs font-semibold">Status</label>
          <span class="flex h-10 items-center gap-2"><Switch v-model="form.aktif" /><span class="text-sm">{{ form.aktif ? 'Aktif' : 'Nonaktif' }}</span></span>
        </div>
        <div><label class="mb-1.5 block text-xs font-semibold">Keterangan (Opsional)</label><Input v-model="form.ket" placeholder="Cuti, Mutasi, Pensiun, dll." /></div>
      </div>
      <div class="mt-6 flex justify-end gap-2">
        <Button variant="secondary" @click="dialog = false">Batal</Button>
        <Button @click="save">Simpan</Button>
      </div>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { Search, Plus, Pencil, Trash2, X } from '@lucide/vue'
import Card from '../components/ui/Card.vue'
import Button from '../components/ui/Button.vue'
import Input from '../components/ui/Input.vue'
import Select from '../components/ui/Select.vue'
import Dialog from '../components/ui/Dialog.vue'
import Switch from '../components/ui/Switch.vue'
import { usePersonnelStore } from '../stores/data'

const store = usePersonnelStore()
const q = ref('')
const dialog = ref(false)
const form = reactive({ id: '', nama: '', regu: 'Regu 1', aktif: true, ket: '' })

const filtered = computed(() => {
  const s = q.value.toLowerCase()
  if (!s) return store.personnel
  return store.personnel.filter((p) => [p.nama, p.regu, p.id].some((v) => v.toLowerCase().includes(s)))
})

function openAdd() {
  Object.assign(form, { id: '', nama: '', regu: 'Regu 1', aktif: true, ket: '' })
  dialog.value = true
}
function save() {
  if (!form.nama.trim()) return
  store.personnel.push({
    id: form.id || `p${Date.now()}`, nama: form.nama, pangkat: '-', jabatan: 'Anggota',
    regu: form.regu, no_hp: '-', dispatch_active: form.aktif, total_laporan: 0,
  })
  dialog.value = false
}
</script>
