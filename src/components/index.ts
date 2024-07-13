import Text from "./Text.js";
import Image from "./Image.js";
import Link from "./Link.js";
import { TextArray, NumberArray, LinkArray, ImageArray } from "./Array.js";

export type LaunchedComponentProps<
  v extends React.ReactNode,
  c extends keyof JSX.IntrinsicElements,
> = JSX.IntrinsicElements[c] & {
  tag: string;
  children: v;
  element?: c;
};

export type HTMLTextTags =
  | "p"
  | "span"
  | "div"
  | "li"
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6";

export type HTMLTagsWithoutChildren =
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

export type HTMLTagsWithChildren = Exclude<
  keyof JSX.IntrinsicElements,
  HTMLTagsWithoutChildren
>;

export {
  Text,
  Text as Number,
  Image,
  Link,
  TextArray,
  NumberArray,
  LinkArray,
  ImageArray,
};
