<template>
  <Teleport to="body">
    <Transition name="dialog">
      <div v-if="modelValue" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/60" @click="$emit('update:modelValue', false)" />
        <div :class="cn('relative w-full max-w-lg rounded-xl border border-line bg-surface p-6 shadow-xl', $attrs.class as string)">
          <slot />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { cn } from '../../lib/utils'

defineProps<{ modelValue: boolean }>()
defineEmits<{ 'update:modelValue': [value: boolean] }>()
</script>

<style scoped>
.dialog-enter-active, .dialog-leave-active { transition: opacity .2s ease; }
.dialog-enter-from, .dialog-leave-to { opacity: 0; }
</style>
