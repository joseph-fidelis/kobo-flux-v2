import { readBody, setCookie } from "h3"
import {
  KOBO_COOKIE_BASE_URL,
  KOBO_COOKIE_TOKEN,
  getKoboSettingsStatus,
  koboSessionCookieOptions,
  validateKoboCredentials,
} from "../../../utils/kobo-credentials"

interface SaveKoboSettingsBody {
  token?: string
  baseUrl?: string
}

export default defineEventHandler(async (event) => {
  const body = await readBody<SaveKoboSettingsBody>(event)
  const token = typeof body?.token === "string" ? body.token.trim() : ""
  const baseUrl = typeof body?.baseUrl === "string" ? body.baseUrl.trim() : ""

  await validateKoboCredentials(token, baseUrl)

  const cookieOptions = koboSessionCookieOptions()
  setCookie(event, KOBO_COOKIE_TOKEN, token, cookieOptions)
  setCookie(event, KOBO_COOKIE_BASE_URL, baseUrl.replace(/\/$/, ""), cookieOptions)

  return getKoboSettingsStatus(event)
})
