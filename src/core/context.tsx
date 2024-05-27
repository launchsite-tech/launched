import EventEmitter from "./events";
import { useState, useEffect, createRef } from "react";
import { createRoot } from "react-dom/client";
import { renderSingleTagUI } from "./renderer";
import type { Tag, TagValue, PartialTagValue, TagSchema } from "../types/tag";
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
      const [tags, setTags] = useState(
        this.makeTagsFromTagValues(this.cleanTags())
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
              setData: (value: TagValue) => {
                setTags((p) => ({
                  ...p,
                  [key]: { ...p[key], data: value },
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

  private makeTagsFromTagValues(tags: Record<keyof Schema, TagValue>) {
    return Object.fromEntries(
      Object.keys(tags).map((key: keyof Schema) => {
        const el = createRef<HTMLElement | null>();

        return [
          key,
          {
            data: tags[key],
            el,
          },
        ];
      })
    ) as Record<keyof Schema, Omit<Tag, "setData">>;
  }

  private cleanTags(): Record<keyof Schema, TagValue> {
    return Object.fromEntries(
      Object.entries(this.config.tags).map(([key, value]) => {
        let dataValue: TagValue;

        if (Array.isArray(value)) {
          dataValue = {
            type: "text",
            value: value.map((v: Partial<TagValue>) => ({
              type: "text",
              value: v.value,
              locked: this.config.locked ?? false,
              ...v,
            })),
            locked: this.config.locked ?? false,
          };
        } else {
          const options: Partial<TagValue> =
            typeof value === "object" ? value! : {};

          dataValue = {
            type: "text",
            value: (typeof value === "object" ? options.value : value) as
              | PartialTagValue
              | Record<string, PartialTagValue>,
            locked: this.config.locked ?? false,
            ...options,
          };
        }

        return [key, dataValue];
      })
    ) as Record<keyof Schema, TagValue>;
  }

  public useTag<S extends Schema = Schema>(key: keyof S) {
    const t = this ?? Launched.instance;

    const tag = t.tags[key];

    if (!tag) throw new Error(`Tag "${String(key)}" not found.`);

    return <T extends HTMLElement | null>(el: T) => {
      if (!el) return;

      (t.tags[key].el.current as T) = el;

      Launched.events.emit("tag:ready", t.tags[key], key);

      this.forceUpdate();
    };
  }

  private render(tags: Record<keyof Schema, Tag>) {
    console.log("rendering");

    return Object.entries(tags).map(([key, tag]) =>
      renderSingleTagUI(tag, key)
    );
  }

  public static registerTagFormat<V extends PartialTagValue>(
    name: string,
    renderer: Renderer<V>
  ) {
    Launched.formats.set(name, renderer);
  }
}

export function useTag<S extends TagSchema<S>>(key: keyof S) {
  if (!Launched.instance) throw new Error("Launched not initialized.");

  return Launched.instance.useTag<S>(key);
}
