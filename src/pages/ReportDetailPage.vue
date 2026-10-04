<template>
  <div v-if="report" class="space-y-4">
    <Button variant="ghost" size="sm" @click="$router.back()">← Kembali</Button>

    <div class="flex flex-wrap items-center gap-3">
      <h2 class="text-xl font-bold">{{ report.data.jenis }}</h2>
      <Badge :variant="moduleBadge[report.module]">{{ store.moduleLabel[report.module] }}</Badge>
      <Badge variant="success">{{ report.status }}</Badge>
    </div>

    <div class="grid gap-4 lg:grid-cols-2">
      <Card class="p-5">
        <h3 class="mb-3 text-sm font-bold">Waktu & Lokasi</h3>
        <dl class="space-y-2 text-sm">
          <div class="flex justify-between"><dt class="text-muted">Tanggal</dt><dd class="font-medium">{{ report.data.tanggal }}</dd></div>
          <div class="flex justify-between"><dt class="text-muted">Pukul</dt><dd class="font-medium">{{ report.data.pukul }}</dd></div>
          <div class="flex justify-between"><dt class="text-muted">Lokasi</dt><dd class="font-medium">{{ report.data.lokasiDetail || '-' }}</dd></div>
          <div class="flex justify-between"><dt class="text-muted">Kelurahan</dt><dd class="font-medium">{{ report.data.kel }}</dd></div>
          <div class="flex justify-between"><dt class="text-muted">Kecamatan</dt><dd class="font-medium">{{ report.data.kec }}</dd></div>
        </dl>
      </Card>
      <Card class="p-5">
        <h3 class="mb-3 text-sm font-bold">Kronologi & Tindakan</h3>
        <p class="text-sm"><span class="font-medium">Kronologi:</span> {{ report.data.kronologi || '-' }}</p>
        <p class="mt-2 text-sm"><span class="font-medium">Tindakan:</span> {{ report.data.tindakan || '-' }}</p>
        <p class="mt-2 text-sm"><span class="font-medium">Regu:</span> {{ report.data.regu }}</p>
      </Card>
    </div>

    <Card class="p-5">
      <h3 class="mb-3 text-sm font-bold">Meta</h3>
      <dl class="grid gap-2 text-sm sm:grid-cols-2">
        <div class="flex justify-between"><dt class="text-muted">ID</dt><dd class="font-mono text-xs">{{ report.id.slice(0, 8) }}…</dd></div>
        <div class="flex justify-between"><dt class="text-muted">Incident at</dt><dd>{{ report.incident_at }}</dd></div>
        <div class="flex justify-between"><dt class="text-muted">Diterima</dt><dd>{{ report.report_received_at }}</dd></div>
        <div class="flex justify-between"><dt class="text-muted">Diperbarui</dt><dd>{{ report.updated_at }}</dd></div>
      </dl>
    </Card>
  </div>
  <div v-else class="p-8 text-center text-sm text-muted">Laporan tidak ditemukan.</div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import type { Module } from '../types'
import { useReportStore } from '../stores/report'
import Card from '../components/ui/Card.vue'
import Badge from '../components/ui/Badge.vue'
import Button from '../components/ui/Button.vue'

const route = useRoute()
const store = useReportStore()
const report = computed(() => store.byId(String(route.params.id)).value)

const moduleBadge: Record<Module, 'default' | 'warning' | 'success'> = {
  k: 'default',
  nk: 'warning',
  sos: 'success',
}
</script>
