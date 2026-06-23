import type { PaginatedResponse } from './util'

export enum IncidentCategory {
  ACCIDENTAL_DISCHARGE    = 'accidental_discharge',
  FIREARM_LOST            = 'firearm_lost',
  FIREARM_STOLEN          = 'firearm_stolen',
  FIREARM_DAMAGED         = 'firearm_damaged',
  AMMUNITION_LOST         = 'ammunition_lost',
  OFFICER_INJURED         = 'officer_injured',
  OFFICER_ASSAULTED       = 'officer_assaulted',
  UNAUTHORIZED_ACCESS     = 'unauthorized_access',
  THEFT                   = 'theft',
  ROBBERY                 = 'robbery',
  VANDALISM               = 'vandalism',
  WARNING_SHOT_FIRED      = 'warning_shot_fired',
  SHOT_FIRED_AT_SUSPECT   = 'shot_fired_at_suspect',
  VEHICLE_ACCIDENT        = 'vehicle_accident',
  OTHER                   = 'other',
}

export enum IncidentSeverity {
  LOW      = 'low',
  MEDIUM   = 'medium',
  HIGH     = 'high',
  CRITICAL = 'critical',
}

export enum IncidentStatus {
  SUBMITTED     = 'submitted',
  UNDER_REVIEW  = 'under_review',
  ESCALATED     = 'escalated',
  RESOLVED      = 'resolved',
  DISMISSED     = 'dismissed',
}

export interface IncidentReportCreate {
  reference_no: string
  reported_by: string
  roster_id: string | null
  category: IncidentCategory
  severity: IncidentSeverity
  incident_date: string
  location_description: string
  description: string
  immediate_action_taken: string | null
  police_notified: boolean
  police_report_no: string | null
  evidence_urls: string | null
}

export interface IncidentReportUpdate {
  category?: IncidentCategory
  severity?: IncidentSeverity
  status?: IncidentStatus
  incident_date?: string
  location_description?: string
  description?: string
  immediate_action_taken?: string | null
  police_notified?: boolean
  police_report_no?: string | null
  evidence_urls?: string | null
  reviewed_by?: string | null
  reviewed_at?: string | null
  review_notes?: string | null
  resolved_at?: string | null
}

export interface IncidentReportResponse {
  id: string
  reference_no: string
  reported_by: string
  roster_id: string | null
  category: IncidentCategory
  severity: IncidentSeverity
  status: IncidentStatus
  incident_date: string
  location_description: string
  description: string
  immediate_action_taken: string | null
  police_notified: boolean
  police_report_no: string | null
  evidence_urls: string | null
  reviewed_by: string | null
  reviewed_at: string | null
  review_notes: string | null
  resolved_at: string | null
  created_at: string
  updated_at: string
}

export interface IncidentReportListResponse extends PaginatedResponse<IncidentReportResponse> {}
