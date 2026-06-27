import type { ValidationStatus } from '~/lib/models/SurveyData'
import type { BadgeVariants } from '@/components/ui/badge'

export function useValidationStatus() {
  function formatValidationStatus(
    status?: ValidationStatus | Record<string, never>,
  ) {
    if (!status || !('uid' in status) || !status.uid) return 'Not reviewed'

    switch (status.uid) {
      case 'validation_status_approved':
        return 'Approved'
      case 'validation_status_not_approved':
        return 'Not approved'
      case 'validation_status_on_hold':
        return 'On hold'
      default:
        return status.uid
    }
  }

  function validationStatusVariant(
    status?: ValidationStatus | Record<string, never>,
  ): BadgeVariants['variant'] {
    if (!status || !('uid' in status) || !status.uid) return 'outline'

    switch (status.uid) {
      case 'validation_status_approved':
        return 'default'
      case 'validation_status_on_hold':
        return 'secondary'
      case 'validation_status_not_approved':
        return 'destructive'
      default:
        return 'outline'
    }
  }

  return { formatValidationStatus, validationStatusVariant }
}
