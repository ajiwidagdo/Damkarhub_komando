<template>
  <div :class="cn('rounded-xl border border-line bg-surface shadow-sm', $attrs.class as string)">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { cn } from '../../lib/utils'
</script>
