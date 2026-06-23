<script setup lang="ts">
import { PaginationListItem } from 'reka-ui'
import { cn } from '@/lib/utils'
import type { HTMLAttributes } from 'vue'

const props = defineProps<{
  class?: HTMLAttributes['class']
  value: number
  isActive?: boolean
}>()
</script>

<template>
  <PaginationListItem
    :value="props.value"
    :class="cn(
      'inline-flex h-8 w-8 items-center justify-center rounded-lg text-[12px] font-medium transition-colors cursor-pointer border',
      props.isActive
        ? 'bg-blue-600 text-white border-blue-600 hover:bg-blue-500'
        : 'bg-transparent text-muted-foreground border-border hover:bg-muted hover:text-foreground',
      props.class,
    )"
  >
    <slot />
  </PaginationListItem>
</template>
