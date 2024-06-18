import { useContext } from "react";
import Launched from "./context";
import error from "./utils/error";
import type { TagData, TagSchemaValue } from "../core/context";

export function useTag<V extends TagSchemaValue = TagData["value"]>(
  key: string,
  value?: V,
  type?: string
) {
  if (!Launched.instance) error("Launched not initialized.");

  const { useTag } = useContext(Launched.instance.context);

  return useTag(key, value, type);
}
