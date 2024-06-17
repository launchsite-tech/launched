import "../styles/inlineEditor.css";
import { useRef } from "react";
import type { TagRenderer, TagRendererProps } from "../../core/renderer";

export function InlineTagUI({
  // element,
  value,
  selected,
  updateData,
  close,
}: TagRendererProps<string>) {
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
      data-value={value}
      dangerouslySetInnerHTML={{ __html: value }}
      spellCheck={selected}
    ></div>
  );
}

export const InlineTagRenderer: TagRenderer<string> = {
  component: (props) => {
    return <InlineTagUI {...props} />;
  },
  parentValidator: (element) => {
    const whitelist = ["P", "H1", "H2", "H3", "H4", "H5", "H6", "SPAN", "DIV"];
    return whitelist.includes(element.nodeName);
  },
};
