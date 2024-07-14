import Text from "./Text.js";
import Image from "./Image.js";
import Link from "./Link.js";
// import EditableArray from "./EditableArray.js";

export type LaunchedComponentProps<
  v extends React.ReactNode,
  c extends keyof JSX.IntrinsicElements,
> = JSX.IntrinsicElements[c] & {
  tag: string;
  children: v;
  element?: c;
};

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

export { Text, Text as Number, Image, Link };
