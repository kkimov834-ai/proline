export function normalizePreviewFields(templateFields: string[], storedFields?: string[]) {
  if (!storedFields?.length) return [...templateFields];
  const allowed = new Set(templateFields);
  const uniqueStored = storedFields.filter((field, index) => allowed.has(field) && storedFields.indexOf(field) === index);
  return uniqueStored.length ? uniqueStored : [templateFields[0]];
}

export function movePreviewField(fields: string[], index: number, offset: -1 | 1) {
  const target = index + offset;
  if (index < 0 || index >= fields.length || target < 0 || target >= fields.length) return [...fields];
  const next = [...fields];
  [next[index], next[target]] = [next[target], next[index]];
  return next;
}

export function hidePreviewField(fields: string[], field: string) {
  if (fields.length <= 1) return [...fields];
  return fields.filter((item) => item !== field);
}

export function showPreviewField(fields: string[], field: string, templateFields: string[]) {
  if (!templateFields.includes(field) || fields.includes(field)) return [...fields];
  return [...fields, field];
}
