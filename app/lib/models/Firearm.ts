import type { ArmoryLocationResponse } from './ArmoryLocation'
import type { UserResponse } from './User'
import type { EnumResponse, PaginatedResponse } from './util'

export interface GetFirearmsParams {
  page?:                number
  size?:                number
  armory_location_id?:  string
  availability?:        string
  condition?:           string
  search?:              string
}

export interface FirearmCreate {
  barcode: number
  type: string
  model: string
  weapon_no: string
  car_no: string
  estimated_cost: string
  condition: string
  availability: string
  is_locked: boolean
  image_url: string | null
  armory_location_id: string | null
}

export type FirearmUpdate = Partial<FirearmCreate>

export interface FirearmResponse {
  id: string
  barcode: number
  type: EnumResponse
  model: string
  weapon_no: string
  car_no: string
  estimated_cost: string
  condition: string
  availability: string
  is_locked: boolean
  image_url: string | null
  armory_location_id: string | null
  armory_location: ArmoryLocationResponse | null
  maintenance_records: any[]
  inspection_records: any[]
  created_at: string
  updated_at: string
}

export interface FirearmListResponse extends PaginatedResponse<FirearmResponse> {}

export interface FirearmApprovalCreate {
  barcode: number
  type: string
  model: string
  weapon_no: string
  car_no: string
  estimated_cost: string
  condition: string
  availability: string
  image_url: string | null
  armory_location_id: string | null
}

export interface FirearmApprovalUpdate {
  status: string
  rejection_reason?: string | null
}

export interface FirearmApprovalResponse {
  id: string
  barcode: number
  type: EnumResponse
  model: string
  weapon_no: string
  car_no: string
  estimated_cost: string
  condition: EnumResponse
  availability: EnumResponse
  image_url: string | null
  armory_location_id: string | null
  armory_location: ArmoryLocationResponse | null
  submitted_at: string
  status: EnumResponse
  rejection_reason: string | null
  reviewed_by: string | null
  reviewed_at: string | null
  submitted_by_user: UserResponse | null
  reviewed_by_user: UserResponse | null
  created_at: string
  updated_at: string
}

export interface FirearmApprovalListResponse extends PaginatedResponse<FirearmApprovalResponse> {}
