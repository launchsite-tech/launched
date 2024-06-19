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

export default function useTagHook(
  context: Launched,
  key: string,
  value?: any,
  type?: string
) {
  const { result } = renderHook(() => useTag(key, value, type), {
    wrapper: (props: { children: React.ReactNode }) =>
      wrapper({ context, children: props.children }),
  });

  return result.current;
}
