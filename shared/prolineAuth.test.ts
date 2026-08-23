import { describe, expect, it } from "vitest";
import { canProlineRoleMove, PROLINE_COLUMN_ORDER, PROLINE_ROLE_MAP } from "./prolineAuth";

describe("PROLINE role visibility and movement rules", () => {
  it("allows every role to view the complete five-column board", () => {
    expect(PROLINE_COLUMN_ORDER).toEqual(["orders", "production", "polishing", "paint", "warehouse"]);
    expect(Object.values(PROLINE_ROLE_MAP)).toHaveLength(5);
  });

  it("uses the exact short Azerbaijani login identifiers", () => {
    expect(Object.keys(PROLINE_ROLE_MAP)).toEqual(["sifariş", "istehsalat", "cilalama", "boyalama", "anbar"]);
    expect(Object.keys(PROLINE_ROLE_MAP).some((email) => email.includes("@"))).toBe(false);
  });

  it("allows a department to request only the next stage", () => {
    expect(canProlineRoleMove("production", "production", "polishing")).toBe(true);
    expect(canProlineRoleMove("production", "production", "paint")).toBe(false);
    expect(canProlineRoleMove("polishing", "polishing", "paint")).toBe(true);
    expect(canProlineRoleMove("warehouse", "warehouse", "orders")).toBe(false);
  });

  it("allows Admin to move between stages", () => {
    expect(canProlineRoleMove("admin", "orders", "warehouse")).toBe(true);
  });
});
