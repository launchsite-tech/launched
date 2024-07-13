import { useTag } from "../core/hooks.js";
import { LaunchedComponentProps } from "./index.js";
import type { HTMLTagsWithChildren } from "./index.js";
import error from "../core/utils/error.js";
import { cloneElement } from "react";

export function PrimitiveArray({
  tag,
  element = "div",
  children,
  arr,
  targetProp = "children",
  ...rest
}: LaunchedComponentProps<React.ReactElement, HTMLTagsWithChildren> & {
  arr: (string | number)[];
  targetProp?: string;
}) {
  const type = typeof arr[0];

  if (!arr.length)
    error(
      "Primitive array component requires at least one child component. Make sure to provide a valid child component."
    );
  else if (!["string", "number", "boolean"].includes(type))
    error(
      "Primitive array component requires all children to be of type string, number, or boolean."
    );
  else if (!arr.every((child) => typeof child === type))
    error(
      "Primitive array component requires all children to be of the same type."
    );

  const Container = element as React.ElementType;

  const elements = arr.map((item, i) => {
    const [value, ref] = useTag(`${tag}-${i}`, item);

    const props = { [targetProp]: value, ref, key: i };

    return cloneElement(
      children,
      props,
      targetProp === "children" ? item : null
    );
  });

  return <Container {...rest}>{elements}</Container>;
}
