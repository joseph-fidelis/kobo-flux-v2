
<script setup lang="ts">
import { usePermissionsUtil } from '~/composables/permission/usePermissions';

const props = defineProps<{
  permission?: string
  any?: string[]
  all?: string[]
  role?: string[]
}>()

const { can, canAny, canAll, hasRole } = usePermissionsUtil()

const allowed = computed(() => {
  if (props.role)       return hasRole(...props.role)
  if (props.all)        return canAll(...props.all)
  if (props.any)        return canAny(...props.any)
  if (props.permission) return can(props.permission)
  return false
})
</script>

<template>
  <slot v-if="allowed" />
</template>