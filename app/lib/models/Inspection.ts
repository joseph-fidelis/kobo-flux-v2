import type { AssetType } from './Firearm'
import type { PaginatedResponse } from './util'

export enum InspectionType {
  ROUTINE          = 'routine',
  PRE_DEPLOYMENT   = 'pre_deployment',
  POST_DEPLOYMENT  = 'post_deployment',
  RANDOM           = 'random',
  ANNUAL           = 'annual',
}

export enum InspectionResult {
  PASSED       = 'passed',
  FAILED       = 'failed',
  NEEDS_REPAIR = 'needs_repair',
  CONDEMNED    = 'condemned',
}

export interface InspectionCreate {
  asset_id: string
  asset_type: AssetType
  type: InspectionType
  inspection_date: string
  next_inspection_date: string | null
  inspected_by: string | null
  authorized_by: string | null
  findings: string | null
  recommendations: string | null
  notes: string | null
}

export interface InspectionUpdate {
  result?: InspectionResult | null
  is_approved?: boolean
  next_inspection_date?: string | null
  authorized_by?: string | null
  authorized_by_comment?: string | null
  findings?: string | null
  recommendations?: string | null
  notes?: string | null
}

export interface InspectionResponse {
  id: string
  asset_id: string
  asset_type: AssetType
  type: InspectionType
  inspection_date: string
  next_inspection_date: string | null
  inspected_by: string | null
  authorized_by: string | null
  authorized_by_comment: string | null
  result: InspectionResult | null
  is_approved: boolean
  findings: string | null
  recommendations: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

export interface InspectionListResponse extends PaginatedResponse<InspectionResponse> {}
