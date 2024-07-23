import { useTag } from "../core/hooks.js";
import { LaunchedComponentProps } from ".";
import error from "../core/utils/error.js";
import type { HTMLTextTagsType } from ".";

export default function Text({
  tag,
  element = "p",
  children,
  ...rest
}: LaunchedComponentProps<string, HTMLTextTagsType>) {
  if (typeof children !== "string")
    error(
      "Text component only accepts string children. Create a custom component for more complex types."
    );

  const [text, textRef] = useTag(tag, children);

  const Container = element;

  return (
    <Container {...rest} ref={textRef}>
      {text}
    </Container>
  );
}
