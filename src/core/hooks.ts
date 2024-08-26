import { useContext } from "react";
import Launched from "./context.js";
import error from "./utils/error.js";
import Renderer from "../core/renderer.js";
import type { TagData, TagSchemaValue } from "../core/context.js";
import type { TagRenderOptions } from "../core/renderer.js";

/** @internal Information about static tags. */
type TagInfo = {
  /** @see {@link TagData.type} */
  type: string;

  /** The value of the static tag. */
  value: TagSchemaValue;

  /** The element that the tag is attached to. */
  el: HTMLElement;
};

/** @see {@link Launched.useTag} */
export function useTag<V extends TagSchemaValue = TagData["value"]>(
  key: string,
  value?: V,
  options?: TagRenderOptions
) {
  if (!Launched.instance) error("Launched not initialized.");

  const { useTag } = useContext(Launched.instance.context);

  return useTag(key, value, options);
}

/**
 * @internal
 *
 * Generates static tags from the DOM.
 *
 * @param skip - Whether to skip generation.
 */
export function useGenerateStaticTags(skip: boolean) {
  if (skip) return;
  if (!Launched.instance) error("Launched not initialized.");

  const taggedElements = Object.values(
    document.querySelectorAll("[data-tag]")
  ) as HTMLElement[];

  const getElType = (el: HTMLElement, fallback?: string) =>
    el.getAttribute("data-type") ?? fallback ?? "string";

  const getTagInfo = (el: HTMLElement) => {
    const type = getElType(el);
    const renderer = Renderer.formats.get(type);

    if (!renderer) error(`Invalid tag type "${type}".`);
    else if (!renderer.getStaticProperties)
      error(`Renderer "${type}" has no configuration for static properties.`);

    const value = renderer.getStaticProperties(el);

    if (value == null)
      error(`No value found for tag "${el.getAttribute("data-tag")}".`);

    return { type, value, el };
  };

  const getObjectTagInfo = (el: HTMLElement) => {
    const keys = el.querySelectorAll("[data-key]");
    const obj: Record<string, TagInfo> = {};

    keys.forEach((key) => {
      const keyName = key.getAttribute("data-key")!;

      obj[keyName] = getTagInfo(key as HTMLElement);
    });

    return obj;
  };

  const tagInfo: (TagInfo & { tag: string })[] = taggedElements.map((el) => {
    const tag = el.getAttribute("data-tag")!;

    const info = (t: any) => ({
      ...t,
      tag,
    });

    const tagKeys = Object.values(el.querySelectorAll("[data-key]"));

    if (tagKeys.length) {
      if (
        tagKeys.every(
          (c) =>
            el.querySelectorAll(`[data-key="${c.getAttribute("data-key")}"]`)
              .length === 1
        )
      ) {
        return info({
          value: getObjectTagInfo(el),
          type: getElType(el, "object"),
          el,
        });
      } else {
        const numChildren = el.children.length;

        if (tagKeys.length % numChildren !== 0)
          error("All children of arrays must have the same keys.");

        const value = Object.values(el.children).map((el) =>
          getObjectTagInfo(el as HTMLElement)
        );

        return info({
          type: getElType(el, "object"),
          value,
          el,
        });
      }
    } else return info(getTagInfo(el));
  });

  tagInfo.forEach(({ tag, type, value, el }) => {
    const [, ref] = useTag(tag, value, { type });
    ref(el);
  });
}
