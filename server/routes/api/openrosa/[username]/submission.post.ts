import { createError, getRouterParam, readBody, setResponseStatus } from "h3"

interface KoboSubmissionPayload {
  id: string
  submission: Record<string, unknown>
}

/**
 * Proxy a single OpenRosa JSON submission to Kobo.
 * Upstream: POST {koboBaseUrl}/{username}/submission
 *
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

  const username = getRouterParam(event, "username")
  if (!username?.trim()) {
    throw createError({
      statusCode: 400,
      statusMessage: "Username is required in the submission path",
    })
  }

  const body = await readBody<KoboSubmissionPayload>(event)
  if (!body?.id || !body?.submission) {
    throw createError({
      statusCode: 400,
      statusMessage: "Request body must include id and submission",
    })
  }

  const base = config.koboBaseUrl.replace(/\/$/, "")
  const target = `${base}/${encodeURIComponent(username)}/submission`
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
