export const PROLINE_ACCESS_CODE = "010203" as const;

export const PROLINE_ROLE_MAP = {
  "dispatcher@proline": { role: "admin", label: "Sifariş" },
  "production@proline": { role: "production", label: "İstehsalat", column: "production" },
  "polishing@proline": { role: "polishing", label: "Cilalama", column: "polishing" },
  "paint@proline": { role: "paint", label: "Boyalama", column: "paint" },
  "warehouse@proline": { role: "warehouse", label: "Anbar", column: "warehouse" },
} as const;

export type ProlineEmail = keyof typeof PROLINE_ROLE_MAP;
export type ProlineRole = (typeof PROLINE_ROLE_MAP)[ProlineEmail]["role"];
