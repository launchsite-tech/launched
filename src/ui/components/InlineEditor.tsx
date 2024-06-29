import "../styles/inlineEditor.css";
import { useRef, useState, useEffect } from "react";
import type { TagRenderer, TagRendererProps } from "../../core/renderer.js";

export function InlineTextUI({
  // element,
  value,
  selected,
  updateData,
  close,
}: TagRendererProps<string>) {
  const editorRef = useRef<HTMLDivElement>(null);

  const [text, setText] = useState(value);

  function handleContentChange() {
    if (!editorRef.current) return;

    const firstTag = editorRef.current.firstChild?.nodeName;
    const keyTag = new RegExp(
      firstTag === "#text" ? "<br" : "</" + firstTag,
      "i"
    );

    const tmp = document.createElement("p");
    tmp.innerHTML = editorRef.current.innerHTML
      .replace(/<[^>]+>/g, (m) => (keyTag.test(m) ? "{ß®}" : ""))
      .replace(/{ß®}$/, "");

    const text = tmp.textContent?.replace(/{ß®}/g, "\n") || "";
    setText(text);
  }

  function onClose() {
    if (text !== value) updateData(text);
    close();
  }

  useEffect(() => {
    if (!editorRef.current) return;

    editorRef.current.textContent = value;
  }, []);

  return (
    <div
      ref={editorRef}
      onInput={handleContentChange}
      onBlur={onClose}
      className="Launched__tag-inlineEditor"
      contentEditable
      suppressContentEditableWarning
      data-empty={text === ""}
      spellCheck={selected}
    ></div>
  );
}

export const InlineTextRenderer: TagRenderer<string> = {
  component: (props) => {
    return <InlineTextUI {...props} />;
  },
  parentValidator: (element) => {
    const whitelist = ["P", "H1", "H2", "H3", "H4", "H5", "H6", "SPAN", "DIV"];
    return whitelist.includes(element.nodeName);
  },
};
