import "../styles/linkEditor.css";
import { InlineTagUI } from "./InlineEditor";
import type { Renderer, RendererProps } from "../../core/renderer";
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
}: RendererProps<Link>) {
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
    console.log(e.target, element);

    if (href !== value.href) updateData({ ...value, href });
    close();
  }

  return (
    <div onBlur={onClose}>
      {selected && (
        <input
          className="Launched__tag-linkInput"
          type="url"
          value={href}
          onChange={(e) => setHref(e.target.value)}
        />
      )}
      <InlineTagUI
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

export const LinkRenderer: Renderer<Link> = {
  component: (props) => {
    return <LinkUI {...props} />;
  },
  parentValidator: (element) => {
    return element.nodeName === "A";
  },
};
