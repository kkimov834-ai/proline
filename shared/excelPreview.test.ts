import { describe, expect, it } from "vitest";
import { hidePreviewField, movePreviewField, normalizePreviewFields, showPreviewField } from "./excelPreview";

describe("Excel preview sütun idarəetməsi", () => {
  const fields = ["Sifariş kodu", "Sifariş adı", "Prioritet"];

  it("saxlanmış sıranı qoruyur və naməlum sütunları silir", () => {
    expect(normalizePreviewFields(fields, ["Prioritet", "Naməlum", "Sifariş adı", "Prioritet"])).toEqual(["Prioritet", "Sifariş adı"]);
  });

  it("sütunların yerini dəyişir", () => {
    expect(movePreviewField(fields, 2, -1)).toEqual(["Sifariş kodu", "Prioritet", "Sifariş adı"]);
  });

  it("son görünən sütunun gizlədilməsinə icazə vermir və gizli sütunu qaytarır", () => {
    expect(hidePreviewField(["Sifariş kodu"], "Sifariş kodu")).toEqual(["Sifariş kodu"]);
    expect(showPreviewField(["Sifariş kodu"], "Prioritet", fields)).toEqual(["Sifariş kodu", "Prioritet"]);
  });
});
