// import flattenNestedValues from "./util/flatten";
import "../ui/index.css";
import Launched from "./context";
import { createRoot } from "react-dom/client";
import type { PartialTagValue, Tag } from "../types/tag";
import { useRef, useState, useEffect } from "react";

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
  const containerRef = useRef<HTMLButtonElement>(null);

  // const fields = flattenNestedValues(tag.data.value);
  const [selected, setSelected] = useState(false);

  function onTagSelect(t: Tag) {
    if (t === tag || !t.el.current) return;

    if (selected) closeTag(true);
    else closeTag();
  }

  function updateTagData() {
    if (!containerRef.current || !selected) return;

    const value = containerRef.current.dataset["value"];

    if (value) {
      tag.setData({
        ...tag.data,
        value,
      });
    }
  }

  function closeTag(update: boolean = false) {
    if (update) updateTagData();

    setSelected(false);
  }

  useEffect(() => {
    if (!tag.el.current) throw new Error("Element is null.");

    tag.el.current.classList.add("tagged");

    if (getComputedStyle(tag.el.current).position === "static") {
      tag.el.current.style.position = "relative";
    }

    Launched.events.emit("tag:mount", tag);
    Launched.events.on("tag:select", onTagSelect);

    return () => {
      Launched.events.emit("tag:unmount", tag);
      Launched.events.off("tag:select", onTagSelect);
    };
  }, []);

  if (!tag.el.current) return null;

  return (
    <button
      ref={containerRef}
      onClick={() => {
        setSelected(true);

        Launched.events.emit("tag:select", tag);
      }}
      className={`Launched__tag-container ${selected && "active"}`}
    >
      {typeof tag.data.value === "object" ? (
        <dialog>cool drawer</dialog>
      ) : (
        <textarea
          className="Launched__tag-inlineEditor"
          defaultValue={tag.data.value as string}
          spellCheck={selected}
          onChange={(e) => {
            containerRef.current!.dataset["value"] = e.target.value;
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              if (tag.data.type === "text") {
                e.preventDefault();
                closeTag(true);
              } else if (tag.data.type === "paragraph" && e.shiftKey) {
                e.preventDefault();
                closeTag(true);
              }
            } else if (e.key === "Escape") closeTag();
          }}
        />
      )}
    </button>
  );
}
