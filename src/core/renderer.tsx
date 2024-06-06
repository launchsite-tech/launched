import "../ui/index.css";
import Launched from "./context";
import type { Tag, TagValue } from "../types/tag";
import type { Renderer } from "../types/render";
import { useRef, useState, useEffect } from "react";
import { createRoot } from "react-dom/client";

export function renderSingleTagUI(parentTag: Tag, id: string): void {
  if (!parentTag || !parentTag.el.current)
    return console.warn(`Tag "${id}" was never bound to an element.`);

  const renderer = Launched.formats.get(parentTag.data.type);

  if (!renderer) return;

  function renderTag(parentTag: Tag, tag: Tag, childId: string): void {
    if (!tag.el.current) return;

    if (Array.isArray(tag.data.value)) {
      tag.data.value.forEach((t, i) => {
        // TODO: Make configurable
        const childEl =
          (tag.el.current!.children[i] as HTMLElement) ?? tag.el.current;

        renderTag(
          parentTag,
          {
            el: { current: childEl },
            data: {
              type: tag.data.type,
              value: t,
            },
            setData: (data) => {
              tag.setData(
                (tag.data.value as TagValue[]).map((v, index) =>
                  index === i ? (data as TagValue) : v
                )
              );
            },
          },
          `${id}-${i}`
        );
      });
    } else {
      if (!tag.el.current) return;

      const id = `Lt-${childId.split(" ").join("-")}`;

      const existingNode = document.getElementById(id);
      if (existingNode) existingNode.remove();

      setTimeout(() => {
        if (Launched.roots.get(childId)) {
          Launched.roots.get(childId)!.unmount();
          Launched.roots.delete(childId);
        }

        const rootNode = document.createElement("div");
        rootNode.id = id;
        tag.el.current!.appendChild(rootNode);
        const root = createRoot(rootNode);

        Launched.roots.set(childId, root);

        root.render(<TagUI tag={tag} renderer={renderer!} id={childId} />);
      }, 0);
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
    (document.activeElement as HTMLElement).blur();

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

    // @ts-expect-error
    tag.el.current = null;
  }

  function onTagSelect(selectedId: string) {
    if (selectedId !== id) setSelected(false);
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
      onMouseDown={() => {
        if (selected) return;

        setSelected(true);
        renderer?.onSelect?.({ element: tag.el.current! });

        Launched.events.emit("tag:select", id, tag);
      }}
      className={`Launched__tag-container ${selected && "active"}`}
    >
      <renderer.component
        element={tag.el.current}
        value={tag.data.value}
        selected={selected}
        updateData={(v) => updateData(v)}
        close={() => close()}
        id={id}
      />
    </div>
  );
}
