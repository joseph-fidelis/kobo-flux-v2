import type { H3Event } from "h3"
import { createError, getQuery, getRequestHeader, readRawBody } from "h3"

/**
 * Forward an incoming request to the KoboToolbox API.
 * Keeps the API token on the server so the browser never talks to Kobo directly.
 */
export async function proxyToKobo(event: H3Event, upstreamPath: string) {
  const config = useRuntimeConfig()

  if (!config.koboApiToken) {
    throw createError({
      statusCode: 500,
      statusMessage: "Kobo API token is not configured (set NUXT_KOBO_API_TOKEN)",
    })
  }

  const base = config.koboBaseUrl.replace(/\/$/, "")
  const path = upstreamPath.startsWith("/") ? upstreamPath : `/${upstreamPath}`
  const target = `${base}${path}`

  const method = event.method
  const query = getQuery(event)

  let body: string | ArrayBuffer | undefined
  if (method !== "GET" && method !== "HEAD") {
    body = (await readRawBody(event, false)) ?? undefined
  }

  const headers: Record<string, string> = {
    Authorization: `Token ${config.koboApiToken}`,
    Accept: getRequestHeader(event, "accept") || "application/json",
  }

  const contentType = getRequestHeader(event, "content-type")
  if (contentType) {
    headers["Content-Type"] = contentType
  }

  try {
    return await $fetch(target, {
      method,
      query,
      body,
      headers,
    })
  } catch (err: unknown) {
    const fetchErr = err as {
      response?: { status?: number }
      data?: { detail?: string; message?: string }
      message?: string
    }

    throw createError({
      statusCode: fetchErr.response?.status ?? 502,
      statusMessage:
        fetchErr.data?.detail ??
        fetchErr.data?.message ??
        fetchErr.message ??
        "Kobo API request failed",
      data: fetchErr.data,
    })
  }
}
