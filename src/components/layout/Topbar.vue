<template>
  <header class="flex h-16 shrink-0 items-center justify-between border-b border-line bg-surface px-6">
    <h1 class="text-lg font-bold">{{ title }}</h1>
    <div class="flex items-center gap-2">
      <!-- Fire Toggle: signature brand DAMKARHUB -->
      <FireToggle />
      <button
        class="relative flex h-10 w-10 items-center justify-center rounded-xl border border-line text-muted transition-colors hover:text-ink"
        aria-label="Notifikasi"
      >
        <Bell class="h-5 w-5" />
        <span class="absolute right-2 top-2 h-2 w-2 rounded-full bg-damkar-500" />
      </button>
      <button
        class="flex h-10 w-10 items-center justify-center rounded-xl border border-line text-muted transition-colors hover:text-ink"
        aria-label="Akun"
        @click="logout"
      >
        <CircleUserRound class="h-5 w-5" />
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Bell, CircleUserRound } from '@lucide/vue'
import FireToggle from '../brand/FireToggle.vue'

const route = useRoute()
const router = useRouter()

const titles: Record<string, string> = {
  overview: 'Overview',
  reports: 'Daftar Laporan',
  'report-detail': 'Detail Laporan',
  personnel: 'Data Personil',
  fleet: 'Manajemen Armada',
  survey: 'Survei Kepuasan',
  settings: 'Pengaturan',
}

const title = computed(() => titles[String(route.name)] ?? 'Komando')

function logout() {
  localStorage.removeItem('komando_auth')
  router.push({ name: 'login' })
}
</script>
