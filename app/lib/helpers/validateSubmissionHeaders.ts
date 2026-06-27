import { isSystemExportColumn } from '~/lib/helpers/koboExport'

export interface HeaderValidation {
  valid: boolean
  /** Full header row from Kobo export (includes system columns). */
  expected: string[]
  /** Question-label columns only (used for matching uploads). */
  expectedData: string[]
  uploaded: string[]
  missing: string[]
  extra: string[]
}

export function validateSubmissionHeaders(
  expected: string[],
  uploaded: string[],
): HeaderValidation {
  const expectedData = expected.filter((h) => !isSystemExportColumn(h))
  const uploadedData = uploaded.filter((h) => !isSystemExportColumn(h))

  const expectedSet = new Set(expectedData)
  const uploadedSet = new Set(uploadedData)

  const missing = expectedData.filter((h) => !uploadedSet.has(h))
  const extra = uploadedData.filter((h) => !expectedSet.has(h))

  return {
    valid: missing.length === 0 && extra.length === 0,
    expected,
    expectedData,
    uploaded,
    missing,
    extra,
  }
}
