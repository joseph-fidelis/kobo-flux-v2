<script setup lang="ts">
import { Settings } from 'lucide-vue-next'
import { toast } from 'vue-sonner'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

definePageMeta({ layout: 'admin-layout' })

const DEFAULT_BASE_URL = 'https://kf.kobotoolbox.org'

const {
  status,
  pending,
  saving,
  error,
  fetchStatus,
  saveSettings,
  clearSettings,
} = useKoboSettings()

const token = ref('')
const baseUrl = ref(DEFAULT_BASE_URL)
const successMessage = ref<string | null>(null)

onMounted(async () => {
  await fetchStatus()
  if (status.value?.baseUrl) {
    baseUrl.value = status.value.baseUrl
  }
})

async function onSave() {
  successMessage.value = null
  const ok = await saveSettings(token.value, baseUrl.value)
  if (ok) {
    token.value = ''
    successMessage.value = 'Credentials saved and verified with Kobo.'
    toast.success('Kobo connection configured')
    await navigateTo('/')
  }
}

async function onClear() {
  successMessage.value = null
  const ok = await clearSettings()
  if (ok) {
    token.value = ''
    baseUrl.value = status.value?.baseUrl ?? DEFAULT_BASE_URL
    successMessage.value = 'Saved browser credentials cleared.'
    toast.success('Credentials cleared')
  }
}
</script>

<template>
  <div class="flex flex-col gap-6 p-6 max-w-2xl">
    <div>
      <h1 class="text-2xl font-semibold tracking-tight">Settings</h1>
      <p class="mt-1 text-sm text-muted-foreground">
        Connect KoboFlux to your KoboToolbox account. Credentials are stored in
        HttpOnly session cookies on this browser.
      </p>
    </div>

    <div
      v-if="status?.source === 'env' && !status.hasCookieCredentials"
      class="rounded-lg border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground"
    >
      Server environment variables are active
      <span v-if="status.tokenMasked">({{ status.tokenMasked }})</span>.
      Saving here will override them for this browser session.
    </div>

    <div
      v-if="error"
      class="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive"
    >
      {{ error }}
    </div>

    <div
      v-if="successMessage"
      class="rounded-lg border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-700 dark:text-green-400"
    >
      {{ successMessage }}
    </div>

    <Card>
      <CardHeader>
        <CardTitle class="flex items-center gap-2">
          <Settings class="h-5 w-5" />
          Kobo connection
        </CardTitle>
        <CardDescription>
          Create a token at
          <a
            href="https://kf.kobotoolbox.org/token/"
            target="_blank"
            rel="noopener noreferrer"
            class="underline underline-offset-2"
          >kf.kobotoolbox.org/token</a>
          (or EU equivalent).
        </CardDescription>
      </CardHeader>
      <CardContent class="flex flex-col gap-5">
        <div v-if="pending" class="text-sm text-muted-foreground">
          Loading current configuration…
        </div>

        <template v-else>
          <div
            v-if="status?.configured"
            class="rounded-md border border-border bg-muted/30 px-3 py-2 text-sm"
          >
            <p>
              Active source:
              <span class="font-medium">{{ status.source === 'cookie' ? 'Browser session' : 'Server env' }}</span>
            </p>
            <p v-if="status.tokenMasked" class="text-muted-foreground">
              Token: {{ status.tokenMasked }}
            </p>
            <p v-if="status.baseUrl" class="text-muted-foreground truncate">
              Base URL: {{ status.baseUrl }}
            </p>
          </div>

          <div class="space-y-2">
            <Label for="kobo-token">Kobo API token</Label>
            <Input
              id="kobo-token"
              v-model="token"
              type="password"
              autocomplete="off"
              placeholder="Paste your API token"
            />
          </div>

          <div class="space-y-2">
            <Label for="kobo-base-url">Kobo base URL</Label>
            <Input
              id="kobo-base-url"
              v-model="baseUrl"
              type="url"
              placeholder="https://kf.kobotoolbox.org"
            />
            <p class="text-xs text-muted-foreground">
              Global: https://kf.kobotoolbox.org · EU: https://eu.kobotoolbox.org
            </p>
          </div>

          <div class="flex flex-wrap gap-2">
            <Button :disabled="saving || !token.trim() || !baseUrl.trim()" @click="onSave">
              {{ saving ? 'Saving…' : 'Save & test connection' }}
            </Button>
            <Button
              v-if="status?.hasCookieCredentials"
              variant="outline"
              :disabled="saving"
              @click="onClear"
            >
              Clear saved credentials
            </Button>
          </div>
        </template>
      </CardContent>
    </Card>
  </div>
</template>
