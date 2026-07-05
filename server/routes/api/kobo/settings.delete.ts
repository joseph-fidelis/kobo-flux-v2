import { deleteCookie } from "h3"
import {
  KOBO_COOKIE_BASE_URL,
  KOBO_COOKIE_TOKEN,
  getKoboSettingsStatus,
  koboSessionCookieOptions,
} from "../../../utils/kobo-credentials"

export default defineEventHandler((event) => {
  const cookieOptions = koboSessionCookieOptions()
  deleteCookie(event, KOBO_COOKIE_TOKEN, cookieOptions)
  deleteCookie(event, KOBO_COOKIE_BASE_URL, cookieOptions)

  return getKoboSettingsStatus(event)
})
