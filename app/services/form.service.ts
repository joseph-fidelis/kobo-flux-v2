import { useApi } from "~/composables/util/useApi"
import type { KoboListParams, KoboPaginatedResponse } from "~/lib/models/SurveyData"
import type {
  AssetContent,
  AssetSnapshot,
  AssetSnapshotRetrieveParams,
  AssetTableView,
  AssetValidContent,
  CreateAssetSnapshotPayload,
} from "~/lib/models/FormContent"

const SNAPSHOT_BASE = "/api/v2/asset_snapshots"
const ASSET_BASE = "/api/v2/assets"

/**
 * Service layer for KoboToolbox API v2 "Form content" endpoints:
 * asset snapshots (ephemeral renderable form versions used for previews
 * and Enketo rendering) and per-asset content views (XLSForm survey/
 * choices/settings, table view, valid content, raw XForm XML).
 */
export const useFormContentApi = () => {
  const api = useApi()

  return {
    // -----------------------------------------------------------------
    // Asset snapshots
    // -----------------------------------------------------------------

    getAssetSnapshots: (params: KoboListParams = {}) =>
      api.get<KoboPaginatedResponse<AssetSnapshot>>(`${SNAPSHOT_BASE}/`, {
        params: {
          ...(params.limit !== undefined && { limit: params.limit }),
          ...(params.start !== undefined && { start: params.start }),
          ...(params.offset !== undefined && { offset: params.offset }),
        },
      }),

    /**
     * Send exactly one variant of CreateAssetSnapshotPayload — either
     * `{ asset, details }` to snapshot an existing asset, or
     * `{ source, details }` to build from a raw form definition.
     */
    createAssetSnapshot: (payload: CreateAssetSnapshotPayload) =>
      api.post<AssetSnapshot>(`${SNAPSHOT_BASE}/`, payload),

    getAssetSnapshot: (snapshotUid: string, params: AssetSnapshotRetrieveParams = {}) =>
      api.get<AssetSnapshot>(`${SNAPSHOT_BASE}/${snapshotUid}/`, {
        params: {
          ...(params.format && { format: params.format }),
        },
      }),

    deleteAssetSnapshot: (snapshotUid: string) =>
      api.delete<{ message: string }>(`${SNAPSHOT_BASE}/${snapshotUid}/`),

    /** Enketo preview URL/HTML for this snapshot. */
    getAssetSnapshotPreview: (snapshotUid: string) =>
      api.get<string>(`${SNAPSHOT_BASE}/${snapshotUid}/preview/`),

    /** Raw compiled XForm XML for this snapshot. */
    getAssetSnapshotXform: (snapshotUid: string) =>
      api.get<string>(`${SNAPSHOT_BASE}/${snapshotUid}/xform/`, {
        headers: { Accept: "*/*" },
        responseType: "text",
      }),

    /** XForm XML with a disclaimer banner injected (used for shared/public previews). */
    getAssetSnapshotXmlWithDisclaimer: (snapshotUid: string) =>
      api.get<string>(`${SNAPSHOT_BASE}/${snapshotUid}/xml_with_disclaimer/`),

    // -----------------------------------------------------------------
    // Per-asset content views
    // -----------------------------------------------------------------

    /** Current XLSForm-style content (survey/choices/settings) for the asset. */
    getAssetContent: (assetUid: string) =>
      api.get<AssetContent>(`${ASSET_BASE}/${assetUid}/content/`),

    /** Spreadsheet/table rendering of the asset's question structure. */
    getAssetTableView: (assetUid: string) =>
      api.get<AssetTableView>(`${ASSET_BASE}/${assetUid}/table_view/`),

    /** Content with invalid/orphaned rows stripped — what actually deploys. */
    getAssetValidContent: (assetUid: string) =>
      api.get<AssetValidContent>(`${ASSET_BASE}/${assetUid}/valid_content/`),

    /** Raw compiled XForm XML for the asset's current deployed version. */
    getAssetXform: (assetUid: string) =>
      api.get<string>(`${ASSET_BASE}/${assetUid}/xform/`, {
        headers: { Accept: "*/*" },
        responseType: "text",
      }),

    /** XLSForm as an Excel (.xlsx) file download. */
    getAssetXls: (assetUid: string) =>
      api.get<Blob>(`${ASSET_BASE}/${assetUid}/xls/`, {
        headers: { Accept: "*/*" },
        responseType: "blob",
      }),
  }
}