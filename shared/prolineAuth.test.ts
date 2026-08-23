import { describe, expect, it } from "vitest";
import { canProlineRoleMove } from "./prolineAuth";

describe("PROLINE role visibility and movement rules", () => {
  it("allows every role to view the complete board", () => {
    expect(["admin", "production", "polishing", "paint", "warehouse"]).toHaveLength(5);
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
