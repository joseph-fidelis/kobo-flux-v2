export default defineNuxtRouteMiddleware((to) => {
  const token = useCookie<string | null>('access_token')

  if (!token.value) {
    return navigateTo('/auth/login')
  }
})
