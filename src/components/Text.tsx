import { useTag } from "../core/hooks.js";
import { LaunchedComponentProps } from ".";
import error from "../core/utils/error.js";
import type { HTMLTextTagsType } from ".";

type TextProps = LaunchedComponentProps<string, HTMLTextTagsType>;

/**
 * A component that renders text.
 *
 * @param props - The properties of the component; see {@link TextProps}
 *
 * @returns The rendered text component.
 *
 * @example
 *
 * ```jsx
 * import { Text } from "launched/components";
 *
 * function App() {
 *  return <Text tag="text">Hello, world!</Text>;
 * }
 * ```
 */
export default function Text({
  tag,
  element = "p",
  children,
  ...rest
}: TextProps) {
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
