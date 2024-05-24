import { useState, useLayoutEffect, useContext } from "react";
import Launched from "./context";

export function useLaunched() {
  if (!Launched.instance) {
    throw new Error("Launched instance not found.");
  }

  return useContext(Launched.instance.context)!;
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
