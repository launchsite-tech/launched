import { useContext } from "react";
import Launched from "./context.js";
import error from "./utils/error.js";
import type { TagData, TagSchemaValue } from "../core/context.js";
import type { TagRenderOptions } from "../core/renderer.js";

export function useTag<V extends TagSchemaValue = TagData["value"]>(
  key: string,
  value?: V,
  type?: string,
  options?: TagRenderOptions
) {
  if (!Launched.instance) error("Launched not initialized.");

  const { useTag } = useContext(Launched.instance.context);

  return useTag(key, value, type, options);
}
