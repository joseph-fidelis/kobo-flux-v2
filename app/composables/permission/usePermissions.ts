import { useUserStore } from "~/stores/user"


export function usePermissionsUtil() {
  const { currentUser } = useUserStore()

  const permissions = computed(() =>
    currentUser?.role.permissions ?? []
  )

  const role = computed(() =>
    currentUser?.role.abbreviation ?? null
  )

  const isSuperAdmin = computed(() =>
    role.value === 'system_admin'
  )

  const can = (slug: string): boolean => {
    if (isSuperAdmin.value) return true
    return permissions.value.includes(slug)
  }

  const canAny = (...slugs: string[]): boolean => {
    if (isSuperAdmin.value) return true
    return slugs.some(s => permissions.value.includes(s))
  }

  const canAll = (...slugs: string[]): boolean => {
    if (isSuperAdmin.value) return true
    return slugs.every(s => permissions.value.includes(s))
  }

  const hasRole = (...roles: string[]): boolean => {
    return roles.includes(role.value ?? '')
  }

  return { can, canAny, canAll, hasRole, isSuperAdmin, permissions, role }
}