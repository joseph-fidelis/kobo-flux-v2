// lib/models/SurveyData.ts
// Types for KoboToolbox API v2 — "Survey data" section (submissions, attachments,
// validation status, exports, export-settings, files, paired-data, advanced-features).
// Source: api/v2/docs/ OpenAPI spec (api_v2, KoboToolbox Primary API).

// ---------------------------------------------------------------------------
// Shared / pagination
// ---------------------------------------------------------------------------

export interface KoboListParams {
    limit?: number
    start?: number
    /** Deprecated alias of `start`, kept for completeness. */
    offset?: number
  }
  
  export interface KoboPaginatedResponse<T> {
    count: number
    next: string | null
    previous: string | null
    results: T[]
  }
  
  // ---------------------------------------------------------------------------
  // Submissions (data/)
  // ---------------------------------------------------------------------------
  
  export interface SubmissionListParams extends KoboListParams {
    /** Comma-separated or JSON-array field list to restrict the response shape. */
    fields?: string
    /** Mongo-style filter query, e.g. {"status":"approved"} */
    query?: string
    /** Mongo-style sort, e.g. {"_id":-1} */
    sort?: string
    format?: 'json' | 'xml' | 'geojson'
  }
  
  export interface SubmissionRetrieveParams {
    format?: 'json' | 'xml' | 'geojson'
  }
  
  /**
   * Submission payload shape is dynamic — it mirrors the asset's form schema
   * (xpath -> value). Loosely typed; narrow per-asset if you generate
   * form-specific types from the asset's question list.
   */
  export type SubmissionRecord = Record<string, unknown> & {
    _id?: number
    _uuid?: string
    _validation_status?: ValidationStatus | Record<string, never>
    _submission_time?: string
  }
  
  export interface DuplicateSubmissionPayload {
    /** Submission IDs to duplicate. */
    payload: number[]
  }
  
  // ---------------------------------------------------------------------------
  // Validation status
  // ---------------------------------------------------------------------------
  
  export type ValidationStatusUid =
    | 'validation_status_not_approved'
    | 'validation_status_approved'
    | 'validation_status_on_hold'
  
  export interface ValidationStatus {
    uid: ValidationStatusUid
    by_whom?: string
    timestamp?: number
  }
  
  export interface UpdateValidationStatusPayload {
    'validation_status.uid': ValidationStatusUid
  }
  
  export interface BulkUpdateValidationStatusesPayload {
    payload: {
      submission_ids: number[]
      'validation_status.uid': ValidationStatusUid
    }
  }
  
  // ---------------------------------------------------------------------------
  // Bulk submission update / delete
  // ---------------------------------------------------------------------------
  
  export interface BulkUpdateSubmissionsPayload {
    payload: {
      submission_ids: number[]
      /** Map of xpath -> new value to apply across all targeted submissions. */
      data: Record<string, unknown>
    }
  }
  
  export interface BulkDeleteSubmissionsPayload {
    payload: {
      submission_ids: number[]
    }
  }
  
  // ---------------------------------------------------------------------------
  // Supplement (submission extra-data, e.g. transcripts/translations metadata)
  // ---------------------------------------------------------------------------
  
  export interface SupplementPayload {
    _version: string // e.g. "20250820"
  }
  
  // ---------------------------------------------------------------------------
  // Attachments
  // ---------------------------------------------------------------------------
  
  export interface Attachment {
    id: number
    uid?: string
    download_url?: string
    filename?: string
    mimetype?: string
    question_xpath?: string
  }
  
  export interface AttachmentListParams {
    /** Required by the API: the question xpath to scope attachments to. */
    xpath: string
    format?: 'json' | 'xml'
  }
  
  export type ThumbnailSuffix = 'small' | 'medium' | 'large'
  
  // ---------------------------------------------------------------------------
  // Advanced features (NLP transcripts/translations, qual analysis)
  // ---------------------------------------------------------------------------
  
  export type AdvancedFeatureAction = 'translation' | 'transcript' | 'qual'
  
  export interface AdvancedFeatureParamsBase {
    [key: string]: unknown
  }
  
  export interface CreateAdvancedFeaturePayload {
    question_xpath: string
    action: AdvancedFeatureAction
    params: AdvancedFeatureParamsBase[]
  }
  
  export interface UpdateAdvancedFeaturePayload {
    question_xpath?: string
    action?: AdvancedFeatureAction
    params?: AdvancedFeatureParamsBase[]
  }
  
  // ---------------------------------------------------------------------------
  // Advanced-feature bulk actions
  // ---------------------------------------------------------------------------
  
  export type BulkActionId = string // ActionIdEnum — narrow once enum values confirmed against live server
  export type BulkActionStatus = 'requested' | 'in_progress' | 'complete' | 'failed' | 'canceled'
  
  export interface CreateBulkActionPayload {
    action_id: BulkActionId
    question_xpath: string
    submission_uuids: string[]
    params: Record<string, unknown>
  }
  
  export interface UpdateBulkActionPayload {
    status: BulkActionStatus
  }
  
  // ---------------------------------------------------------------------------
  // Export settings (saved export configs)
  // ---------------------------------------------------------------------------
  
  export interface ExportSettingsConfig {
    fields_from_all_versions?: boolean
    group_sep?: string
    hierarchy_in_labels?: boolean
    lang?: string
    multiple_select?: string
    type?: string
    fields?: string[]
    flatten?: boolean
    xls_types_as_text?: boolean
    include_media_url?: boolean
    submission_ids?: number[]
    query?: Record<string, unknown>
  }
  
  export interface ExportSetting {
    uid: string
    name: string
    export_settings: ExportSettingsConfig
    url?: string
    data_url_csv?: string
    data_url_xlsx?: string
  }
  
  export interface CreateExportSettingPayload {
    name: string
    export_settings: ExportSettingsConfig
  }
  
  export interface UpdateExportSettingPayload {
    name?: string
    export_settings?: Partial<ExportSettingsConfig>
  }
  
  export interface ExportSettingDataParams {
    format: 'csv' | 'xlsx'
  }
  
  // ---------------------------------------------------------------------------
  // Exports (one-off export tasks)
  // ---------------------------------------------------------------------------
  
  export interface ExportListParams extends KoboListParams {
    ordering?: string
  }
  
  export type ExportTaskStatus = 'created' | 'processing' | 'complete' | 'error'
  
  export interface ExportTask {
    uid: string
    status: ExportTaskStatus
    result?: string // download URL once complete
    date_created?: string
  }
  
  export interface CreateExportPayload {
    fields?: string[]
    fields_from_all_versions: boolean
    group_sep: string
    hierarchy_in_labels: boolean
    include_media_url: boolean
    lang: string
    multiple_select: string
    /** Kobo API field name for targeted submission exports. */
    submission_ids?: number[]
    type: string
    flatten: boolean
    xls_types_as_text: boolean
    query?: Record<string, unknown>
  }
  
  // ---------------------------------------------------------------------------
  // Files (asset-level media/source files, not submission attachments)
  // ---------------------------------------------------------------------------
  
  export interface AssetFile {
    uid: string
    content?: string
    description?: string
    file_type?: string
    date_created?: string
  }
  
  /**
   * Spec lists this schema with no defined properties (multipart/form-data
   * upload). Use FormData at the call site; this type is a placeholder for
   * any metadata fields your backend actually expects alongside the file.
   */
  export type CreateAssetFilePayload = FormData | Record<string, unknown>
  
  // ---------------------------------------------------------------------------
  // Paired data (cross-project data linking)
  // ---------------------------------------------------------------------------
  
  export interface PairedData {
    uid: string
    source: string // URI of the source asset
    fields: string[]
    filename: string
    source__name: string // readOnly
  }
  
  export interface CreatePairedDataPayload {
    source: string
    fields: string[]
    filename: string
  }
  
  export interface UpdatePairedDataPayload {
    fields?: string[]
    filename?: string
  }
  
  // ---------------------------------------------------------------------------
  // Reports
  // ---------------------------------------------------------------------------
  
  export interface AssetReport {
    url?: string
    count?: number
    list?: Array<Record<string, unknown>>
  }

  // ---------------------------------------------------------------------------
  // v1 submission upload
  // ---------------------------------------------------------------------------

  export interface SubmissionFormMeta {
    assetUid: string
    formId: string
    formhubUuid?: string
  }

  export interface KoboV1SubmissionPayload {
    id: string
    submission: Record<string, unknown>
  }

  export interface SubmissionUploadResponse {
    status: number
    data: unknown
  }

  export interface SubmissionUploadRowResult {
    row: number
    ok: boolean
    status?: number
    message?: string
  }

  export interface SubmissionUploadProgress {
    done: number
    total: number
    succeeded: number
    failed: number
  }

  export interface KoboV1FormListItem {
    id_string?: string
    uuid?: string
    title?: string
  }