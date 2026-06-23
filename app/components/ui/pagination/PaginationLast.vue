<script setup lang="ts">
import { PaginationLast } from 'reka-ui'
import { ChevronsRight } from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import type { HTMLAttributes } from 'vue'

const props = defineProps<{ class?: HTMLAttributes['class'] }>()
</script>

<template>
  <PaginationLast
    :class="cn(
      'inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors cursor-pointer hover:bg-muted hover:text-foreground disabled:opacity-40 disabled:cursor-not-allowed',
      props.class,
    )"
  >
    <slot>
      <ChevronsRight :size="15" />
    </slot>
  </PaginationLast>
</template>
