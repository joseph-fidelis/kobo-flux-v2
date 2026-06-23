export type SupportedCurrency = "USD" | "TZS";

const CURRENCY_CONFIG: Record<
  SupportedCurrency,
  {
    locale: string;
    minimumFractionDigits: number;
    maximumFractionDigits: number;
  }
> = {
  TZS: {
    locale: "sw-TZ",
    minimumFractionDigits: 0, // TZS has no decimals
    maximumFractionDigits: 0,
  },
  USD: {
    locale: "en-US",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  },
};

export function formatCurrency(
  amount: number | string,
  currency: SupportedCurrency = "TZS",
): string {
  const config = CURRENCY_CONFIG[currency];

  const numericAmount =
    typeof amount === "string"
      ? Number(amount.replace(/,/g, "").trim())
      : amount;
      
  return new Intl.NumberFormat(config.locale, {
    style: "currency",
    currency,
    minimumFractionDigits: config.minimumFractionDigits,
    maximumFractionDigits: config.maximumFractionDigits,
  }).format(numericAmount);
}

export function formatCurrencyCompact(
  amount: number,
  currency: SupportedCurrency = "TZS",
): string {
  const config = CURRENCY_CONFIG[currency];

  if (amount >= 1_000_000_000) {
    return `TSh ${(amount / 1_000_000_000).toFixed(1)}B`; // TSh 1.5B
  }
  if (amount >= 1_000_000) {
    return `TSh ${(amount / 1_000_000).toFixed(1)}M`; // TSh 1.5M
  }
  if (amount >= 1_000) {
    return `TSh ${(amount / 1_000).toFixed(0)}K`; // TSh 150K
  }
  return new Intl.NumberFormat(config.locale, {
    style: "currency",
    currency,
    minimumFractionDigits: config.minimumFractionDigits,
    maximumFractionDigits: config.maximumFractionDigits,
  }).format(amount);
}
