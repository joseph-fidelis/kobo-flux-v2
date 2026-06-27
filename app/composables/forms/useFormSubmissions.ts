import type { Asset } from '~/lib/models/ProjectsLibrary'
import type { CreateExportPayload, SubmissionRecord } from '~/lib/models/SurveyData'
import { sanitizeFilename, triggerBrowserDownload } from '~/lib/helpers/download'
import { useProjectsLibraryApi } from '~/services/project.service'
import { useSubmissionApi } from '~/services/survey.service'

const SUBMISSIONS_PAGE_SIZE = 10
const SUBMISSIONS_EXPORT_LIMIT = 10

type SubmissionDownloadFormat = 'json' | 'xml' | 'xlsx'

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function submissionExportFilename(formName: string, extension: string) {
  return `${sanitizeFilename(formName)}-submissions-${SUBMISSIONS_EXPORT_LIMIT}.${extension}`
}

function buildSubmissionExportPayload(submissionIds: number[]): CreateExportPayload {
  return {
    fields_from_all_versions: true,
    group_sep: '/',
    hierarchy_in_labels: false,
    include_media_url: true,
    lang: '_default',
    multiple_select: 'both',
    type: 'xls',
    flatten: false,
    xls_types_as_text: false,
    submission_ids: submissionIds,
  }
}

export function useFormSubmissions(formUid: MaybeRefOrGetter<string | undefined>) {
  const route = useRoute()
  const {
    getSubmissions,
    getSubmissionsXml,
    createExport,
    getExport,
    downloadExportFile,
  } = useSubmissionApi()
  const { getAsset } = useProjectsLibraryApi()

  const uid = computed(() => toValue(formUid))
  const form = ref<Asset | null>(null)
  const submissions = ref<SubmissionRecord[]>([])
  const totalCount = ref(0)
  const pending = ref(true)
  const error = ref<string | null>(null)
  const downloading = ref<SubmissionDownloadFormat | null>(null)
  const downloadError = ref<string | null>(null)

  const downloadBaseName = computed(() =>
    sanitizeFilename(form.value?.name ?? uid.value ?? 'submissions'),
  )

  const page = computed(() => {
    const value = Number(route.query.page)
    return Number.isFinite(value) && value >= 1 ? Math.floor(value) : 1
  })

  const hasForm = computed(() => Boolean(uid.value))
  const totalPages = computed(() =>
    totalCount.value > 0 ? Math.ceil(totalCount.value / SUBMISSIONS_PAGE_SIZE) : 0,
  )
  const hasPagination = computed(() => totalPages.value > 1)
  const rangeStart = computed(() =>
    totalCount.value === 0 ? 0 : (page.value - 1) * SUBMISSIONS_PAGE_SIZE + 1,
  )
  const rangeEnd = computed(() =>
    Math.min(page.value * SUBMISSIONS_PAGE_SIZE, totalCount.value),
  )

  async function refresh() {
    const id = uid.value
    if (!id) {
      pending.value = false
      form.value = null
      submissions.value = []
      totalCount.value = 0
      error.value = null
      return
    }

    pending.value = true
    error.value = null

    try {
      if (!form.value || form.value.uid !== id) {
        form.value = await getAsset(id)
      }

      const response = await getSubmissions(id, {
        limit: SUBMISSIONS_PAGE_SIZE,
        start: (page.value - 1) * SUBMISSIONS_PAGE_SIZE,
        sort: '{"_id":-1}',
      })
      submissions.value = response.results
      totalCount.value = response.count

      const maxPage =
        totalCount.value > 0 ? Math.ceil(totalCount.value / SUBMISSIONS_PAGE_SIZE) : 1
      if (page.value > maxPage) {
        goToPage(maxPage)
      }
    } catch (err: unknown) {
      const apiErr = err as { message?: string }
      error.value = apiErr.message ?? 'Failed to load submissions'
      form.value = null
      submissions.value = []
      totalCount.value = 0
    } finally {
      pending.value = false
    }
  }

  function goToPage(nextPage: number) {
    const maxPage = totalPages.value || 1
    const clamped = Math.min(Math.max(1, nextPage), maxPage)

    navigateTo({
      path: route.path,
      query: {
        ...route.query,
        form: uid.value,
        ...(clamped > 1 ? { page: String(clamped) } : {}),
      },
    })
  }

  function viewFormDetails() {
    if (uid.value) navigateTo(`/forms/${uid.value}`)
  }

  async function fetchExportSubmissions() {
    const id = uid.value
    if (!id) return []

    const response = await getSubmissions(id, {
      limit: SUBMISSIONS_EXPORT_LIMIT,
      start: 0,
      sort: '{"_id":-1}',
    })
    return response.results
  }

  async function waitForExport(assetUid: string, exportUid: string) {
    const maxAttempts = 60
    for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
      const task = await getExport(assetUid, exportUid)
      if (task.status === 'complete') return task
      if (task.status === 'error') {
        throw new Error('Kobo export failed')
      }
      await sleep(2000)
    }
    throw new Error('Export timed out')
  }

  async function downloadSubmissionJson() {
    const id = uid.value
    if (!id) return

    downloading.value = 'json'
    downloadError.value = null
    try {
      const records = await fetchExportSubmissions()
      if (records.length === 0) {
        downloadError.value = 'No submissions to export'
        return
      }
      const blob = new Blob([JSON.stringify(records, null, 2)], {
        type: 'application/json',
      })
      triggerBrowserDownload(blob, submissionExportFilename(downloadBaseName.value, 'json'))
    } catch (err: unknown) {
      const apiErr = err as { message?: string }
      downloadError.value = apiErr.message ?? 'Failed to download JSON'
    } finally {
      downloading.value = null
    }
  }

  async function downloadSubmissionXml() {
    const id = uid.value
    if (!id) return

    downloading.value = 'xml'
    downloadError.value = null
    try {
      const xml = await getSubmissionsXml(id, {
        limit: SUBMISSIONS_EXPORT_LIMIT,
        start: 0,
        sort: '{"_id":-1}',
      })
      const blob = new Blob([xml], { type: 'application/xml' })
      triggerBrowserDownload(blob, submissionExportFilename(downloadBaseName.value, 'xml'))
    } catch (err: unknown) {
      const apiErr = err as { message?: string }
      downloadError.value = apiErr.message ?? 'Failed to download XML'
    } finally {
      downloading.value = null
    }
  }

  async function downloadSubmissionXlsx() {
    const id = uid.value
    if (!id) return

    downloading.value = 'xlsx'
    downloadError.value = null
    try {
      const records = await fetchExportSubmissions()
      const submissionIds = records
        .map((record) => record._id)
        .filter((value): value is number => typeof value === 'number')

      if (submissionIds.length === 0) {
        downloadError.value = 'No submissions to export'
        return
      }

      const task = await createExport(id, buildSubmissionExportPayload(submissionIds))
      await waitForExport(id, task.uid)
      const blob = await downloadExportFile(id, task.uid)
      triggerBrowserDownload(blob, submissionExportFilename(downloadBaseName.value, 'xlsx'))
    } catch (err: unknown) {
      const apiErr = err as { message?: string }
      downloadError.value = apiErr.message ?? 'Failed to download XLSX'
    } finally {
      downloading.value = null
    }
  }

  watch(uid, (newUid, oldUid) => {
    if (newUid !== oldUid) {
      form.value = null
      if (route.query.page) {
        navigateTo({
          path: route.path,
          query: { ...route.query, form: newUid, page: undefined },
        })
        return
      }
    }
    refresh()
  }, { immediate: true })

  watch(page, (newPage, oldPage) => {
    if (newPage !== oldPage && uid.value) refresh()
  })

  return {
    form,
    submissions,
    totalCount,
    pending,
    error,
    hasForm,
    page,
    pageSize: SUBMISSIONS_PAGE_SIZE,
    totalPages,
    hasPagination,
    rangeStart,
    rangeEnd,
    refresh,
    goToPage,
    viewFormDetails,
    downloading,
    downloadError,
    downloadSubmissionJson,
    downloadSubmissionXml,
    downloadSubmissionXlsx,
  }
}
