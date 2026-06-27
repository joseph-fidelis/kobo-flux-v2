import type { AssetDeploymentStatus } from '~/lib/models/ProjectsLibrary'
import type { BadgeVariants } from '@/components/ui/badge'

export function useAssetStatus() {
  function formatDeploymentStatus(status?: AssetDeploymentStatus) {
    if (!status) return 'Draft'
    return status.charAt(0).toUpperCase() + status.slice(1)
  }

  function deploymentStatusVariant(
    status?: AssetDeploymentStatus,
  ): BadgeVariants['variant'] {
    switch (status) {
      case 'deployed':
        return 'default'
      case 'archived':
        return 'secondary'
      default:
        return 'outline'
    }
  }

  return { formatDeploymentStatus, deploymentStatusVariant }
}
