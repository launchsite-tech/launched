import EventEmitter from "./events";
import flattenNestedValues from "./util/flatten";
import { useState, useEffect, createRef, createContext } from "react";
import { renderSingleTagUI } from "./renderer";
import type {
  Tag,
  TagValue,
  PartialTagValue,
  TagSchema,
  FlatTagSchema,
} from "../types/tag";
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

export interface LaunchedContextValue<Schema extends TagSchema<any>> {
  useTag<S extends Schema>(
    key: keyof S
  ): readonly [
    FlatTagSchema<S>[typeof key],
    <T extends HTMLElement | null>(el: T) => void,
  ];
  render(key?: keyof Schema): void;
}

export default class Launched<Schema extends TagSchema<any>> {
  private readonly config: Required<Config<Schema>>;

  public tags: Record<keyof Schema, Tag> = {} as Record<keyof Schema, Tag>;
  public Provider: React.FC<{ children: React.ReactNode }>;
  public context: React.Context<LaunchedContextValue<Schema> | null>;

  public static instance: Launched<any> | null;
  public static events = new EventEmitter();
  public static formats = new Map<string, Renderer<any>>();

  constructor(config: Omit<Config<Schema>, "tags">) {
    if (Launched.instance) {
      throw new Error("There can only be one instance of Launched.");
    }

    this.context = createContext<LaunchedContextValue<Schema> | null>(null);
    this.config = { ...defaults, ...config } as Required<Config<Schema>>;

    this.Provider = ({ children }: { children: React.ReactNode }) => {
      const [tags, setTags] = useState(
        this.makeTagsFromTagValues(this.cleanTags())
      );

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

      useEffect(() => {
        Launched.events.emit("data:update", this.tags);
      }, [tags]);

      return (
        <this.context.Provider
          value={{
            useTag: this.useTag,
            render: this.render,
          }}
        >
          {children}
        </this.context.Provider>
      );
    };

    Launched.instance = this;

    Launched.events.on("tag:unmount", (tag: Tag) => {
      // @ts-ignore
      tag.el.current = null;
    });

    Launched.events.on("tag:ready", (tag: Tag) => {
      renderSingleTagUI(tag);
    });
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

  private useTag<S extends Schema = Schema>(key: keyof S) {
    const t = this ?? Launched.instance;

    const tag = t.tags[key];

    if (!tag) throw new Error(`Tag "${String(key)}" not found.`);

    const v = Array.isArray(tag.data.value)
      ? tag.data.value.map(flattenNestedValues)
      : flattenNestedValues(tag.data.value);

    return [
      v as FlatTagSchema<S>[typeof key],
      <T extends HTMLElement | null>(el: T) => {
        if (!el) return;

        (t.tags[key].el.current as T) = el;

        Launched.events.emit("tag:ready", t.tags[key]);
      },
    ] as const;
  }

  private render<S extends Schema = Schema>(key?: keyof S) {
    if (key) renderSingleTagUI(this.tags[key]);
    else {
      Object.values(this.tags).forEach((tag) => {
        renderSingleTagUI(tag as Tag);
      });
    }
  }

  public static registerTagFormat<V extends PartialTagValue>(
    name: string,
    renderer: Renderer<V>
  ) {
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
