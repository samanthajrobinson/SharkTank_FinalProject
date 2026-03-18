export function sanitizeText(value = '') {
  return String(value).replace(/[<>]/g, '').trim();
}

export function sanitizeArray(values = []) {
  return values.map((value) => sanitizeText(value)).filter(Boolean);
}
