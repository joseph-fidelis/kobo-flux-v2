import type { Asset, Deployment } from '~/lib/models/ProjectsLibrary'
import type {
  SubmissionFormMeta,
  SubmissionUploadProgress,
  SubmissionUploadRowResult,
} from '~/lib/models/SurveyData'
import {
  buildKoboLabelExportPayload,
  buildKoboXmlExportPayload,
  sleep,
} from '~/lib/helpers/koboExport'
import { fetchKoboExportHeaders } from '~/lib/helpers/koboExportJob'
import {
  FORM_ID_RESOLUTION_ERROR,
  resolveFormIdWithFallbacks,
} from '~/lib/helpers/koboFormId'
import { formatAssetOwner } from '~/composables/forms/formatAssetOwner'
import { triggerBrowserDownload } from '~/lib/helpers/download'
import {
  buildLabelToXpathMap,
  labelRowToSubmissionPayload,
  rowsToFlatDicts,
  validateSubmissionHeaders,
  type HeaderValidation,
} from '~/lib/helpers/submissionUpload'
import { buildXlsxBlob, parseXlsxFile } from '~/lib/helpers/xlsx'
import { useFormContentApi } from '~/services/form.service'
import { useProjectsLibraryApi } from '~/services/project.service'
import { useSubmissionApi } from '~/services/survey.service'

const PREVIEW_ROW_LIMIT = 10
const UPLOAD_DELAY_MS = 100

function extractFormhubUuid(asset: Asset): string | undefined {
  const candidates = ['uuid', 'formhub_uuid', 'kuid', 'deployment__uuid'] as const
  for (const key of candidates) {
    const value = asset[key]
    if (typeof value === 'string' && value.trim()) return value.trim()
  }
  return undefined
}

function resolveOwnerUsername(asset: Asset): string | undefined {
  if (asset.owner__username?.trim()) return asset.owner__username.trim()
  if (typeof asset.owner === 'string' && asset.owner.trim()) {
    return formatAssetOwner(asset.owner, asset)
  }
  return undefined
}

function responseMessage(data: unknown): string {
  if (data == null) return 'Unknown error'
  if (typeof data === 'string') return data
  if (typeof data === 'object') {
    const record = data as Record<string, unknown>
    if (typeof record.detail === 'string') return record.detail
    if (typeof record.message === 'string') return record.message
    return JSON.stringify(data)
  }
  return String(data)
}

export function useSubmissionUpload(formUid: MaybeRefOrGetter<string | undefined>) {
  const uid = computed(() => toValue(formUid))
  const { getAsset, getDeployment } = useProjectsLibraryApi()
  const { getAssetContent, getAssetXml, getAssetXform } = useFormContentApi()
  const submissionApi = useSubmissionApi()
  const { submitSubmission, getV1Forms } = submissionApi

  const form = ref<Asset | null>(null)
  const deployment = ref<Deployment | null>(null)
  const formMeta = ref<SubmissionFormMeta | null>(null)
  const expectedHeaders = ref<string[]>([])
  const labelToXpath = ref<Map<string, string>>(new Map())
  const pending = ref(true)
  const headersPending = ref(false)
  const parsing = ref(false)
  const uploading = ref(false)
  const error = ref<string | null>(null)
  const parseError = ref<string | null>(null)

  const selectedFile = ref<File | null>(null)
  const uploadedHeaders = ref<string[]>([])
  const parsedDataRows = ref<(string | number)[][]>([])
  const previewRows = ref<(string | number)[][]>([])
  const totalRowCount = ref(0)
  const validation = ref<HeaderValidation | null>(null)
  const uploadMessage = ref<string | null>(null)
  const uploadProgress = ref<SubmissionUploadProgress>({
    done: 0,
    total: 0,
    succeeded: 0,
    failed: 0,
  })
  const uploadResults = ref<SubmissionUploadRowResult[]>([])

  const hasForm = computed(() => Boolean(uid.value))
  const isDeployable = computed(
    () => Boolean(formMeta.value) && Boolean(form.value?.has_deployment && deployment.value?.active),
  )
  const canUpload = computed(
    () =>
      validation.value?.valid === true
      && totalRowCount.value > 0
      && isDeployable.value
      && !uploading.value,
  )

  const previewHeaders = computed(() => {
    if (uploadedHeaders.value.length > 0) return uploadedHeaders.value
    return expectedHeaders.value
  })

  async function resolveFormhubUuid(asset: Asset): Promise<string | undefined> {
    const fromAsset = extractFormhubUuid(asset)
    if (fromAsset) return fromAsset

    // Stale v1 fallback — only reached when deployment__uuid is missing on the asset.
    try {
      const forms = await getV1Forms()
      const deploymentUuid = asset.deployment__uuid
      if (typeof deploymentUuid === 'string' && deploymentUuid.trim()) {
        const byUuid = forms.find((item) => item.uuid === deploymentUuid)
        return byUuid?.uuid
      }
    } catch {
      return undefined
    }
  }

  async function resolveFormMeta(asset: Asset, deploymentData: Deployment | null) {
    const ownerUsername = resolveOwnerUsername(asset)
    if (!ownerUsername) {
      throw new Error(
        'Could not resolve form owner username. The asset must include owner__username for OpenRosa submission upload.',
      )
    }

    const formId = await resolveFormIdWithFallbacks(asset, deploymentData, {
      getAssetContent,
      getAssetXform: async (assetUid) => {
        try {
          return await getAssetXml(assetUid)
        } catch {
          return getAssetXform(assetUid)
        }
      },
      getV1Forms,
    })
    if (!formId) {
      throw new Error(FORM_ID_RESOLUTION_ERROR)
    }

    const formhubUuid = await resolveFormhubUuid(asset)
    formMeta.value = {
      assetUid: asset.uid,
      formId,
      ownerUsername,
      ...(formhubUuid ? { formhubUuid } : {}),
    }
  }

  async function fetchExpectedExportHeaders(assetUid: string) {
    headersPending.value = true
    try {
      const labelHeaders = await fetchKoboExportHeaders(
        submissionApi,
        assetUid,
        buildKoboLabelExportPayload(),
      )
      const xpathHeaders = await fetchKoboExportHeaders(
        submissionApi,
        assetUid,
        buildKoboXmlExportPayload(),
      )
      expectedHeaders.value = labelHeaders
      labelToXpath.value = buildLabelToXpathMap(labelHeaders, xpathHeaders)
    } finally {
      headersPending.value = false
    }
  }

  async function refresh() {
    const id = uid.value
    if (!id) {
      pending.value = false
      form.value = null
      deployment.value = null
      formMeta.value = null
      expectedHeaders.value = []
      labelToXpath.value = new Map()
      error.value = null
      return
    }

    pending.value = true
    error.value = null
    clearFile()

    try {
      const asset = await getAsset(id)
      form.value = asset
      deployment.value = null

      if (!asset.has_deployment) {
        throw new Error('Form is not deployed. Deploy the form before uploading submissions.')
      }

      const deploymentData = await getDeployment(id)
      deployment.value = deploymentData

      if (!deploymentData.active) {
        throw new Error('Form deployment is not active. Redeploy the form before uploading.')
      }

      await resolveFormMeta(asset, deploymentData)
      await fetchExpectedExportHeaders(id)
      
    } catch (err: unknown) {
      const apiErr = err as { message?: string }
      error.value = apiErr.message ?? 'Failed to load form export headers'
      form.value = null
      deployment.value = null
      formMeta.value = null
      expectedHeaders.value = []
      labelToXpath.value = new Map()
    } finally {
      pending.value = false
    }
  }

  function clearFile() {
    selectedFile.value = null
    uploadedHeaders.value = []
    parsedDataRows.value = []
    previewRows.value = []
    totalRowCount.value = 0
    validation.value = null
    parseError.value = null
    uploadMessage.value = null
    uploadResults.value = []
    uploadProgress.value = { done: 0, total: 0, succeeded: 0, failed: 0 }
  }

  async function onFileSelected(file: File | null) {
    clearFile()
    if (!file) return

    selectedFile.value = file
    parsing.value = true
    parseError.value = null

    try {
      const parsed = await parseXlsxFile(file)
      uploadedHeaders.value = parsed.headers
      parsedDataRows.value = parsed.dataRows
      totalRowCount.value = parsed.dataRows.length
      previewRows.value = parsed.dataRows.slice(0, PREVIEW_ROW_LIMIT)
      validation.value = validateSubmissionHeaders(
        expectedHeaders.value,
        parsed.headers,
      )
    } catch (err: unknown) {
      const apiErr = err as { message?: string }
      parseError.value = apiErr.message ?? 'Failed to read spreadsheet'
      selectedFile.value = null
    } finally {
      parsing.value = false
    }
  }

  function downloadTemplate() {
    const dataHeaders = expectedHeaders.value.filter(
      (h) => !h.trim().startsWith('_'),
    )
    const blob = buildXlsxBlob(dataHeaders.length > 0 ? dataHeaders : expectedHeaders.value)
    const name = form.value?.name ?? uid.value ?? 'form'
    triggerBrowserDownload(blob, `${name.replace(/[^\w.-]+/g, '_')}-upload-template.xlsx`)
  }

  function downloadUploadLog() {
    if (uploadResults.value.length === 0) return
    const lines = uploadResults.value.map((result) => {
      const status = result.ok ? 'SUCCESS' : 'FAILED'
      return `[Row ${result.row}] ${status}${result.status ? ` (${result.status})` : ''}: ${result.message ?? ''}`
    })
    const blob = new Blob([lines.join('\n')], { type: 'text/plain' })
    const name = form.value?.name ?? uid.value ?? 'form'
    triggerBrowserDownload(blob, `${name.replace(/[^\w.-]+/g, '_')}-upload-log.txt`)
  }

  async function upload() {
    if (!canUpload.value || !formMeta.value) return

    uploading.value = true
    uploadMessage.value = null
    uploadResults.value = []

    const labelRows = rowsToFlatDicts(uploadedHeaders.value, parsedDataRows.value)
    const total = labelRows.length
    uploadProgress.value = { done: 0, total, succeeded: 0, failed: 0 }

    for (let index = 0; index < labelRows.length; index += 1) {
      const rowNumber = index + 1
      const payload = labelRowToSubmissionPayload(
        formMeta.value,
        labelRows[index]!,
        labelToXpath.value,
      )

      try {
        const response = await submitSubmission(formMeta.value.ownerUsername, payload)
        const ok = response.status === 201
        uploadResults.value.push({
          row: rowNumber,
          ok,
          status: response.status,
          message: ok ? 'Submitted' : responseMessage(response.data),
        })
        if (ok) {
          uploadProgress.value.succeeded += 1
        } else {
          uploadProgress.value.failed += 1
        }
      } catch (err: unknown) {
        const apiErr = err as { message?: string; status_code?: number }
        uploadResults.value.push({
          row: rowNumber,
          ok: false,
          status: apiErr.status_code,
          message: apiErr.message ?? 'Request failed',
        })
        uploadProgress.value.failed += 1
      }

      uploadProgress.value.done += 1
      if (index < labelRows.length - 1) {
        await sleep(UPLOAD_DELAY_MS)
      }
    }

    const { succeeded, failed } = uploadProgress.value
    uploadMessage.value = `Upload complete: ${succeeded} succeeded, ${failed} failed.`
    uploading.value = false
  }

  watch(uid, refresh, { immediate: true })

  return {
    form,
    deployment,
    formMeta,
    expectedHeaders,
    pending,
    headersPending,
    parsing,
    uploading,
    error,
    parseError,
    hasForm,
    isDeployable,
    selectedFile,
    uploadedHeaders,
    previewHeaders,
    previewRows,
    totalRowCount,
    previewRowLimit: PREVIEW_ROW_LIMIT,
    validation,
    canUpload,
    uploadMessage,
    uploadProgress,
    uploadResults,
    refresh,
    onFileSelected,
    clearFile,
    downloadTemplate,
    downloadUploadLog,
    upload,
  }
}
