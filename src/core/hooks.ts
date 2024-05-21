import { useContext } from "react";
import Launched from "./context";

export function useLaunched() {
  if (!Launched.instance) {
    throw new Error("Launched instance not found.");
  }

  return useContext(Launched.instance.context)!;
}
