<template>
  <div class="space-y-4">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h2 class="text-xl font-bold">Data Personil</h2>
        <p class="text-sm text-muted">{{ store.activeCount }} aktif dispatch</p>
      </div>
      <Input v-model="globalFilter" placeholder="Cari personil…" class="w-56" />
    </div>

    <Table>
      <thead>
        <tr class="border-b border-line">
          <th v-for="c in cols" :key="c" class="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-muted">{{ c }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="p in filtered" :key="p.id" class="border-b border-line last:border-0 hover:bg-background">
          <td class="px-4 py-3 font-medium">{{ p.nama }}</td>
          <td class="px-4 py-3 text-muted">{{ p.pangkat }}</td>
          <td class="px-4 py-3">{{ p.regu }}</td>
          <td class="px-4 py-3">
            <Badge :variant="p.dispatch_active ? 'success' : 'muted'">
              {{ p.dispatch_active ? 'Aktif' : 'Nonaktif' }}
            </Badge>
          </td>
          <td class="px-4 py-3 text-right">{{ p.total_laporan }}</td>
        </tr>
      </tbody>
    </Table>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { usePersonnelStore } from '../stores/data'
import Table from '../components/ui/Table.vue'
import Input from '../components/ui/Input.vue'
import Badge from '../components/ui/Badge.vue'

const store = usePersonnelStore()
const globalFilter = ref('')
const cols = ['Nama', 'Pangkat', 'Regu', 'Dispatch', 'Laporan']

const filtered = computed(() => {
  const q = globalFilter.value.toLowerCase()
  if (!q) return store.personnel
  return store.personnel.filter((p) =>
    [p.nama, p.pangkat, p.regu, p.jabatan].some((v) => v.toLowerCase().includes(q))
  )
})
</script>
