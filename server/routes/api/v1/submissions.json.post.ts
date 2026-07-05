import { createError, readBody, setResponseStatus } from "h3"

interface KoboV1SubmissionPayload {
  id: string
  submission: Record<string, unknown>
}

/**
 * Proxy a single v1 submission POST to Kobo (KC).
 * Always responds with HTTP 200 and { status, data } so batch uploads can handle per-row failures.
 */
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()

  if (!config.koboApiToken) {
    throw createError({
      statusCode: 500,
      statusMessage: "Kobo API token is not configured (set NUXT_KOBO_API_TOKEN)",
    })
  }

  const body = await readBody<KoboV1SubmissionPayload>(event)
  if (!body?.id || !body?.submission) {
    throw createError({
      statusCode: 400,
      statusMessage: "Request body must include id and submission",
    })
  }

  const base = config.koboBaseUrl.replace(/\/$/, "")
  const target = `${base}/api/v1/submissions.json`
  const headers = {
    Authorization: `Token ${config.koboApiToken}`,
    Accept: "application/json",
    "Content-Type": "application/json",
  }

  try {
    const response = await $fetch.raw(target, {
      method: "POST",
      headers,
      body,
    })

    setResponseStatus(event, 200)
    return { status: response.status, data: response._data }
  } catch (err: unknown) {
    const fetchErr = err as {
      response?: { status?: number }
      data?: unknown
      message?: string
    }

    const status = fetchErr.response?.status ?? 502
    setResponseStatus(event, 200)
    return {
      status,
      data: fetchErr.data ?? { message: fetchErr.message ?? "Kobo submission failed" },
    }
  }
})
