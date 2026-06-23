import { useApi } from "~/composables/util/useApi"
import type { RoleCreate, UpdateRole, RoleResponse, Permission } from "~/lib/models/Roles"
import type { ApiResponse } from "~/lib/models/util"

const BASE = "/api/v1/roles"

export const useRoleApi = () => {
  const api = useApi()
  return {
    getRoles: (search: string = '') =>
      api.get<ApiResponse<RoleResponse[]>>(`${BASE}/` , { params:{...(search?.trim() && { search }),}}),

    getPermissions: () =>
      api.get<ApiResponse<Permission[]>>(`${BASE}/permissions`),

    createRole: (payload: RoleCreate) =>
      api.post<ApiResponse<RoleResponse>>(`${BASE}/`, payload),

    updateRole: (id: string, payload: UpdateRole) =>
      api.patch<ApiResponse<RoleResponse>>(`${BASE}/${id}`, payload),

    deleteRole: (id: string) =>
      api.delete<{ message: string }>(`${BASE}/${id}`),

    assignPermissions: (id: string, permission_ids: string[]) =>
      api.put<ApiResponse<RoleResponse>>(`${BASE}/${id}/permissions`, { permission_ids }),
  }
}
