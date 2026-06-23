import type { BranchResponse } from './Branch'
import type { PaginatedResponse } from './util'

export interface ArmoryLocationCreate {
  name: string
  branch_id: string | null
}

export type ArmoryLocationUpdate = Partial<ArmoryLocationCreate>

export interface ArmoryLocationResponse {
  id: string
  name: string
  branch_id: string | null
  branch: BranchResponse | null
  created_at: string
  updated_at: string
}

export interface ArmoryLocationListResponse extends PaginatedResponse<ArmoryLocationResponse> {}
