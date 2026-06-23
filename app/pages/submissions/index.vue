<template>
  <div class="p-6">
    <h1 class="text-2xl font-semibold tracking-tight">Submissions</h1>
    <p v-if="formUid" class="mt-1 text-sm text-muted-foreground">
      Submissions for form:
      <code class="rounded bg-muted px-1.5 py-0.5 text-xs">{{ formUid }}</code>
    </p>
  </div>
</template>

<script lang="ts" setup>
definePageMeta({ layout: 'admin-layout' })

const route = useRoute()
const formUid = computed(() => route.query.form as string | undefined)
</script>
