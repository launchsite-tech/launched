export default function flattenNestedValues(obj: any): any {
  if (typeof obj !== "object" || !obj) return obj;

  if (Array.isArray(obj)) {
    return obj.map(flattenNestedValues);
  }

  if ("value" in obj) {
    return flattenNestedValues(obj.value);
  }

  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [key, flattenNestedValues(value)])
  );
}
