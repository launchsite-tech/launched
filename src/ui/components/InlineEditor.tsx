import { useRef } from "react";
import type { Renderer } from "../../types/render";

function InlineTagUI({
  // element,
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
  const editorRef = useRef<HTMLDivElement>(null);
  const text = useRef(value);

  function getText(): string {
    if (!editorRef.current) return "";

    const firstTag = editorRef.current.firstChild?.nodeName;
    const keyTag = new RegExp(
      firstTag === "#text" ? "<br" : "</" + firstTag,
      "i"
    );

    const tmp = document.createElement("p");
    tmp.innerHTML = editorRef.current.innerHTML
      .replace(/<[^>]+>/g, (m) => (keyTag.test(m) ? "{ß®}" : ""))
      .replace(/{ß®}$/, "");

    return tmp.innerText.replace(/{ß®}/g, "\n");
  }

  function onClose() {
    if (text.current !== value) updateData(text.current);
    close();
  }

  return (
    <div
      ref={editorRef}
      onInput={() => (text.current = getText())}
      onBlur={onClose}
      className="Launched__tag-inlineEditor"
      contentEditable
      dangerouslySetInnerHTML={{ __html: value }}
      spellCheck={selected}
    ></div>
  );
}

export const InlineTagRenderer: Renderer<string> = {
  component: (props) => {
    return <InlineTagUI {...props} />;
  },
};
