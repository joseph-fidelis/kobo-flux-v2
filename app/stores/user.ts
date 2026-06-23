import { defineStore } from 'pinia'
import type { UserResponse } from '~/lib/models/User'

export const useUserStore = defineStore('user-store', {
  state: () => ({
    currentUser: null as UserResponse | null,
  }),
  actions: {
    setCurrentUser(user: UserResponse | null) {
      this.currentUser = user
    }
  },
  persist: [
    {
      // SSR-safe — tiny cookie just for server-side route protection and header UI
      storage: piniaPluginPersistedstate.cookies({
        sameSite: 'strict',
        secure: import.meta.env.PROD,
      }),
      pick: [
        'currentUser.id',
        'currentUser.username',
        'currentUser.email',
        'currentUser.file_number',
        'currentUser.is_superuser',
        'currentUser.last_login',
        'currentUser.last_login',
        'currentUser.role.id',
        'currentUser.role.name',
        'currentUser.role.abbreviation',
        'currentUser.branch',
      ]
    },
    {
      // client-only — permissions can be large, no cookie size concern
      storage: piniaPluginPersistedstate.localStorage(),
      pick: [
        'currentUser.role.permissions',
      ]
    }
  ]
})