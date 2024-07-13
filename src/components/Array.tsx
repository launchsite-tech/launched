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
  arr: string[] | number[];
  targetProp?: string;
}) {
  const type = typeof arr[0];

  if (!arr.length)
    error(
      "Primitive array component requires at least one child component. Make sure to provide a valid child component."
    );
  else if (!["string", "number"].includes(type))
    error(
      "Primitive array component requires all children to be of type string, number, or boolean."
    );

  const Container = element as React.ElementType;

  const [array, ref] = useTag(tag, arr);

  return (
    <Container ref={ref} {...rest}>
      {array.map((item, i) =>
        cloneElement(
          children,
          { [targetProp]: item, key: i },
          targetProp === "children" ? item : null
        )
      )}
    </Container>
  );
}
