export const PROLINE_ACCESS_CODE = "010203" as const;

export const PROLINE_ROLE_MAP = {
  "sifariş": { role: "admin", label: "Sifariş" },
  "istehsalat": { role: "production", label: "İstehsalat", column: "production" },
  "cilalama": { role: "polishing", label: "Cilalama", column: "polishing" },
  "boyalama": { role: "paint", label: "Boyalama", column: "paint" },
  "anbar": { role: "warehouse", label: "Anbar", column: "warehouse" },
} as const;

export type ProlineEmail = keyof typeof PROLINE_ROLE_MAP;
export type ProlineRole = (typeof PROLINE_ROLE_MAP)[ProlineEmail]["role"];
export const PROLINE_BASE_COLUMN_ORDER = ["orders", "production", "polishing", "paint", "warehouse"] as const;
export type ProlineBaseColumn = (typeof PROLINE_BASE_COLUMN_ORDER)[number];
export type ProlineColumn = string;

export function ownProlineColumn(role: string): string | undefined {
  const config = Object.values(PROLINE_ROLE_MAP).find((item) => item.role === role);
  return config && "column" in config ? config.column : undefined;
}

export function visibleProlineColumns(role: string, columnOrder?: string[]): string[] {
  const order = columnOrder || [...PROLINE_BASE_COLUMN_ORDER];
  if (role === "admin") return [...order];
  const ownColumn = ownProlineColumn(role);
  if (!ownColumn) return [];
  const ownIndex = order.indexOf(ownColumn);
  if (ownIndex < 0) return [ownColumn];
  return [ownColumn, order[ownIndex + 1]].filter(Boolean) as string[];
}

export function nextProlineColumn(column: string, columnOrder?: string[]): string | undefined {
  const order = columnOrder || [...PROLINE_BASE_COLUMN_ORDER];
  return order[order.indexOf(column) + 1];
}

export function canProlineRoleMove(role: string, from: string, to: string, columnOrder?: string[]) {
  if (role === "admin") return true;
  const order = columnOrder || [...PROLINE_BASE_COLUMN_ORDER];
  const config = Object.values(PROLINE_ROLE_MAP).find((item) => item.role === role);
  const fromIndex = order.indexOf(from);
  const toIndex = order.indexOf(to);
  if (config && "column" in config) {
    return config.column === from && toIndex === fromIndex + 1;
  }
  return false;
}

export function slugify(text: string): string {
  return text
    .toLocaleLowerCase("az-AZ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
