<template>
  <div class="flex h-full flex-col">
    <div class="mb-4 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h2 class="text-2xl font-extrabold">Pusat Komando</h2>
        <p class="text-sm text-muted">Pantau seluruh insiden dan pergerakan armada serta petugas secara real-time</p>
      </div>
      <div class="flex items-center gap-2">
        <span v-if="reportStore.usingLiveData" class="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-600">● Data Live</span>
        <span v-else class="rounded-full bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-600">● Data Contoh</span>
        <button
          v-if="mergeMode"
          class="rounded-lg bg-brand-600 px-3 py-2 text-xs font-bold text-white hover:bg-brand-500 disabled:opacity-40"
          :disabled="mergeSel.size < 2"
          @click="doMerge"
        >
          Gabungkan ({{ mergeSel.size }})
        </button>
        <button
          v-if="mergeMode"
          class="rounded-lg border border-line px-3 py-2 text-xs font-semibold text-muted hover:text-ink"
          @click="mergeMode = false; mergeSel.clear()"
        >
          Batal
        </button>
        <button
          v-else
          class="flex items-center gap-1.5 rounded-lg border border-line px-3 py-2 text-xs font-bold text-muted hover:text-ink"
          title="Gabung 2 cluster atau lebih menjadi 1 insiden"
          @click="mergeMode = true"
        >
          <Merge class="h-4 w-4" /> Gabung Cluster
        </button>
      </div>
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
          <p v-if="!filtered.length" class="py-8 text-center text-sm text-muted">
            Belum ada insiden. Data muncul otomatis dari laporan yang masuk.
          </p>
          <button
            v-for="i in filtered"
            :key="i.id"
            :class="cn('w-full rounded-xl border-l-4 bg-background p-3 text-left transition-shadow hover:shadow-md', selected?.id === i.id && 'ring-2 ring-brand-500/40')"
            :style="{ borderLeftColor: categoryMeta[i.category].color }"
            @click="mergeMode ? toggleMerge(i.id) : select(i)"
          >
            <div class="flex items-start gap-3">
              <input
                v-if="mergeMode"
                type="checkbox"
                :checked="mergeSel.has(i.id)"
                class="mt-1 h-4 w-4 shrink-0 accent-brand-600"
                @click.stop="toggleMerge(i.id)"
              />
              <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-extrabold" :style="{ background: categoryMeta[i.category].color + '1a', color: categoryMeta[i.category].color }">
                {{ i.badge }}
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
                <div class="mt-1 flex items-center gap-1.5">
                  <span class="flex items-center gap-1 text-[11px] font-medium text-damkar-500">
                    <Flame class="h-3 w-3" /> {{ i.reportCount }} Laporan Warga
                  </span>
                  <span
                    :class="cn('rounded-full px-1.5 py-0.5 text-[10px] font-bold', i.status === 'disetujui' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-amber-500/10 text-amber-600')"
                    :title="i.status === 'disetujui' ? 'Cluster sudah dikonfirmasi operator' : 'Usulan sistem — perlu konfirmasi operator'"
                  >
                    {{ i.status === 'disetujui' ? 'Disetujui' : 'Usulan' }}
                  </span>
                </div>
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
            v-for="i in mappable"
            :key="i.id"
            :lat-lng="[i.lat!, i.lng!]"
            :icon="pinIcon(categoryMeta[i.category].color, i.badge)"
            @click="select(i)"
          >
            <l-tooltip>{{ i.badge }} — {{ i.title }}</l-tooltip>
          </l-marker>
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
          <div v-if="selected" class="absolute right-3 top-16 z-[500] flex max-h-[calc(100%-5rem)] w-80 flex-col rounded-xl border border-line bg-surface shadow-xl">
            <div class="relative shrink-0">
              <div class="flex h-36 items-center justify-center rounded-t-xl bg-gradient-to-br from-navy-800 to-navy-950">
                <span class="flex h-16 w-16 items-center justify-center rounded-full bg-white/10 text-2xl font-extrabold text-white">{{ selected.badge }}</span>
              </div>
              <button class="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-lg bg-black/40 text-white hover:bg-black/60" @click="selected = null" aria-label="Tutup">
                <X class="h-4 w-4" />
              </button>
            </div>
            <div class="space-y-2 overflow-y-auto p-4">
              <div class="flex items-center justify-between">
                <span class="rounded px-2 py-0.5 text-[10px] font-extrabold text-white" :style="{ background: categoryMeta[selected.category].color }">
                  {{ categoryMeta[selected.category].label }}
                </span>
                <span class="text-xs text-muted">{{ selected.dateLabel }} · {{ selected.time }}</span>
              </div>
              <h4 class="text-base font-extrabold">Insiden {{ selected.badge }} — {{ selected.title }}</h4>
              <p class="flex items-center gap-1.5 text-xs text-muted"><MapPin class="h-3.5 w-3.5" /> {{ selected.address }}</p>
              <p v-if="selected.coords" class="flex items-center gap-1.5 text-xs text-muted"><Crosshair class="h-3.5 w-3.5" /> {{ selected.coords }}</p>
              <p class="flex items-center gap-1.5 rounded-lg bg-damkar-500/10 px-2.5 py-1.5 text-xs font-semibold text-damkar-500">
                <Flame class="h-3.5 w-3.5" /> {{ selected.reportCount }} Laporan Warga (Cluster {{ selected.badge }})
              </p>

              <!-- Kontrol hybrid: setujui / gabung / pisah -->
              <div class="rounded-lg border border-line bg-background/60 p-2.5">
                <p class="mb-1.5 text-[11px] font-bold text-muted">KONFIRMASI OPERATOR</p>
                <div v-if="selected.status === 'usulan'" class="flex gap-1.5">
                  <Button size="sm" variant="success" class="flex-1" @click="incidentStore.approve(selected.id)">
                    <Check class="h-4 w-4" /> Setujui Cluster
                  </Button>
                </div>
                <p v-else class="flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
                  <Check class="h-3.5 w-3.5" /> Cluster disetujui operator
                  <button class="ml-auto underline" @click="incidentStore.unapprove(selected.id)">batalkan</button>
                </p>
                <button
                  v-if="!splitMode"
                  class="mt-1.5 flex w-full items-center justify-center gap-1.5 rounded-lg border border-line px-2 py-1.5 text-xs font-semibold text-muted hover:text-ink"
                  @click="splitMode = true; splitSel.clear()"
                >
                  <Split class="h-3.5 w-3.5" /> Pisahkan laporan…
                </button>
                <div v-else class="mt-1.5 space-y-1">
                  <p class="text-[11px] text-muted">Pilih laporan untuk dipisah jadi cluster baru:</p>
                  <label v-for="r in incidentStore.reportsOf(selected.id)" :key="r.id" class="flex cursor-pointer items-center gap-2 rounded-md px-1.5 py-1 text-xs hover:bg-background">
                    <input type="checkbox" :checked="splitSel.has(r.id)" class="h-3.5 w-3.5 accent-brand-600" @change="toggleSplit(r.id)" />
                    <span class="truncate">{{ (r.data?.jenis as string) || 'Laporan' }} — {{ (r.data?.lokasiDetail as string) || r.id.slice(0, 8) }}</span>
                  </label>
                  <div class="flex gap-1.5 pt-1">
                    <Button
                      size="sm"
                      class="flex-1"
                      :disabled="splitSel.size === 0 || splitSel.size >= selected.reportCount"
                      @click="doSplit"
                    >
                      Pisahkan ({{ splitSel.size }})
                    </Button>
                    <Button size="sm" variant="outline" @click="splitMode = false">Batal</Button>
                  </div>
                </div>
              </div>

              <Button variant="success" class="w-full" @click="dispatch">
                <Send class="h-4 w-4" /> Teruskan Kepada Petugas
              </Button>
              <Button class="w-full" @click="call"><Phone class="h-4 w-4" /> Telpon Pelapor</Button>
              <div class="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm"><CalendarClock class="h-4 w-4" /> Jadwalkan</Button>
                <Button variant="outline" size="sm" @click="splitMode = true; splitSel.clear()"><Split class="h-4 w-4" /> Pisahkan</Button>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { LMap, LTileLayer, LMarker, LTooltip } from '@vue-leaflet/vue-leaflet'
import { divIcon, type Icon } from 'leaflet'
import {
  Search, Plus, Flame, X, MapPin,
  Crosshair, Send, Phone, CalendarClock, Split, Check, Merge,
} from '@lucide/vue'
import Button from '../components/ui/Button.vue'
import { cn } from '../lib/utils'
import { categoryMeta, useIncidentStore, type IncidentCategory, type IncidentView } from '../stores/incident'
import { useReportStore } from '../stores/report'

const incidentStore = useIncidentStore()
const reportStore = useReportStore()

const tab = ref<'semua' | IncidentCategory>('semua')
const selected = ref<IncidentView | null>(null)
const mergeMode = ref(false)
const mergeSel = ref(new Set<string>())
const splitMode = ref(false)
const splitSel = ref(new Set<string>())

const incidents = computed(() => incidentStore.incidents)
const mappable = computed(() => incidents.value.filter((i) => i.lat !== null && i.lng !== null))

const tabs = computed(() => [
  { key: 'semua' as const, label: 'Semua', count: incidents.value.length },
  { key: 'darurat' as const, label: 'Darurat', count: incidents.value.filter((i) => i.category === 'darurat').length },
  { key: 'terjadwal' as const, label: 'Terjadwal', count: incidents.value.filter((i) => i.category === 'terjadwal').length },
])

const filtered = computed(() =>
  tab.value === 'semua' ? incidents.value : incidents.value.filter((i) => i.category === tab.value),
)

// Selalu sinkronkan pilihan dengan objek terbaru (status/badge bisa berubah
// setelah aksi operator tanpa id-nya hilang dari daftar).
watch(incidents, (list) => {
  if (selected.value) {
    selected.value = list.find((i) => i.id === selected.value!.id) ?? list[0] ?? null
  } else if (list.length) {
    selected.value = list[0] ?? null
  }
  splitMode.value = false
}, { immediate: true })

function select(i: IncidentView) {
  selected.value = i
  splitMode.value = false
  splitSel.value.clear()
}

function toggleMerge(id: string) {
  if (mergeSel.value.has(id)) mergeSel.value.delete(id)
  else mergeSel.value.add(id)
}

function doMerge() {
  const gid = incidentStore.merge([...mergeSel.value])
  mergeMode.value = false
  mergeSel.value.clear()
  if (gid) {
    const inc = incidentStore.incidents.find((i) => i.id === gid)
    if (inc) selected.value = inc
  }
}

function toggleSplit(id: string) {
  if (splitSel.value.has(id)) splitSel.value.delete(id)
  else splitSel.value.add(id)
}

function doSplit() {
  if (!selected.value) return
  const gid = incidentStore.split(selected.value.id, [...splitSel.value])
  splitMode.value = false
  splitSel.value.clear()
  if (gid) {
    const inc = incidentStore.incidents.find((i) => i.id === gid)
    if (inc) selected.value = inc
  }
}

function pinIcon(color: string, badge: string): Icon {
  return divIcon({
    className: '',
    html: `<div style="width:30px;height:30px;border-radius:50%;background:${color};display:flex;align-items:center;justify-content:center;color:#fff;font-weight:800;font-size:13px;box-shadow:0 2px 8px rgba(0,0,0,.35);border:2px solid #fff">${badge}</div>`,
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
  alert(`Menghubungi pelapor: ${selected.value?.phone || '-'}`)
}
</script>

<style scoped>
.pop-enter-active, .pop-leave-active { transition: all .25s ease; }
.pop-enter-from, .pop-leave-to { opacity: 0; transform: translateX(12px); }
</style>
