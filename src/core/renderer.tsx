import "../ui/styles/container.css";
import error from "./utils/error.js";
import { useRef, useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import type { Tag, TagData, TagValue } from "./context.js";
import type { Root } from "react-dom/client";
import Launched from "./context.js";
import flattenTagValue from "./utils/flattenTagValue.js";

export type TagRenderOptions = Partial<{
  isMutable: boolean;
}>;

type TagUIOptions = TagRenderOptions & {
  index: number;
  parentTag: Tag;
};

type TagRendererFunctionState = {
  element?: HTMLElement;
};

export type TagRendererProps<V> = {
  id: string;
  element: HTMLElement;
  value: V;
  selected: boolean;
  context: Launched;
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

  private initialRenderOptions = new Map<string, TagUIOptions>();

  constructor() {}

  public static registerTagFormat<V>(name: string, renderer: TagRenderer<V>) {
    if (!renderer.component) error("Custom renderers must have a component.");

    Renderer.formats.set(name, renderer);
  }

  public renderSingleTagUI(
    parentTag: Tag,
    id: string,
    options?: TagRenderOptions
  ): void {
    if (!parentTag || !parentTag.el.current)
      return console.warn(`Tag "${id}" was never bound to an element.`);

    const renderTag = (
      parentTag: Tag,
      tag: Tag,
      childId: string,
      index: number
    ): void => {
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
                    index === i
                      ? ((typeof data === "function"
                          ? data(v)
                          : data) as TagValue)
                      : v
                  )
                );
              },
            },
            `${id}-${i}`,
            i
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
                const newValue =
                  typeof data === "function"
                    ? data(
                        (tag.data.value as Record<string, TagData>)[key]!.value
                      )
                    : data;

                tag.setData({
                  ...(tag.data.value as Record<string, TagData>),
                  [key]: {
                    type: (tag.data.value as Record<string, TagData>)[key]!
                      .type,
                    value: newValue,
                  },
                });
              },
            },
            `${childId}-${key}`,
            index
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
            `Parent element of tag "${childId}" does not satisfy the constraints of the "${tag.data.type}" renderer.`
          );
        }

        const id = `Lt-${childId.replaceAll(" ", "-")}`;
        let userOptions: TagUIOptions = {} as TagUIOptions;

        if (this.initialRenderOptions.get(id))
          userOptions = this.initialRenderOptions.get(id)!;
        else {
          userOptions = {
            isMutable: options?.isMutable ?? false,
            index,
            parentTag,
          };

          this.initialRenderOptions.set(id, userOptions);
        }

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

          const t = {
            ...tag,
            data: {
              type: tag.data.type,
              value: flattenTagValue(tag.data.value as any),
            },
          };

          root.render(
            <TagUI
              tag={t}
              renderer={renderer!}
              id={childId}
              options={userOptions}
            />
          );
        }, 0);
      }
    };

    renderTag(parentTag, parentTag, id, 0);
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
  options,
}: {
  tag: Omit<Tag, "data"> & {
    data: {
      type: string;
      value: any;
    };
  };
  renderer: TagRenderer<any>;
  id: string;
  options: TagUIOptions;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  const [selected, setSelected] = useState(false);

  const { isMutable, parentTag, index } = options;

  function close() {
    setSelected(false);

    containerRef.current?.blur();

    renderer.onClose?.({
      element: tag.el.current ?? undefined,
    });

    Launched.events.emit("tag:deselect", id, tag);
  }

  function updateData(data: any) {
    tag.setData(data);

    renderer.onDataUpdate?.({
      element: tag.el.current ?? undefined,
      data,
    });

    // @ts-expect-error
    tag.el.current = null;
  }

  function duplicateTagItem() {
    if (!Array.isArray(parentTag.data.value)) return;

    parentTag.setData((p) => [
      ...(p as TagValue[]).slice(0, index + 1),
      (p as TagValue[])[index]!,
      ...(p as TagValue[]).slice(index + 1),
    ]);
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
        context={Launched.instance!}
      />
      {isMutable && (
        <div
          onMouseDown={(e) => e.preventDefault()}
          className="Launched__tag-arrayControls Launched__toolbar-tools"
        >
          <button
            className="Launched__toolbar-button add"
            onClick={duplicateTagItem}
          >
            <svg viewBox="0 0 24 24" className="Launched__icon">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
          </button>
          <button
            className="Launched__button remove"
            // onClick={removeTagItem}
          >
            <svg viewBox="0 0 24 24" className="Launched__icon">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
