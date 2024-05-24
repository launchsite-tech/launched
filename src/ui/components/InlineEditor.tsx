import type { Renderer } from "../../types/render";

function InlineTagUI({
  element,
  value,
  selected,
  updateData,
  close,
}: {
  element: HTMLElement;
  value: string;
  selected: boolean;
  updateData: (data: string) => void;
  close: () => void;
}) {
  return (
    <textarea
      className="Launched__tag-inlineEditor"
      defaultValue={value}
      spellCheck={selected}
      onChange={(e) => {
        element.dataset["value"] = e.target.value;
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          // TODO: See if there's a cleaner way to do this. There needs to be a way to detect text wrapping on parent element.
          e.preventDefault();

          updateData(element.dataset["value"] ?? value);
        } else if (e.key === "Escape") close();
      }}
    />
  );
}

export const InlineTagRenderer: Renderer<string> = {
  render: (element: HTMLElement, value: string, options) => {
    return (
      <InlineTagUI
        element={element}
        value={value}
        selected={options?.selected ?? false}
        updateData={options?.updateData ?? (() => {})}
        close={options?.close ?? (() => {})}
      />
    );
  },
};
