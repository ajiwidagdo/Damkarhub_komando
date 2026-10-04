<template>
  <div class="flex h-full flex-col">
    <div class="mb-4">
      <h2 class="text-2xl font-extrabold">Pusat Komando</h2>
      <p class="text-sm text-muted">Pantau seluruh insiden dan pergerakan armada serta petugas secara real-time</p>
    </div>

    <div class="grid min-h-0 flex-1 gap-4 xl:grid-cols-[340px_1fr]">
      <!-- Daftar Insiden -->
      <div class="flex min-h-0 flex-col rounded-xl border border-line bg-surface">
        <div class="flex items-center justify-between p-4 pb-2">
          <h3 class="font-bold">Daftar Insiden</h3>
          <div class="flex gap-1.5">
            <button class="flex h-8 w-8 items-center justify-center rounded-lg border border-line text-muted hover:text-ink" aria-label="Cari">
              <Search class="h-4 w-4" />
            </button>
            <button class="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white hover:bg-brand-500" aria-label="Tambah">
              <Plus class="h-4 w-4" />
            </button>
          </div>
        </div>
        <div class="flex gap-2 px-4 pb-3">
          <button
            v-for="t in tabs"
            :key="t.key"
            :class="cn('rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors', tab === t.key ? 'bg-brand-600 text-white' : 'bg-background text-muted hover:text-ink')"
            @click="tab = t.key"
          >
            {{ t.label }} <span class="ml-1 rounded-full bg-white/20 px-1.5">{{ t.count }}</span>
          </button>
        </div>
        <div class="min-h-0 flex-1 space-y-2.5 overflow-y-auto px-4 pb-4">
          <button
            v-for="i in filtered"
            :key="i.id"
            :class="cn('w-full rounded-xl border-l-4 bg-background p-3 text-left transition-shadow hover:shadow-md', selected?.id === i.id && 'ring-2 ring-brand-500/40')"
            :style="{ borderLeftColor: categoryMeta[i.category].color }"
            @click="select(i)"
          >
            <div class="flex items-start gap-3">
              <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full" :style="{ background: categoryMeta[i.category].color + '1a', color: categoryMeta[i.category].color }">
                <Flame v-if="i.category === 'darurat'" class="h-5 w-5" />
                <PawPrint v-else-if="i.category === 'penyelamatan'" class="h-5 w-5" />
                <UserRound v-else-if="i.category === 'terjadwal'" class="h-5 w-5" />
                <Info v-else class="h-5 w-5" />
              </span>
              <div class="min-w-0 flex-1">
                <div class="flex items-center justify-between gap-2">
                  <span class="rounded px-1.5 py-0.5 text-[10px] font-extrabold text-white" :style="{ background: categoryMeta[i.category].color }">
                    {{ categoryMeta[i.category].label }}
                  </span>
                  <span class="text-xs text-muted">{{ i.time }}</span>
                </div>
                <p class="mt-1 truncate text-sm font-bold">{{ i.title }}</p>
                <p class="truncate text-xs text-muted">{{ i.address }}</p>
                <p v-if="i.cluster" class="mt-1 flex items-center gap-1 text-[11px] font-medium text-damkar-500">
                  <Flame class="h-3 w-3" /> {{ i.cluster }} Laporan Warga
                </p>
              </div>
            </div>
          </button>
        </div>
      </div>

      <!-- Peta -->
      <div class="relative min-h-[480px] overflow-hidden rounded-xl border border-line">
        <l-map ref="mapRef" :zoom="13" :center="[-7.37, 108.53]" :use-global-leaflet="false" style="height: 100%; min-height: 480px">
          <l-tile-layer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="© OpenStreetMap contributors" />
          <l-marker
            v-for="i in mockIncidents"
            :key="i.id"
            :lat-lng="[i.lat, i.lng]"
            :icon="pinIcon(categoryMeta[i.category].color)"
            @click="select(i)"
          />
          <l-marker :lat-lng="[-7.371, 108.528]" :icon="makoIcon">
            <l-tooltip>Mako DAMKAR Kota Banjar</l-tooltip>
          </l-marker>
        </l-map>

        <!-- Toolbar peta -->
        <div class="absolute left-3 right-3 top-3 z-[500] flex flex-wrap items-center gap-2">
          <div class="flex min-w-52 flex-1 items-center gap-2 rounded-xl border border-line bg-surface px-3 py-2 shadow-sm">
            <Search class="h-4 w-4 shrink-0 text-muted" />
            <input placeholder="Cari lokasi, alamat, atau insiden…" class="w-full bg-transparent text-sm outline-none placeholder:text-muted" />
          </div>
          <div class="flex overflow-hidden rounded-xl border border-line bg-surface shadow-sm">
            <button class="bg-brand-600 px-4 py-2 text-xs font-bold text-white">Peta Live</button>
            <button class="px-4 py-2 text-xs font-semibold text-muted hover:text-ink">Satelit</button>
          </div>
        </div>

        <!-- Legend -->
        <div class="absolute bottom-3 left-3 z-[500] flex flex-wrap gap-3 rounded-xl border border-line bg-surface/95 px-4 py-2 text-[11px] font-medium shadow-sm">
          <span class="flex items-center gap-1.5"><span class="h-2.5 w-2.5 rounded-full bg-damkar-500" /> Lokasi Insiden</span>
          <span class="flex items-center gap-1.5"><span class="h-2.5 w-2.5 rounded-full bg-brand-500" /> Armada / Pos</span>
          <span class="flex items-center gap-1.5"><span class="h-2.5 w-2.5 rounded-full bg-sos-500" /> Petugas Aktif</span>
        </div>

        <!-- Popup detail -->
        <Transition name="pop">
          <div v-if="selected" class="absolute right-3 top-16 z-[500] w-80 rounded-xl border border-line bg-surface shadow-xl">
            <div class="relative">
              <div class="flex h-36 items-center justify-center rounded-t-xl bg-gradient-to-br from-navy-800 to-navy-950">
                <Flame class="h-12 w-12 text-damkar-500" />
              </div>
              <button class="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-lg bg-black/40 text-white hover:bg-black/60" @click="selected = null" aria-label="Tutup">
                <X class="h-4 w-4" />
              </button>
            </div>
            <div class="space-y-2 p-4">
              <div class="flex items-center justify-between">
                <span class="rounded px-2 py-0.5 text-[10px] font-extrabold text-white" :style="{ background: categoryMeta[selected.category].color }">
                  {{ categoryMeta[selected.category].label }}
                </span>
                <span class="text-xs text-muted">{{ selected.time }}</span>
              </div>
              <h4 class="text-base font-extrabold">{{ selected.title }}</h4>
              <p class="flex items-center gap-1.5 text-xs text-muted"><MapPin class="h-3.5 w-3.5" /> {{ selected.address }}</p>
              <p class="flex items-center gap-1.5 text-xs text-muted"><Crosshair class="h-3.5 w-3.5" /> {{ selected.coords }}</p>
              <p v-if="selected.cluster" class="flex items-center gap-1.5 rounded-lg bg-damkar-500/10 px-2.5 py-1.5 text-xs font-semibold text-damkar-500">
                <Flame class="h-3.5 w-3.5" /> {{ selected.cluster }} Laporan Warga (Cluster)
              </p>
              <Button variant="success" class="w-full" @click="dispatch">
                <Send class="h-4 w-4" /> Teruskan Kepada Petugas
              </Button>
              <Button class="w-full" @click="call"><Phone class="h-4 w-4" /> Telpon Pelapor</Button>
              <div class="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm"><CalendarClock class="h-4 w-4" /> Jadwalkan</Button>
                <Button variant="outline" size="sm"><Split class="h-4 w-4" /> Pisahkan</Button>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { LMap, LTileLayer, LMarker, LTooltip } from '@vue-leaflet/vue-leaflet'
import { divIcon, type Icon } from 'leaflet'
import {
  Search, Plus, Flame, PawPrint, UserRound, Info, X, MapPin,
  Crosshair, Send, Phone, CalendarClock, Split,
} from '@lucide/vue'
import Button from '../components/ui/Button.vue'
import { cn } from '../lib/utils'
import { mockIncidents, categoryMeta, type Incident, type IncidentCategory } from '../mocks/incidents'

const tab = ref<'semua' | IncidentCategory>('semua')
const selected = ref<Incident | null>(mockIncidents[0] ?? null)

const tabs = computed(() => [
  { key: 'semua' as const, label: 'Semua', count: mockIncidents.length },
  { key: 'darurat' as const, label: 'Darurat', count: mockIncidents.filter((i) => i.category === 'darurat').length },
  { key: 'terjadwal' as const, label: 'Terjadwal', count: mockIncidents.filter((i) => i.category === 'terjadwal').length },
])

const filtered = computed(() =>
  tab.value === 'semua' ? mockIncidents : mockIncidents.filter((i) => i.category === tab.value)
)

function select(i: Incident) {
  selected.value = i
}

function pinIcon(color: string): Icon {
  return divIcon({
    className: '',
    html: `<div style="width:30px;height:30px;border-radius:50%;background:${color};display:flex;align-items:center;justify-content:center;color:#fff;font-weight:800;font-size:14px;box-shadow:0 2px 8px rgba(0,0,0,.35);border:2px solid #fff">!</div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  }) as Icon
}

const makoIcon: Icon = divIcon({
  className: '',
  html: `<div style="width:34px;height:34px;border-radius:50%;background:#0a1a33;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:800;box-shadow:0 2px 8px rgba(0,0,0,.35);border:2px solid #fff">★</div>`,
  iconSize: [34, 34],
  iconAnchor: [17, 17],
}) as Icon

function dispatch() {
  alert(`Dispatch diteruskan ke petugas aktif untuk: ${selected.value?.title}`)
}
function call() {
  alert(`Menghubungi pelapor: ${selected.value?.phone}`)
}
</script>

<style scoped>
.pop-enter-active, .pop-leave-active { transition: all .25s ease; }
.pop-enter-from, .pop-leave-to { opacity: 0; transform: translateX(12px); }
</style>
