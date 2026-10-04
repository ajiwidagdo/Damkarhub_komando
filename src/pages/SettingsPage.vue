<template>
  <div class="max-w-2xl space-y-6">
    <div>
      <h2 class="text-xl font-bold">Pengaturan</h2>
      <p class="text-sm text-muted">Preferensi aplikasi Komando</p>
    </div>

    <Card class="p-5">
      <h3 class="mb-4 text-sm font-bold">Tampilan</h3>
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-medium">Tema</p>
          <p class="text-xs text-muted">Klik api di topbar atau tombol ini</p>
        </div>
        <Button variant="outline" size="sm" @click="toggle">
          {{ dark ? 'Mode terang' : 'Mode gelap' }}
        </Button>
      </div>
    </Card>

    <Card class="p-5">
      <h3 class="mb-4 text-sm font-bold">Sesi</h3>
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-medium">Keluar</p>
          <p class="text-xs text-muted">Hapus flag mock login</p>
        </div>
        <Button variant="outline" size="sm" @click="logout">Keluar</Button>
      </div>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Card from '../components/ui/Card.vue'
import Button from '../components/ui/Button.vue'
import { useTheme } from '../composables/useTheme'

const router = useRouter()
const { isDark, toggleDark } = useTheme()
const dark = ref(false)

onMounted(() => { dark.value = isDark() })

function toggle() {
  toggleDark()
  dark.value = isDark()
}

function logout() {
  localStorage.removeItem('komando_auth')
  router.push({ name: 'login' })
}
</script>
