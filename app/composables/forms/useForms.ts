import type { Asset } from '~/lib/models/ProjectsLibrary'
import { useProjectsLibraryApi } from '~/services/project.service'
import { formatAssetOwner } from '~/composables/forms/formatAssetOwner'

export function useForms() {
  const { getAssets } = useProjectsLibraryApi()

  const forms = ref<Asset[]>([])
  const pending = ref(true)
  const error = ref<string | null>(null)

  async function refresh() {
    pending.value = true
    error.value = null
    try {
      const response = await getAssets({
        q: 'asset_type:survey',
        ordering: '-date_modified',
        current_user_permissions_only: true,
        limit: 100,
      })
      forms.value = response.results
    } catch (err: unknown) {
      const apiErr = err as { message?: string }
      error.value = apiErr.message ?? 'Failed to load forms'
      forms.value = []
    } finally {
      pending.value = false
    }
  }

  function viewDetails(uid: string) {
    navigateTo(`/forms/${uid}`)
  }

  function viewSubmissions(uid: string) {
    navigateTo({ path: '/forms/submissions', query: { form: uid } })
  }

  function uploadData(uid: string) {
    navigateTo({ path: '/forms/upload', query: { form: uid } })
  }

  onMounted(refresh)

  return {
    forms,
    pending,
    error,
    refresh,
    viewDetails,
    viewSubmissions,
    uploadData,
    formatOwner: formatAssetOwner,
  }
}
