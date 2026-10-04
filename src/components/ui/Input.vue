<template>
  <input
    :value="modelValue"
    :class="cn('flex h-10 w-full rounded-lg border border-line bg-background px-3 py-2 text-sm text-ink placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-damkar-500/40 disabled:opacity-50', $attrs.class as string)"
    @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
  />
</template>

<script setup lang="ts">
import { cn } from '../../lib/utils'

defineProps<{ modelValue?: string | number }>()
defineEmits<{ 'update:modelValue': [value: string] }>()
</script>
