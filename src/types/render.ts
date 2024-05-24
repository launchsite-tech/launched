import type { TagValue, PartialTagValue } from "./tag";

export type Renderer<
  V extends PartialTagValue,
  A extends Record<string, Partial<TagValue>> = {},
> = {
  format: (value: V, args: A) => TagValue;
  render: (
    element: HTMLElement,
    value: V,
    options: Partial<{
      selected: boolean;
      updateData: (data: V) => void;
      close: () => void;
    }>
  ) => JSX.Element;
  options?: Partial<{
    onClose: () => void;
    onSelect: () => void;
    onDataUpdate: (data: V) => void;
  }>;
};
