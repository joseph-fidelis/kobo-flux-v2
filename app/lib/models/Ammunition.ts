import type { ArmoryLocationResponse } from './ArmoryLocation'
import type { EnumResponse, PaginatedResponse } from './util'

export enum AmmunitionUnit {
  ROUNDS    = 'rounds',
  BOXES     = 'boxes',
  MAGAZINES = 'magazines',
  BELTS     = 'belts',
  CANISTERS = 'canisters',
}


export interface AmmunitionTypeCreate {
  name: string
  description: string | null
  calibar: string | null
  compatible_firearm_type: string
  is_active: boolean
}

export type AmmunitionTypeUpdate = Partial<AmmunitionTypeCreate>

export interface AmmunitionTypeResponse {
  id: string
  name: string
  description: string | null
  calibar: string | null
  compatible_firearm_type: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface AmmunitionTypeListResponse extends PaginatedResponse<AmmunitionTypeResponse> {}

export interface AmmunitionCreate {
  ammunition_type_id: string
  quantity: number
  unit: AmmunitionUnit
  minimum_threshold: number
  // status: string
  estimated_cost_per_unit: string
  expiry_date: string | null
  batch_no: string | null
  notes: string | null
  armory_location_id: string
}

export type AmmunitionUpdate = Partial<AmmunitionCreate>

export interface AmmunitionResponse {
  id: string
  ammunition_type_id: string
  quantity: number
  unit: AmmunitionUnit
  minimum_threshold: number
  status: string
  estimated_cost_per_unit: string
  expiry_date: string | null
  batch_no: string | null
  notes: string | null
  armory_location_id: string
  ammunition_type: AmmunitionTypeResponse | null
  armory_location: ArmoryLocationResponse | null
  created_at: string
  updated_at: string
}

export interface AmmunitionListResponse extends PaginatedResponse<AmmunitionResponse> {}
