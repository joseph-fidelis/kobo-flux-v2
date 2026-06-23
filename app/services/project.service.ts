import { useApi } from "~/composables/util/useApi"
import type { KoboPaginatedResponse } from "~/lib/models/SurveyData"
import type {
  Asset,
  AssetCounts,
  AssetListParams,
  AssetRetrieveParams,
  AssetsHash,
  AssetsMetadata,
  AssetVersion,
  BulkAssetActionPayload,
  CreateAssetPayload,
  CreateDeploymentPayload,
  CreateImportPayload,
  CreateProjectInvitePayload,
  Deployment,
  ImportTask,
  MinimalAsset,
  MinimalAssetListParams,
  ProjectInvite,
  ProjectInviteListParams,
  ProjectOwnershipTransfer,
  Tag,
  UpdateAssetContentPayload,
  UpdateAssetDataSharingPayload,
  UpdateDeploymentPayload,
  UpdateProjectInvitePayload,
} from "~/lib/models/ProjectsLibrary"
import type { KoboListParams } from "~/lib/models/SurveyData"

const ASSET_BASE = "/api/v2/assets"
const IMPORT_BASE = "/api/v2/imports"
const OWNERSHIP_BASE = "/api/v2/project-ownership"
const TAG_BASE = "/api/v2/tags"

/**
 * Service layer for KoboToolbox API v2 "Manage projects and library
 * content" endpoints: assets (projects/templates/library items),
 * deployment lifecycle, version history, bulk asset actions, imports,
 * project-ownership transfer invites, and tags.
 */
export const useProjectsLibraryApi = () => {
  const api = useApi()

  return {
    // -----------------------------------------------------------------
    // Assets — list / CRUD
    // -----------------------------------------------------------------

    getAssets: (params: AssetListParams = {}) =>
      api.get<KoboPaginatedResponse<Asset>>(`${ASSET_BASE}/`, {
        params: {
          ...(params.limit !== undefined && { limit: params.limit }),
          ...(params.start !== undefined && { start: params.start }),
          ...(params.offset !== undefined && { offset: params.offset }),
          ...(params.q?.trim() && { q: params.q }),
          ...(params.ordering?.trim() && { ordering: params.ordering }),
          ...(params.current_user_permissions_only !== undefined && {
            current_user_permissions_only: params.current_user_permissions_only,
          }),
        },
      }),

    /**
     * Send exactly one variant of CreateAssetPayload — either
     * `{ name, clone_from, asset_type }` to clone an existing asset, or
     * `{ name, asset_type, settings }` to create a fresh one.
     */
    createAsset: (payload: CreateAssetPayload) =>
      api.post<Asset>(`${ASSET_BASE}/`, payload),

    getAsset: (assetUid: string, params: AssetRetrieveParams = {}) =>
      api.get<Asset>(`${ASSET_BASE}/${assetUid}/`, {
        params: {
          ...(params.format && { format: params.format }),
        },
      }),

    /**
     * Send exactly one variant: UpdateAssetContentPayload to edit the
     * form's content/name, or UpdateAssetDataSharingPayload to toggle
     * data-sharing (`enabled` + `fields`). These are different operations
     * that share this route — do not mix fields from both shapes.
     */
    updateAsset: (assetUid: string, payload: UpdateAssetContentPayload | UpdateAssetDataSharingPayload) =>
      api.patch<Asset>(`${ASSET_BASE}/${assetUid}/`, payload),

    deleteAsset: (assetUid: string) =>
      api.delete<{ message: string }>(`${ASSET_BASE}/${assetUid}/`),

    /** Per-question/per-field submission counts for this asset. */
    getAssetCounts: (assetUid: string, params: KoboListParams = {}) =>
      api.get<KoboPaginatedResponse<AssetCounts>>(`${ASSET_BASE}/${assetUid}/counts/`, {
        params: {
          ...(params.limit !== undefined && { limit: params.limit }),
          ...(params.start !== undefined && { start: params.start }),
          ...(params.offset !== undefined && { offset: params.offset }),
        },
      }),

    // -----------------------------------------------------------------
    // Deployment (publish/unpublish, re-deploy a new version)
    // -----------------------------------------------------------------

    getDeployment: (assetUid: string) =>
      api.get<Deployment>(`${ASSET_BASE}/${assetUid}/deployment/`),

    /** First-time deploy. Use updateDeployment to redeploy/toggle active state. */
    createDeployment: (assetUid: string, payload: CreateDeploymentPayload) =>
      api.post<Deployment>(`${ASSET_BASE}/${assetUid}/deployment/`, payload),

    updateDeployment: (assetUid: string, payload: UpdateDeploymentPayload) =>
      api.patch<Deployment>(`${ASSET_BASE}/${assetUid}/deployment/`, payload),

    // -----------------------------------------------------------------
    // Versions
    // -----------------------------------------------------------------

    getAssetVersions: (assetUid: string, params: KoboListParams = {}) =>
      api.get<KoboPaginatedResponse<AssetVersion>>(`${ASSET_BASE}/${assetUid}/versions/`, {
        params: {
          ...(params.limit !== undefined && { limit: params.limit }),
          ...(params.start !== undefined && { start: params.start }),
          ...(params.offset !== undefined && { offset: params.offset }),
        },
      }),

    getAssetVersion: (assetUid: string, versionUid: string) =>
      api.get<AssetVersion>(`${ASSET_BASE}/${assetUid}/versions/${versionUid}/`),

    // -----------------------------------------------------------------
    // Bulk asset actions (archive/unarchive/delete/undelete)
    // -----------------------------------------------------------------

    /**
     * Send exactly one variant: target specific `asset_uids`, or apply to
     * the current filtered set with an explicit `confirm: true`. The
     * confirm variant is destructive at scale — surface a confirmation
     * dialog before calling this with `confirm: true`.
     */
    bulkAssetAction: (payload: BulkAssetActionPayload) =>
      api.post<{ message: string }>(`${ASSET_BASE}/bulk/`, payload),

    // -----------------------------------------------------------------
    // Assets — misc top-level lookups
    // -----------------------------------------------------------------

    getAssetsCountsSummary: () =>
      api.get<AssetCounts>(`${ASSET_BASE}/counts/`),

    getAssetsHash: () =>
      api.get<AssetsHash>(`${ASSET_BASE}/hash/`),

    getAssetsMetadata: () =>
      api.get<AssetsMetadata>(`${ASSET_BASE}/metadata/`),

    getAssetsMinimalList: (params: MinimalAssetListParams = {}) =>
      api.get<KoboPaginatedResponse<MinimalAsset>>(`${ASSET_BASE}/minimal-list/`, {
        params: {
          ...(params.limit !== undefined && { limit: params.limit }),
          ...(params.start !== undefined && { start: params.start }),
          ...(params.q?.trim() && { q: params.q }),
        },
      }),

    // -----------------------------------------------------------------
    // Imports (XLSForm / external form import jobs)
    // -----------------------------------------------------------------

    getImports: (params: KoboListParams = {}) =>
      api.get<KoboPaginatedResponse<ImportTask>>(`${IMPORT_BASE}/`, {
        params: {
          ...(params.limit !== undefined && { limit: params.limit }),
          ...(params.start !== undefined && { start: params.start }),
          ...(params.offset !== undefined && { offset: params.offset }),
        },
      }),

    /**
     * multipart/form-data per the spec — pass a FormData instance built
     * at the call site if uploading a file alongside these fields, or the
     * plain payload if importing from a URL only.
     */
    createImport: (payload: CreateImportPayload | FormData) =>
      api.post<ImportTask>(`${IMPORT_BASE}/`, payload, {
        headers: { "Content-Type": "multipart/form-data" },
      }),

    getImport: (importUid: string) =>
      api.get<ImportTask>(`${IMPORT_BASE}/${importUid}/`),

    // -----------------------------------------------------------------
    // Project ownership transfer invites
    // -----------------------------------------------------------------

    getProjectInvites: (params: ProjectInviteListParams = {}) =>
      api.get<KoboPaginatedResponse<ProjectInvite>>(`${OWNERSHIP_BASE}/invites/`, {
        params: {
          ...(params.limit !== undefined && { limit: params.limit }),
          ...(params.start !== undefined && { start: params.start }),
          ...(params.offset !== undefined && { offset: params.offset }),
          ...(params.mode?.trim() && { mode: params.mode }),
        },
      }),

    createProjectInvite: (payload: CreateProjectInvitePayload) =>
      api.post<ProjectInvite>(`${OWNERSHIP_BASE}/invites/`, payload),

    getProjectInvite: (inviteUid: string) =>
      api.get<ProjectInvite>(`${OWNERSHIP_BASE}/invites/${inviteUid}/`),

    /** Accept/decline/cancel an ownership transfer invite by updating its status. */
    updateProjectInvite: (inviteUid: string, payload: UpdateProjectInvitePayload) =>
      api.patch<ProjectInvite>(`${OWNERSHIP_BASE}/invites/${inviteUid}/`, payload),

    deleteProjectInvite: (inviteUid: string) =>
      api.delete<{ message: string }>(`${OWNERSHIP_BASE}/invites/${inviteUid}/`),

    getProjectInviteTransfer: (inviteUid: string, transferUid: string) =>
      api.get<ProjectOwnershipTransfer>(
        `${OWNERSHIP_BASE}/invites/${inviteUid}/transfers/${transferUid}/`
      ),

    // -----------------------------------------------------------------
    // Tags
    // -----------------------------------------------------------------

    getTags: (params: KoboListParams = {}) =>
      api.get<KoboPaginatedResponse<Tag>>(`${TAG_BASE}/`, {
        params: {
          ...(params.limit !== undefined && { limit: params.limit }),
          ...(params.start !== undefined && { start: params.start }),
          ...(params.offset !== undefined && { offset: params.offset }),
        },
      }),

    getTag: (tagUid: string) => api.get<Tag>(`${TAG_BASE}/${tagUid}/`),
  }
}