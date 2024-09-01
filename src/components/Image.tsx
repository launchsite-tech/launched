import { useTag } from "../core/hooks.js";
import { LaunchedComponentProps } from ".";
import error from "../core/utils/error.js";
import type { HTMLTagsWithChildrenType } from ".";

type ImageProps = Omit<
  LaunchedComponentProps<string, "img">,
  "children" | "className" | "element" | "src"
> & {
  /** The URL of the image. */
  src: string;

  /**
   * The container element of the image.
   *
   * @default "div"
   *
   * @see {@link HTMLTagsWithChildrenType}
   */
  element?: HTMLTagsWithChildrenType;

  /** The classes of the image and its container. */
  classNames?: {
    container?: string;
    image?: string;
  };
};

/**
 * A component that renders an image.
 *
 * @param props - The properties of the component; see {@link ImageProps}
 *
 * @returns The rendered image component.
 *
 * @example
 *
 * ```jsx
 * import { Image } from "launched/components";
 *
 * function App() {
 *  return <Image tag="image" src="https://example.com/image.jpg" alt="An example image" />;
 * }
 * ```
 */
export default function Image({
  tag,
  classNames,
  element = "div",
  src,
  ...rest
}: ImageProps) {
  if (!src || typeof src !== "string")
    error(
      "Image component requires a src prop of type string. Make sure to provide a valid image URL."
    );

  const [img, imgRef] = useTag(tag, src, { type: "image" });

  const Container = element as React.ElementType;

  return (
    <Container className={classNames?.container} ref={imgRef}>
      <img className={classNames?.image} src={img} {...rest} />
    </Container>
  );
}
