// import flattenNestedValues from "./util/flatten";
import "../ui/index.css";
import Launched from "./context";
import { createPortal } from "react-dom";
import type { Tag } from "../types/tag";
import type { Renderer } from "../types/render";
import { useRef, useState, useEffect } from "react";

export function renderSingleTagUI(parentTag: Tag, id: string): React.ReactNode {
  if (!parentTag || !parentTag.el.current) return null;

  function getRendererForFormat(format: string) {
    const renderer = Launched.formats.get(format);

    if (!renderer) {
      console.error(`No renderer found for tag type: ${format}`);
      return;
    }

    return renderer;
  }

  const renderer = getRendererForFormat(parentTag.data.type);

  if (!renderer) return null;

  function renderTag(parentTag: Tag, tag: Tag, id: string): React.ReactNode {
    if (!tag.el.current) return null;

    if (Array.isArray(tag.data.value)) {
      Array.from(tag.el.current.children).forEach((child, i) => {
        renderTag(
          parentTag,
          {
            el: { current: child as HTMLElement },
            data: {
              ...tag.data,
              value: (tag.data.value as any[])[i]!,
            },
            setData: (data) => {
              tag.setData(
                (tag.data.value as (string | number)[]).map((v, index) =>
                  index === i ? data : v
                )
              );
            },
          },
          `${id}-${i}`
        );
      });

      return null;
    } else {
      const childRenderer =
        tag.data.type === parentTag.data.type
          ? renderer
          : getRendererForFormat(tag.data.type);

      if (!childRenderer) return null;

      return <TagUI key={id} tag={tag} renderer={childRenderer} id={id} />;
    }
  }

  return renderTag(parentTag, parentTag, id);
}

function TagUI({
  tag,
  renderer,
  id,
}: {
  tag: Tag;
  renderer: Renderer<any>;
  id: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  const [selected, setSelected] = useState(false);

  function close() {
    setSelected(false);
    renderer?.onClose?.({
      element: tag.el.current ?? undefined,
    });
    Launched.events.emit("tag:deselect", tag);
  }

  function updateData(data: any) {
    tag.setData(data);
    renderer?.onDataUpdate?.({
      element: tag.el.current ?? undefined,
      data,
    });
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

  return createPortal(
    <div
      ref={containerRef}
      tabIndex={0}
      onClick={() => {
        setSelected(true);
        renderer?.onSelect?.({ element: tag.el.current! });

        Launched.events.emit("tag:select", tag);
      }}
      className={`Launched__tag-container ${selected && "active"}`}
    >
      <renderer.component
        element={tag.el.current}
        value={tag.data.value}
        selected={selected}
        updateData={updateData}
        close={close}
        id={id}
      />
    </div>,
    tag.el.current
  );
}
