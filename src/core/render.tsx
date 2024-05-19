// import flattenNestedValues from "./util/flatten";
import "../ui/index.css";
import { createRoot } from "react-dom/client";
import type { PartialTagValue, Tag } from "../types/tag";
import { useEffect } from "react";

export function renderSingleTagUI(tag: Tag) {
  if (!tag || !tag.el.current) return;

  function renderTag(tag: Tag) {
    if (!tag.el.current) return;

    if (Array.isArray(tag.data.value)) {
      Array.from(tag.el.current.children).forEach((child, i) => {
        renderTag({
          ...tag,
          el: { current: child as HTMLElement },
          data: {
            ...tag.data,
            value: (tag.data.value as PartialTagValue[])[i]!,
          },
        });
      });
    } else {
      const reactLink = document.createElement("div");
      tag.el.current.appendChild(reactLink);

      createRoot(reactLink).render(<TagUI tag={tag} />);
    }
  }

  renderTag(tag);
}

function TagUI({ tag }: { tag: Tag }) {
  // const fields = flattenNestedValues(tag.data.value);

  useEffect(() => {
    if (!tag.el.current) throw new Error("Element is null.");

    if (getComputedStyle(tag.el.current).position === "static") {
      tag.el.current.style.position = "relative";
    }
  }, []);

  if (!tag.el.current) return null;

  return (
    <div className="Launched__tag-container">
      <button className="Launched__tag-editButton">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="Launched__icon"
        >
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
        </svg>
        <span>Edit</span>
      </button>
    </div>
  );
}
