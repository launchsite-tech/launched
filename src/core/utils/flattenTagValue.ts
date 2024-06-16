import type { TagData, FlatTagValue } from "../context";

export default function flattenTagValue<V extends TagData>(
  value: Record<string, V> | V | V[]
): FlatTagValue<V> {
  if (Array.isArray(value))
    return value.map((v) => flattenTagValue(v)) as FlatTagValue<V>;
  else if (typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, v]) => {
        if (typeof v === "object" && "value" in v) return [key, v.value];
        else return [key, flattenTagValue(v)];
      })
    ) as FlatTagValue<V>;
  } else return value;
}
