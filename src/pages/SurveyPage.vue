<template>
  <div class="space-y-6">
    <div>
      <h2 class="text-xl font-bold">Survei Kepuasan</h2>
      <p class="text-sm text-muted">Kepuasan layanan & nominasi</p>
    </div>

    <div class="grid gap-4 lg:grid-cols-3">
      <Card class="p-5">
        <p class="text-xs font-semibold uppercase tracking-wide text-muted">Rata-rata rating</p>
        <p class="mt-2 text-4xl font-extrabold">{{ store.avgRating.toFixed(1) }}<span class="text-lg text-muted">/5</span></p>
        <p class="mt-1 text-xs text-muted">{{ store.totalVotes }} responden</p>
      </Card>
      <Card class="p-5 lg:col-span-2">
        <h3 class="mb-4 text-sm font-bold">Distribusi Rating</h3>
        <LazyChart type="bar" :options="barOptions" :series="barSeries" />
      </Card>
    </div>

    <div class="grid gap-4 lg:grid-cols-2">
      <Card class="p-5">
        <h3 class="mb-4 text-sm font-bold">🏆 Damkar Terpopuler</h3>
        <ol class="space-y-3">
          <li v-for="(e, i) in store.popular" :key="e.nama" class="flex items-center gap-3">
            <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-damkar-600/10 text-sm font-extrabold text-damkar-500">{{ i + 1 }}</span>
            <div class="min-w-0 flex-1">
              <p class="truncate text-sm font-semibold">{{ e.nama }}</p>
              <p class="text-xs text-muted">{{ e.detail }}</p>
            </div>
            <Badge>{{ e.votes }} vote</Badge>
          </li>
        </ol>
      </Card>
      <Card class="p-5">
        <h3 class="mb-4 text-sm font-bold">😂 Laporan Tergokil</h3>
        <ol class="space-y-3">
          <li v-for="(e, i) in store.funniest" :key="e.nama" class="flex items-center gap-3">
            <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-rescue-500/10 text-sm font-extrabold text-rescue-500">{{ i + 1 }}</span>
            <div class="min-w-0 flex-1">
              <p class="truncate text-sm font-semibold">{{ e.nama }}</p>
              <p class="text-xs text-muted">{{ e.detail }}</p>
            </div>
            <Badge variant="warning">{{ e.votes }} vote</Badge>
          </li>
        </ol>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Card from '../components/ui/Card.vue'
import Badge from '../components/ui/Badge.vue'
import LazyChart from '../components/charts/LazyChart.vue'
import { useSurveyStore } from '../stores/data'

const store = useSurveyStore()

const barSeries = computed(() => [{ name: 'Responden', data: store.ratings.map((r) => r.count) }])
const barOptions = computed(() => ({
  xaxis: { categories: store.ratings.map((r) => `★ ${r.rating}`) },
  colors: ['#f59e0b'],
  plotOptions: { bar: { borderRadius: 6, horizontal: true } },
}))
</script>
