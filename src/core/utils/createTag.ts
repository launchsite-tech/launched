import { createRef } from "react";
import error from "./error";
import type { Tag, TagData, TagSchemaValue } from "../context";

function validateObjectKeys(tag: any, keys: string[][]) {
  if (keys.some((k) => k.some((k) => typeof tag[k] === "object")))
    error("Objects cannot have nested objects.");
}

function transformObjectToTagData(
  tag: TagSchemaValue | Partial<TagData>,
  type: string
): TagData {
  if (Array.isArray(tag)) {
    if (!tag.length) error("Array must have at least one item.");
    else if (tag.some((v) => typeof v !== typeof tag[0]))
      error("Array must have items of the same type.");

    if (typeof tag[0] === "object") {
      if (Array.isArray(tag[0])) error("Array cannot have nested arrays.");

      const keys = tag.map((v) => Object.keys(v));
      if (keys[0]!.some((key) => keys.some((k) => !k.includes(key))))
        error("Objects must have the same keys.");

      return {
        // tag: Record<string, TagData>[] | Record<string, Partial<TagData> | string | number>[]
        type,
        value: tag.map((v) =>
          Object.fromEntries(
            Object.entries(v).map(
              ([k, v]: [
                string,
                TagData | Partial<TagData> | string | number,
              ]) => {
                if (typeof v !== "object")
                  return [k, { type: typeof v, value: v }];
                else
                  return [
                    k,
                    transformObjectToTagData(
                      v,
                      (v as TagData)["type"] ??
                        typeof (v as TagData)["value"] ??
                        type
                    ),
                  ];
              }
            )
          )
        ),
      };
    } else
      return {
        // tag: string[] | number[]
        type: typeof tag[0],
        value: tag as string[] | number[],
      };
  } else if (typeof tag === "object") {
    return {
      // tag: Record<string, TagData> | Record<string, Partial<TagData> | string | number>
      type,
      value: (tag as TagData)["value"] ?? tag,
    };
  } else {
    return {
      // tag: string | number
      type: typeof tag,
      value: tag as string | number,
    };
  }
}

export default function createTag(
  tag: TagSchemaValue | TagData,
  type: string
): Omit<Tag, "setData"> {
  const t = transformObjectToTagData(tag, type);

  return {
    el: createRef<HTMLElement>(),
    data: t,
  };
}
