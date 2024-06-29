import { useContext } from "react";
import Launched from "./context.js";
import error from "./utils/error.js";
import type { TagData, TagSchemaValue } from "../core/context.js";

export function useTag<V extends TagSchemaValue = TagData["value"]>(
  key: string,
  value?: V,
  type?: string
) {
  if (!Launched.instance) error("Launched not initialized.");

  const { useTag } = useContext(Launched.instance.context);

  return useTag(key, value, type);
}
