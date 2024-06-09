import { useState, useLayoutEffect, useContext } from "react";
import Launched from "./context";
import error from "./utils/error";
import type { TagData } from "../types/tag";

export function useTag<V extends TagData["value"] = TagData["value"]>(
  key: string,
  value?: V
) {
  if (!Launched.instance) error("Launched not initialized.");

  const { useTag } = useContext(Launched.instance.context);

  return useTag(key, value);
}

export function useMediaQuery(query: string) {
  function getMatches() {
    return window.matchMedia(query).matches;
  }

  const [matches, setMatches] = useState(getMatches);

  function handleChange() {
    setMatches(getMatches());
  }

  useLayoutEffect(() => {
    const matchMedia = window.matchMedia(query);

    handleChange();

    if (matchMedia.addListener) matchMedia.addListener(handleChange);
    else matchMedia.addEventListener("change", handleChange);

    return () => {
      if (matchMedia.removeListener) matchMedia.removeListener(handleChange);
      else matchMedia.removeEventListener("change", handleChange);
    };
  }, [query]);

  return matches;
}
