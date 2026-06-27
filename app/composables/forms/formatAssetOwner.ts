import type { Asset } from '~/lib/models/ProjectsLibrary'

export function formatAssetOwner(owner: string, asset: Asset) {
  if (asset.owner__username) return asset.owner__username
  const match = owner.match(/\/users\/([^/]+)\/?$/)
  return match?.[1] ?? owner
}
