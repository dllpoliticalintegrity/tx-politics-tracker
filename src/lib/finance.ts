export type Party = "D" | "R" | "I";

export const PARTY_COLOR: Record<string, string> = {
  D: "hsl(var(--dem))",
  R: "hsl(var(--rep))",
  I: "hsl(var(--ind))",
};

export const PARTY_LABEL: Record<string, string> = {
  D: "Democrat",
  R: "Republican",
  I: "Independent",
};

export function partyColor(party: string | null | undefined): string {
  return PARTY_COLOR[party ?? ""] ?? "hsl(var(--muted-foreground))";
}

export function partyLabel(party: string | null | undefined): string {
  return PARTY_LABEL[party ?? ""] ?? "Other";
}

export function formatCurrency(n: number | null | undefined): string {
  const v = n ?? 0;
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(2)}M`;
  if (v >= 1_000) return `$${(v / 1_000).toFixed(0)}K`;
  return `$${v.toLocaleString()}`;
}

export function formatCurrencyFull(n: number | null | undefined): string {
  const v = n ?? 0;
  return `$${v.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
}

export function contributorTypeLabel(code: string | null | undefined): string {
  switch ((code ?? "").toUpperCase()) {
    case "IND":
      return "Individual";
    case "COM":
      return "Committee";
    case "SCC":
      return "Small Contributor Committee";
    case "PTY":
      return "Political Party";
    case "OTH":
      return "Other";
    default:
      return "Unknown";
  }
}
