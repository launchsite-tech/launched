// * From [launched]/src/core/utils/flattenTagValue.ts

import type { TagData } from "launched";

type FlatTagValue<T> =
  T extends Array<infer R>
    ? Array<FlatTagValue<R>>
    : T extends Record<string, any>
      ? {
          [K in keyof T]: T[K] extends { type: string; value: infer V }
            ? V
            : FlatTagValue<T[K]>;
        }
      : T;

export default function flattenTagValue<V extends TagData>(
  value: Record<string, V> | Record<string, V>[] | V | V[]
): FlatTagValue<V> {
  if (Array.isArray(value))
    return value.map((v) => flattenTagValue(v)) as FlatTagValue<V>;
  else if (typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, v]) => {
        if (typeof v === "object" && "value" in v)
          return [key, flattenTagValue(v.value)];
        else return [key, flattenTagValue(v)];
      })
    ) as FlatTagValue<V>;
  } else return value;
}
