// import flattenNestedValues from "./util/flatten";
import "../ui/index.css";
import Launched from "./context";
import { createRoot } from "react-dom/client";
import type { PartialTagValue, Tag } from "../types/tag";
import type { Renderer } from "../types/render";
import { useRef, useState, useEffect } from "react";

export function renderSingleTagUI(parentTag: Tag) {
  if (!parentTag || !parentTag.el.current) return;

  function getRendererForFormat(format: string) {
    const renderer = Launched.formats.get(format);

    if (!renderer) {
      console.error(`No renderer found for tag type: ${format}`);
      return;
    }

    return renderer;
  }

  const renderer = getRendererForFormat(parentTag.data.type);

  if (!renderer) return;

  function renderTag(parentTag: Tag, tag: Tag) {
    if (!tag.el.current) return;

    if (Array.isArray(tag.data.value)) {
      Array.from(tag.el.current.children).forEach((child, i) => {
        renderTag(parentTag, {
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
      const root = createRoot(reactLink);

      if (tag.data.type !== parentTag.data.type) {
        const renderer = getRendererForFormat(tag.data.type);

        if (renderer) root.render(<TagUI tag={tag} renderer={renderer} />);
      } else root.render(<TagUI tag={tag} renderer={renderer!} />);
    }
  }

  renderTag(parentTag, parentTag);
}

function TagUI({ tag, renderer }: { tag: Tag; renderer: Renderer<any> }) {
  const containerRef = useRef<HTMLDivElement>(null);

  const [selected, setSelected] = useState(false);

  function close() {
    setSelected(false);
    renderer?.onClose?.();
  }

  function updateData(data: any) {
    tag.setData({
      ...tag.data,
      value: data,
    });
    renderer?.onDataUpdate?.(data);
  }

  function onTagSelect(selectedTag: Tag) {
    if (selectedTag !== tag) setSelected(false);
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
    <div
      ref={containerRef}
      tabIndex={0}
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
    </div>
  );
}
