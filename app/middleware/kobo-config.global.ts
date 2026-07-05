export default defineNuxtRouteMiddleware(async (to) => {
  if (to.path === '/settings') {
    return
  }

  try {
    const status = await $fetch<{ configured: boolean }>('/api/kobo/settings')
    if (!status.configured) {
      if (import.meta.client) {
        useAnalytics().track('unconfigured_redirect', { from_path: to.path })
      }
      return navigateTo('/settings')
    }
  } catch {
    if (import.meta.client) {
      useAnalytics().track('unconfigured_redirect', { from_path: to.path })
    }
    return navigateTo('/settings')
  }
})
