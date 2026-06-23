import { ref, computed } from 'vue'
import { toast } from 'vue-sonner'
import { useRoleApi } from '~/services/role.service'
import { useDebounce } from '~/composables/util/debounce'
import type { RoleCreate, UpdateRole, RoleResponse } from '~/lib/models/Roles'
import { prependItemToList, removeItemFromList, updateItemInList } from '~/lib/helpers/lists'

export const useRole = () => {
  const service = useRoleApi()

  const roleList  = ref<RoleResponse[]>([])
  const isLoading = ref(false)
  const error     = ref<string | null>(null)
  const searchQuery = ref('')

  const currentRole      = ref<RoleResponse | null>(null)
  const showModal        = ref(false)
  const showDeleteDialog = ref(false)

  const debouncedSearch = useDebounce(searchQuery, 300)

watch(debouncedSearch, () => fetchRoles(searchQuery.value))

  const fetchRoles = async (query : string = '') => {
    try {
      isLoading.value = true
      error.value = null
      const res = await service.getRoles(query)
      roleList.value = res.data
    } catch (err: any) {
      error.value = err?.message ?? 'Failed to load roles'
      toast.error(error.value!)
    } finally {
      isLoading.value = false
    }
  }

  function openAdd() {
    currentRole.value = null
    showModal.value   = true
  }

  function openEdit(r: RoleResponse) {
    currentRole.value = r
    showModal.value   = true
  }

  function promptDelete(r: RoleResponse) {
    currentRole.value      = r
    showDeleteDialog.value = true
  }

  const createRole = async (payload: RoleCreate) => {
    try {
      isLoading.value = true
      const {message, data } = await service.createRole(payload)
      prependItemToList(roleList.value, data)
      toast.success(message)
    } catch (err: any) {
      toast.error(err?.message ?? 'Failed to create role')
    } finally {
      isLoading.value = false
    }
  }

  const updateRole = async (payload: UpdateRole) => {
    if (!currentRole.value) return 
    try {
      isLoading.value = true
      const {message, data} = await service.updateRole(currentRole.value.id, payload)
      updateItemInList(roleList.value, data)
      toast.success(message)
    } catch (err: any) {
      toast.error(err?.message ?? 'Failed to update role')
    } finally {
      isLoading.value = false
    }
  }

  const handleConfirm = async (payload: RoleCreate) => {
    if (currentRole.value) {
      await updateRole(payload)
    } else {
      await createRole(payload)
    }
    showModal.value   = false
    currentRole.value = null
  }

  const deleteRole = async () => {
    if (!currentRole.value) return false
    try {
      isLoading.value = true
      const name = currentRole.value.name
      await service.deleteRole(currentRole.value.id)
      // await fetchRoles()
      removeItemFromList(roleList.value, currentRole.value.id)
      toast.success(`Role "${name}" deleted`)
      showDeleteDialog.value = false
      currentRole.value      = null
    } catch (err: any) {
      toast.error(err?.message ?? 'Failed to delete role')
    } finally {
      isLoading.value = false
    }
  }

  return {
    roleList,
    isLoading,
    error,
    searchQuery,
    currentRole,
    showModal,
    showDeleteDialog,
    fetchRoles,
    openAdd,
    openEdit,
    promptDelete,
    handleConfirm,
    deleteRole,
  }
}
