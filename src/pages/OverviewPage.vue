<template>
  <div class="space-y-6">
    <div>
      <h2 class="text-xl font-bold">Overview</h2>
      <p class="text-sm text-muted">Ringkasan operasional Damkarhub</p>
    </div>

    <!-- 5 stat cards -->
    <div class="grid grid-cols-2 gap-4 xl:grid-cols-5">
      <Card v-for="s in stats" :key="s.label" class="p-5">
        <div class="flex items-center justify-between">
          <p class="text-xs font-semibold uppercase tracking-wide text-muted">{{ s.label }}</p>
          <component :is="s.icon" class="h-4 w-4" :class="s.iconClass" />
        </div>
        <p class="mt-2 text-3xl font-extrabold">{{ s.value }}</p>
        <p class="mt-1 text-xs text-muted">{{ s.hint }}</p>
      </Card>
    </div>

    <!-- Charts -->
    <div class="grid gap-4 lg:grid-cols-2">
      <Card class="p-5">
        <h3 class="mb-4 text-sm font-bold">Laporan per Modul</h3>
        <LazyChart type="donut" :options="donutOptions" :series="donutSeries" />
      </Card>
      <Card class="p-5">
        <h3 class="mb-4 text-sm font-bold">Tren Laporan Harian</h3>
        <LazyChart type="bar" :options="barOptions" :series="barSeries" />
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Flame, LifeBuoy, Megaphone, Users, Truck } from '@lucide/vue'
import Card from '../components/ui/Card.vue'
import LazyChart from '../components/charts/LazyChart.vue'
import { useReportStore } from '../stores/report'
import { usePersonnelStore, useFleetStore } from '../stores/data'

const reports = useReportStore()
const personnel = usePersonnelStore()
const fleet = useFleetStore()

const stats = computed(() => [
  { label: 'Kebakaran', value: reports.k.length, hint: 'Laporan modul K', icon: Flame, iconClass: 'text-damkar-500' },
  { label: 'Non Kebakaran', value: reports.nk.length, hint: 'Laporan modul NK', icon: LifeBuoy, iconClass: 'text-rescue-500' },
  { label: 'Sosialisasi', value: reports.sos.length, hint: 'Laporan modul SOS', icon: Megaphone, iconClass: 'text-sos-500' },
  { label: 'Personil Aktif', value: personnel.activeCount, hint: 'Siap dispatch', icon: Users, iconClass: 'text-muted' },
  { label: 'Armada Siap', value: fleet.fleet.filter((f) => f.status === 'siap').length, hint: 'Dari total armada', icon: Truck, iconClass: 'text-muted' },
])

const donutSeries = computed(() => [reports.k.length, reports.nk.length, reports.sos.length])
const donutOptions = {
  labels: ['Kebakaran', 'Non Kebakaran', 'Sosialisasi'],
  colors: ['#dc2626', '#f59e0b', '#10b981'],
  legend: { position: 'bottom' },
}

const barSeries = computed(() => [{ name: 'Laporan', data: [1, 2, 2, 2, 1] }])
const barOptions = {
  xaxis: { categories: ['1 Okt', '2 Okt', '3 Okt', '4 Okt', '5 Okt'] },
  colors: ['#dc2626'],
  plotOptions: { bar: { borderRadius: 6 } },
}
</script>
