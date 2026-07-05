import { useApi } from "~/composables/util/useApi"
import type {
  Attachment,
  AttachmentListParams,
  AssetFile,
  AssetReport,
  BulkUpdateSubmissionsPayload,
  BulkDeleteSubmissionsPayload,
  BulkUpdateValidationStatusesPayload,
  CreateAdvancedFeaturePayload,
  CreateAssetFilePayload,
  CreateBulkActionPayload,
  CreateExportPayload,
  CreateExportSettingPayload,
  CreatePairedDataPayload,
  DuplicateSubmissionPayload,
  ExportListParams,
  ExportSetting,
  ExportSettingDataParams,
  ExportTask,
  KoboListParams,
  KoboPaginatedResponse,
  PairedData,
  SubmissionListParams,
  SubmissionRecord,
  SubmissionRetrieveParams,
  SupplementPayload,
  ThumbnailSuffix,
  UpdateAdvancedFeaturePayload,
  UpdateBulkActionPayload,
  UpdateExportSettingPayload,
  UpdatePairedDataPayload,
  UpdateValidationStatusPayload,
  ValidationStatus,
  KoboSubmissionPayload,
  KoboV1FormListItem,
  SubmissionUploadResponse,
} from "~/lib/models/SurveyData"

const BASE = "/api/v2/assets"
/** @deprecated v1 removed June 2026 — kept for optional id_string fallback only. */
const V1_FORMS = "/api/v1/forms.json"

function openRosaSubmissionPath(username: string) {
  return `/api/openrosa/${encodeURIComponent(username)}/submission`
}

/**
 * Service layer for KoboToolbox API v2 "Survey data" endpoints.
 *
 * All methods are scoped under a parent asset (`assetUid`), matching the
 * API's nesting: /api/v2/assets/{uid_asset}/...
 *
 * NOTE on two spec artifacts carried over deliberately:
 * 1. `data/bulk/` and `data/validation_statuses/` list `id` as a path param
 *    in the OpenAPI doc, but `id` does not appear in those URLs. That's a
 *    DRF router metadata quirk, not a real param — omitted here.
 * 2. `files/` create payload is multipart with no fixed schema in the spec.
 *    `createFile` accepts FormData directly; build it at the call site.
 */
export const useSubmissionApi = () => {
  const api = useApi()

  return {
    // -----------------------------------------------------------------
    // Submissions (core data/)
    // -----------------------------------------------------------------

    getSubmissions: (assetUid: string, params: SubmissionListParams = {}) =>
      api.get<KoboPaginatedResponse<SubmissionRecord>>(`${BASE}/${assetUid}/data/`, {
        params: {
          ...(params.limit !== undefined && { limit: params.limit }),
          ...(params.start !== undefined && { start: params.start }),
          ...(params.offset !== undefined && { offset: params.offset }),
          ...(params.fields?.trim() && { fields: params.fields }),
          ...(params.query?.trim() && { query: params.query }),
          ...(params.sort?.trim() && { sort: params.sort }),
          ...(params.format && { format: params.format }),
        },
      }),

    /** Submission data as XML (use with limit/start to cap export size). */
    getSubmissionsXml: (assetUid: string, params: Omit<SubmissionListParams, "format"> = {}) =>
      api.get<string>(`${BASE}/${assetUid}/data/`, {
        params: {
          format: "xml",
          ...(params.limit !== undefined && { limit: params.limit }),
          ...(params.start !== undefined && { start: params.start }),
          ...(params.offset !== undefined && { offset: params.offset }),
          ...(params.fields?.trim() && { fields: params.fields }),
          ...(params.query?.trim() && { query: params.query }),
          ...(params.sort?.trim() && { sort: params.sort }),
        },
        headers: { Accept: "*/*" },
        responseType: "text",
      }),

    downloadExportFile: (assetUid: string, exportUid: string) =>
      api.get<Blob>(`${BASE}/${assetUid}/exports/${exportUid}/download`, {
        headers: { Accept: "*/*" },
        responseType: "blob",
      }),

    getSubmission: (assetUid: string, id: string, params: SubmissionRetrieveParams = {}) =>
      api.get<SubmissionRecord>(`${BASE}/${assetUid}/data/${id}/`, {
        params: {
          ...(params.format && { format: params.format }),
        },
      }),

    deleteSubmission: (assetUid: string, id: string) =>
      api.delete<{ message: string }>(`${BASE}/${assetUid}/data/${id}/`),

    duplicateSubmission: (assetUid: string, id: string, payload: DuplicateSubmissionPayload) =>
      api.post<SubmissionRecord>(`${BASE}/${assetUid}/data/${id}/duplicate/`, payload),

    getSubmissionEdit: (assetUid: string, id: string) =>
      api.get<{ url: string }>(`${BASE}/${assetUid}/data/${id}/edit/`),

    // Enketo (web form) edit/view URLs
    getEnketoEditUrl: (assetUid: string, id: string) =>
      api.get<{ url: string }>(`${BASE}/${assetUid}/data/${id}/enketo/edit/`),

    getEnketoViewUrl: (assetUid: string, id: string) =>
      api.get<{ url: string }>(`${BASE}/${assetUid}/data/${id}/enketo/view/`),

    getEnketoRedirectEditUrl: (assetUid: string, id: string) =>
      api.get<{ url: string }>(`${BASE}/${assetUid}/data/${id}/enketo/redirect/edit/`),

    getEnketoRedirectViewUrl: (assetUid: string, id: string) =>
      api.get<{ url: string }>(`${BASE}/${assetUid}/data/${id}/enketo/redirect/view/`),

    // -----------------------------------------------------------------
    // Validation status (single submission)
    // -----------------------------------------------------------------

    getValidationStatus: (assetUid: string, id: string) =>
      api.get<ValidationStatus | Record<string, never>>(
        `${BASE}/${assetUid}/data/${id}/validation_status/`
      ),

    updateValidationStatus: (assetUid: string, id: string, payload: UpdateValidationStatusPayload) =>
      api.patch<ValidationStatus>(`${BASE}/${assetUid}/data/${id}/validation_status/`, payload),

    clearValidationStatus: (assetUid: string, id: string) =>
      api.delete<{ message: string }>(`${BASE}/${assetUid}/data/${id}/validation_status/`),

    // -----------------------------------------------------------------
    // Bulk operations (submission-set level)
    // -----------------------------------------------------------------

    bulkUpdateSubmissions: (assetUid: string, payload: BulkUpdateSubmissionsPayload) =>
      api.patch<{ message: string }>(`${BASE}/${assetUid}/data/bulk/`, payload),

    bulkDeleteSubmissions: (assetUid: string, payload: BulkDeleteSubmissionsPayload) =>
      api.delete<{ message: string }>(`${BASE}/${assetUid}/data/bulk/`),

    bulkUpdateValidationStatuses: (assetUid: string, payload: BulkUpdateValidationStatusesPayload) =>
      api.patch<{ message: string }>(`${BASE}/${assetUid}/data/validation_statuses/`, payload),

    bulkClearValidationStatuses: (assetUid: string, payload: BulkUpdateValidationStatusesPayload["payload"]) =>
      api.delete<{ message: string }>(`${BASE}/${assetUid}/data/validation_statuses/`),

    // -----------------------------------------------------------------
    // Supplement (per-submission extra metadata, e.g. transcript state)
    // -----------------------------------------------------------------

    getSupplement: (assetUid: string, rootUuid: string) =>
      api.get<Record<string, unknown>>(`${BASE}/${assetUid}/data/${rootUuid}/supplement/`),

    updateSupplement: (assetUid: string, rootUuid: string, payload: SupplementPayload) =>
      api.patch<Record<string, unknown>>(`${BASE}/${assetUid}/data/${rootUuid}/supplement/`, payload),

    // -----------------------------------------------------------------
    // Attachments (submission media)
    // -----------------------------------------------------------------

    getAttachments: (assetUid: string, dataUid: string, params: AttachmentListParams) =>
      api.get<Attachment[]>(`${BASE}/${assetUid}/data/${dataUid}/attachments/`, {
        params: {
          xpath: params.xpath,
          ...(params.format && { format: params.format }),
        },
      }),

    getAttachment: (assetUid: string, dataUid: string, id: number) =>
      api.get<Attachment>(`${BASE}/${assetUid}/data/${dataUid}/attachments/${id}/`),

    getAttachmentThumbnail: (assetUid: string, dataUid: string, id: number, suffix: ThumbnailSuffix) =>
      api.get<Blob>(`${BASE}/${assetUid}/data/${dataUid}/attachments/${id}/${suffix}/`, {
        headers: { "Accept": "application/octet-stream" },
      }),

    deleteAttachment: (assetUid: string, id: number) =>
      api.delete<{ message: string }>(`${BASE}/${assetUid}/attachments/${id}/`),

    bulkDeleteAttachments: (assetUid: string, attachmentIds: number[]) =>
      api.delete<{ message: string }>(`${BASE}/${assetUid}/attachments/bulk/`),

    // -----------------------------------------------------------------
    // Advanced features (transcripts / translations / qual analysis)
    // -----------------------------------------------------------------

    getAdvancedFeatures: (assetUid: string) =>
      api.get<KoboPaginatedResponse<Record<string, unknown>>>(`${BASE}/${assetUid}/advanced-features/`),

    createAdvancedFeature: (assetUid: string, payload: CreateAdvancedFeaturePayload) =>
      api.post<Record<string, unknown>>(`${BASE}/${assetUid}/advanced-features/`, payload),

    getAdvancedFeature: (assetUid: string, advancedFeatureUid: string) =>
      api.get<Record<string, unknown>>(
        `${BASE}/${assetUid}/advanced-features/${advancedFeatureUid}/`
      ),

    updateAdvancedFeature: (
      assetUid: string,
      advancedFeatureUid: string,
      payload: UpdateAdvancedFeaturePayload
    ) =>
      api.patch<Record<string, unknown>>(
        `${BASE}/${assetUid}/advanced-features/${advancedFeatureUid}/`,
        payload
      ),

    // Advanced-feature bulk actions
    getBulkActions: (assetUid: string, params: KoboListParams = {}) =>
      api.get<KoboPaginatedResponse<Record<string, unknown>>>(
        `${BASE}/${assetUid}/advanced-features/bulk-actions/`,
        {
          params: {
            ...(params.limit !== undefined && { limit: params.limit }),
            ...(params.start !== undefined && { start: params.start }),
            ...(params.offset !== undefined && { offset: params.offset }),
          },
        }
      ),

    createBulkAction: (assetUid: string, payload: CreateBulkActionPayload) =>
      api.post<Record<string, unknown>>(
        `${BASE}/${assetUid}/advanced-features/bulk-actions/`,
        payload
      ),

    getBulkAction: (assetUid: string, actionUid: string) =>
      api.get<Record<string, unknown>>(
        `${BASE}/${assetUid}/advanced-features/bulk-actions/${actionUid}/`
      ),

    updateBulkAction: (assetUid: string, actionUid: string, payload: UpdateBulkActionPayload) =>
      api.patch<Record<string, unknown>>(
        `${BASE}/${assetUid}/advanced-features/bulk-actions/${actionUid}/`,
        payload
      ),

    // -----------------------------------------------------------------
    // Export settings (saved/reusable export configs)
    // -----------------------------------------------------------------

    getExportSettingsList: (assetUid: string, params: KoboListParams = {}) =>
      api.get<KoboPaginatedResponse<ExportSetting>>(`${BASE}/${assetUid}/export-settings/`, {
        params: {
          ...(params.limit !== undefined && { limit: params.limit }),
          ...(params.start !== undefined && { start: params.start }),
          ...(params.offset !== undefined && { offset: params.offset }),
        },
      }),

    createExportSetting: (assetUid: string, payload: CreateExportSettingPayload) =>
      api.post<ExportSetting>(`${BASE}/${assetUid}/export-settings/`, payload),

    getExportSetting: (assetUid: string, exportSettingUid: string) =>
      api.get<ExportSetting>(`${BASE}/${assetUid}/export-settings/${exportSettingUid}/`),

    updateExportSetting: (
      assetUid: string,
      exportSettingUid: string,
      payload: UpdateExportSettingPayload
    ) =>
      api.patch<ExportSetting>(
        `${BASE}/${assetUid}/export-settings/${exportSettingUid}/`,
        payload
      ),

    deleteExportSetting: (assetUid: string, exportSettingUid: string) =>
      api.delete<{ message: string }>(`${BASE}/${assetUid}/export-settings/${exportSettingUid}/`),

    getExportSettingData: (
      assetUid: string,
      exportSettingUid: string,
      params: ExportSettingDataParams
    ) =>
      api.get<Blob>(`${BASE}/${assetUid}/export-settings/${exportSettingUid}/data/`, {
        params: { format: params.format },
        headers: { "Accept": "application/octet-stream" },
      }),

    // -----------------------------------------------------------------
    // Exports (one-off async export tasks)
    // -----------------------------------------------------------------

    getExports: (assetUid: string, params: ExportListParams = {}) =>
      api.get<KoboPaginatedResponse<ExportTask>>(`${BASE}/${assetUid}/exports/`, {
        params: {
          ...(params.limit !== undefined && { limit: params.limit }),
          ...(params.start !== undefined && { start: params.start }),
          ...(params.offset !== undefined && { offset: params.offset }),
          ...(params.ordering?.trim() && { ordering: params.ordering }),
        },
      }),

    createExport: (assetUid: string, payload: CreateExportPayload) =>
      api.post<ExportTask>(`${BASE}/${assetUid}/exports/`, payload),

    getExport: (assetUid: string, exportUid: string) =>
      api.get<ExportTask>(`${BASE}/${assetUid}/exports/${exportUid}/`),

    deleteExport: (assetUid: string, exportUid: string) =>
      api.delete<{ message: string }>(`${BASE}/${assetUid}/exports/${exportUid}/`),

    // -----------------------------------------------------------------
    // Files (asset-level media, e.g. form attachments/source files)
    // -----------------------------------------------------------------

    getAssetFiles: (assetUid: string, params: KoboListParams = {}) =>
      api.get<KoboPaginatedResponse<AssetFile>>(`${BASE}/${assetUid}/files/`, {
        params: {
          ...(params.limit !== undefined && { limit: params.limit }),
          ...(params.start !== undefined && { start: params.start }),
          ...(params.offset !== undefined && { offset: params.offset }),
        },
      }),

    /** Multipart upload — pass a FormData instance built at the call site. */
    createAssetFile: (assetUid: string, payload: CreateAssetFilePayload) =>
      api.post<AssetFile>(`${BASE}/${assetUid}/files/`, payload, {
        headers: { "Content-Type": "multipart/form-data" },
      }),

    getAssetFile: (assetUid: string, fileUid: string) =>
      api.get<AssetFile>(`${BASE}/${assetUid}/files/${fileUid}/`),

    deleteAssetFile: (assetUid: string, fileUid: string) =>
      api.delete<{ message: string }>(`${BASE}/${assetUid}/files/${fileUid}/`),

    getAssetFileContent: (assetUid: string, fileUid: string) =>
      api.get<Blob>(`${BASE}/${assetUid}/files/${fileUid}/content/`, {
        headers: { "Accept": "application/octet-stream" },
      }) as Promise<Blob>,

    // -----------------------------------------------------------------
    // Paired data (cross-project data linking)
    // -----------------------------------------------------------------

    getPairedDataList: (assetUid: string, params: KoboListParams = {}) =>
      api.get<KoboPaginatedResponse<PairedData>>(`${BASE}/${assetUid}/paired-data/`, {
        params: {
          ...(params.limit !== undefined && { limit: params.limit }),
          ...(params.start !== undefined && { start: params.start }),
          ...(params.offset !== undefined && { offset: params.offset }),
        },
      }),

    createPairedData: (assetUid: string, payload: CreatePairedDataPayload) =>
      api.post<PairedData>(`${BASE}/${assetUid}/paired-data/`, payload),

    getPairedData: (assetUid: string, pairedDataUid: string) =>
      api.get<PairedData>(`${BASE}/${assetUid}/paired-data/${pairedDataUid}/`),

    updatePairedData: (assetUid: string, pairedDataUid: string, payload: UpdatePairedDataPayload) =>
      api.patch<PairedData>(`${BASE}/${assetUid}/paired-data/${pairedDataUid}/`, payload),

    deletePairedData: (assetUid: string, pairedDataUid: string) =>
      api.delete<{ message: string }>(`${BASE}/${assetUid}/paired-data/${pairedDataUid}/`),

    getPairedDataExternal: (assetUid: string, pairedDataUid: string) =>
      api.get<Record<string, unknown>>(`${BASE}/${assetUid}/paired-data/${pairedDataUid}/external/`),

    // -----------------------------------------------------------------
    // Reports
    // -----------------------------------------------------------------

    getReports: (assetUid: string) =>
      api.get<AssetReport>(`${BASE}/${assetUid}/reports/`),

    // -----------------------------------------------------------------
    // Submission upload (OpenRosa JSON)
    // -----------------------------------------------------------------

    submitSubmission: (username: string, payload: KoboSubmissionPayload) =>
      api.post<SubmissionUploadResponse>(openRosaSubmissionPath(username), payload),

    /**
     * @deprecated v1 /api/v1/forms.json removed June 2026. Prefer v2 asset metadata.
     */
    getV1Forms: () => api.get<KoboV1FormListItem[]>(V1_FORMS),
  }
}