import { createRef } from "react";
import error from "./error";
import type { Tag, TagData, TagSchemaValue } from "../context";

function validateObject(tag: Record<string, any>) {
  if (
    Object.values(tag).some(
      (v) => typeof v === "object" && !("type" in v) && !("value" in v)
    )
  )
    error("Objects cannot have nested objects without an explicit type.");
}

function transformObjectToTagData(
  value: Record<string, any>,
  type: string
): string | number | Record<string, TagData> {
  if ("type" in value && "value" in value) return value;

  return Object.fromEntries(
    Object.entries(value).map(
      ([k, v]: [string, TagData | Partial<TagData> | string | number]) => {
        if (typeof v !== "object") return [k, { type: typeof v, value: v }];
        else return [k, transformObjectToTagData(v, type)];
      }
    )
  );
}

function transformTag(
  tag: TagSchemaValue | Partial<TagData>,
  type: string
): TagData {
  if (Array.isArray(tag)) {
    if (!tag.length) return { type, value: [] };
    else if (tag.some((v) => typeof v !== typeof tag[0]))
      error("Array must have items of the same type.");

    if (typeof tag[0] === "object") {
      if (Array.isArray(tag[0])) error("Array cannot have nested arrays.");

      const keys = tag.map((v) => Object.keys(v));
      if (keys[0]!.some((key) => keys.some((k) => !k.includes(key))))
        error("Objects must have the same keys.");

      validateObject(tag[0]);

      return {
        type,
        value: tag.map((v) =>
          transformObjectToTagData(v as Record<string, any>, type)
        ),
      };
    } else
      return {
        type: typeof tag[0],
        value: tag as string[] | number[],
      };
  } else if (typeof tag === "object") {
    validateObject(tag);

    const value = transformObjectToTagData(tag, type);

    return {
      type,
      value,
    };
  } else {
    return {
      type: typeof tag,
      value: tag as string | number,
    };
  }
}

export default function createTag(
  tag: TagSchemaValue | TagData,
  type: string
): Omit<Tag, "setData"> {
  const t = transformTag(tag, type);

  return {
    el: createRef<HTMLElement>(),
    data: t,
  };
}
