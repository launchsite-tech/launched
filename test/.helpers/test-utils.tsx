import React from "react";
import { LaunchedProvider } from "../../src/core/context";
import useTagHook, { useHookWithWrapper } from "./useTagHook";
import generateError from "./generateError";
import { render } from "@testing-library/react";

function renderWithWrapper(ui: React.ReactElement) {
  return render(<LaunchedProvider>{ui}</LaunchedProvider>);
}

export { useTagHook, generateError, useHookWithWrapper, renderWithWrapper };
export * from "vitest";
export * from "@testing-library/react";
