const HTMLTagsWithoutChildrenLower = [
  "area",
  "base",
  "br",
  "col",
  "embed",
  "hr",
  "img",
  "input",
  "link",
  "meta",
  "param",
  "source",
  "track",
  "wbr",
] as const;

const HTMLTextTagsLower = [
  "p",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "span",
  "div",
] as const;

export type HTMLTagsWithoutChildren =
  (typeof HTMLTagsWithoutChildrenLower)[number];
export type HTMLTagsWithChildren = Exclude<
  keyof JSX.IntrinsicElements,
  HTMLTagsWithoutChildren
>;
export type HTMLTextTags = (typeof HTMLTextTagsLower)[number];

export const HTMLTagsWithoutChildren = HTMLTagsWithoutChildrenLower.map((t) =>
  t.toUpperCase()
);
export const HTMLTextTags = HTMLTextTagsLower.map((t) => t.toUpperCase());
