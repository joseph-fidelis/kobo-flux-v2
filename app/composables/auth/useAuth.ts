import { ref } from 'vue'
import { useAuthApi } from '~/services/auth.service'
import { useUserStore } from '~/stores/user'

export function useAuth() {

  const isLoading = ref(false)
  const api = useAuthApi()
  const error = ref<string | null>(null)
  const store = useUserStore()

  const accessToken = useCookie<string | null>('access_token', {
    sameSite: 'strict',
    secure: import.meta.env.PROD,
  })


  const refreshToken = useCookie<string | null>('refresh_token', {
    sameSite: 'strict',
    secure: import.meta.env.PROD,
  })


  const login = async (username: string, password: string) => {
    try {
      isLoading.value = true    
      const data = await api.login(username, password)
      accessToken.value = data.access_token
      refreshToken.value = data.refresh_token
      store.setCurrentUser(data.user)
      await navigateTo('/admin/dashboard')
    } catch (err: any) {
      error.value = err?.message ?? 'Login failed'
      console.error('Login error:', err)
    } finally {
      isLoading.value = false
    }
  }

  const logout = async () => {
    try {
      await api.logout()
    } catch {
      
    } finally {
      store.setCurrentUser(null)
      accessToken.value = null
      refreshToken.value = null
      await navigateTo('/auth/login')
    }
  }

  return { error,  isLoading, login, logout }
}
