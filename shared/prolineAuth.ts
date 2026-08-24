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
export const PROLINE_COLUMN_ORDER = ["orders", "production", "polishing", "paint", "warehouse"] as const;
export type ProlineColumn = (typeof PROLINE_COLUMN_ORDER)[number];
export function ownProlineColumn(role: ProlineRole): ProlineColumn | undefined {
  const config = Object.values(PROLINE_ROLE_MAP).find((item) => item.role === role);
  return config && "column" in config ? config.column : undefined;
}

export function visibleProlineColumns(role: ProlineRole): ProlineColumn[] {
  if (role === "admin") return [...PROLINE_COLUMN_ORDER];
  const ownColumn = ownProlineColumn(role);
  if (!ownColumn) return [];
  const ownIndex = PROLINE_COLUMN_ORDER.indexOf(ownColumn);
  return [ownColumn, PROLINE_COLUMN_ORDER[ownIndex + 1]].filter(Boolean) as ProlineColumn[];
}

export function nextProlineColumn(column: ProlineColumn): ProlineColumn | undefined {
  return PROLINE_COLUMN_ORDER[PROLINE_COLUMN_ORDER.indexOf(column) + 1];
}

export function canProlineRoleMove(role: ProlineRole, from: ProlineColumn, to: ProlineColumn) {
  if (role === "admin") return true;
  const config = Object.values(PROLINE_ROLE_MAP).find((item) => item.role === role);
  const fromIndex = PROLINE_COLUMN_ORDER.indexOf(from);
  const toIndex = PROLINE_COLUMN_ORDER.indexOf(to);
  return !!config && "column" in config && config.column === from && toIndex === fromIndex + 1;
}
