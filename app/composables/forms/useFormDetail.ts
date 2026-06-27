import type { Asset, Deployment } from '~/lib/models/ProjectsLibrary'
import { sanitizeFilename, triggerBrowserDownload } from '~/lib/helpers/download'
import { formatAssetOwner } from '~/composables/forms/formatAssetOwner'
import { useProjectsLibraryApi } from '~/services/project.service'
import { useFormContentApi } from '~/services/form.service'

type FormDownloadFormat = 'json' | 'xml' | 'xlsx'

export function useFormDetail(uid: MaybeRefOrGetter<string>) {
  const { getAsset, getDeployment } = useProjectsLibraryApi()
  const { getAssetContent, getAssetXform, getAssetXls } = useFormContentApi()

  const assetUid = computed(() => toValue(uid))
  const form = ref<Asset | null>(null)
  const deployment = ref<Deployment | null>(null)
  const pending = ref(true)
  const error = ref<string | null>(null)
  const downloading = ref<FormDownloadFormat | null>(null)
  const downloadError = ref<string | null>(null)

  const downloadBaseName = computed(() =>
    sanitizeFilename(form.value?.name ?? assetUid.value),
  )

  async function refresh() {
    const id = assetUid.value
    if (!id) return

    pending.value = true
    error.value = null
    deployment.value = null

    try {
      const asset = await getAsset(id)
      form.value = asset

      if (asset.has_deployment) {
        try {
          deployment.value = await getDeployment(id)
        } catch {
          deployment.value = null
        }
      }
    } catch (err: unknown) {
      const apiErr = err as { message?: string }
      error.value = apiErr.message ?? 'Failed to load form'
      form.value = null
    } finally {
      pending.value = false
    }
  }

  function viewSubmissions() {
    navigateTo({ path: '/forms/submissions', query: { form: assetUid.value } })
  }

  async function downloadFormJson() {
    const id = assetUid.value
    if (!id) return

    downloading.value = 'json'
    downloadError.value = null
    try {
      const content = await getAssetContent(id)
      const blob = new Blob([JSON.stringify(content, null, 2)], {
        type: 'application/json',
      })
      triggerBrowserDownload(blob, `${downloadBaseName.value}.json`)
    } catch (err: unknown) {
      const apiErr = err as { message?: string }
      downloadError.value = apiErr.message ?? 'Failed to download JSON'
    } finally {
      downloading.value = null
    }
  }

  async function downloadFormXml() {
    const id = assetUid.value
    if (!id) return

    downloading.value = 'xml'
    downloadError.value = null
    try {
      const xml = await getAssetXform(id)
      const blob = new Blob([xml], { type: 'application/xml' })
      triggerBrowserDownload(blob, `${downloadBaseName.value}.xml`)
    } catch (err: unknown) {
      const apiErr = err as { message?: string }
      downloadError.value = apiErr.message ?? 'Failed to download XML'
    } finally {
      downloading.value = null
    }
  }

  async function downloadFormXlsx() {
    const id = assetUid.value
    if (!id) return

    downloading.value = 'xlsx'
    downloadError.value = null
    try {
      const blob = await getAssetXls(id)
      triggerBrowserDownload(blob, `${downloadBaseName.value}.xlsx`)
    } catch (err: unknown) {
      const apiErr = err as { message?: string }
      downloadError.value = apiErr.message ?? 'Failed to download XLSX'
    } finally {
      downloading.value = null
    }
  }

  const settingsDescription = computed(() => {
    const description = form.value?.settings?.description
    return typeof description === 'string' ? description : null
  })

  const settingsSector = computed(() => {
    const sector = form.value?.settings?.sector
    return typeof sector === 'string' ? sector : null
  })

  const settingsCountry = computed(() => {
    const country = form.value?.settings?.country
    return typeof country === 'string' ? country : null
  })

  watch(assetUid, refresh, { immediate: true })

  return {
    form,
    deployment,
    pending,
    error,
    downloading,
    downloadError,
    refresh,
    viewSubmissions,
    downloadFormJson,
    downloadFormXml,
    downloadFormXlsx,
    formatOwner: formatAssetOwner,
    settingsDescription,
    settingsSector,
    settingsCountry,
  }
}
