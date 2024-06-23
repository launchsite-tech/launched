import { useTag } from "../core/hooks";
import { LaunchedComponentProps } from ".";
import error from "../core/utils/error";

type validTextTags =
  | "p"
  | "span"
  | "div"
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6";

export default function Text({
  tag,
  element = "p",
  children,
  ...rest
}: LaunchedComponentProps<string, validTextTags>) {
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
