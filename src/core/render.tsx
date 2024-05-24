// import flattenNestedValues from "./util/flatten";
import "../ui/index.css";
import Launched from "./context";
import { createRoot } from "react-dom/client";
import type { PartialTagValue, Tag } from "../types/tag";
import type { Renderer } from "../types/render";
import { useRef, useState, useEffect } from "react";

export function renderSingleTagUI(tag: Tag) {
  if (!tag || !tag.el.current) return;

  console.log(tag.data);
  const renderer = Launched.formats.get(tag.data.type);

  if (!renderer) {
    console.error(`No renderer found for tag type: ${tag.data.type}`);
    return;
  }

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

      createRoot(reactLink).render(<TagUI tag={tag} renderer={renderer!} />);
    }
  }

  renderTag(tag);
}

function TagUI({ tag, renderer }: { tag: Tag; renderer: Renderer<any> }) {
  const containerRef = useRef<HTMLButtonElement>(null);

  const [selected, setSelected] = useState(false);

  function close() {
    setSelected(false);
    renderer.options?.onClose?.();
  }

  function updateData(data: any) {
    tag.setData({
      ...tag.data,
      value: data,
    });
    renderer.options?.onDataUpdate?.(data);
  }

  function onTagSelect(selectedTag: Tag) {
    if (selectedTag !== tag) setSelected(false);
  }

  useEffect(() => {
    if (!tag.el.current) throw new Error("Element is null.");

    tag.el.current.classList.add("tagged");

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
      {renderer.render(tag.el.current, tag.data.value, {
        selected,
        updateData,
        close,
      })}
    </button>
  );
}
