export type ExcelTemplateId = "detailed" | "summary" | "workflow" | "priorities" | "timelog" | "handover";

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
  {
    id: "priorities",
    name: "Prioritet nəzarəti",
    description: "Təcili və yüksək prioritetli sifarişləri sürətli izləmək üçün.",
    fields: ["Sifariş kodu", "Sifariş adı", "Prioritet", "Cari mərhələ", "Ətraflı açıqlama", "Yaradılma tarixi"],
  },
  {
    id: "timelog",
    name: "Mərhələ vaxt hesabatı",
    description: "Sifarişin yaradılma və mərhələyə giriş vaxtlarını müqayisə edir.",
    fields: ["Sifariş kodu", "Sifariş adı", "Cari mərhələ", "Mərhələyə giriş tarixi", "Yaradılma tarixi", "Son yenilənmə"],
  },
  {
    id: "handover",
    name: "Təhvil-təslim siyahısı",
    description: "Anbar və şöbələrarası təhvil üçün əsas məlumatları cəmləyir.",
    fields: ["Sifariş kodu", "Sifariş adı", "Cari mərhələ", "Növbəti mərhələ", "Prioritet", "Status", "Ətraflı açıqlama"],
  },
];
