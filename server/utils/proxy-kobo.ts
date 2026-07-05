import type { H3Event } from "h3"
import { createError, getQuery, getRequestHeader, readRawBody, setResponseHeaders } from "h3"

function isBinaryUpstreamPath(path: string) {
  return /\/xls\/?$/.test(path)
}

function isTextXmlUpstreamPath(path: string) {
  return /\/xform\/?$/.test(path)
}

function isSubmissionDataXmlExport(path: string, query: Record<string, unknown>) {
  return /\/data\/?$/.test(path) && String(query.format ?? "") === "xml"
}

function usesWildcardAccept(path: string, query: Record<string, unknown>) {
  return (
    isBinaryUpstreamPath(path)
    || isTextXmlUpstreamPath(path)
    || isSubmissionDataXmlExport(path, query)
  )
}

/** Kobo's Django API requires trailing slashes; Nitro catch-all routes may strip them. */
function normalizeKoboApiPath(path: string) {
  if (/\.[a-zA-Z0-9]+$/.test(path)) return path
  return path.endsWith("/") ? path : `${path}/`
}

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
  const path = normalizeKoboApiPath(
    upstreamPath.startsWith("/") ? upstreamPath : `/${upstreamPath}`,
  )
  const target = `${base}${path}`

  const method = event.method
  const query = getQuery(event)

  let body: string | ArrayBuffer | undefined
  if (method !== "GET" && method !== "HEAD") {
    body = (await readRawBody(event, false)) ?? undefined
  }

  const clientAccept = getRequestHeader(event, "accept")
  const headers: Record<string, string> = {
    Authorization: `Token ${config.koboApiToken}`,
    Accept: usesWildcardAccept(path, query) ? "*/*" : clientAccept || "application/json",
  }

  const contentType = getRequestHeader(event, "content-type")
  if (contentType) {
    headers["Content-Type"] = contentType
  }

  try {
    if (isBinaryUpstreamPath(path)) {
      const response = await $fetch.raw(target, {
        method,
        query,
        body,
        headers,
        responseType: "arrayBuffer",
      })

      setResponseHeaders(event, {
        "content-type":
          response.headers.get("content-type") ??
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        ...(response.headers.get("content-disposition")
          ? { "content-disposition": response.headers.get("content-disposition")! }
          : {}),
      })

      return new Uint8Array(response._data as ArrayBuffer)
    }

    if (isSubmissionDataXmlExport(path, query) || isTextXmlUpstreamPath(path)) {
      const response = await $fetch.raw(target, {
        method,
        query,
        body,
        headers,
        responseType: "text",
      })

      setResponseHeaders(event, {
        "content-type": response.headers.get("content-type") ?? "application/xml",
      })

      return response._data
    }

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
