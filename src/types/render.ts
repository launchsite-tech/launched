type RendererFunctionState = {
  element?: HTMLElement;
};

export type RendererProps<V> = {
  id: string;
  element: HTMLElement;
  value: V;
  selected: boolean;
  updateData: (data: V) => void;
  close: () => void;
};

export type Renderer<V> = {
  component: (props: RendererProps<V>) => React.ReactNode;
  onClose?: (state: RendererFunctionState) => void;
  onSelect?: (state: RendererFunctionState) => void;
  onDataUpdate?: (state: RendererFunctionState & { data: V }) => void;
};