// plugins/auth.ts
export default defineNuxtPlugin(async () => {
    console.log("auth guard running")
//   const store = useUserStore()
//   const { $api } = useNuxtApp()

//   if (store.persistedUser?.id) {
//     try {
//       const user = await $fetch<UserResponse>('/api/users/me')
//       store.setCurrentUser(user)
//     } catch {
//       // token expired or invalid, clear everything
//       store.setCurrentUser(null)
//     }
//   }
})