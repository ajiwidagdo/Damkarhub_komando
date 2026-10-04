<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-xl font-bold">Manajemen Armada</h2>
        <p class="text-sm text-muted">Master data armada — akan jadi source dropdown di Fireman</p>
      </div>
      <Button @click="openAdd"><Plus class="h-4 w-4" /> Tambah Armada</Button>
    </div>

    <Table>
      <thead>
        <tr class="border-b border-line">
          <th v-for="c in cols" :key="c" class="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-muted">{{ c }}</th>
          <th class="px-4 py-3" />
        </tr>
      </thead>
      <tbody>
        <tr v-for="f in store.fleet" :key="f.id" class="border-b border-line last:border-0 hover:bg-background">
          <td class="px-4 py-3 font-medium">{{ f.nama }}</td>
          <td class="px-4 py-3 text-muted">{{ f.jenis }}</td>
          <td class="px-4 py-3 font-mono text-xs">{{ f.plat }}</td>
          <td class="px-4 py-3">
            <Badge :variant="statusVariant[f.status]">{{ store.statusLabel[f.status] }}</Badge>
          </td>
          <td class="px-4 py-3 text-muted">{{ f.keterangan }}</td>
          <td class="px-4 py-3 text-right">
            <div class="flex justify-end gap-1">
              <Button size="sm" variant="ghost" @click="openEdit(f)"><Pencil class="h-4 w-4" /></Button>
              <Button size="sm" variant="ghost" @click="store.remove(f.id)"><Trash2 class="h-4 w-4" /></Button>
            </div>
          </td>
        </tr>
      </tbody>
    </Table>

    <Dialog v-model="dialog">
      <h3 class="mb-4 text-base font-bold">{{ editing ? 'Ubah Armada' : 'Tambah Armada' }}</h3>
      <div class="space-y-3">
        <div><label class="mb-1.5 block text-sm font-medium">Nama</label><Input v-model="form.nama" placeholder="Unit Pancar 3" /></div>
        <div><label class="mb-1.5 block text-sm font-medium">Jenis</label><Input v-model="form.jenis" placeholder="Mobil Pancar" /></div>
        <div><label class="mb-1.5 block text-sm font-medium">Plat nomor</label><Input v-model="form.plat" placeholder="Z 8006 A" /></div>
        <div>
          <label class="mb-1.5 block text-sm font-medium">Status</label>
          <Select v-model="form.status">
            <option value="siap">Siap Operasi</option>
            <option value="tugas">Bertugas</option>
            <option value="perawatan">Perawatan</option>
          </Select>
        </div>
        <div><label class="mb-1.5 block text-sm font-medium">Keterangan</label><Input v-model="form.keterangan" placeholder="—" /></div>
      </div>
      <div class="mt-6 flex justify-end gap-2">
        <Button variant="outline" @click="dialog = false">Batal</Button>
        <Button @click="save">Simpan</Button>
      </div>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { Plus, Pencil, Trash2 } from '@lucide/vue'
import type { FleetStatus, FleetUnit } from '../types'
import { useFleetStore } from '../stores/data'
import Table from '../components/ui/Table.vue'
import Button from '../components/ui/Button.vue'
import Input from '../components/ui/Input.vue'
import Select from '../components/ui/Select.vue'
import Badge from '../components/ui/Badge.vue'
import Dialog from '../components/ui/Dialog.vue'

const store = useFleetStore()
const cols = ['Nama', 'Jenis', 'Plat', 'Status', 'Keterangan']
const statusVariant: Record<FleetStatus, 'success' | 'warning' | 'muted'> = {
  siap: 'success',
  tugas: 'warning',
  perawatan: 'muted',
}

const dialog = ref(false)
const editing = ref<FleetUnit | null>(null)
const form = reactive({ nama: '', jenis: '', plat: '', status: 'siap' as FleetStatus, keterangan: '' })

function openAdd() {
  editing.value = null
  Object.assign(form, { nama: '', jenis: '', plat: '', status: 'siap', keterangan: '' })
  dialog.value = true
}

function openEdit(f: FleetUnit) {
  editing.value = f
  Object.assign(form, { nama: f.nama, jenis: f.jenis, plat: f.plat, status: f.status, keterangan: f.keterangan })
  dialog.value = true
}

function save() {
  if (!form.nama.trim()) return
  if (editing.value) store.update(editing.value.id, { ...form })
  else store.add({ ...form })
  dialog.value = false
}
</script>
