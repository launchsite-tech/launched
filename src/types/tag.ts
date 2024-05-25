type PartialTagValue =
  | string
  | number
  | string[]
  | number[]
  | Partial<TagValue>
  | Partial<TagValue>[];

type TagValue = {
  type: string;
  value: PartialTagValue | Record<string, PartialTagValue>;
  locked: boolean;
  options?: string[];
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

export { TagValue, PartialTagValue, Tag, TagSchema, FlatTagSchema };
