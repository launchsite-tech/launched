// import flattenNestedValues from "./util/flatten";
import "../ui/index.css";
import Launched from "./context";
import type { TagValue, PartialTagValue, Tag } from "../types/tag";
import type { Renderer } from "../types/render";
import { useRef, useState, useEffect } from "react";

export function renderSingleTagUI(parentTag: Tag, id: string) {
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

  function renderTag(parentTag: Tag, tag: Tag, id: string) {
    if (!tag.el.current) return null;

    if (Array.isArray(tag.data.value)) {
      Array.from(tag.el.current.children).forEach((child, i) => {
        renderTag(
          parentTag,
          {
            el: { current: child as HTMLElement },
            data: {
              ...tag.data,
              value: (tag.data.value as PartialTagValue[])[i]!,
            },
            setData: (data) => {
              tag.setData({
                ...tag.data,
                value: (tag.data.value as Partial<TagValue>[]).map(
                  (v, index) => (index === i ? data : v)
                ),
              });
            },
          },
          `${id}-${i}`
        );
      });
    } else {
      if (tag.data.type !== parentTag.data.type) {
        const renderer = getRendererForFormat(tag.data.type);

        if (renderer) return <TagUI tag={tag} renderer={renderer} id={id} />;
      } else return <TagUI tag={tag} renderer={renderer!} id={id} />;
    }
  }

  renderTag(parentTag, parentTag, id);
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
    tag.setData({
      ...tag.data,
      value: data,
    });
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

  return (
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
    </div>
  );
}
