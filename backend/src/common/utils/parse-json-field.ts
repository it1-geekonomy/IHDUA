/** Multipart bodies send objects as JSON strings; invalid JSON is passed through so validators reject it. */
export function parseJsonField(value: unknown): unknown {
  if (typeof value !== 'string') return value;
  if (!value.trim()) return undefined;
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}
