import { ref, computed, watch } from 'vue'
import { toast } from 'vue-sonner'
import { useUserApi } from '~/services/user.service'
import { useDebounce } from '~/composables/util/debounce'
import { type UserCreate, type UserResponse, type UpdateUser, type UserPaginatedResponse, UserStatus } from '~/lib/models/User'

export const useUser = () => {
  const service = useUserApi()

  const _data       = ref<UserPaginatedResponse | null>(null)
  const isLoading   = ref(false)
  const error       = ref<string | null>(null)
  const searchQuery  = ref('')
  const statusFilter = ref<UserStatus>(UserStatus.ALL)
  const roleFilter   = ref('')
  const currentPage = ref(1)
  const pageSize    = ref(20)

  const currentUser      = ref<UserResponse | null>(null)
  const showModal        = ref(false)
  const showDeleteDialog = ref(false)

  const debouncedSearch = useDebounce(searchQuery, 400)

  const userList   = computed(() => _data.value?.items ?? [])
  const stats      = computed(() => _data.value?.stats ?? { active: 0, disabled: 0, suspended: 0, banned: 0, total: 0, by_role: [] })
  const total      = computed(() => _data.value?.total ?? 0)
  const totalPages = computed(() => _data.value?.pages ?? 1)

  const editingUser = computed<UpdateUser | null>(() =>
    currentUser.value ? {
      username:    currentUser.value.username,
      email:       currentUser.value.email,
      first_name:  currentUser.value.first_name,
      surname:     currentUser.value.surname,
      initial:     currentUser.value.initial,
      title:       currentUser.value.title,
      department:  currentUser.value.department,
      directorate: currentUser.value.directorate,
      phone_number: currentUser.value.phone_number,
  
      role_id:     currentUser.value.role_id,
      branch_id:   currentUser.value.branch_id,
    } : null
  )

  const fetchUsers = async (pg = currentPage.value, size = pageSize.value) => {
    try {
      isLoading.value = true
      error.value = null
      _data.value = await service.getUsers(pg, size, searchQuery.value, statusFilter.value, roleFilter.value || undefined)
      currentPage.value = pg
    } catch (err: any) {
      error.value = err?.message ?? 'Failed to load users'
      toast.error(error.value!)
    } finally {
      isLoading.value = false
    }
  }

  watch(debouncedSearch, () => fetchUsers(1))
  watch(statusFilter,    () => fetchUsers(1))
  watch(roleFilter,      () => fetchUsers(1))

  function openAdd() {
    currentUser.value = null
    showModal.value   = true
  }

  function openEdit(u: UserResponse) {
    currentUser.value = u
    showModal.value   = true
  }

  function promptDelete(u: UserResponse) {
    currentUser.value      = u
    showDeleteDialog.value = true
  }

  const createUser = async (payload: UpdateUser) => {
    try {
      isLoading.value = true
      const res = await service.createUser(payload)
      await fetchUsers()
      toast.success(res.message)
      return res.data
    } catch (err: any) {
      toast.error(err?.message ?? 'Failed to create user')
      return null
    } finally {
      isLoading.value = false
    }
  }

  const updateUser = async (payload: UpdateUser) => {
    if (!currentUser.value) return null
    try {
      isLoading.value = true
      const res = await service.updateUser(currentUser.value.id, payload)
      await fetchUsers()
      toast.success(res.message)
      return res.data
    } catch (err: any) {
      toast.error(err?.message ?? 'Failed to update user')
      return null
    } finally {
      isLoading.value = false
    }
  }

  const handleConfirm = async (payload: UpdateUser) => {
    if (currentUser.value) {
      await updateUser(payload)
    } else {
      await createUser(payload)
    }
    showModal.value   = false
    currentUser.value = null
  }

  const deleteUser = async () => {
    if (!currentUser.value) return false
    try {
      isLoading.value = true
      const name = `${currentUser.value.first_name} ${currentUser.value.surname}`
      await service.deleteUser(currentUser.value.username)
      await fetchUsers()
      toast.success(`User "${name}" deleted`)
      showDeleteDialog.value = false
      currentUser.value      = null
      return true
    } catch (err: any) {
      toast.error(err?.message ?? 'Failed to delete user')
      return false
    } finally {
      isLoading.value = false
    }
  }

  return {
    userList,
    stats,
    isLoading,
    error,
    searchQuery,
    statusFilter,
    roleFilter,
    total,
    totalPages,
    currentPage,
    pageSize,
    currentUser,
    editingUser,
    showModal,
    showDeleteDialog,
    fetchUsers,
    openAdd,
    openEdit,
    promptDelete,
    handleConfirm,
    deleteUser,
  }
}
