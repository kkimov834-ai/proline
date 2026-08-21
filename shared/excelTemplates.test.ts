import { describe, expect, it } from "vitest";
import { excelTemplates } from "./excelTemplates";

describe("PROLINE Excel şablonları", () => {
  it("üç fərqli export şablonunu Azərbaycan dilində saxlayır", () => {
    expect(excelTemplates).toHaveLength(3);
    expect(excelTemplates.map((template) => template.id)).toEqual(["detailed", "summary", "workflow"]);
    expect(excelTemplates[0].fields).toContain("Ətraflı açıqlama");
    expect(excelTemplates[0].fields).toContain("Yaradılma tarixi");
    expect(excelTemplates[2].fields).toContain("Təsdiq statusu");
  });
});
