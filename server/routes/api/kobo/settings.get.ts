import { getKoboSettingsStatus } from "../../../utils/kobo-credentials"

export default defineEventHandler((event) => {
  return getKoboSettingsStatus(event)
})
