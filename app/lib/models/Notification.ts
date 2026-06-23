import type { PaginatedResponse } from './util'

export enum NotificationType {
  HANDOVER_REQUEST   = 'handover_request',
  HANDOVER_CONFIRMED = 'handover_confirmed',
  HANDOVER_RETURNED  = 'handover_returned',
  ALLOCATION_MADE    = 'allocation_made',
  ALLOCATION_RETURNED = 'allocation_returned',
  AMMO_REQUEST       = 'ammo_request',
  AMMO_APPROVED      = 'ammo_approved',
  AMMO_FULFILLED     = 'ammo_fulfilled',
  USER_CREATED       = 'user_created',
  SYSTEM             = 'system',
}

export interface NotificationResponse {
  id: string
  user_id: string
  title: string
  body: string
  type: NotificationType
  data: Record<string, unknown> | null
  is_read: boolean
  read_at: string | null
  created_at: string
  updated_at: string
}

export interface NotificationListResponse extends PaginatedResponse<NotificationResponse> {}

export interface UnreadCountResponse {
  count: number
}
