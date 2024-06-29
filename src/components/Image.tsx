import { useTag } from "../core/hooks.js";
import { LaunchedComponentProps } from ".";
import error from "../core/utils/error.js";

type HTMLTagsWithoutChildren =
  | "img"
  | "input"
  | "hr"
  | "br"
  | "area"
  | "base"
  | "col"
  | "embed"
  | "link"
  | "meta"
  | "param"
  | "source"
  | "track"
  | "wbr";
type validImageContainerTags = Omit<
  keyof JSX.IntrinsicElements,
  HTMLTagsWithoutChildren
>;

export default function Image({
  tag,
  classNames,
  element = "div",
  src,
  ...rest
}: Omit<
  LaunchedComponentProps<string, "img">,
  "children" | "className" | "element"
> & {
  element?: validImageContainerTags;
  classNames?: {
    container?: string;
    image?: string;
  };
}) {
  if (!src || typeof src !== "string")
    error(
      "Image component requires a src prop of type string. Make sure to provide a valid image URL."
    );

  const [img, imgRef] = useTag(tag, src, "image");

  const Container = element as React.ElementType;

  return (
    <Container className={classNames?.container} ref={imgRef}>
      <img className={classNames?.image} src={img} {...rest} />
    </Container>
  );
}
