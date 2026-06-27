import type { ExportTask } from "~/lib/models/SurveyData"
import { createError, setResponseHeaders } from "h3"

/**
 * Download a completed async export file server-side (result URLs require auth).
 */
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const assetUid = getRouterParam(event, "uid")
  const exportUid = getRouterParam(event, "exportUid")

  if (!config.koboApiToken) {
    throw createError({
      statusCode: 500,
      statusMessage: "Kobo API token is not configured (set NUXT_KOBO_API_TOKEN)",
    })
  }

  if (!assetUid || !exportUid) {
    throw createError({ statusCode: 400, statusMessage: "Missing asset or export uid" })
  }

  const base = config.koboBaseUrl.replace(/\/$/, "")
  const authHeaders = { Authorization: `Token ${config.koboApiToken}` }

  const task = await $fetch<ExportTask>(
    `${base}/api/v2/assets/${assetUid}/exports/${exportUid}/`,
    { headers: authHeaders },
  )

  if (task.status !== "complete" || !task.result) {
    throw createError({
      statusCode: 409,
      statusMessage: `Export is not ready (status: ${task.status ?? "unknown"})`,
    })
  }

  const response = await $fetch.raw(task.result, {
    headers: authHeaders,
    responseType: "arrayBuffer",
  })

  setResponseHeaders(event, {
    "content-type":
      response.headers.get("content-type")
      ?? "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ...(response.headers.get("content-disposition")
      ? { "content-disposition": response.headers.get("content-disposition")! }
      : {}),
  })

  return new Uint8Array(response._data as ArrayBuffer)
})
