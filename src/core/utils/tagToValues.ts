import flattenTagValue from "./flattenTagValue.js";
import type { Tag, TagData } from "../context.js";

/**
 * @internal
 *
 * Transform a tag into its flattened values.
 *
 * @param tag - The tag to transform
 *
 * @returns The tag's values
 *
 * @see {@link flattenTagValue}
 */
export default function tagToValues(tag: Tag): TagData["value"] {
  if (Array.isArray(tag.data.value)) {
    return tag.data.value.map((t) =>
      tagToValues({
        ...tag,
        data: {
          ...tag.data,
          value: t,
        },
      })
    ) as TagData["value"];
  } else if (typeof tag.data.value === "object") {
    // @ts-expect-error
    return flattenTagValue(tag.data.value) as TagData["value"];
  } else return tag.data.value;
}
