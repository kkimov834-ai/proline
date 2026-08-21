export type ExcelTemplateId = "detailed" | "summary" | "workflow";

export type ExcelTemplate = {
  id: ExcelTemplateId;
  name: string;
  description: string;
  fields: string[];
};

export const excelTemplates: ExcelTemplate[] = [
  {
    id: "detailed",
    name: "Ətraflı istehsalat hesabatı",
    description: "Sifariş, tarixçə, mərhələ, prioritet və təsdiq məlumatlarını tam göstərir.",
    fields: ["Sifariş kodu", "Sifariş adı", "Ətraflı açıqlama", "Prioritet", "Cari mərhələ", "Gözlənilən keçid", "İmtina səbəbi", "Yaradılma tarixi", "Son yenilənmə", "Mərhələyə giriş tarixi"],
  },
  {
    id: "summary",
    name: "Rəhbərlik üçün qısa icmal",
    description: "Rəhbərlik baxışı üçün əsas KPI və əməliyyat sütunlarını yığcam göstərir.",
    fields: ["Sifariş kodu", "Sifariş adı", "Cari mərhələ", "Prioritet", "Yaradılma tarixi", "Status"],
  },
  {
    id: "workflow",
    name: "İş axını nəzarəti",
    description: "Keçid təsdiqləri, gözləmə və imtina səbəblərini ön plana çıxarır.",
    fields: ["Sifariş kodu", "Sifariş adı", "Cari mərhələ", "Növbəti mərhələ", "Təsdiq statusu", "İmtina səbəbi", "Yaradılma tarixi", "Son yenilənmə"],
  },
];
