import { ref, computed } from 'vue'
import { useRoleApi } from '~/services/role.service'
import type { RoleResponse, Permission } from '~/lib/models/Roles'

export const usePermissionManager = () => {
  const service = useRoleApi()

  const allPermissions = ref<Permission[]>([])
  const roleList       = ref<RoleResponse[]>([])
  const isLoading      = ref(false)
  const searchQuery    = ref('')
  const categoryFilter = ref('')

  // ─── Fetch ────────────────────────────────────────────────
  const init = async () => {
    isLoading.value = true
    try {
      const [permsRes, rolesRes] = await Promise.all([
        service.getPermissions(),
        service.getRoles(),
      ])
      allPermissions.value = permsRes.data
      roleList.value       = rolesRes.data
    } finally {
      isLoading.value = false
    }
  }

  // ─── Derived ─────────────────────────────────────────────
  const categories = computed<string[]>(() =>
    Array.from(new Set(allPermissions.value.map(p => p.category))).sort()
  )

  const filteredGroups = computed(() => {
    const q   = searchQuery.value.toLowerCase()
    const cat = categoryFilter.value

    return categories.value
      .filter(c => !cat || c === cat)
      .map(c => ({
        category: c,
        permissions: allPermissions.value.filter(p => {
          if (p.category !== c) return false
          if (!q) return true
          return p.name.toLowerCase().includes(q) || p.slug.toLowerCase().includes(q)
        }),
      }))
      .filter(g => g.permissions.length > 0)
  })

  function rolesWithPerm(permId: string) {
    return roleList.value.filter(r => r.permissions?.some(p => p.id === permId))
  }

  return {
    allPermissions,
    roleList,
    isLoading,
    searchQuery,
    categoryFilter,
    categories,
    filteredGroups,
    rolesWithPerm,
    init,
  }
}
