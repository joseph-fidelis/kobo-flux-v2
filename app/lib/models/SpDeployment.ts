import type { PaginatedResponse } from './util'

export enum RosterStatus {
  DRAFT     = 'draft',
  ACTIVE    = 'active',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum DeploymentStatus {
  ASSIGNED = 'assigned',
  DEPLOYED = 'deployed',
  RETURNED = 'returned',
  ABSENT   = 'absent',
}

export enum HandoverStatus {
  PENDING   = 'pending',
  PARTIAL   = 'partial',
  COMPLETED = 'completed',
}

export enum FirearmReturnCondition {
  EXCELLENT = 'excellent',
  GOOD      = 'good',
  FAIR      = 'fair',
  DAMAGED   = 'damaged',
  LOST      = 'lost',
}

// --- Rosters ---

export interface RosterCreate {
  title: string
  description: string | null
  deployment_location_id: string
  deployment_date: string
  expected_return_date: string | null
  created_by: string | null
  authorized_by: string | null
  notes: string | null
}

export interface RosterUpdate {
  title?: string
  description?: string | null
  status?: RosterStatus
  actual_return_date?: string | null
  authorized_by?: string | null
  notes?: string | null
}

export interface RosterResponse {
  id: string
  title: string
  description: string | null
  deployment_location_id: string
  deployment_date: string
  expected_return_date: string | null
  actual_return_date: string | null
  status: RosterStatus
  created_by: string | null
  authorized_by: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

export interface RosterListResponse extends PaginatedResponse<RosterResponse> {}

// --- SP Assignments ---

export interface SPAssignmentCreate {
  roster_id: string
  sp_id: string
  notes: string | null
}

export interface SPAssignmentUpdate {
  status?: DeploymentStatus
  deployed_at?: string | null
  returned_at?: string | null
  notes?: string | null
}

export interface SPAssignmentResponse {
  id: string
  roster_id: string
  sp_id: string
  status: DeploymentStatus
  deployed_at: string | null
  returned_at: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

export interface SPAssignmentListResponse extends PaginatedResponse<SPAssignmentResponse> {}

// --- Firearm Issue / Handover ---

export interface FirearmIssueCreate {
  sp_assignment_id: string
  firearm_id: string
  issued_by: string | null
  issued_at: string
  firearm_condition_on_issue: FirearmReturnCondition
  notes: string | null
}

export interface FirearmIssueResponse {
  id: string
  sp_assignment_id: string
  firearm_id: string
  issued_by: string | null
  issued_at: string
  firearm_condition_on_issue: FirearmReturnCondition
  notes: string | null
  created_at: string
  updated_at: string
}

export interface FirearmHandoverCreate {
  firearm_issue_id: string
  returned_by_sp_id: string | null
  received_by: string | null
  returned_at: string
  return_condition: FirearmReturnCondition
  status: HandoverStatus
  damage_description: string | null
  notes: string | null
}

export interface FirearmHandoverResponse {
  id: string
  firearm_issue_id: string
  returned_by_sp_id: string | null
  received_by: string | null
  returned_at: string
  return_condition: FirearmReturnCondition
  status: HandoverStatus
  damage_description: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

// --- Ammunition Issue / Handover ---

export interface AmmunitionIssueCreate {
  sp_assignment_id: string
  ammunition_id: string
  quantity_issued: number
  issued_by: string | null
  issued_at: string
  notes: string | null
}

export interface AmmunitionIssueResponse {
  id: string
  sp_assignment_id: string
  ammunition_id: string
  quantity_issued: number
  issued_by: string | null
  issued_at: string
  notes: string | null
  created_at: string
  updated_at: string
}

export interface AmmunitionHandoverCreate {
  ammunition_issue_id: string
  returned_by_sp_id: string | null
  received_by: string | null
  quantity_issued: number
  quantity_returned: number
  quantity_used: number
  returned_at: string
  status: HandoverStatus
  notes: string | null
}

export interface AmmunitionHandoverResponse {
  id: string
  ammunition_issue_id: string
  returned_by_sp_id: string | null
  received_by: string | null
  quantity_issued: number
  quantity_returned: number
  quantity_used: number
  returned_at: string
  status: HandoverStatus
  notes: string | null
  quantity_discrepancy: number
  created_at: string
  updated_at: string
}
