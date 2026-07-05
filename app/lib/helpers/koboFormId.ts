import type { AssetContent } from '~/lib/models/FormContent'
import type { Asset, Deployment } from '~/lib/models/ProjectsLibrary'
import type { KoboV1FormListItem } from '~/lib/models/SurveyData'

export const FORM_ID_RESOLUTION_ERROR =
  'Could not resolve form id_string. Checked deployment identifiers, form content settings, XForm XML, and v1 forms list. Redeploy the form or verify the asset has settings.id_string in Kobo.'

/** Strip HTML preview wrapper when /xform/ returns syntax-highlighted HTML instead of raw XML. */
function extractXmlPayload(text: string): string {
  const trimmed = text.trim()
  const xmlStart = trimmed.indexOf('<?xml')
  if (xmlStart >= 0) return trimmed.slice(xmlStart)
  const htmlRoot = trimmed.match(/<h:html[\s\S]*<\/h:html>/i)
  if (htmlRoot?.[0]) return htmlRoot[0]
  return trimmed
}

/**
 * Parse id_string from a deployed XForm document.
 * Kobo primary instance: <instance><root id="id_string">...</root></instance>
 */
export function parseFormIdFromXform(xml: string): string | undefined {
  const body = extractXmlPayload(xml)
  if (!body) return undefined

  // Primary submission instance (no id on <instance> tag); root child carries id="id_string"
  const primaryRoot = body.match(
    /<instance>\s*<([A-Za-z0-9_:-]+)(?:\s[^>]*)?\sid="([^"]+)"/i,
  )
  if (primaryRoot?.[2]) return pickFormId(primaryRoot[2])
  if (primaryRoot?.[1]) return pickFormId(primaryRoot[1])

  // Some forms: id on <instance> itself (skip choice-list instances)
  const instanceIdMatches = body.matchAll(/<instance\s+id="([^"]+)"/gi)
  for (const match of instanceIdMatches) {
    const candidate = match[1]
    if (!candidate || candidate.endsWith('_list')) continue
    const parsed = pickFormId(candidate)
    if (parsed) return parsed
  }

  return undefined
}

/** Strip KC/KPI deployment URLs down to the bare id_string used by v1 POST. */
export function normalizeFormId(raw: string): string | undefined {
  const trimmed = raw.trim()
  if (!trimmed) return undefined

  const formsMatch = trimmed.match(/\/forms\/([^/?#]+)\/?$/)
  if (formsMatch?.[1]) return formsMatch[1]

  return trimmed
}

function pickFormId(raw: unknown): string | undefined {
  if (typeof raw !== 'string') return undefined
  return normalizeFormId(raw)
}

export function formIdFromContentSettings(
  settings: Record<string, unknown> | undefined,
): string | undefined {
  if (!settings) return undefined
  return pickFormId(settings.id_string) ?? pickFormId(settings.form_id)
}

function nestedDeploymentAsset(deployment: Deployment | null): Asset | undefined {
  if (!deployment || typeof deployment !== 'object') return undefined
  const nested = (deployment as unknown as Record<string, unknown>).asset
  if (!nested || typeof nested !== 'object') return undefined
  return nested as Asset
}

/** Resolve id_string from fields already present on asset/deployment responses. */
export function resolveFormIdFromAsset(
  asset: Asset,
  deployment: Deployment | null,
): string | undefined {
  const fromAssetIdentifier = pickFormId(asset.deployment__identifier)
  if (fromAssetIdentifier) return fromAssetIdentifier

  const fromDeploymentIdentifier = pickFormId(deployment?.identifier)
  if (fromDeploymentIdentifier) return fromDeploymentIdentifier

  const fromNestedContent = formIdFromContentSettings(
    nestedDeploymentAsset(deployment)?.content?.settings as Record<string, unknown> | undefined,
  )
  if (fromNestedContent) return fromNestedContent

  return formIdFromContentSettings(
    asset.content?.settings as Record<string, unknown> | undefined,
  )
}

export interface ResolveFormIdOptions {
  getAssetContent?: (assetUid: string) => Promise<AssetContent>
  getAssetXform?: (assetUid: string) => Promise<string>
  getV1Forms?: () => Promise<KoboV1FormListItem[]>
}

export async function resolveFormIdWithFallbacks(
  asset: Asset,
  deployment: Deployment | null,
  options: ResolveFormIdOptions = {},
): Promise<string | undefined> {
  const direct = resolveFormIdFromAsset(asset, deployment)
  if (direct) return direct

  if (options.getAssetContent) {
    try {
      const content = await options.getAssetContent(asset.uid)
      const fromContent = formIdFromContentSettings(content.settings)
      if (fromContent) return fromContent
    } catch {
      // fall through
    }
  }

  if (options.getAssetXform) {
    try {
      const xform = await options.getAssetXform(asset.uid)
      const fromXform = parseFormIdFromXform(xform)
      if (fromXform) return fromXform
    } catch {
      // fall through
    }
  }

  if (options.getV1Forms) {
    try {
      const forms = await options.getV1Forms()
      const deploymentUuid = asset.deployment__uuid
      if (typeof deploymentUuid === 'string' && deploymentUuid.trim()) {
        const byUuid = forms.find((form) => form.uuid === deploymentUuid)
        if (byUuid?.id_string) return pickFormId(byUuid.id_string)
      }

      const byTitle = forms.find(
        (form) => form.title === asset.name && typeof form.id_string === 'string',
      )
      if (byTitle?.id_string) return pickFormId(byTitle.id_string)
    } catch {
      // fall through
    }
  }

  return undefined
}
