import React from "react";
import EventEmitter from "./events";
import { useState, useEffect, createContext } from "react";
import Renderer from "./renderer";
import Toolbar from "../ui/components/Toolbar";
import error from "./utils/error";
import makeTagsFromSchema from "./utils/makeTagsFromSchema";
import flattenTagValue from "./utils/flattenTagValue";

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
  save?: (tags: Record<keyof Schema, Tag>) => void;
  toolbarOptions?: Partial<{
    className: string;
    position: "center" | "right" | "left";
  }>;
}

const defaults: Config<{}> = {
  locked: false,
  tags: {},
  toolbarOptions: {
    position: "center",
  },
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

export default class Launched<Schema extends TagSchema<any> = {}> {
  private readonly config: Required<Config<Schema>>;
  private renderer = new Renderer();
  private addTag: (key: string, tag: Omit<Tag, "setData">) => void = () => {};
  private originalTags = new Map<keyof Schema, TagData["value"]>();
  private version: number = -1;
  private history: { key: string; value: TagData["value"] }[] = [];

  public tags: Record<keyof Schema, Tag> = {} as Record<keyof Schema, Tag>;
  public Provider: React.FC<{ children: React.ReactNode }>;
  public context = createContext<LaunchedContextValue>(
    {} as LaunchedContextValue
  );

  public static instance: Launched<any> | null;
  public static events = new EventEmitter();

  constructor(config?: Config<Schema>) {
    if (Launched.instance) {
      error("There can only be one instance of Launched.");
    }

    Launched.instance = this;

    this.config = { ...defaults, ...config } as Required<Config<Schema>>;

    this.Provider = ({ children }: { children: React.ReactNode }) => {
      const [tags, setTags] = useState(() =>
        makeTagsFromSchema(this.config.tags)
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
          <Toolbar
            {...this.config.toolbarOptions}
            undo={this.undo.bind(this)}
            redo={this.redo.bind(this)}
            revert={this.restore.bind(this)}
            save={() => this.config.save?.(this.tags)}
          />
        </this.context.Provider>
      );
    };

    Launched.events.on("tag:ready", (key: keyof Schema) => {
      if (!this.config.locked) this.render(key);
    });

    Launched.events.on(
      "tag:change",
      (key: keyof Schema, value: TagData["value"]) => {
        if (this.version !== this.history.length)
          this.history = this.history.slice(0, this.version);

        this.history.push({ key: String(key), value });
        this.version++;

        console.log(this.version);
      }
    );
  }

  private useTag = (<V extends TagSchemaValue = TagData["value"]>(
    key: string,
    value?: V
  ) => {
    const t = this ?? Launched.instance;

    let tag: Tag | Omit<Tag, "setData"> | undefined = t.tags[key];

    if (!tag && value) {
      const newTag = makeTagsFromSchema({ [key]: value } as Schema)[key]!;

      setTimeout(() => this.addTag(String(key), newTag), 0);

      tag = newTag;
    } else if (!tag)
      error(
        `Tag "${String(key)}" does not exist. Either create add it to your schema or pass a value to useTag.`
      );

    const v =
      typeof tag.data.value === "object"
        ? flattenTagValue(tag.data.value as Record<string, TagData>)
        : tag.data.value;

    return [
      v,
      <T extends HTMLElement | null>(el: T) => {
        if (!el) return;

        (tag!.el.current as T) = el;

        if (!this.originalTags.has(key))
          this.originalTags.set(key, tag.data.value);

        Launched.events.emit("tag:ready", key, tag);
      },
    ] as const;
  }) as LaunchedContextValue["useTag"];

  private render(tag?: keyof Schema) {
    if (tag && this.tags[tag])
      this.renderer.renderSingleTagUI(this.tags[tag], String(tag));
    else
      Object.entries(this.tags).map(([key, tag]) =>
        tag.el.current ? this.renderer.renderSingleTagUI(tag, key) : null
      );
  }

  public static lock() {
    if (!Launched.instance) error("Launched is not initialized.");

    Launched.instance.config.locked = true;

    function unmountTag(id: string, value: TagValue, type: string) {
      if (type === "object") {
        Object.keys(value).forEach((key) => {
          Launched.instance!.renderer.unmountSingleTagUI(`${id}-${key}`);
        });
      } else Launched.instance!.renderer.unmountSingleTagUI(id);
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

  public undo() {
    console.log(this.version);

    if (this.version === -1) return;
    else if (this.version === 0) {
      this.version -= 2;
      this.restore();
      return;
    }

    const { key, value } = this.history[this.version - 1]!;
    this.version -= 2;

    this.tags[key]!.setData(value);
  }

  public redo() {
    if (this.version === this.history.length) return;

    const { key, value } = this.history[this.version + 1]!;

    this.tags[key]!.setData(value);
  }

  public restore() {
    this.history = [];
    this.version = -1;

    Array.from(this.originalTags.entries()).map(([key, value]) => {
      if (this.tags[key]?.data.value !== value) {
        console.log(key, value);
        this.tags[key]!.setData(value);
      }
    });
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
