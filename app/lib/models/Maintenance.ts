import type { AssetType } from './Firearm'
import type { PaginatedResponse } from './util'

export enum MaintenanceType {
  ROUTINE       = 'routine',
  CORRECTIVE    = 'corrective',
  PREVENTIVE    = 'preventive',
  EMERGENCY     = 'emergency',
  CLEANING      = 'cleaning',
  PARTS_REPLACE = 'parts_replace',
}

export enum MaintenanceStatus {
  SCHEDULED   = 'scheduled',
  IN_PROGRESS = 'in_progress',
  COMPLETED   = 'completed',
  CANCELLED   = 'cancelled',
  OVERDUE     = 'overdue',
}

export interface MaintenanceCreate {
  asset_id: string
  asset_type: AssetType
  type: MaintenanceType
  scheduled_date: string
  description: string | null
  performed_by: string | null
  authorized_by: string | null
  cost: string
  notes: string | null
}

export interface MaintenanceUpdate {
  status?: MaintenanceStatus
  started_date?: string | null
  completed_date?: string | null
  next_maintenance_date?: string | null
  performed_by?: string | null
  authorized_by?: string | null
  authorized_by_comment?: string | null
  cost?: string
  description?: string | null
  parts_replaced?: string | null
  notes?: string | null
}

export interface MaintenanceResponse {
  id: string
  asset_id: string
  asset_type: AssetType
  type: MaintenanceType
  status: MaintenanceStatus
  scheduled_date: string
  started_date: string | null
  completed_date: string | null
  next_maintenance_date: string | null
  description: string | null
  performed_by: string | null
  authorized_by: string | null
  authorized_by_comment: string | null
  cost: string
  parts_replaced: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

export interface MaintenanceListResponse extends PaginatedResponse<MaintenanceResponse> {}
