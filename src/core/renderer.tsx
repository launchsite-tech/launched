import "../ui/styles/container.css";
import error from "./utils/error";
import { useRef, useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import type { Tag, TagData, TagValue } from "./context";
import type { Root } from "react-dom/client";
import Launched from "./context";

type TagRendererFunctionState = {
  element?: HTMLElement;
};

export type TagRendererProps<V> = {
  id: string;
  element: HTMLElement;
  value: V;
  selected: boolean;
  updateData: (data: V) => void;
  close: () => void;
};

export type TagRenderer<V> = {
  component: (props: TagRendererProps<V>) => React.JSX.Element;
  parentValidator?: (element: HTMLElement) => boolean;
  onClose?: (state: TagRendererFunctionState) => void;
  onSelect?: (state: TagRendererFunctionState) => void;
  onDataUpdate?: (state: TagRendererFunctionState & { data: V }) => void;
};

export default class Renderer {
  public static formats = new Map<string, TagRenderer<any>>();
  public static roots = new Map<string, Root>();

  constructor() {}

  public static registerTagFormat<V>(name: string, renderer: TagRenderer<V>) {
    Renderer.formats.set(name, renderer);
  }

  public renderSingleTagUI(parentTag: Tag, id: string): void {
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
                type: (tag.data.value as Record<string, TagData>)[key]!.type,
                value: tag.data.value[key]!.value,
              },
              setData: (data) => {
                tag.setData({
                  ...(tag.data.value as Record<string, TagData>),
                  [key]: {
                    type: (tag.data.value as Record<string, TagData>)[key]!
                      .type,
                    value: data,
                  },
                });
              },
            },
            `${childId}-${key}`
          );
        }
      } else {
        if (!tag.el.current) return;

        const renderer = Renderer.formats.get(tag.data.type);

        if (!renderer) {
          return console.warn(
            `No renderer found for tag type "${tag.data.type}".`
          );
        }

        if (
          renderer.parentValidator &&
          !renderer.parentValidator(tag.el.current)
        ) {
          return console.warn(
            `Parent element of tag "${childId}" does not satisfy the constraints of the renderer of type "${tag.data.type}".`
          );
        }

        const id = `Lt-${childId.split(" ").join("-")}`;

        const existingNode = document.getElementById(id);
        if (existingNode) existingNode.remove();

        setTimeout(() => {
          if (Renderer.roots.get(childId)) {
            Renderer.roots.get(childId)!.unmount();
            Renderer.roots.delete(childId);
          }

          const rootNode = document.createElement("div");
          rootNode.id = id;
          tag.el.current!.appendChild(rootNode);
          const root = createRoot(rootNode);

          Renderer.roots.set(childId, root);

          root.render(<TagUI tag={tag} renderer={renderer!} id={childId} />);
        }, 0);
      }
    }

    renderTag(parentTag, parentTag, id);
  }

  public unmountSingleTagUI(tagId: string): void {
    const id = `Lt-${tagId.split(" ").join("-")}`;
    const root = Renderer.roots.get(tagId);

    if (root) {
      root.unmount();
      Renderer.roots.delete(tagId);
    }

    const node = document.getElementById(id);
    if (node) node.remove();
  }
}

function TagUI({
  tag,
  renderer,
  id,
}: {
  tag: Tag;
  renderer: TagRenderer<any>;
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

  function select() {
    if (selected) return;

    setSelected(true);
    renderer?.onSelect?.({ element: tag.el.current! });

    Launched.events.emit("tag:select", id, tag);
  }

  if (!tag.el.current) return null;

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      onMouseDown={select}
      onFocus={select}
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
