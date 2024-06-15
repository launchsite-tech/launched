export default function cloneDeep<T>(obj: T): T {
  if (typeof obj !== "object" || obj === null) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => cloneDeep(item)) as any;
  }

  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [key, cloneDeep(value)])
  ) as any;
}
