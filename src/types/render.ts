import type { PartialTagValue } from "./tag";

export type Renderer<V extends PartialTagValue> = {
  render: (
    element: HTMLElement,
    value: V,
    options: Partial<{
      selected: boolean;
      updateData: (data: V) => void;
      close: () => void;
    }>
  ) => JSX.Element;
  onClose?: () => void;
  onSelect?: () => void;
  onDataUpdate?: (data: V) => void;
};
