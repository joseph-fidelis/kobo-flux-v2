import type { RouteLocationNormalized } from 'vue-router'
import type { PostHog } from 'posthog-js'
import type { KoboSettingsStatus } from '~/composables/useKoboSettings'
import { useUserOrgApi } from '~/services/user-org.service'

const identified = ref(false)
const identifying = ref(false)

function isAnalyticsEnabled(): boolean {
  const config = useRuntimeConfig().public
  return Boolean(config.posthogEnabled && config.posthogKey)
}

function getPosthog(): PostHog | null {
  if (!import.meta.client || !isAnalyticsEnabled()) {
    return null
  }

  const { $posthog } = useNuxtApp()
  return ($posthog as PostHog | undefined) ?? null
}

async function updateSuperProperties() {
  const posthog = getPosthog()
  if (!posthog) return

  try {
    const status = await $fetch<KoboSettingsStatus>('/api/kobo/settings')
    posthog.register({
      kobo_base_url: status.baseUrl ?? undefined,
      credential_source: status.source ?? undefined,
    })
  } catch {
    // Settings unavailable — skip super properties update
  }
}

export function useAnalytics() {
  function track(event: string, properties?: Record<string, unknown>) {
    getPosthog()?.capture(event, properties)
  }

  function trackPageView(route: RouteLocationNormalized) {
    getPosthog()?.capture('$pageview', {
      path: route.path,
      query: route.query,
      page_name: route.name?.toString() ?? route.path,
    })
  }

  async function identifyUser() {
    if (!import.meta.client || identified.value || identifying.value) {
      return
    }

    const posthog = getPosthog()
    if (!posthog) return

    identifying.value = true
    try {
      await updateSuperProperties()

      const status = await $fetch<KoboSettingsStatus>('/api/kobo/settings')
      if (!status.configured) return

      const { getCurrentUser } = useUserOrgApi()
      const user = await getCurrentUser()
      const baseUrl = status.baseUrl ?? 'unknown'
      const distinctId = `${baseUrl}::${user.username}`

      posthog.identify(distinctId, {
        email: user.email,
        username: user.username,
        organization: user.organization?.name,
        organization_uid: user.organization?.uid,
        kobo_base_url: baseUrl,
        credential_source: status.source,
      })

      identified.value = true
    } catch {
      // User not available yet — remain anonymous until next navigation
    } finally {
      identifying.value = false
    }
  }

  function reset() {
    identified.value = false
    getPosthog()?.reset()
  }

  return {
    track,
    trackPageView,
    identifyUser,
    reset,
    isEnabled: isAnalyticsEnabled,
  }
}
