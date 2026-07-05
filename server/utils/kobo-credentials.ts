import type { H3Event } from "h3"
import { createError, getCookie } from "h3"

export const KOBO_COOKIE_TOKEN = "koboflux_kobo_token"
export const KOBO_COOKIE_BASE_URL = "koboflux_kobo_base_url"

export interface KoboCredentials {
  token: string
  baseUrl: string
  source: "cookie" | "env"
}

export interface KoboSettingsStatus {
  configured: boolean
  baseUrl: string | null
  source: "cookie" | "env" | null
  tokenMasked: string | null
  hasCookieCredentials: boolean
}

function normalizeBaseUrl(raw: string): string | null {
  const trimmed = raw.trim()
  if (!trimmed) return null
  try {
    const url = new URL(trimmed)
    if (url.protocol !== "https:" && url.protocol !== "http:") return null
    return trimmed.replace(/\/$/, "")
  } catch {
    return null
  }
}

function maskToken(token: string): string {
  if (token.length <= 8) return "••••••••"
  return `${token.slice(0, 4)}••••${token.slice(-4)}`
}

function credentialsFromEnv(): KoboCredentials | null {
  const config = useRuntimeConfig()
  const token = config.koboApiToken?.trim()
  const baseUrl = normalizeBaseUrl(config.koboBaseUrl ?? "")
  if (!token || !baseUrl) return null
  return { token, baseUrl, source: "env" }
}

function credentialsFromCookies(event: H3Event): KoboCredentials | null {
  const token = getCookie(event, KOBO_COOKIE_TOKEN)?.trim()
  const baseUrl = normalizeBaseUrl(getCookie(event, KOBO_COOKIE_BASE_URL) ?? "")
  if (!token || !baseUrl) return null
  return { token, baseUrl, source: "cookie" }
}

export function resolveKoboCredentials(event: H3Event): KoboCredentials | null {
  return credentialsFromCookies(event) ?? credentialsFromEnv()
}

export function requireKoboCredentials(event: H3Event): KoboCredentials {
  const credentials = resolveKoboCredentials(event)
  if (!credentials) {
    throw createError({
      statusCode: 401,
      statusMessage: "Kobo credentials not configured. Open Settings.",
    })
  }
  return credentials
}

export function getKoboSettingsStatus(event: H3Event): KoboSettingsStatus {
  const fromCookie = credentialsFromCookies(event)
  const fromEnv = credentialsFromEnv()
  const active = fromCookie ?? fromEnv

  return {
    configured: Boolean(active),
    baseUrl: active?.baseUrl ?? null,
    source: active?.source ?? null,
    tokenMasked: active ? maskToken(active.token) : null,
    hasCookieCredentials: Boolean(fromCookie),
  }
}

export function koboSessionCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
  }
}

export async function validateKoboCredentials(
  token: string,
  baseUrl: string,
): Promise<void> {
  const normalized = normalizeBaseUrl(baseUrl)
  if (!normalized) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid Kobo base URL. Use https://kf.kobotoolbox.org or https://eu.kobotoolbox.org",
    })
  }

  const trimmedToken = token.trim()
  if (!trimmedToken) {
    throw createError({
      statusCode: 400,
      statusMessage: "Kobo API token is required",
    })
  }

  try {
    await $fetch(`${normalized}/me/`, {
      headers: {
        Authorization: `Token ${trimmedToken}`,
        Accept: "application/json",
      },
    })
  } catch (err: unknown) {
    const fetchErr = err as {
      response?: { status?: number }
      data?: { detail?: string; message?: string }
      message?: string
    }

    throw createError({
      statusCode: 400,
      statusMessage:
        fetchErr.data?.detail
        ?? fetchErr.data?.message
        ?? fetchErr.message
        ?? "Could not connect to Kobo with the provided credentials",
    })
  }
}
