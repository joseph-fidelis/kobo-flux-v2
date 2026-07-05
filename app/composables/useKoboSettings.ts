export interface KoboSettingsStatus {
  configured: boolean
  baseUrl: string | null
  source: 'cookie' | 'env' | null
  tokenMasked: string | null
  hasCookieCredentials: boolean
}

export function useKoboSettings() {
  const status = ref<KoboSettingsStatus | null>(null)
  const pending = ref(false)
  const saving = ref(false)
  const error = ref<string | null>(null)
  const { track, reset } = useAnalytics()

  async function fetchStatus() {
    pending.value = true
    error.value = null
    try {
      status.value = await $fetch<KoboSettingsStatus>('/api/kobo/settings')
    } catch (err: unknown) {
      const apiErr = err as { message?: string; statusMessage?: string }
      error.value = apiErr.message ?? apiErr.statusMessage ?? 'Failed to load settings'
      status.value = null
    } finally {
      pending.value = false
    }
  }

  async function saveSettings(token: string, baseUrl: string) {
    saving.value = true
    error.value = null
    const sourceBefore = status.value?.source ?? null
    try {
      status.value = await $fetch<KoboSettingsStatus>('/api/kobo/settings', {
        method: 'POST',
        body: { token, baseUrl },
      })
      track('credentials_saved', {
        base_url: baseUrl,
        source_before: sourceBefore,
        success: true,
      })
      return true
    } catch (err: unknown) {
      const apiErr = err as {
        message?: string
        statusMessage?: string
        data?: { message?: string; statusMessage?: string }
      }
      error.value =
        apiErr.data?.statusMessage
        ?? apiErr.data?.message
        ?? apiErr.statusMessage
        ?? apiErr.message
        ?? 'Failed to save settings'
      track('credentials_saved', {
        base_url: baseUrl,
        source_before: sourceBefore,
        success: false,
      })
      return false
    } finally {
      saving.value = false
    }
  }

  async function clearSettings() {
    saving.value = true
    error.value = null
    try {
      status.value = await $fetch<KoboSettingsStatus>('/api/kobo/settings', {
        method: 'DELETE',
      })
      track('credentials_cleared', { success: true })
      reset()
      return true
    } catch (err: unknown) {
      const apiErr = err as { message?: string; statusMessage?: string }
      error.value = apiErr.message ?? apiErr.statusMessage ?? 'Failed to clear settings'
      track('credentials_cleared', { success: false })
      return false
    } finally {
      saving.value = false
    }
  }

  return {
    status,
    pending,
    saving,
    error,
    fetchStatus,
    saveSettings,
    clearSettings,
  }
}
