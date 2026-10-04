<template>
  <div class="rounded-xl border border-line bg-surface p-4">
    <div class="flex items-start gap-3">
      <span class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl" :style="{ background: color + '1a', color }">
        <component :is="icon" class="h-5 w-5" />
      </span>
      <div class="min-w-0">
        <p class="text-[11px] font-medium leading-tight text-muted">{{ label }}</p>
        <p class="text-xl font-extrabold">{{ value }} <span v-if="suffix" class="text-sm font-semibold text-muted">({{ suffix }})</span></p>
        <p class="mt-1 flex items-center gap-1 text-[11px]">
          <span :class="cn('rounded px-1.5 py-0.5 font-bold', up ? 'bg-sos-500/10 text-sos-500' : 'bg-damkar-500/10 text-damkar-500')">
            {{ up ? '↑' : '↓' }} {{ Math.abs(delta) }}%
          </span>
          <span class="text-muted">dari bulan lalu</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Component } from 'vue'
import { cn } from '../../lib/utils'

defineProps<{
  label: string
  value: string | number
  suffix?: string
  delta: number
  up: boolean
  icon: Component
  color: string
}>()
</script>
