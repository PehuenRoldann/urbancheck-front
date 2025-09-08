export function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export function findKeyByValue(
  map: Map<number, string>,
  value: string
): number | null {
  for (const [key, val] of map.entries()) {
    if (val === value) {
      return key;
    }
  }
  return null;
}

export function formatForDateInput(
  d: string | Date | null | undefined
): string | null {
  if (!d) return null;
  const date = new Date(d);
  // corregimos a local para evitar corrimientos por timezone
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return local.toISOString().split('T')[0]; // "YYYY-MM-DD"
}
