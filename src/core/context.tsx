import React from "react";
import EventEmitter from "./events";
import { useState, useEffect, createRef, createContext } from "react";
import { renderSingleTagUI, unmountSingleTagUI } from "./renderer";
import Toolbar from "../ui/components/Toolbar";
import error from "./utils/error";
import type { Renderer } from "./renderer";
import type { Root } from "react-dom/client";

export type TagValue = string | number | Record<string, TagData>;
export type TagSchemaValue =
  | TagValue
  | TagValue[]
  | Record<string, Partial<TagData> | string | number>
  | Record<string, Partial<TagData> | string | number>[];

export type FlatTagValue<T> =
  T extends Array<infer R>
    ? Array<FlatTagValue<R>>
    : T extends Record<string, any>
      ? {
          [K in keyof T]: T[K] extends { type: string; value: infer V }
            ? V
            : FlatTagValue<T[K]>;
        }
      : T;

export type TagData = {
  readonly type: string;
  readonly value: TagValue | TagValue[];
};

export type TagSchema<T extends Record<string, TagSchemaValue>> = {
  [K in keyof T]: T[K];
};

export type Tag = {
  data: TagData;
  setData: (value: TagData["value"]) => void;
  el: React.RefObject<HTMLElement>;
};

export interface Config<Schema extends TagSchema<any>> {
  tags?: Schema;
  locked?: boolean;
}

const defaults = {
  locked: false,
  tags: {},
};

interface LaunchedContextValue {
  useTag<V extends TagSchemaValue = TagData["value"]>(
    key: string,
    value?: V
  ): readonly [
    V extends string | number ? string | number : FlatTagValue<V>,
    <T extends HTMLElement | null>(el: T) => void,
  ];
}

export default class Launched<Schema extends TagSchema<any>> {
  private readonly config: Required<Config<Schema>>;
  private addTag: (key: string, tag: Omit<Tag, "setData">) => void = () => {};

  public tags: Record<keyof Schema, Tag> = {} as Record<keyof Schema, Tag>;
  public Provider: React.FC<{ children: React.ReactNode }>;
  public context = createContext<LaunchedContextValue>(
    {} as LaunchedContextValue
  );

  public static instance: Launched<any> | null;
  public static events = new EventEmitter();
  public static formats = new Map<string, Renderer<any>>();
  public static roots = new Map<string, Root>();

  constructor(config?: Config<Schema>) {
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
          const setData = (value: string | number) => {
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
  }

  private flattenTagValue<V extends TagData>(
    value: Record<string, V> | V | V[]
  ): FlatTagValue<V> {
    if (Array.isArray(value))
      return value.map((v) => this.flattenTagValue(v)) as FlatTagValue<V>;
    else if (typeof value === "object") {
      return Object.fromEntries(
        Object.entries(value).map(([key, v]) => {
          if (typeof v === "object" && "value" in v) return [key, v.value];
          else return [key, this.flattenTagValue(v)];
        })
      ) as FlatTagValue<V>;
    } else return value;
  }

  private transformObjectsToTagData(tags: Schema): Schema {
    return Object.fromEntries(
      Object.entries(tags).map(([key, data]) => {
        if (Array.isArray(data)) {
          return [key, data.map((v) => this.transformObjectsToTagData(v))];
        } else if (typeof data === "object") {
          return [
            key,
            {
              type: data.type ?? typeof data.value,
              value: data.value,
            },
          ];
        } else {
          return [key, { type: typeof data, value: data }];
        }
      })
    ) as Schema;
  }

  private makeTagsFromSchema(
    tags: Schema
  ): Record<keyof Schema, Omit<Tag, "setData">> {
    const cleanTags = this.transformObjectsToTagData(tags);

    return Object.fromEntries(
      Object.entries(cleanTags).map(([key, data]: [string, TagData]) => {
        let type: string, value: TagData["value"];

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
          type = "type" in data ? data.type : typeof data;
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

  private useTag = (<V extends TagSchemaValue = TagData["value"]>(
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

    const v =
      typeof tag.data.value === "object"
        ? this.flattenTagValue(tag.data.value as Record<string, TagData>)
        : tag.data.value;

    return [
      v,
      <T extends HTMLElement | null>(el: T) => {
        if (!el) return;

        (tag!.el.current as T) = el;

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

    function unmountTag(id: string, value: TagValue, type: string) {
      if (type === "object") {
        Object.keys(value).forEach((key) => {
          unmountSingleTagUI(`${id}-${key}`);
        });
      } else unmountSingleTagUI(id);
    }

    Object.entries(Launched.instance.tags).map(([key, tag]) => {
      if (!Array.isArray(tag.data.value))
        unmountTag(key, tag.data.value, tag.data.type);
      else
        tag.data.value.forEach((_, i) => {
          unmountTag(
            `${key}-${i}`,
            (tag.data.value as TagValue[])[i]!,
            tag.data.type
          );
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
