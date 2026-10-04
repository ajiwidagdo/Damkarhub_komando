<template>
  <aside class="flex w-56 shrink-0 flex-col bg-sidebar text-white">
    <div class="flex items-center gap-2.5 px-5 pb-6 pt-5">
      <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-damkar-600 shadow-lg shadow-damkar-600/40">
        <Flame class="h-5 w-5 text-white" />
      </div>
      <div>
        <p class="text-[15px] font-extrabold tracking-wide">DAMKAR<span class="text-damkar-500">HUB</span></p>
        <p class="text-[11px] text-white/60">Sistem Komando</p>
      </div>
    </div>

    <nav class="flex-1 space-y-1 overflow-y-auto px-3">
      <router-link
        v-for="item in mainNav"
        :key="item.to"
        :to="item.to"
        class="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/70 transition-colors hover:bg-white/10 hover:text-white"
        :active-class="item.exact ? '' : ACTIVE"
        :exact-active-class="ACTIVE"
      >
        <component :is="item.icon" class="h-[18px] w-[18px]" />
        {{ item.label }}
      </router-link>

      <p class="px-3 pb-1 pt-5 text-[10px] font-bold uppercase tracking-widest text-white/40">Master Data</p>
      <router-link
        v-for="item in subNav"
        :key="item.to"
        :to="item.to"
        class="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/70 transition-colors hover:bg-white/10 hover:text-white"
        active-class="!bg-brand-600 !text-white shadow-lg shadow-brand-600/30"
      >
        <component :is="item.icon" class="h-[18px] w-[18px]" />
        {{ item.label }}
      </router-link>
    </nav>

    <div class="p-5">
      <div class="mb-2 h-1 w-8 rounded-full bg-damkar-500" />
      <p class="text-[11px] font-bold leading-relaxed tracking-wide text-white/80">
        PANTANG PULANG<br />SEBELUM API PADAM
      </p>
    </div>
  </aside>
</template>

<script setup lang="ts">
import {
  House, ChartColumn, FileText, Users, Settings, Truck, BarChart3, Flame,
} from '@lucide/vue'

const ACTIVE = '!bg-brand-600 !text-white shadow-lg shadow-brand-600/30'

const mainNav = [
  { to: '/', label: 'Pusat Komando', icon: House, exact: true },
  { to: '/analitik', label: 'Dasbor Analitik', icon: ChartColumn },
  { to: '/reports', label: 'Pengelola Laporan', icon: FileText },
  { to: '/personnel', label: 'Manajemen Personel', icon: Users },
  { to: '/settings', label: 'Pengaturan & Tagihan', icon: Settings },
]
const subNav = [
  { to: '/fleet', label: 'Armada', icon: Truck },
  { to: '/survey', label: 'Survei', icon: BarChart3 },
]
</script>
