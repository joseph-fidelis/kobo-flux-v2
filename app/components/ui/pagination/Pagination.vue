<script setup lang="ts">
import { PaginationRoot, type PaginationRootProps, type PaginationRootEmits } from 'reka-ui'
import { cn } from '@/lib/utils'
import type { HTMLAttributes } from 'vue'

interface Props extends PaginationRootProps {
  class?: HTMLAttributes['class']
}

const props = defineProps<Props>()
const emits = defineEmits<PaginationRootEmits>()
</script>

<template>
  <PaginationRoot
    v-bind="props"
    :class="cn('mx-auto flex w-full justify-center', props.class)"
    @update:page="emits('update:page', $event)"
  >
    <slot />
  </PaginationRoot>
</template>
