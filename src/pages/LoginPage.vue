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
        <p v-if="error" class="rounded-lg bg-damkar-600/10 px-3 py-2 text-sm text-damkar-600">{{ error }}</p>
        <Button type="submit" class="w-full" :disabled="loading">
          {{ loading ? 'Memeriksa...' : 'Masuk' }}
        </Button>
        <p v-if="!isSupabaseConfigured" class="text-center text-xs text-muted">Mock login — kredensial apa saja bisa masuk.</p>
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
import { isSupabaseConfigured, supabase } from '../lib/supabase'

const router = useRouter()
const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

async function login() {
  error.value = ''

  // Mode mock: Supabase belum dikonfigurasi.
  if (!isSupabaseConfigured) {
    localStorage.setItem('komando_auth', '1')
    await router.push({ name: 'command' })
    return
  }

  loading.value = true
  try {
    const { error: authError } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value,
    })
    if (authError) {
      error.value = 'Email atau kata sandi salah. Silakan coba lagi.'
      return
    }
    await router.push({ name: 'command' })
  } finally {
    loading.value = false
  }
}
</script>
