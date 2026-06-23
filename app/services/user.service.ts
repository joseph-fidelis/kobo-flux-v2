import { useApi } from "~/composables/util/useApi"
import { UserStatus, type UpdateUser, type UserCreate, type UserPaginatedResponse, type UserResponse } from "~/lib/models/User"
import type { ApiResponse, PaginatedResponse } from "~/lib/models/util"

const BASE = "/api/v1/users/branch"

export const useUserApi = () => {
  const api = useApi()
  return {
    createUser: (payload: UpdateUser) =>
      api.post<ApiResponse<UserResponse>>(BASE + '/create-user', payload),

    getUsers: (page = 1, size = 20, search?: string, status: UserStatus =UserStatus.ALL, role_id?: string) =>
      api.get<UserPaginatedResponse>(`${BASE}/` , {
        params: {
          page,
          size,
          ...(search?.trim() && { search }),
          ...(status.trim() && { status }),
          ...(role_id?.trim() && { role_id }),
        }
      }),

    getUser: (id: string) =>
      api.get<ApiResponse<UserResponse>>(`${BASE}/${id}`),

    updateUser: (user_id: string, payload: UpdateUser) =>
      api.patch<ApiResponse<UserResponse>>(`${BASE}/${user_id}`, payload),

    deleteUser: (username: string) =>
      api.delete<{ message: string }>(`${BASE}/${username}`),
  }
}
