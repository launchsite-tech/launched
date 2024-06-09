import React from "react";
import EventEmitter from "./events";
import { useState, useEffect, createRef, createContext } from "react";
import { renderSingleTagUI, unmountSingleTagUI } from "./renderer";
import Toolbar from "../ui/components/Toolbar";
import error from "./utils/error";
import type { Tag, TagData, TagSchema } from "../types/tag";
import type { Renderer } from "../types/render";
import type { Root } from "react-dom/client";

export interface Config<Schema extends TagSchema<any>> {
  tags?: Schema;
  locked?: boolean;
}

const defaults = {
  locked: false,
  tags: {},
};

interface LaunchedContextValue {
  useTag<V extends TagData["value"] = TagData["value"]>(
    key: string,
    value?: V
  ): readonly [
    V extends string | number ? string | number : V,
    <T extends HTMLElement | null>(el: T) => void,
  ];
}

export default class Launched<Schema extends TagSchema<any>> {
  private readonly config: Required<Config<Schema>>;
  private addTag: (key: string, tag: Omit<Tag, "setData">) => void = () => {};
  // private version = 0;
  // private history: {
  //   key: keyof Schema;
  //   value: TagValue | TagValue[];
  // }[] = [];

  public tags: Record<keyof Schema, Tag> = {} as Record<keyof Schema, Tag>;
  public Provider: React.FC<{ children: React.ReactNode }>;
  public context = createContext<LaunchedContextValue>(
    {} as LaunchedContextValue
  );

  public static instance: Launched<any> | null;
  public static events = new EventEmitter();
  public static formats = new Map<string, Renderer<any>>();
  public static roots = new Map<string, Root>();

  // { title: "hello" } => { title: "goodbye" }
  // |--> history = [{ key: title, value: "hello" }], version = 1
  // { title: "goodbye" } => { title: "goodb" }
  // |--> history = [{ key: title, value: "hello" }, { key: title, value: "goodbye" }], version = 2
  // undo => version = 1
  // redo => version = 2
  // reset => version = 0

  constructor(config?: Omit<Config<Schema>, "tags">) {
    if (Launched.instance) {
      error("There can only be one instance of Launched.");
    }

    Launched.instance = this;

    this.config = { ...defaults, ...config } as Required<Config<Schema>>;

    this.Provider = ({ children }: { children: React.ReactNode }) => {
      const [tags, setTags] = useState(() =>
        this.makeTagsFromSchema(this.config.tags)
      );

      this.tags = Object.fromEntries(
        Object.entries(tags).map(([key, data]) => {
          const setData = (value: TagData["value"]) => {
            if (!tags[key]) return;

            setTags((p) => {
              const newTags = { ...p };
              const tag = newTags[key];

              if (tag) {
                tag.data = { ...tag.data, value };
              }

              return newTags;
            });

            Launched.events.emit(
              "tag:change",
              key,
              value,
              tags[key]?.data.value
            );
          };

          return [key, { ...data, setData }];
        })
      ) as Record<keyof Schema, Tag>;

      this.addTag = (key, tag) => {
        setTags((p) => ({ ...p, [key]: tag }));
      };

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
          <Toolbar />
        </this.context.Provider>
      );
    };

    Launched.events.on("tag:ready", (key: keyof Schema) => {
      if (!this.config.locked) this.render(key);
    });

    // Launched.events.on(
    //   "tag:change",
    //   (key: keyof Schema, value: TagValue | TagValue[]) => {
    //     if (this.version === this.history.length - 1) {
    //       this.history.push({ key, value });
    //     } else {
    //       this.history.splice(
    //         this.version + 1,
    //         this.history.length - this.version,
    //         { key, value }
    //       );
    //     }

    //     this.version++;
    //   }
    // );
  }

  private makeTagsFromSchema(
    tags: Schema
  ): Record<keyof Schema, Omit<Tag, "setData">> {
    return Object.fromEntries(
      Object.entries(tags).map(([key, data]) => {
        let type: string, value: any;

        if (Array.isArray(data)) {
          if (!data.length) error("Array must have at least one item.");

          type = typeof data[0];
          if (data.some((v) => typeof v !== type))
            error("Array must have consistent types.");

          if (type === "object") {
            const keys = data.map((v) => Object.keys(v));
            if (keys[0]!.some((key) => keys.some((k) => !k.includes(key))))
              error("Objects must have the same keys.");
            if (keys.some((k) => k.some((k) => typeof k === "object")))
              error("Objects cannot have nested objects.");

            if (data[0].type) type = data[0].type;
          }

          value = data;
        } else {
          type =
            typeof data.value === "object" && "type" in data
              ? data.type
              : typeof data;
          value =
            typeof data === "object" && "value" in data ? data.value : data;
        }

        return [
          key,
          {
            el: createRef<HTMLElement>(),
            data: { type, value },
          },
        ];
      })
    ) as Record<keyof Schema, Omit<Tag, "setData">>;
  }

  private useTag = (<V extends TagData["value"] = TagData["value"]>(
    key: string,
    value?: V
  ) => {
    const t = this ?? Launched.instance;

    let tag: Tag | Omit<Tag, "setData"> | undefined = t.tags[key];

    if (!tag && value) {
      const newTag = this.makeTagsFromSchema({ [key]: value } as Schema)[key]!;

      setTimeout(() => this.addTag(String(key), newTag), 0);

      tag = newTag;
    } else if (!tag)
      error(
        `Tag "${String(key)}" does not exist. Either create add it to your schema or pass a value to useTag.`
      );

    return [
      tag.data.value as V extends string | number ? string | number : V,
      <T extends HTMLElement | null>(el: T) => {
        if (!el) return;

        (tag.el.current as T) = el;

        Launched.events.emit("tag:ready", key, tag);
      },
    ] as const;
  }) as LaunchedContextValue["useTag"];

  private render(tag?: keyof Schema) {
    if (tag && this.tags[tag]) renderSingleTagUI(this.tags[tag], String(tag));
    else
      Object.entries(this.tags).map(([key, tag]) =>
        tag.el.current ? renderSingleTagUI(tag, key) : null
      );
  }

  public static registerTagFormat<V>(name: string, renderer: Renderer<V>) {
    Launched.formats.set(name, renderer);
  }

  public static lock() {
    if (!Launched.instance) error("Launched is not initialized.");

    Launched.instance.config.locked = true;

    Object.entries(Launched.instance.tags).map(([key, tag]) => {
      if (!Array.isArray(tag.data.value)) unmountSingleTagUI(key);
      else
        tag.data.value.forEach((_, i) => {
          unmountSingleTagUI(`${key}-${i}`);
        });
    });
  }

  public static unlock() {
    if (!Launched.instance) error("Launched is not initialized.");

    Launched.instance.config.locked = false;

    Object.entries(Launched.instance.tags).map(([key]) => {
      Launched.instance!.render(key);
    });
  }

  public static toggle() {
    if (!Launched.instance) error("Launched is not initialized.");

    Launched.instance.config.locked ? Launched.unlock() : Launched.lock();
  }

  // public undo() {
  //   if (this.version === 0) return;

  //   const diff = this.history[this.version - 1]!;

  //   this.tags[diff.key].setData(diff.value);
  //   this.version--;
  // }
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
