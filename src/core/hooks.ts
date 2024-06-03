import { useState, useLayoutEffect, useContext } from "react";
import Launched from "./context";
import type { TagSchema } from "../types/tag";
import type { Renderer } from "../types/render";

export function useTag<S extends TagSchema<S>>(
  key: keyof S,
  renderer?: Renderer<any>
) {
  if (!Launched.instance) throw new Error("Launched not initialized.");

  const { useTag } = useContext(Launched.instance.context);

  return useTag(key, renderer);
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
