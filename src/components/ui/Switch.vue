<template>
  <button
    role="switch"
    :aria-checked="modelValue"
    :class="cn('relative h-6 w-11 shrink-0 rounded-full transition-colors', modelValue ? 'bg-sos-500' : 'bg-muted/40')"
    @click="$emit('update:modelValue', !modelValue)"
  >
    <span :class="cn('absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all', modelValue ? 'left-[22px]' : 'left-0.5')" />
  </button>
</template>

<script setup lang="ts">
import { cn } from '../../lib/utils'

defineProps<{ modelValue: boolean }>()
defineEmits<{ 'update:modelValue': [value: boolean] }>()
</script>
