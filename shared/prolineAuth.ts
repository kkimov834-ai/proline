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
