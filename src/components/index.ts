import Text from "./Text.js";
import Image from "./Image.js";
import Link from "./Link.js";

/**
 * Properties of common Launched components, along with the properties of their associated element types.
 *
 * @template v - The data type of children passed into the component
 * @template c - Valid element types of the component
 */
export type LaunchedComponentProps<
  v extends React.ReactNode,
  c extends keyof JSX.IntrinsicElements,
> = JSX.IntrinsicElements[c] & {
  /** The tag to be assigned to the component. */
  tag: string;

  /** The children of the component. */
  children: v;

  /** The element type of the component. */
  element?: c;
};

export { Text, Text as Number, Image, Link };
export * from "../ui/components/helpers/elementGroups.js";
