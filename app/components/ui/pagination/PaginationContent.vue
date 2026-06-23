<script setup lang="ts">
import { PaginationList } from 'reka-ui'
import { cn } from '@/lib/utils'
import type { HTMLAttributes } from 'vue'

const props = defineProps<{ class?: HTMLAttributes['class'] }>()
</script>

<template>
  <PaginationList v-slot="slotProps" :class="cn('flex items-center gap-1', props.class)">
    <slot v-bind="slotProps" />
  </PaginationList>
</template>
