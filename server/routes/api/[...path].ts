import { proxyToKobo } from "../../utils/proxy-kobo"

export default defineEventHandler(async (event) => {
  const path = getRouterParam(event, "path") || ""
  return proxyToKobo(event, `/api/${path}`)
})
