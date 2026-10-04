<template>
  <aside class="flex w-60 shrink-0 flex-col border-r border-line bg-surface">
    <div class="flex items-center gap-3 px-5 py-5">
      <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-damkar-600 text-white shadow-lg shadow-damkar-600/30">
        <Flame class="h-5 w-5" />
      </div>
      <div>
        <p class="text-sm font-extrabold tracking-wide">DAMKARHUB</p>
        <p class="text-[11px] font-medium text-muted">Komando</p>
      </div>
    </div>
    <nav class="flex-1 space-y-1 overflow-y-auto px-3">
      <router-link
        v-for="item in nav"
        :key="item.to"
        :to="item.to"
        class="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted transition-colors hover:bg-background hover:text-ink"
        active-class="!bg-damkar-600/10 !text-damkar-500"
      >
        <component :is="item.icon" class="h-[18px] w-[18px]" />
        {{ item.label }}
      </router-link>
    </nav>
    <div class="border-t border-line p-4">
      <p class="text-[11px] text-muted">v0.1.0 — mock</p>
    </div>
  </aside>
</template>

<script setup lang="ts">
import {
  LayoutDashboard, FileText, Users, Truck, BarChart3, Settings, Flame,
} from '@lucide/vue'

const nav = [
  { to: '/', label: 'Overview', icon: LayoutDashboard },
  { to: '/reports', label: 'Laporan', icon: FileText },
  { to: '/personnel', label: 'Personil', icon: Users },
  { to: '/fleet', label: 'Armada', icon: Truck },
  { to: '/survey', label: 'Survei', icon: BarChart3 },
  { to: '/settings', label: 'Pengaturan', icon: Settings },
]
</script>
