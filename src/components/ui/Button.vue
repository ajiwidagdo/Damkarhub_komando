<template>
  <button :class="cn(buttonVariants({ variant, size }))">
    <slot />
  </button>
</template>

<script setup lang="ts">
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-brand-600 text-white shadow hover:bg-brand-500',
        success: 'bg-sos-500 text-white shadow hover:bg-sos-400',
        secondary: 'bg-background text-ink border border-line hover:bg-surface',
        ghost: 'text-muted hover:text-ink hover:bg-background',
        outline: 'border border-line bg-surface text-ink hover:bg-background',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-8 px-3 text-[13px]',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  }
)

export type ButtonVariants = VariantProps<typeof buttonVariants>

interface Props {
  variant?: 'default' | 'success' | 'secondary' | 'ghost' | 'outline'
  size?: 'default' | 'sm' | 'icon'
}withDefaults(defineProps<Props>(), { variant: 'default', size: 'default' })
</script>
