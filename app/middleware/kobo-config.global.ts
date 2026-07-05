export default defineNuxtRouteMiddleware(async (to) => {
  if (to.path === '/settings') {
    return
  }

  try {
    const status = await $fetch<{ configured: boolean }>('/api/kobo/settings')
    if (!status.configured) {
      return navigateTo('/settings')
    }
  } catch {
    return navigateTo('/settings')
  }
})
