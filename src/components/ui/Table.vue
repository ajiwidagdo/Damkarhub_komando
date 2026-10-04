<template>
  <div :class="cn('w-full overflow-x-auto rounded-xl border border-line', $attrs.class as string)">
    <table class="w-full text-sm">
      <slot />
    </table>
  </div>
</template>

<script setup lang="ts">
import { cn } from '../../lib/utils'
</script>
