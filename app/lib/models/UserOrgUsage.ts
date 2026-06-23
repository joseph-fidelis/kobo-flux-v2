// lib/models/UserOrgUsage.ts
// Types for KoboToolbox API v2 — "User / team / organization / usage" section:
// current user profile (/me), users, organizations (members, invites, assets),
// project views (team dashboards), and service/asset usage tracking.
// Source: api/v2/docs/ OpenAPI spec (api_v2, KoboToolbox Primary API).

import type { KoboListParams } from "./SurveyData"

// ---------------------------------------------------------------------------
// Shared enums
// ---------------------------------------------------------------------------

export type InviteeRole = "admin" | "member"

export type MemberRole = "admin" | "member" | "owner"

export type OrganizationInviteStatus =
  | "accepted"
  | "cancelled"
  | "declined"
  | "expired"
  | "pending"
  | "resent"

export type OrganizationType =
  | "non-profit"
  | "government"
  | "educational"
  | "commercial"
  | "none"

export type AssetUsageDeploymentStatus = "archived" | "deployed" | "draft"

export type ProjectViewExportObjectType = "assets" | "users"

// ---------------------------------------------------------------------------
// Current user (/me)
// ---------------------------------------------------------------------------

export interface CurrentUserOrganization {
  url?: string
  name?: string
  uid?: string
}

export interface CurrentUserExtraDetails {
  bio?: string
  city?: string
  name?: string
  sector?: string
  country?: string
  twitter?: string
  linkedin?: string
  instagram?: string
  organization?: string
  last_ui_language?: string
  organization_type?: string
  organization_website?: string
  project_views_settings?: Record<string, unknown>
  require_auth?: boolean
  newsletter_subscription?: string
  [key: string]: unknown
}

export interface GitRevision {
  short?: string
  long?: string
  branch?: string
  tag?: string
}

export interface CurrentUser {
  username: string
  first_name: string
  last_name: string
  email: string
  server_time: string
  date_joined: string
  projects_url: string
  gravatar: string
  last_login: string
  extra_details: CurrentUserExtraDetails
  git_rev: GitRevision
  social_accounts: SocialAccount[]
  validated_password: boolean
  accepted_tos: boolean
  organization: CurrentUserOrganization
  extra_details__uid: string
  is_superuser?: boolean
}

export interface UpdateCurrentUserPayload {
  username?: string
  first_name?: string
  last_name?: string
  last_login?: string
  extra_details?: CurrentUserExtraDetails
  current_password?: string
  new_password?: string
}

export interface EmailAddress {
  email: string
  primary: boolean
  verified: boolean
}

export interface CreateEmailPayload {
  email: string
}

export interface SocialAccount {
  provider: string
  uid: string
  last_login?: string
  date_joined?: string
  email?: string
  username?: string
}

// ---------------------------------------------------------------------------
// Users (admin / superuser listing)
// ---------------------------------------------------------------------------

export interface UserMetadata {
  name?: string
  sector?: string
  country?: string
  organization?: string
  last_ui_language?: string
  organization_type?: string
  organization_website?: string
  project_views_settings?: Record<string, unknown>
  [key: string]: unknown
}

export interface UserListItem {
  id: number
  username: string
  is_superuser: boolean
  date_joined: string
  last_login: string
  is_active: boolean
  email: string
  asset_count: number
  metadata: UserMetadata
}

export interface UserProfile {
  url: string
  username: string
  date_joined: string
  public_collection_subscribers_count: number
  public_collections_count: number
}

// ---------------------------------------------------------------------------
// Organizations
// ---------------------------------------------------------------------------

export interface Organization {
  id: string
  url: string
  name: string
  website: string
  organization_type: OrganizationType
  created: string
  modified: string
  is_owner: boolean
  is_mmo: boolean
  request_user_role: MemberRole
  /** Hyperlink to the members sub-resource. */
  members: string
  /** Hyperlink to the assets sub-resource. */
  assets: string
  /** Hyperlink to the service_usage sub-resource. */
  service_usage: string
  /** Hyperlink to the asset_usage sub-resource. */
  asset_usage: string
}

export interface UpdateOrganizationPayload {
  name?: string
  website?: string
  organization_type?: OrganizationType
}

export interface OrganizationMember {
  role: MemberRole
  url: string
  user: string
  user__username: string
  user__email: string
  user__extra_details__name: string
  user__has_mfa_enabled: boolean
  date_joined: string
  user__is_active: boolean
  invite: OrganizationInvite | null
}

export interface UpdateOrganizationMemberPayload {
  role: InviteeRole
}

export interface OrganizationInvite {
  invitee_role: InviteeRole
  status: OrganizationInviteStatus
  url: string
  invited_by: string
  organization_name: string
  created: string
  modified: string
  invitee: string
}

export interface CreateOrganizationInvitePayload {
  role: InviteeRole
  invitees: string[]
}

/** POST /organizations/{uid}/invites/ returns one entry per invitee. */
export type CreateOrganizationInviteResponse = OrganizationInvite[]

/**
 * PATCH payload is a oneOf in the spec — either update status (accept/
 * decline/cancel) or change the invitee's role. Send exactly one shape.
 */
export type UpdateOrganizationInvitePayload =
  | { status: OrganizationInviteStatus }
  | { role: InviteeRole }

export interface OrganizationAssetListCount {
  deployed_count: number
  archived_count: number
  draft_count: number
}

export interface OrganizationAssetMinimal {
  uid: string
  name: string
  deployment_status: AssetUsageDeploymentStatus
}

export interface OrganizationAssetListParams extends KoboListParams {
  q?: string
}

export interface OrganizationAssetUsageListParams extends KoboListParams {
  ordering?: string
}

// ---------------------------------------------------------------------------
// Usage tracking
// ---------------------------------------------------------------------------

export interface NlpUsage {
  total_nlp_asr_seconds: number
  total_nlp_llm_requests: number
  total_nlp_mt_characters: number
}

export interface ServiceUsageBalanceData {
  effective_limit: number
  balance_value: number
  balance_percent: number
  exceeded: boolean
}

export interface ServiceUsageBalances {
  submission: ServiceUsageBalanceData | null
  storage_bytes: ServiceUsageBalanceData | null
  asr_seconds: ServiceUsageBalanceData | null
  mt_characters: ServiceUsageBalanceData | null
  llm_requests: ServiceUsageBalanceData | null
}

export interface TotalNlpUsage {
  asr_seconds_current_period: number
  llm_requests_current_period: number
  mt_characters_current_period: number
  asr_seconds_all_time: number
  llm_requests_all_time: number
  mt_characters_all_time: number
}

export interface TotalSubmissionCount {
  all_time: number
  current_period: number
}

export interface ServiceUsage {
  total_nlp_usage: TotalNlpUsage
  total_storage_bytes: number
  total_submission_count: TotalSubmissionCount
  balances: ServiceUsageBalances
  current_period_start: string
  current_period_end: string
  last_updated: string
}

export interface AssetUsage {
  asset: string
  asset__name: string
  nlp_usage_current_period: NlpUsage
  nlp_usage_all_time: NlpUsage
  storage_bytes: number
  submission_count_current_period: number
  submission_count_all_time: number
}

export interface OrganizationAssetUsage extends AssetUsage {
  deployment_status: AssetUsageDeploymentStatus
}

// ---------------------------------------------------------------------------
// Project views (team / org dashboards)
// ---------------------------------------------------------------------------

export interface ProjectView {
  uid: string
  name: string
  url: string
  assets: string
  assets_export: string
  users: string
  users_export: string
  countries: string[]
  permissions: string[]
  assigned_users: string[]
}

export interface ProjectViewUserMetadata {
  city?: string
  name?: string
  sector?: string
  country?: string
  organization?: string
  last_ui_language?: string
  organization_type?: string
  organization_website?: string
  project_view_settings?: Record<string, unknown>
  [key: string]: unknown
}

export interface ProjectViewUser {
  id: number
  username: string
  is_superuser: boolean
  date_joined: string
  last_login: string
  is_active: boolean
  email: string
  asset_count: number
  metadata: ProjectViewUserMetadata
}

export interface ProjectViewAssetSettings {
  sector?: { label?: string; value?: string }
  country?: Array<{ label?: string; value?: string }>
  description?: string
  collects_pii?: string
  organization?: string
  country_codes?: string[]
  operational_purpose?: string
  [key: string]: unknown
}

export interface ProjectViewAsset {
  url: string
  date_created: string
  date_modified: string
  date_deployed: string
  owner: string
  owner__username: string
  owner__email: string
  owner__name: string
  owner__organization: string
  uid: string
  name: string
  settings: ProjectViewAssetSettings
  languages: string[]
  has_deployment: boolean
  deployment__active: boolean
  deployment__submission_count: number
  deployment_status: string
  asset_type: string
  downloads: Array<Record<string, unknown>>
  owner_label: string
}

export interface ProjectViewExport {
  status: string
  result: string
}

export interface ProjectViewExportCreateResult {
  status: string
}

export interface ProjectViewAssetListParams extends KoboListParams {}

export interface ProjectViewUserListParams extends KoboListParams {}

export interface ProjectViewAssetMinimalListParams extends KoboListParams {
  q?: string
}
