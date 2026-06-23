// lib/models/FormContent.ts
// Types for KoboToolbox API v2 — "Form content" section: asset snapshots
// (ephemeral renderable form versions) and content-view endpoints.
// Source: api/v2/docs/ OpenAPI spec (api_v2, KoboToolbox Primary API).

import type { KoboListParams } from "./SurveyData"

// ---------------------------------------------------------------------------
// Asset snapshots
// ---------------------------------------------------------------------------

export interface SnapshotWarning {
  code: string
  message: string
}

export interface SnapshotDetails {
  status: string
  warnings: SnapshotWarning[]
}

/**
 * XLSForm-ish source payload used when building a snapshot from raw form
 * definition instead of cloning an existing asset.
 */
export interface SnapshotSource {
  schema?: string
  survey?: Array<{ name: string; type: string }>
  settings?: { form_title?: string }
  translated?: string[]
  translation?: string[]
}

/**
 * Create payload is a union (oneOf in the spec):
 *  - Variant A: snapshot an existing asset by URI.
 *  - Variant B: build a snapshot directly from a raw form `source` definition.
 * Exactly one shape applies per request — do not send both `asset` and `source`.
 */
export type CreateAssetSnapshotPayload =
  | {
      asset: string // URI, e.g. https://kf.kobotoolbox.org/api/v2/assets/{uid}/
      details: SnapshotDetails
    }
  | {
      source: SnapshotSource
      details: SnapshotDetails
    }

export interface AssetSnapshot {
  url: string
  uid: string
  owner: string // URI
  date_created: string
  xml: string // URI
  enketopreviewlink: string // URI
  asset: string // URI
  asset_version_id: string
  details: SnapshotDetails
  source: SnapshotSource
}

export interface AssetSnapshotRetrieveParams {
  format?: string
}

// ---------------------------------------------------------------------------
// Asset content views (read-only renderings of the same underlying form)
// ---------------------------------------------------------------------------

/**
 * Raw XLSForm-style content (survey/choices/settings as edited in the
 * form builder). Loosely typed — narrow further if you maintain a strict
 * XLSForm schema elsewhere.
 */
export interface AssetContent {
  survey?: Array<Record<string, unknown>>
  choices?: Array<Record<string, unknown>>
  settings?: Record<string, unknown>
  schema?: string
  translated?: string[]
  translations?: (string | null)[]
}

export type AssetTableView = Record<string, unknown>
export type AssetValidContent = AssetContent