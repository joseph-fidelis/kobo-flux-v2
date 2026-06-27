import type { Asset } from '~/lib/models/ProjectsLibrary'
import type { HeaderValidation } from '~/lib/helpers/validateSubmissionHeaders'
import { buildKoboLabelExportPayload, sleep } from '~/lib/helpers/koboExport'
import { triggerBrowserDownload } from '~/lib/helpers/download'
import { validateSubmissionHeaders } from '~/lib/helpers/validateSubmissionHeaders'
import { buildXlsxBlob, parseXlsxBlob, parseXlsxFile } from '~/lib/helpers/xlsx'
import { useProjectsLibraryApi } from '~/services/project.service'
import { useSubmissionApi } from '~/services/survey.service'

const PREVIEW_ROW_LIMIT = 10

export function useSubmissionUpload(formUid: MaybeRefOrGetter<string | undefined>) {
  const uid = computed(() => toValue(formUid))
  const { getAsset } = useProjectsLibraryApi()
  const { createExport, getExport, downloadExportFile } = useSubmissionApi()

  const form = ref<Asset | null>(null)
  const expectedHeaders = ref<string[]>([])
  const pending = ref(true)
  const headersPending = ref(false)
  const parsing = ref(false)
  const error = ref<string | null>(null)
  const parseError = ref<string | null>(null)

  const selectedFile = ref<File | null>(null)
  const uploadedHeaders = ref<string[]>([])
  const previewRows = ref<(string | number)[][]>([])
  const totalRowCount = ref(0)
  const validation = ref<HeaderValidation | null>(null)
  const uploadMessage = ref<string | null>(null)

  const hasForm = computed(() => Boolean(uid.value))
  const canUpload = computed(() => validation.value?.valid === true && totalRowCount.value > 0)

  const previewHeaders = computed(() => {
    if (uploadedHeaders.value.length > 0) return uploadedHeaders.value
    return expectedHeaders.value
  })

  async function waitForExport(assetUid: string, exportUid: string) {
    const maxAttempts = 60
    for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
      const task = await getExport(assetUid, exportUid)
      if (task.status === 'complete') return task
      if (task.status === 'error') {
        throw new Error('Kobo export failed while loading expected headers')
      }
      await sleep(2000)
    }
    throw new Error('Timed out waiting for Kobo export headers')
  }

  async function fetchExpectedExportHeaders(assetUid: string) {
    headersPending.value = true
    try {
      const task = await createExport(assetUid, buildKoboLabelExportPayload())
      await waitForExport(assetUid, task.uid)
      const blob = await downloadExportFile(assetUid, task.uid)
      const parsed = await parseXlsxBlob(blob)
      expectedHeaders.value = parsed.headers
    } finally {
      headersPending.value = false
    }
  }

  async function refresh() {
    const id = uid.value
    if (!id) {
      pending.value = false
      form.value = null
      expectedHeaders.value = []
      error.value = null
      return
    }

    pending.value = true
    error.value = null
    clearFile()

    try {
      form.value = await getAsset(id)
      await fetchExpectedExportHeaders(id)
    } catch (err: unknown) {
      const apiErr = err as { message?: string }
      error.value = apiErr.message ?? 'Failed to load form export headers'
      form.value = null
      expectedHeaders.value = []
    } finally {
      pending.value = false
    }
  }

  function clearFile() {
    selectedFile.value = null
    uploadedHeaders.value = []
    previewRows.value = []
    totalRowCount.value = 0
    validation.value = null
    parseError.value = null
    uploadMessage.value = null
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

  function upload() {
    if (!canUpload.value) return
    uploadMessage.value = `${totalRowCount.value} row(s) validated and ready for import. Bulk upload to Kobo will be wired in a follow-up.`
  }

  watch(uid, refresh, { immediate: true })

  return {
    form,
    expectedHeaders,
    pending,
    headersPending,
    parsing,
    error,
    parseError,
    hasForm,
    selectedFile,
    uploadedHeaders,
    previewHeaders,
    previewRows,
    totalRowCount,
    previewRowLimit: PREVIEW_ROW_LIMIT,
    validation,
    canUpload,
    uploadMessage,
    refresh,
    onFileSelected,
    clearFile,
    downloadTemplate,
    upload,
  }
}
