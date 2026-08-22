import { describe, expect, it } from "vitest";
import { excelTemplates } from "./excelTemplates";

describe("PROLINE Excel şablonları", () => {
  it("altı fərqli export şablonunu Azərbaycan dilində saxlayır", () => {
    expect(excelTemplates).toHaveLength(6);
    expect(excelTemplates.map((template) => template.id)).toEqual(["detailed", "summary", "workflow", "priorities", "timelog", "handover"]);
    expect(excelTemplates[0].fields).toContain("Ətraflı açıqlama");
    expect(excelTemplates[0].fields).toContain("Yaradılma tarixi");
    expect(excelTemplates[2].fields).toContain("Təsdiq statusu");
  });
});
