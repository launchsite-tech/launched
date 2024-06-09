import "../ui/index.css";
import Launched from "./context";
import error from "./utils/error";
import type { Tag, TagValue } from "../types/tag";
import type { Renderer } from "../types/render";
import { useRef, useState, useEffect } from "react";
import { createRoot } from "react-dom/client";

export function renderSingleTagUI(parentTag: Tag, id: string): void {
  if (!parentTag || !parentTag.el.current)
    return console.warn(`Tag "${id}" was never bound to an element.`);

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
    } else if (
      tag.data.type === "object" &&
      typeof tag.data.value === "object"
    ) {
      for (const key in tag.data.value) {
        const childEl = tag.el.current!.querySelector(
          `[data-key="${key}"]`
        ) as HTMLElement;

        if (!childEl)
          error(
            `Child element with key "${key}" (under "${id}") not found. If you're using a custom renderer, make sure to add a data-key attribute to the targeted element.`
          );

        renderTag(
          parentTag,
          {
            el: { current: childEl },
            data: {
              type: typeof tag.data.value[key],
              value: tag.data.value[key]!,
            },
            setData: (data) => {
              tag.setData({
                ...(tag.data.value as Record<string, TagValue>),
                [key]: data,
              } as TagValue);
            },
          },
          `${childId}-${key}`
        );
      }
    } else {
      if (!tag.el.current) return;

      const renderer = Launched.formats.get(tag.data.type);

      if (!renderer) {
        return console.warn(
          `No renderer found for tag type "${tag.data.type}".`
        );
      }

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

export function unmountSingleTagUI(tagId: string): void {
  const id = `Lt-${tagId.split(" ").join("-")}`;
  const root = Launched.roots.get(tagId);

  if (root) {
    root.unmount();
    Launched.roots.delete(tagId);
  }

  const node = document.getElementById(id);
  if (node) node.remove();
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

    Launched.events.emit("tag:deselect", id, tag);
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
    if (!tag.el.current) error("Element is null.");

    tag.el.current.classList.add("tagged");

    if (getComputedStyle(tag.el.current).position === "static") {
      tag.el.current.style.position = "relative";
    }

    Launched.events.emit("tag:mount", id, tag);
    Launched.events.on("tag:select", onTagSelect);

    return () => {
      Launched.events.emit("tag:unmount", id, tag);
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
