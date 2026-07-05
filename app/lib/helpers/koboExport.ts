import type { CreateExportPayload } from '~/lib/models/SurveyData'

/** Columns Kobo adds to data exports — not required in upload spreadsheets. */
export const SYSTEM_EXPORT_COLUMNS = new Set([
  '_id',
  '_uuid',
  '_submission_time',
  '_validation_status',
  '_submitted_by',
  '_status',
  '_version',
  'meta/instanceID',
  'instanceID',
])

export function isSystemExportColumn(header: string) {
  const trimmed = header.trim()
  return SYSTEM_EXPORT_COLUMNS.has(trimmed) || trimmed.startsWith('_')
}

/** Matches Kobo UI / download export settings (label columns, lang `_default`). */
export function buildKoboLabelExportPayload(
  overrides: Partial<CreateExportPayload> = {},
): CreateExportPayload {
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
    ...overrides,
  }
}

/** Same export settings as label export but with xpath column headers. */
export function buildKoboXmlExportPayload(
  overrides: Partial<CreateExportPayload> = {},
): CreateExportPayload {
  return buildKoboLabelExportPayload({ lang: '_xml', ...overrides })
}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
