import React from "react";
import Launched from "../../src/core/context";
import { renderHook } from "@testing-library/react-hooks";
import { useTag } from "../../src/core/hooks";

const wrapper = ({
  context,
  children,
}: {
  context: Launched;
  children: React.ReactNode;
}) => <context.Provider>{children}</context.Provider>;

export function useHookWithWrapper<T>(hook: () => T, context: Launched): T {
  const { result } = renderHook(hook, {
    wrapper: (props: { children: React.ReactNode }) =>
      wrapper({ context, children: props.children }),
  });

  return result.current;
}

export default function useTagHook(
  context: Launched,
  key: string,
  value?: any,
  type?: string
) {
  return useHookWithWrapper(() => useTag(key, value, type), context);
}
