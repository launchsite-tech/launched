type TagValue = string | number | Record<string, string | number>;

type TagData = {
  readonly type: string;
  readonly value: TagValue | TagValue[];
};

type TagSchema<T extends Record<string, TagData["value"]>> = {
  [K in keyof T]: T[K];
};

type Tag = {
  data: TagData;
  setData: (value: TagData["value"]) => void;
  el: React.RefObject<HTMLElement>;
};

export { TagData, TagValue, Tag, TagSchema };
