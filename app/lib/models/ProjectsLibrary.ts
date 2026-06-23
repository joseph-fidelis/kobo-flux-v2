// lib/models/ProjectsLibrary.ts
// Types for KoboToolbox API v2 — "Manage projects and library content"
// section: assets (projects/forms/templates/blocks/questions), deployment,
// versions, bulk asset actions, imports, project-ownership transfers, tags.
// Source: api/v2/docs/ OpenAPI spec (api_v2, KoboToolbox Primary API).

import type { KoboListParams } from "./SurveyData"

// ---------------------------------------------------------------------------
// Assets (core resource — projects, templates, library blocks/questions)
// ---------------------------------------------------------------------------

export type AssetType = "survey" | "template" | "block" | "question" | "collection"

export type AssetDeploymentStatus = "draft" | "deployed" | "archived"

export interface AssetListParams extends KoboListParams {
  /** Search query (Kobo's asset search DSL, e.g. asset_type:survey). */
  q?: string
  ordering?: string
  /**
   * When true, only return the requesting user's own permission
   * assignments. Defaults to false (return all visible assignments).
   */
  current_user_permissions_only?: boolean
}

/**
 * Create payload is a union (oneOf in the spec):
 *  - Variant A: clone an existing asset (template/library item) by uid.
 *  - Variant B: create a brand-new asset with full settings.
 * Exactly one shape applies per request.
 */
export type CreateAssetPayload =
  | {
      name: string
      clone_from: string // source asset uid
      asset_type: AssetType
    }
  | {
      name: string
      asset_type: AssetType
      settings: {
        description?: string
        sector?: string
        country?: string
        "share-metadata"?: boolean
      }
    }

/**
 * Update payload is a union (oneOf in the spec) covering two genuinely
 * different operations that happen to share the PATCH /assets/{uid}/ route:
 *  - Variant A: update form content/name (the common case).
 *  - Variant B: toggle data-sharing settings (`enabled` + `fields`). This
 *    is almost certainly a distinct sub-resource the spec generator folded
 *    into the same schema name — kept separate below as
 *    UpdateAssetDataSharingPayload so callers aren't misled into thinking
 *    `enabled`/`fields` apply to a normal content update.
 */
export interface UpdateAssetContentPayload {
  content: string
  name: string
}

export interface UpdateAssetDataSharingPayload {
  enabled: boolean
  fields: string[]
}

export type UpdateAssetPayload = UpdateAssetContentPayload | UpdateAssetDataSharingPayload

export interface Asset {
  uid: string
  url: string
  name: string
  asset_type: AssetType
  date_created: string
  date_modified: string
  owner: string // URI
  content?: Record<string, unknown>
  settings?: Record<string, unknown>
  deployment__active?: boolean
  deployment__identifier?: string
  deployment__submission_count?: number
  deployment_status?: AssetDeploymentStatus
  has_deployment?: boolean
  version_id?: string
  tag_string?: string
  permissions?: Array<Record<string, unknown>>
  [key: string]: unknown // Kobo's asset payload has many more optional fields than worth enumerating
}

export interface AssetRetrieveParams {
  format?: string
}

// ---------------------------------------------------------------------------
// Deployment (publishing an asset as a live, submittable form)
// ---------------------------------------------------------------------------

export interface CreateDeploymentPayload {
  active: boolean
}

export interface UpdateDeploymentPayload {
  active?: boolean
  /** Pin the deployment to a specific asset version. */
  version_id?: string
}

export interface Deployment {
  backend?: string
  identifier?: string
  active: boolean
  version_id: string
  date_modified?: string
}

// ---------------------------------------------------------------------------
// Versions (immutable snapshots of an asset's content over time)
// ---------------------------------------------------------------------------

export interface AssetVersion {
  uid: string
  url: string
  content_hash?: string
  date_deployed?: string | null
  date_modified: string
  deployed?: boolean
}

// ---------------------------------------------------------------------------
// Bulk asset actions
// ---------------------------------------------------------------------------

export type BulkAssetAction = "archive" | "unarchive" | "delete" | "undelete"

/**
 * Bulk payload is a union (oneOf in the spec):
 *  - Variant A: target a specific set of asset UIDs.
 *  - Variant B: apply to all assets matching the current filter, gated by
 *    an explicit `confirm: true` (destructive bulk operations).
 *
 * NOTE: the spec literally types `asset_uids` as `array of object`, which
 * doesn't match how Kobo bulk actions are actually invoked (UID strings).
 * Typed as `string[]` here as the intentional, correct shape — flagging
 * the deviation from the raw spec rather than propagating what looks like
 * a schema-generation artifact.
 */
export type BulkAssetActionPayload =
  | {
      action: BulkAssetAction
      asset_uids: string[]
    }
  | {
      action: BulkAssetAction
      confirm: true
    }

// ---------------------------------------------------------------------------
// Assets — misc top-level endpoints
// ---------------------------------------------------------------------------

export interface AssetCounts {
  [assetType: string]: number
}

export interface AssetsHash {
  hash: string
}

export interface AssetsMetadata {
  languages?: string[]
  countries?: Array<{ value: string; label: string }>
  sectors?: Array<{ value: string; label: string }>
  organizations?: string[]
  [key: string]: unknown
}

export interface MinimalAssetListParams {
  limit?: number
  start?: number
  q?: string
}

export interface MinimalAsset {
  uid: string
  name: string
  asset_type: AssetType
}

// ---------------------------------------------------------------------------
// Imports (XLSForm / external project import jobs)
// ---------------------------------------------------------------------------

export interface CreateImportPayload {
  /** URI of the target asset (or library collection) to import into. */
  destination: string
  /** URI of the source file/form to import from. */
  url: string
  name: string
  assetUid: string
}

export type ImportStatus = "created" | "processing" | "complete" | "error"

export interface ImportTask {
  uid: string
  url: string
  status: ImportStatus
  messages?: Record<string, unknown>
  date_created: string
}

// ---------------------------------------------------------------------------
// Project ownership transfers (invite-based asset ownership handoff)
// ---------------------------------------------------------------------------

export type InviteStatus = "pending" | "accepted" | "declined" | "cancelled" | "failed" | "in_progress" | "complete"

export interface ProjectInviteListParams extends KoboListParams {
  /** Filters by invite direction/role, e.g. 'sent' | 'received'. */
  mode?: string
}

export interface CreateProjectInvitePayload {
  recipient: string // URI of the recipient user
  assets: string[] // asset URIs to transfer
}

export interface UpdateProjectInvitePayload {
  status: InviteStatus
}

export interface ProjectInvite {
  uid: string
  url: string
  sender: string // URI
  recipient: string // URI
  status: InviteStatus
  date_created: string
  date_modified?: string
  assets?: string[]
}

export interface ProjectOwnershipTransfer {
  uid: string
  status: ImportStatus
  asset: string // URI
  date_created: string
  date_modified?: string
}

// ---------------------------------------------------------------------------
// Tags
// ---------------------------------------------------------------------------

export interface Tag {
  uid: string
  name: string
  url: string
  parent?: string | null
}