<script setup lang="ts">
import { PaginationEllipsis } from 'reka-ui'
import { MoreHorizontal } from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import type { HTMLAttributes } from 'vue'

const props = defineProps<{ class?: HTMLAttributes['class'] }>()
</script>

<template>
  <PaginationEllipsis :class="cn('inline-flex h-8 w-8 items-center justify-center text-muted-foreground', props.class)">
    <slot>
      <MoreHorizontal :size="15" />
    </slot>
  </PaginationEllipsis>
</template>
