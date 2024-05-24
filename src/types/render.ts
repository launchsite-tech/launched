import type { PartialTagValue } from "./tag";

export type Renderer<V extends PartialTagValue> = {
  component: (props: {
    element: HTMLElement;
    value: V;
    selected: boolean;
    updateData: (data: V) => void;
    close: () => void;
  }) => React.ReactNode;
  onClose?: () => void;
  onSelect?: () => void;
  onDataUpdate?: (data: V) => void;
};
