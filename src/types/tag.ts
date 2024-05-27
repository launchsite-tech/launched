type TagValue = {
  readonly type: string;
  readonly value: any;
};

type TagSchema<T extends Record<string, any>> = {
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
  setData: (value: TagValue["value"]) => void;
  el: React.RefObject<HTMLElement>;
};

export { TagValue, Tag, TagSchema, FlatTagSchema };
