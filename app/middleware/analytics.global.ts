export default defineNuxtRouteMiddleware(async (to) => {
  if (!import.meta.client) return

  const { trackPageView, identifyUser } = useAnalytics()
  trackPageView(to)

  if (to.path === '/settings') return

  try {
    const status = await $fetch<{ configured: boolean }>('/api/kobo/settings')
    if (status.configured) {
      await identifyUser()
    }
  } catch {
    // Credentials check failed — skip identify
  }
})
