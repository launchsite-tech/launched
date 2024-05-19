import flattenNestedValues from "./util/flatten";
import { useTagData } from "./hooks";
import { createContext } from "react";
import { renderSingleTagUI } from "./render";
import type { Tag, TagSchema, FlatTagSchema } from "../types/tag";
export interface Config<Schema extends TagSchema<Schema>> {
  tags: Schema;
  locked?: boolean;
}

const defaults = {
  locked: false,
};

export interface LaunchedContextValue<Schema extends TagSchema<Schema>> {
  tags: Record<keyof Schema, Tag>;
  useTag<S extends Schema>(
    key: keyof S
  ): readonly [
    FlatTagSchema<S>[typeof key],
    <T extends HTMLElement | null>(el: T) => void,
  ];
  render(key?: keyof Schema): void;
}

export default class Launched<Schema extends TagSchema<Schema>> {
  private readonly config: Required<Config<Schema>>;
  private tags: Record<keyof Schema, Tag>;

  public Provider: React.FC<{ children: React.ReactNode }>;
  public context: React.Context<LaunchedContextValue<Schema> | null>;

  public static instance: Launched<any> | null;

  constructor(
    config: Omit<Config<Schema>, "tags">,
    tags: Record<keyof Schema, Tag>
  ) {
    if (Launched.instance) {
      throw new Error("There can only be one instance of Launched.");
    }

    this.context = createContext<LaunchedContextValue<Schema> | null>(null);
    this.config = { ...defaults, ...config } as Required<Config<Schema>>;
    this.tags = tags;

    this.Provider = ({ children }: { children: React.ReactNode }) => {
      return (
        <this.context.Provider
          value={{ tags: this.tags, useTag: this.useTag, render: this.render }}
        >
          {children}
        </this.context.Provider>
      );
    };

    console.log(this.config);
    console.log(this.tags);

    Launched.instance = this;
  }

  private useTag<S extends Schema = Schema>(key: keyof S) {
    const i = this ?? Launched.instance!;

    const tag = i.tags[key];

    if (!tag) throw new Error(`Tag "${String(key)}" not found.`);

    const v = Array.isArray(tag.data.value)
      ? tag.data.value.map(flattenNestedValues)
      : flattenNestedValues(tag.data.value);

    return [
      v as FlatTagSchema<S>[typeof key],
      <T extends HTMLElement | null>(el: T) => {
        if (!el) throw new Error("Element is null.");

        if (tag.el.current) {
          throw new Error(`Tag "${String(key)}" already bound to an element.`);
        }

        (i.tags[key].el.current as T) = el;
        // ! TEMPORARY
        renderSingleTagUI(tag);
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
}

export function LaunchedProvider<Schema extends TagSchema<Schema>>({
  config,
  children,
}: {
  config: Config<Schema>;
  children: React.ReactNode;
}) {
  const tags = useTagData(config);

  if (Launched.instance) {
    return <Launched.instance.Provider>{children}</Launched.instance.Provider>;
  } else {
    const L = new Launched(config, tags);

    return <L.Provider>{children}</L.Provider>;
  }
}
