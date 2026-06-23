import { proxyToKobo } from "../../utils/proxy-kobo"

export default defineEventHandler(async (event) => {
  const path = getRouterParam(event, "path")
  const upstream = path ? `/me/${path}` : "/me"
  return proxyToKobo(event, upstream)
})
