import EventEmitter from "./events";
import { useState, useEffect, createRef } from "react";
import { createRoot } from "react-dom/client";
import { renderSingleTagUI } from "./renderer";
import type { Tag, TagValue, TagSchema } from "../types/tag";
import type { Renderer } from "../types/render";

export interface Config<Schema extends TagSchema<any>> {
  tags: Schema;
  locked?: boolean;
  inlineEditable?: boolean;
}

const defaults = {
  locked: false,
  inlineEditable: true,
};

export default class Launched<Schema extends TagSchema<any>> {
  private readonly config: Required<Config<Schema>>;
  private forceUpdate: () => void = () => {};

  public tags: Record<keyof Schema, Tag> = {} as Record<keyof Schema, Tag>;
  public Provider: React.FC<{}>;

  public static instance: Launched<any> | null;
  public static events = new EventEmitter();
  public static formats = new Map<string, Renderer<any>>();

  constructor(config: Omit<Config<Schema>, "tags">) {
    if (Launched.instance) {
      throw new Error("There can only be one instance of Launched.");
    }
    Launched.instance = this;

    this.config = { ...defaults, ...config } as Required<Config<Schema>>;

    this.Provider = () => {
      const [, renderCount] = useState(0);
      const [tags, setTags] = useState(() =>
        this.makeTagsFromSchema(this.config.tags)
      );

      useEffect(() => {
        this.forceUpdate = () => renderCount((c) => c + 1);
      }, []);

      useEffect(() => {
        this.tags = Object.fromEntries(
          Object.entries(tags).map(([key, data]) => [
            key,
            {
              ...data,
              setData: (value: TagValue["value"]) => {
                if (!tags[key]) return;

                setTags((p) => ({
                  ...p,
                  [key]: {
                    ...p[key],
                    data: {
                      type: p[key]!.data.type,
                      value,
                    },
                  },
                }));

                Launched.events.emit("tag:change", key, value);
              },
            },
          ])
        ) as Record<keyof Schema, Tag>;

        Launched.events.emit("data:update", this.tags);
      }, [tags]);

      return this.render(this.tags);
    };

    this.createRoot().render(<this.Provider />);

    Launched.events.on("tag:unmount", (tag: Tag) => {
      // @ts-ignore
      tag.el.current = null;
    });
  }

  private createRoot() {
    const root = document.createElement("div");
    root.setAttribute("id", "launched-root");
    document.body.appendChild(root);

    return createRoot(root);
  }

  private makeTagsFromSchema(
    tags: Schema
  ): Record<keyof Schema, Omit<Tag, "setData">> {
    return Object.fromEntries(
      Object.entries(tags).map(([key, data]) => {
        const el = createRef<HTMLElement>();

        let type: string, value: any;

        if (typeof data === "object" && !Array.isArray(data)) {
          if ("type" in data && typeof data.type !== "string")
            throw new Error("Type must be a string.");

          type =
            "type" in data
              ? data.type
              : typeof data.value !== "object"
                ? typeof data.value
                : key;

          value = "value" in data ? data.value : data;
        } else if (Array.isArray(data)) {
          if (!data.length)
            throw new Error("Array must have at least one item.");

          type = typeof data[0];

          if (type === "object")
            throw new Error(
              "Please create a custom type to use object arrays."
            );
          else if (data.some((v) => typeof v !== type))
            throw new Error("Array must have consistent types.");

          value = data;
        } else {
          type = typeof data;
          value = data;
        }

        return [
          key,
          {
            el,
            data: { type, value },
          },
        ];
      })
    ) as Record<keyof Schema, Omit<Tag, "setData">>;
  }

  public useTag<S extends Schema = Schema>(
    key: keyof S,
    renderer?: Renderer<any> | string
  ): (el: HTMLElement) => void {
    const t = this ?? Launched.instance;

    const tag = t.tags[key];

    if (!tag) throw new Error(`Tag "${String(key)}" not found.`);

    if (renderer) {
      if (typeof renderer === "string") {
        if (!Launched.formats.has(renderer))
          throw new Error(`No renderer found for tag type: ${renderer}`);

        // TODO: Use when schema isn't specified
        // tag.data.type = renderer;
      } else {
        Launched.formats.set(tag.data.type, renderer);
      }
    }

    return <T extends HTMLElement | null>(el: T) => {
      if (!el) return;

      (t.tags[key].el.current as T) = el;

      Launched.events.emit("tag:ready", t.tags[key], key);

      this.forceUpdate();
    };
  }

  private render(tags: Record<keyof Schema, Tag>) {
    return Object.entries(tags).map(([key, tag]) =>
      renderSingleTagUI(tag, key)
    );
  }

  public static registerTagFormat<V>(name: string, renderer: Renderer<V>) {
    Launched.formats.set(name, renderer);
  }
}

export function useTag<S extends TagSchema<S>>(
  key: keyof S
): (el: HTMLElement | null) => void;
export function useTag<S extends TagSchema<S>>(
  key: keyof S,
  type: string
): (el: HTMLElement | null) => void;
export function useTag<S extends TagSchema<S>>(
  key: keyof S,
  renderer: Renderer<any>
): (el: HTMLElement | null) => void;
export function useTag<S extends TagSchema<S>>(
  key: keyof S,
  typeOrRenderer?: Renderer<any> | string
) {
  if (!Launched.instance) throw new Error("Launched not initialized.");

  return Launched.instance.useTag<S>(key, typeOrRenderer);
}
