<template>
  <span :class="cn(badgeVariants({ variant }), $attrs.class as string)">
    <slot />
  </span>
</template>

<script setup lang="ts">
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold',
  {
    variants: {
      variant: {
        default: 'bg-brand-600/10 text-brand-600',
        success: 'bg-sos-500/10 text-sos-500',
        warning: 'bg-rescue-500/15 text-rescue-500',
        muted: 'bg-background text-muted border border-line',
      },
    },
    defaultVariants: { variant: 'default' },
  }
)

export type BadgeVariants = VariantProps<typeof badgeVariants>

interface Props {
  variant?: 'default' | 'success' | 'warning' | 'muted'
}
withDefaults(defineProps<Props>(), { variant: 'default' })
</script>
