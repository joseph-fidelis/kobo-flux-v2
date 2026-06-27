import type { SubmissionRecord } from '~/lib/models/SurveyData'

function truncateUuid(uuid?: string) {
  if (!uuid) return '—'
  return uuid.length > 12 ? `${uuid.slice(0, 8)}…` : uuid
}

export function useSubmissionDisplay() {
  function formatSubmissionId(submission: SubmissionRecord) {
    return submission._id != null ? String(submission._id) : '—'
  }

  function formatSubmissionUuid(submission: SubmissionRecord) {
    return truncateUuid(submission._uuid)
  }

  function formatSubmissionUuidFull(submission: SubmissionRecord) {
    return submission._uuid ?? '—'
  }

  return {
    formatSubmissionId,
    formatSubmissionUuid,
    formatSubmissionUuidFull,
  }
}
