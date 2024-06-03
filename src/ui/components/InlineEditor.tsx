import { useRef, useState, useEffect } from "react";
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

  const [text, setText] = useState(value);

  function getContainer() {
    return element.querySelector(".Launched__tag-container") as HTMLElement;
  }

  useEffect(() => {
    getContainer().dataset["value"] = value;
  }, []);

  return (
    <textarea
      className="Launched__tag-inlineEditor"
      value={text}
      spellCheck={selected}
      rows={1}
      ref={editorRef}
      onBlur={close}
      onChange={(e) => {
        getContainer().dataset["value"] = e.target.value;
        setText(e.target.value);
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          // TODO: See if there's a cleaner way to do this. There needs to be a way to detect text wrapping on parent element.
          e.preventDefault();

          updateData(getContainer().dataset["value"] ?? value);
          close();
        } else if (e.key === "Escape") {
          getContainer().dataset["value"] = value;
          setText(value);

          close();
        }
      }}
    />
  );
}

export const InlineTagRenderer: Renderer<string> = {
  component: (props) => {
    return <InlineTagUI {...props} />;
  },
  onSelect: (state) => {
    if (state.element) {
      state.element.style.setProperty("color", "transparent");
    }
  },
  onClose: (state) => {
    if (state.element) {
      state.element.style.removeProperty("color");
    }
  },
  onDataUpdate: (state) => {
    if (state.element) {
      state.element.style.removeProperty("color");
    }
  },
};
