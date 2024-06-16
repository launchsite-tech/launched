import { createRef } from "react";
import error from "./error";
import type { TagSchema, Tag, TagData } from "../context";

function transformObjectsToTagData<Schema extends TagSchema<any>>(
  tags: Schema
): Schema {
  return Object.fromEntries(
    Object.entries(tags).map(([key, data]) => {
      if (Array.isArray(data)) {
        return [key, data.map((v) => transformObjectsToTagData(v))];
      } else if (typeof data === "object") {
        return [
          key,
          {
            type: data.type ?? typeof data.value,
            value: data.value,
          },
        ];
      } else {
        return [key, { type: typeof data, value: data }];
      }
    })
  ) as Schema;
}

export default function makeTagsFromSchema<Schema extends TagSchema<any>>(
  tags: Schema
): Record<keyof Schema, Omit<Tag, "setData">> {
  const cleanTags = transformObjectsToTagData(tags);

  return Object.fromEntries(
    Object.entries(cleanTags).map(([key, data]: [string, TagData]) => {
      let type: string, value: TagData["value"];

      if (Array.isArray(data)) {
        if (!data.length) error("Array must have at least one item.");

        type = typeof data[0];
        if (data.some((v) => typeof v !== type))
          error("Array must have consistent types.");

        if (type === "object") {
          const keys = data.map((v) => Object.keys(v));
          if (keys[0]!.some((key) => keys.some((k) => !k.includes(key))))
            error("Objects must have the same keys.");
          if (keys.some((k) => k.some((k) => typeof k === "object")))
            error("Objects cannot have nested objects.");

          if (data[0].type) type = data[0].type;
        }

        value = data;
      } else {
        type = "type" in data ? data.type : typeof data;
        value = typeof data === "object" && "value" in data ? data.value : data;
      }

      return [
        key,
        {
          el: createRef<HTMLElement>(),
          data: { type, value },
        },
      ];
    })
  ) as Record<keyof Schema, Omit<Tag, "setData">>;
}
