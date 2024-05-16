type TagInputType = "text" | "paragraph" | "number" | "date";

type PartialTagValue = string | number | TagValue | TagValue[];

type TagValue = {
  type: TagInputType;
  value: PartialTagValue | Record<string, PartialTagValue>;
  locked: boolean;
};

export { TagInputType, TagValue, PartialTagValue };
