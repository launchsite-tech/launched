import "../styles/inlineEditor.css";
import { useRef, useState, useEffect } from "react";
import type { TagRenderer, TagRendererProps } from "../../core/renderer.js";
import { HTMLTextTags } from "./helpers/elementGroups.js";

export function InlineTextUI({
  value,
  selected,
  updateData,
  close,
}: TagRendererProps<string>) {
  const editorRef = useRef<HTMLDivElement>(null);

  const [text, setText] = useState(value);

  function sanitizeText(text: string) {
    return text.replace(/<[^>]*>?/gm, "");
  }

  function handleContentChange() {
    if (!editorRef.current) return value;

    const text = sanitizeText(editorRef.current.textContent || "");
    setText(text);

    return text;
  }

  function onClose() {
    const text = handleContentChange();

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
      onInput={() => setText(editorRef.current?.textContent || "")}
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
    return HTMLTextTags.includes(element.nodeName);
  },
};
