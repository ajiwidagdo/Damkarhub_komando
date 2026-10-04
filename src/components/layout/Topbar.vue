<template>
  <header class="flex h-16 shrink-0 items-center gap-3 border-b border-line bg-surface px-4">
    <button class="flex h-10 w-10 items-center justify-center rounded-lg text-muted hover:bg-background hover:text-ink" aria-label="Menu">
      <Menu class="h-5 w-5" />
    </button>

    <span class="hidden items-center gap-2 rounded-full bg-sos-500/10 px-3 py-1.5 text-xs font-semibold text-sos-500 md:flex">
      <span class="h-2 w-2 rounded-full bg-sos-500" /> Server Online
    </span>
    <span class="hidden items-center gap-2 rounded-full bg-brand-600/10 px-3 py-1.5 text-xs font-semibold text-brand-600 lg:flex">
      <Users class="h-3.5 w-3.5" /> {{ personnel.activeCount }} Petugas Aktif
    </span>

    <!-- Emergency banner -->
    <button
      class="mx-auto flex items-center gap-2.5 rounded-xl bg-gradient-to-r from-damkar-600/15 via-damkar-600/5 to-transparent px-4 py-1.5"
      @click="$router.push('/')"
    >
      <Siren class="h-6 w-6 text-damkar-500" />
      <span class="text-left">
        <span class="block text-xs font-extrabold uppercase tracking-wide text-damkar-500">Ada Insiden Darurat Baru!</span>
        <span class="block text-[10px] text-muted">Sistem Siaga 24 Jam</span>
      </span>
    </button>

    <div class="ml-auto hidden text-right text-xs text-muted sm:block">
      <p class="font-medium">{{ today }}</p>
      <p class="font-bold text-ink">{{ clock }}</p>
    </div>

    <FireToggle />

    <button class="relative flex h-10 w-10 items-center justify-center rounded-xl text-muted hover:bg-background hover:text-ink" aria-label="Notifikasi">
      <Bell class="h-5 w-5" />
      <span class="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-damkar-500 text-[9px] font-bold text-white">3</span>
    </button>

    <button class="flex items-center gap-2.5 rounded-xl py-1 pl-1 pr-2 hover:bg-background" @click="$router.push('/settings')">
      <span class="flex h-9 w-9 items-center justify-center rounded-full bg-navy-800 text-sm font-bold text-white">A</span>
      <span class="hidden text-left xl:block">
        <span class="block text-xs font-bold">Admin</span>
        <span class="block text-[10px] text-muted">Super Administrator</span>
      </span>
      <ChevronDown class="hidden h-4 w-4 text-muted xl:block" />
    </button>
  </header>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { Menu, Users, Siren, Bell, ChevronDown } from '@lucide/vue'
import FireToggle from '../brand/FireToggle.vue'
import { usePersonnelStore } from '../../stores/data'

const personnel = usePersonnelStore()
const today = ref('')
const clock = ref('')
let timer: number | undefined

function tick() {
  const d = new Date()
  today.value = d.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' })
  clock.value = d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
}

onMounted(() => { tick(); timer = window.setInterval(tick, 30000) })
onUnmounted(() => window.clearInterval(timer))
</script>
