import type { PartialTagValue } from "./tag";

type RendererFunctionState = {
  element?: HTMLElement;
};

export type Renderer<V extends PartialTagValue> = {
  component: (props: {
    id: string;
    element: HTMLElement;
    value: V;
    selected: boolean;
    updateData: (data: V) => void;
    close: () => void;
  }) => React.ReactNode;
  onClose?: (state: RendererFunctionState) => void;
  onSelect?: (state: RendererFunctionState) => void;
  onDataUpdate?: (state: RendererFunctionState & { data: V }) => void;
};
