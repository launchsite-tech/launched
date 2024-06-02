import React from "react";
import EventEmitter from "./events";
import { useState, useEffect, createRef, createContext } from "react";
import { renderSingleTagUI } from "./renderer";
import type { Tag, TagValue, TagSchema } from "../types/tag";
import type { Renderer } from "../types/render";
import type { Root } from "react-dom/client";

export interface Config<Schema extends TagSchema<any>> {
  tags: Schema;
  locked?: boolean;
  inlineEditable?: boolean;
}

const defaults = {
  locked: false,
  inlineEditable: true,
};

interface LaunchedContextValue<Schema extends TagSchema<any>> {
  useTag<S extends Schema>(
    key: keyof S,
    renderer?: Renderer<any> | string
  ): readonly [
    TagValue["value"],
    <T extends HTMLElement | null>(el: T) => void,
  ];
}

export default class Launched<Schema extends TagSchema<any>> {
  private readonly config: Required<Config<Schema>>;

  public tags: Record<keyof Schema, Tag> = {} as Record<keyof Schema, Tag>;
  public Provider: React.FC<{ children: React.ReactNode }>;
  public context = createContext<LaunchedContextValue<Schema>>(
    {} as LaunchedContextValue<Schema>
  );

  public static instance: Launched<any> | null;
  public static events = new EventEmitter();
  public static formats = new Map<string, Renderer<any>>();
  public static roots = new Map<string, Root>();

  constructor(config: Omit<Config<Schema>, "tags">) {
    if (Launched.instance) {
      throw new Error("There can only be one instance of Launched.");
    }
    Launched.instance = this;

    this.config = { ...defaults, ...config } as Required<Config<Schema>>;

    this.Provider = ({ children }: { children: React.ReactNode }) => {
      const [tags, setTags] = useState(() =>
        this.makeTagsFromSchema(this.config.tags)
      );

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

      useEffect(() => {
        Launched.events.emit("data:update", this.tags);
      }, [tags]);

      return (
        <this.context.Provider
          value={{
            useTag: this.useTag.bind(this),
          }}
        >
          {children}
        </this.context.Provider>
      );
    };

    Launched.events.on("tag:ready", (key: keyof Schema) => {
      this.render(key);
    });
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

  private useTag<S extends Schema = Schema>(
    key: keyof S,
    renderer?: Renderer<any> | string
  ): [TagValue["value"], <T extends HTMLElement | null>(el: T) => void] {
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

    return [
      tag.data.value,
      <T extends HTMLElement | null>(el: T) => {
        if (!el) return;

        (t.tags[key].el.current as T) = el;

        Launched.events.emit("tag:ready", key, t.tags[key]);
      },
    ] as const;
  }

  private render(tag?: keyof Schema) {
    if (tag) renderSingleTagUI(this.tags[tag], String(tag));
    else
      Object.entries(this.tags).map(([key, tag]) =>
        tag.el.current ? renderSingleTagUI(tag, key) : null
      );
  }

  public static registerTagFormat<V>(name: string, renderer: Renderer<V>) {
    Launched.formats.set(name, renderer);
  }
}

export function LaunchedProvider<Schema extends TagSchema<any>>({
  config,
  children,
}: {
  config: Config<Schema>;
  children: React.ReactNode;
}) {
  const L = Launched.instance ?? new Launched(config);

  return <L.Provider>{children}</L.Provider>;
}
