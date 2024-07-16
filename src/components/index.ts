import Text from "./Text.js";
import Image from "./Image.js";
import Link from "./Link.js";

export type LaunchedComponentProps<
  v extends React.ReactNode,
  c extends keyof JSX.IntrinsicElements,
> = JSX.IntrinsicElements[c] & {
  tag: string;
  children: v;
  element?: c;
};

export { Text, Text as Number, Image, Link };
export * from "../ui/components/helpers/elementGroups.js";
