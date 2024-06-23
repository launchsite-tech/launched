import Text from "./Text";
import Image from "./Image";
import Link from "./Link";

export type LaunchedComponentProps<
  v extends React.ReactNode,
  c extends keyof JSX.IntrinsicElements,
> = JSX.IntrinsicElements[c] & {
  tag: string;
  children: v;
  element?: c;
};

export { Text, Text as Number, Image, Link };
