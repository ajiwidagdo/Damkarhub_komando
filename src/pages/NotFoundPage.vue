<template>
  <div class="flex min-h-full flex-col items-center justify-center p-8 text-center">
    <p class="text-6xl font-extrabold text-muted/40">404</p>
    <h1 class="mt-4 text-xl font-bold">Halaman tidak ditemukan</h1>
    <p class="mt-2 text-sm text-muted">Alamat yang dituju tidak ada di Komando.</p>
    <Button class="mt-6" @click="$router.push({ name: 'overview' })">Kembali ke Overview</Button>
  </div>
</template>

<script setup lang="ts">
import Button from '../components/ui/Button.vue'
</script>
