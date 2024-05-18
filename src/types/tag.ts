type TagInputType = "text" | "paragraph" | "number" | "date";

type PartialTagValue =
  | string
  | number
  | Partial<TagValue>
  | Partial<TagValue>[];

type TagValue = {
  type: TagInputType;
  value: PartialTagValue | Record<string, PartialTagValue>;
  locked: boolean;
};

type TagSchema<T extends Record<string, PartialTagValue>> = {
  [K in keyof T]: T[K];
};

type FlatTagSchema<T> = {
  [K in keyof T]: T[K] extends { value: infer V }
    ? V extends object
      ? FlatTagSchema<V>
      : V
    : T[K] extends object
      ? FlatTagSchema<T[K]>
      : T[K];
};

type Tag = {
  data: TagValue;
  setData: (value: TagValue) => void;
  el: React.RefObject<HTMLElement>;
};

export {
  TagInputType,
  TagValue,
  PartialTagValue,
  Tag,
  TagSchema,
  FlatTagSchema,
};
