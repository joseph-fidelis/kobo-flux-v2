import type { Asset } from '~/lib/models/ProjectsLibrary'
import { formatAssetOwner } from '~/composables/forms/formatAssetOwner'
import { useProjectsLibraryApi } from '~/services/project.service'

const RECENT_FORMS_LIMIT = 8

export interface DashboardKpis {
  totalForms: number
  deployedForms: number
  totalSubmissions: number
  activeCollectors: number
}

function computeKpis(forms: Asset[]): DashboardKpis {
  let totalSubmissions = 0
  let deployedForms = 0
  let activeCollectors = 0

  for (const form of forms) {
    totalSubmissions += form.deployment__submission_count ?? 0
    if (form.deployment_status === 'deployed') {
      deployedForms += 1
    }
    if (form.deployment__active) {
      activeCollectors += 1
    }
  }

  return {
    totalForms: forms.length,
    deployedForms,
    totalSubmissions,
    activeCollectors,
  }
}

export function useDashboard() {
  const { getAssets } = useProjectsLibraryApi()
  const { track } = useAnalytics()

  const forms = ref<Asset[]>([])
  const pending = ref(true)
  const error = ref<string | null>(null)

  const kpis = computed(() => computeKpis(forms.value))

  const recentForms = computed(() => forms.value.slice(0, RECENT_FORMS_LIMIT))

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
      const stats = computeKpis(forms.value)
      track('dashboard_loaded', {
        form_count: stats.totalForms,
        submission_count: stats.totalSubmissions,
      })
    } catch (err: unknown) {
      const apiErr = err as { message?: string }
      error.value = apiErr.message ?? 'Failed to load dashboard'
      forms.value = []
    } finally {
      pending.value = false
    }
  }

  function viewForm(uid: string) {
    navigateTo(`/forms/${uid}`)
  }

  function viewAllForms() {
    navigateTo('/forms')
  }

  onMounted(refresh)

  return {
    forms,
    kpis,
    recentForms,
    pending,
    error,
    refresh,
    viewForm,
    viewAllForms,
    formatOwner: formatAssetOwner,
  }
}
