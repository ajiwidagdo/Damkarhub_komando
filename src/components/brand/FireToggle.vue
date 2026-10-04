<!-- Fire Toggle — signature brand DAMKARHUB (di-port dari Fireman)
     Api menyala (light) / padam + asap (dark). Klik = ganti tema. -->
<template>
  <button
    ref="btnRef"
    class="brand-toggle"
    :aria-label="dark ? 'Ganti ke mode terang' : 'Ganti ke mode gelap'"
    :title="dark ? 'Mode terang' : 'Mode gelap'"
    @click="onClick"
  >
    <span class="brand-mark">
      <svg class="bm-flame-outer" viewBox="0 0 48 48" aria-hidden="true">
        <defs>
          <linearGradient id="ft-gFlame" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stop-color="#ffd23f" />
            <stop offset=".42" stop-color="#ff8a1f" />
            <stop offset="1" stop-color="#e11d2e" />
          </linearGradient>
        </defs>
        <path
          fill="url(#ft-gFlame)"
          d="M25.2 1.5c.9 6.4-2.4 10.1-6 14.6-3.6 4.5-7.2 8.9-7.2 15.2C12 39.6 17.4 46.5 24.6 46.5S37.5 40 37.5 32.4c0-4.6-2-8.1-4.5-10.9-.2 3.4-1.7 5.5-3.7 6.6 1.3-6.9.3-17.2-4.1-26.6z"
        />
      </svg>
      <svg class="bm-flame-inner" viewBox="0 0 48 48" aria-hidden="true">
        <path
          fill="#fff1b8"
          opacity=".95"
          d="M24.6 46.5c-4.4 0-7.5-3.2-7.5-7.7 0-3.3 2-5.5 3.7-7.8.4 2.2 1.7 3.6 3 3.9 1.3-2.4 1.1-5.7-.3-9 4.3 3.3 8.5 7.4 8.5 12.9 0 4.6-3.2 7.7-7.4 7.7z"
        />
      </svg>
      <svg class="bm-smoke" viewBox="0 0 48 48" aria-hidden="true">
        <path
          d="M24 6 C19 11, 29 14, 24 19 C19 24, 29 27, 24 32 C20 36, 26 39, 24 42"
          stroke="currentColor" stroke-width="3" stroke-linecap="round" fill="none" opacity=".85"
        />
        <path
          d="M16 14 C12 18, 18 21, 14 25 C11 28, 15 30, 13 33"
          stroke="currentColor" stroke-width="2.2" stroke-linecap="round" fill="none" opacity=".55"
        />
        <path
          d="M32 16 C28 20, 34 23, 30 27 C27 30, 31 32, 29 35"
          stroke="currentColor" stroke-width="2.2" stroke-linecap="round" fill="none" opacity=".55"
        />
      </svg>
      <span class="bm-embers" aria-hidden="true"><i /><i /><i /></span>
    </span>
  </button>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useTheme } from '../../composables/useTheme'

const { isDark, toggleDark } = useTheme()
const btnRef = ref<HTMLElement | null>(null)
const dark = ref(false)

function onClick() {
  toggleDark(btnRef.value)
  dark.value = isDark()
}

onMounted(() => {
  dark.value = isDark()
})
</script>
