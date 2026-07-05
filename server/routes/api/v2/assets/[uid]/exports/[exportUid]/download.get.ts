import type { ExportTask } from "~/lib/models/SurveyData"
import { createError, setResponseHeaders } from "h3"
import { requireKoboCredentials } from "../../../../../../../utils/kobo-credentials"

/**
 * Download a completed async export file server-side (result URLs require auth).
 */
export default defineEventHandler(async (event) => {
  const { token, baseUrl } = requireKoboCredentials(event)
  const assetUid = getRouterParam(event, "uid")
  const exportUid = getRouterParam(event, "exportUid")

  if (!assetUid || !exportUid) {
    throw createError({ statusCode: 400, statusMessage: "Missing asset or export uid" })
  }

  const authHeaders = { Authorization: `Token ${token}` }

  const task = await $fetch<ExportTask>(
    `${baseUrl}/api/v2/assets/${assetUid}/exports/${exportUid}/`,
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
