<template>
  <div class="flex min-h-full items-center justify-center bg-background p-4">
    <Card class="w-full max-w-sm p-8">
      <div class="mb-6 flex flex-col items-center text-center">
        <div class="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-damkar-600 text-white shadow-lg shadow-damkar-600/30">
          <Flame class="h-7 w-7" />
        </div>
        <h1 class="text-xl font-extrabold tracking-wide">DAMKARHUB</h1>
        <p class="text-sm text-muted">Komando — Masuk</p>
      </div>
      <form class="space-y-4" @submit.prevent="login">
        <div>
          <label class="mb-1.5 block text-sm font-medium">Email</label>
          <Input v-model="email" type="email" placeholder="komando@damkarhub.id" required />
        </div>
        <div>
          <label class="mb-1.5 block text-sm font-medium">Kata sandi</label>
          <Input v-model="password" type="password" placeholder="••••••••" required />
        </div>
        <Button type="submit" class="w-full">Masuk</Button>
        <p class="text-center text-xs text-muted">Mock login — kredensial apa saja bisa masuk.</p>
      </form>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Flame } from '@lucide/vue'
import Card from '../components/ui/Card.vue'
import Input from '../components/ui/Input.vue'
import Button from '../components/ui/Button.vue'

const router = useRouter()
const email = ref('')
const password = ref('')

function login() {
  localStorage.setItem('komando_auth', '1')
  router.push({ name: 'overview' })
}
</script>
