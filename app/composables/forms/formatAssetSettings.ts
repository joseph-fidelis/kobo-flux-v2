import type {
  AssetSettings,
  DeploymentLinks,
} from "~/lib/models/ProjectsLibrary";

export interface FormattedAssetSettings {
  description: string | null;
  sector: string | null;
  countries: string[];
  organization: string | null;
  collectsPii: string | null;
  operationalPurpose: string | null;
  dataTableColumns: string[];
  hasContent: boolean;
}

export const DEPLOYMENT_LINK_LABELS: Record<keyof DeploymentLinks, string> = {
  url: "Web form",
  single_url: "Single-page form",
  single_once_url: "One-time submission",
  offline_url: "Offline form",
  preview_url: "Preview",
  iframe_url: "Embed (iframe)",
  single_iframe_url: "Embed single-page",
  single_once_iframe_url: "Embed one-time",
};

function formatPii(value: AssetSettings["collects_pii"]): string | null {
  if (value == null || value === "") return null;
  if (typeof value === "boolean") return value ? "Yes" : "No";
  return String(value);
}

export function getDeploymentLinks(
  asset:
    | {
        deployment__links?: DeploymentLinks;
        deployment_links?: DeploymentLinks;
      }
    | null
    | undefined,
): DeploymentLinks | undefined {
  if (!asset) return undefined;
  return asset.deployment__links ?? asset.deployment_links;
}

export function formatAssetSettings(
  settings: Record<string, unknown> | undefined,
): FormattedAssetSettings {
  const s = (settings ?? {}) as AssetSettings;

  const sector = s.sector;
  const sectorLabel =
    typeof sector === "string"
      ? sector
      : (sector?.label ?? sector?.value ?? null);

  let countries: string[] = [];
  if (Array.isArray(s.country)) {
    countries = s.country
      .map((item) => item.label ?? item.value)
      .filter((value): value is string => Boolean(value));
  } else if (typeof s.country === "string" && s.country) {
    countries = [s.country];
  } else if (Array.isArray(s.country_codes) && s.country_codes.length > 0) {
    countries = s.country_codes;
  }

  const dataTableColumns = s["data-table"]?.["selected-columns"] ?? [];

  const description = typeof s.description === "string" ? s.description : null;
  const organization =
    typeof s.organization === "string" && s.organization
      ? s.organization
      : null;
  const collectsPii = formatPii(s.collects_pii);
  const operationalPurpose =
    typeof s.operational_purpose === "string" && s.operational_purpose
      ? s.operational_purpose
      : null;

  const hasContent = Boolean(
    description ||
    sectorLabel ||
    countries.length > 0 ||
    organization ||
    collectsPii ||
    operationalPurpose ||
    dataTableColumns.length > 0,
  );

  return {
    description,
    sector: sectorLabel,
    countries,
    organization,
    collectsPii,
    operationalPurpose,
    dataTableColumns,
    hasContent,
  };
}
