import type { CreateExportPayload, ExportTask } from '~/lib/models/SurveyData'
import { sleep } from '~/lib/helpers/koboExport'
import { parseXlsxBlob } from '~/lib/helpers/xlsx'

export interface KoboExportApi {
  createExport: (assetUid: string, payload: CreateExportPayload) => Promise<ExportTask>
  getExport: (assetUid: string, exportUid: string) => Promise<ExportTask>
  downloadExportFile: (assetUid: string, exportUid: string) => Promise<Blob>
}

export async function waitForKoboExport(
  getExport: KoboExportApi['getExport'],
  assetUid: string,
  exportUid: string,
) {
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

export async function fetchKoboExportHeaders(
  api: KoboExportApi,
  assetUid: string,
  payload: CreateExportPayload,
) {
  const task = await api.createExport(assetUid, payload)
  await waitForKoboExport(api.getExport, assetUid, task.uid)
  const blob = await api.downloadExportFile(assetUid, task.uid)
  const parsed = await parseXlsxBlob(blob)
  return parsed.headers
}

export async function fetchKoboExportBlob(
  api: KoboExportApi,
  assetUid: string,
  payload: CreateExportPayload,
) {
  const task = await api.createExport(assetUid, payload)
  await waitForKoboExport(api.getExport, assetUid, task.uid)
  return api.downloadExportFile(assetUid, task.uid)
}
