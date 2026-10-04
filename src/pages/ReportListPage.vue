<template>
  <div class="space-y-4">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h2 class="text-xl font-bold">Daftar Laporan</h2>
        <p class="text-sm text-muted">{{ table.getFilteredRowModel().rows.length }} laporan</p>
      </div>
      <div class="flex gap-2">
        <Input v-model="globalFilter" placeholder="Cari laporan…" class="w-56" />
        <Select v-model="moduleFilter" class="w-44">
          <option value="">Semua modul</option>
          <option value="k">Kebakaran</option>
          <option value="nk">Non Kebakaran</option>
          <option value="sos">Sosialisasi</option>
        </Select>
      </div>
    </div>

    <Table>
      <thead>
        <tr v-for="hg in table.getHeaderGroups()" :key="hg.id" class="border-b border-line">
          <th
            v-for="h in hg.headers"
            :key="h.id"
            class="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-muted"
          >
            <button
              v-if="h.column.getCanSort()"
              class="inline-flex items-center gap-1 hover:text-ink"
              @click="h.column.toggleSorting()"
            >
              <FlexRender :render="h.column.columnDef.header" :props="h.getContext()" />
              <ArrowUpDown class="h-3 w-3" />
            </button>
            <FlexRender v-else :render="h.column.columnDef.header" :props="h.getContext()" />
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="row in table.getRowModel().rows"
          :key="row.id"
          class="cursor-pointer border-b border-line transition-colors last:border-0 hover:bg-background"
          @click="$router.push({ name: 'report-detail', params: { id: row.original.id } })"
        >
          <td v-for="cell in row.getVisibleCells()" :key="cell.id" class="px-4 py-3">
            <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
          </td>
        </tr>
        <tr v-if="!table.getRowModel().rows.length">
          <td colspan="5" class="px-4 py-10 text-center text-sm text-muted">Tidak ada laporan.</td>
        </tr>
      </tbody>
    </Table>

    <div class="flex items-center justify-between">
      <p class="text-xs text-muted">
        Halaman {{ table.getState().pagination.pageIndex + 1 }} dari {{ table.getPageCount() }}
      </p>
      <div class="flex gap-2">
        <Button size="sm" variant="outline" :disabled="!table.getCanPreviousPage()" @click="table.previousPage()">
          Sebelumnya
        </Button>
        <Button size="sm" variant="outline" :disabled="!table.getCanNextPage()" @click="table.nextPage()">
          Berikutnya
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { h, ref } from 'vue'
import { ArrowUpDown } from '@lucide/vue'
import {
  createColumnHelper,
  FlexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useVueTable,
} from '@tanstack/vue-table'
import type { Module, Report } from '../types'
import { useReportStore } from '../stores/report'
import Table from '../components/ui/Table.vue'
import Input from '../components/ui/Input.vue'
import Select from '../components/ui/Select.vue'
import Button from '../components/ui/Button.vue'
import Badge from '../components/ui/Badge.vue'

const store = useReportStore()
const globalFilter = ref('')
const moduleFilter = ref('')

const moduleBadge: Record<Module, 'default' | 'warning' | 'success'> = {
  k: 'default',
  nk: 'warning',
  sos: 'success',
}

const columnHelper = createColumnHelper<Report>()
const columns = [
  columnHelper.accessor('data.tanggal', {
    header: 'Tanggal',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('module', {
    header: 'Modul',
    cell: (info) => h(Badge, { variant: moduleBadge[info.getValue()] }, () => store.moduleLabel[info.getValue()]),
    filterFn: (row, _col, value) => !value || row.original.module === value,
  }),
  columnHelper.accessor('data.jenis', { header: 'Jenis' }),
  columnHelper.accessor('data.lokasiDetail', { header: 'Lokasi' }),
  columnHelper.accessor('status', {
    header: 'Status',
    cell: (info) => h(Badge, { variant: 'success' }, () => info.getValue()),
  }),
]

const table = useVueTable({
  get data() { return store.reports.filter((r) => !r.deleted) },
  columns,
  state: {
    get globalFilter() { return globalFilter.value },
    get columnFilters() { return moduleFilter.value ? [{ id: 'module', value: moduleFilter.value }] : [] },
  },
  onGlobalFilterChange: (v) => { globalFilter.value = String(v ?? '') },
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  initialState: { pagination: { pageSize: 8 } },
})
</script>
