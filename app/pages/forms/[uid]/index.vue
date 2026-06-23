<template>
  <div class="flex flex-col gap-4 p-6">
    <div class="flex items-center gap-3">
      <Button variant="ghost" size="sm" as-child>
        <NuxtLink to="/forms" class="flex items-center gap-1.5 text-muted-foreground">
          <ArrowLeft class="h-4 w-4" />
          Back to forms
        </NuxtLink>
      </Button>
    </div>

    <div>
      <h1 class="text-2xl font-semibold tracking-tight">Form details</h1>
      <p class="mt-1 text-sm text-muted-foreground">
        UID: <code class="rounded bg-muted px-1.5 py-0.5 text-xs">{{ uid }}</code>
      </p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-vue-next'

definePageMeta({ layout: 'admin-layout' })

const route = useRoute()
const uid = computed(() => route.params.uid as string)
</script>
