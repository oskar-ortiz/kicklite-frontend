/**
 * Convierte un valor a número válido y seguro.
 */
export const safeNumber = (
  value: any,
  fallback: number = 0
): number => {
  const n = Number(value);
  return isNaN(n) ? fallback : n;
};

/**
 * Versión segura de toLocaleString() para números.
 */
export const safeLocale = (
  value: number | string | null | undefined,
  fallback: number = 0
): string => {
  const n = safeNumber(value, fallback);
  try {
    return n.toLocaleString();
  } catch {
    return fallback.toLocaleString();
  }
};

/**
 * Devuelve siempre una fecha válida.
 */
export const safeDate = (value: any): Date => {
  const date = new Date(value);
  if (isNaN(date.getTime())) {
    return new Date();
  }
  return date;
};
