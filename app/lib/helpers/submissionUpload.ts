import type {
  KoboV1SubmissionPayload,
  SubmissionFormMeta,
} from '~/lib/models/SurveyData'
import { isSystemExportColumn } from '~/lib/helpers/koboExport'

export interface HeaderValidation {
  valid: boolean
  expected: string[]
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

export function buildLabelToXpathMap(
  labelHeaders: string[],
  xpathHeaders: string[],
): Map<string, string> {
  const map = new Map<string, string>()
  const length = Math.min(labelHeaders.length, xpathHeaders.length)

  for (let i = 0; i < length; i += 1) {
    const label = labelHeaders[i]?.trim() ?? ''
    const xpath = xpathHeaders[i]?.trim() ?? ''
    if (!label || !xpath) continue
    if (isSystemExportColumn(label) || isSystemExportColumn(xpath)) continue
    map.set(label, xpath)
  }

  return map
}

export function rowsToFlatDicts(
  headers: string[],
  dataRows: (string | number)[][],
): Record<string, string>[] {
  return dataRows.map((row) => {
    const flat: Record<string, string> = {}
    headers.forEach((header, index) => {
      if (!header || isSystemExportColumn(header)) return
      const value = row[index]
      flat[header] = value == null ? '' : String(value)
    })
    return flat
  })
}

export function nestSubmissionFields(flat: Record<string, string>): Record<string, unknown> {
  const submission: Record<string, unknown> = {}

  for (const [key, value] of Object.entries(flat)) {
    if (!key || key.includes('remove')) continue

    if (key.includes('/')) {
      const parts = key.split('/')
      if (parts[0] === 'meta') {
        if (!submission.meta || typeof submission.meta !== 'object') {
          submission.meta = {}
        }
        const meta = submission.meta as Record<string, unknown>
        meta[parts[1]!] = value
        continue
      }

      let current = submission
      for (let i = 0; i < parts.length - 1; i += 1) {
        const part = parts[i]!
        if (
          !current[part]
          || typeof current[part] !== 'object'
          || Array.isArray(current[part])
        ) {
          current[part] = {}
        }
        current = current[part] as Record<string, unknown>
      }
      current[parts[parts.length - 1]!] = value
    } else {
      submission[key] = value
    }
  }

  return submission
}

function applyLabelToXpathMap(
  labelRow: Record<string, string>,
  labelToXpath: Map<string, string>,
): Record<string, string> {
  const flat: Record<string, string> = {}
  for (const [label, value] of Object.entries(labelRow)) {
    flat[labelToXpath.get(label) ?? label] = value
  }
  return flat
}

export function buildSubmissionPayload(
  formMeta: SubmissionFormMeta,
  flatXpathRow: Record<string, string>,
): KoboV1SubmissionPayload {
  const submission = nestSubmissionFields(flatXpathRow)

  if (!submission.meta || typeof submission.meta !== 'object') {
    submission.meta = {}
  }
  const meta = submission.meta as Record<string, unknown>
  if (!meta.instanceID) {
    meta.instanceID = `uuid:${crypto.randomUUID()}`
  }

  if (formMeta.formhubUuid) {
    submission.formhub = { uuid: formMeta.formhubUuid }
  }

  return {
    id: formMeta.formId,
    submission,
  }
}

export function labelRowToSubmissionPayload(
  formMeta: SubmissionFormMeta,
  labelRow: Record<string, string>,
  labelToXpath: Map<string, string>,
): KoboV1SubmissionPayload {
  return buildSubmissionPayload(formMeta, applyLabelToXpathMap(labelRow, labelToXpath))
}
