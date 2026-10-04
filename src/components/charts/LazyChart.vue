<!-- Wrapper ApexCharts minimal — lazy-load, tanpa wrapper library -->
<template>
  <div ref="el" class="min-h-[240px]">
    <p v-if="!ready" class="flex h-[240px] items-center justify-center text-sm text-muted">Memuat grafik…</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import type ApexChartsType from 'apexcharts'

const props = defineProps<{
  type: 'donut' | 'bar' | 'line' | 'area'
  options: Record<string, unknown>
  series: unknown[]
}>()

const el = ref<HTMLElement | null>(null)
const ready = ref(false)
let chart: ApexChartsType | null = null

async function mount() {
  if (!el.value || chart) return
  const { default: ApexCharts } = await import('apexcharts')
  chart = new ApexCharts(el.value, {
    chart: { type: props.type, height: 260, toolbar: { show: false } },
    ...props.options,
    series: props.series,
  } as never)
  chart.render()
  ready.value = true
}

onMounted(mount)
onBeforeUnmount(() => chart?.destroy())

watch(() => [props.options, props.series], () => {
  chart?.updateOptions({ ...props.options, series: props.series } as never)
}, { deep: true })
</script>
