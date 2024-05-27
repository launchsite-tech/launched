import { useRef, useEffect } from "react";
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
  const editorRef = useRef<HTMLTextAreaElement>(null);

  function getContainer() {
    return element.querySelector(".Launched__tag-container") as HTMLElement;
  }

  useEffect(() => {
    getContainer().dataset["value"] = value;
  }, []);

  return (
    <textarea
      className="Launched__tag-inlineEditor"
      defaultValue={value}
      spellCheck={selected}
      rows={1}
      ref={editorRef}
      onChange={(e) => {
        getContainer().dataset["value"] = e.target.value;
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          // TODO: See if there's a cleaner way to do this. There needs to be a way to detect text wrapping on parent element.
          e.preventDefault();

          updateData(element.dataset["value"] ?? value);
          close();
          editorRef.current?.blur();
        } else if (e.key === "Escape") close();
      }}
    />
  );
}

export const InlineTagRenderer: Renderer<string> = {
  component: (props) => {
    return <InlineTagUI {...props} />;
  },
};
