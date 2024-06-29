import "../styles/linkEditor.css";
import { InlineTextUI } from "./InlineEditor.js";
import type { TagRenderer, TagRendererProps } from "../../core/renderer.js";
import { useState, useEffect } from "react";

type Link = {
  text: string;
  href: string;
};

export function LinkUI({
  element,
  value,
  selected,
  updateData,
  close,
  ...props
}: TagRendererProps<Link>) {
  const [href, setHref] = useState(value.href);

  function onMouseEnter() {
    element.removeAttribute("href");
  }

  function onMouseLeave() {
    element.setAttribute("href", href);
  }

  useEffect(() => {
    element.addEventListener("mouseenter", onMouseEnter);
    element.addEventListener("mouseleave", onMouseLeave);

    return () => {
      element.removeEventListener("mouseenter", onMouseEnter);
      element.removeEventListener("mouseleave", onMouseLeave);
    };
  }, []);

  function onClose(e: React.FocusEvent<HTMLDivElement>) {
    if (element.contains(e.relatedTarget as Node)) return;

    if (href !== value.href) updateData({ ...value, href });
    close();
  }

  return (
    <div onBlur={onClose}>
      {selected && (
        <div className="Launched__tag-linkInput">
          <input
            className=""
            type="text"
            value={href}
            placeholder="Enter a URL..."
            onChange={(e) => setHref(e.target.value)}
            onBlur={() => {
              if (href !== value.href) updateData({ ...value, href });
            }}
          />
        </div>
      )}
      <InlineTextUI
        {...props}
        value={value.text}
        updateData={(text) => updateData({ ...value, text })}
        element={element}
        selected={selected}
        close={() => {}}
      />
    </div>
  );
}

export const LinkRenderer: TagRenderer<Link> = {
  component: (props) => {
    return <LinkUI {...props} />;
  },
  parentValidator: (element) => {
    return element.nodeName === "A";
  },
};
