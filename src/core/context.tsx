import { useRef, useState, useContext, createContext } from "react";
import type {
  TagValue,
  PartialTagValue,
  Tag,
  TagSchema,
} from "../types/tag";

export interface Config<Schema extends TagSchema<Schema>> {
  tags: Schema;
  locked?: boolean;
}

const defaults = {
  locked: false,
};

interface LaunchedContextValue<Schema extends TagSchema<Schema>> {
  tags: Record<keyof Schema, Tag>;
  useTag<S extends Schema>(
    key: keyof S
  ): readonly [S[typeof key], <T extends HTMLElement | null>(el: T) => void];
}

function makeTags<Schema extends TagSchema<Schema>>(config: Config<Schema>) {
return Object.fromEntries(
      Object.entries(config.tags).map(([key, value]) => {
        const options: Partial<TagValue> = typeof value === "object" ? value! : {};

        const [data, setData] = useState<TagValue>(Object.assign(
          {
            type: "text",
            value: (typeof value === "object" ? options.value : value) as PartialTagValue | Record<string, PartialTagValue>,
            locked: config.locked,
          },
            options
          ) as TagValue
        )
        const el = useRef<HTMLElement | null>(null);

        return [
          key,
          {
            data,
            setData,
            el,
          } as Tag,
        ];
      })
    ) as Record<keyof Schema, Tag>;
}

export default class Launched<Schema extends TagSchema<Schema>> {
  private context;
  private tags;
  private config;

  public Provider;

  public static instance: Launched<any> | null = null;
  public static useLaunched: () => LaunchedContextValue<any>;

  constructor(config: Config<Schema>) {
    this.context = createContext<LaunchedContextValue<Schema> | null>(null);
    this.config = Object.assign({}, defaults, config) as Required<
      Config<Schema>
    >;

    if (!this.config.tags) {
      throw new Error("No tags provided.");
    }

    this.tags = makeTags(config);

    this.Provider = ({ children }: { children: React.ReactNode }) => {
      return (
        <this.context.Provider value={{ tags: this.tags, useTag: this.useTag }}>
          {children}
        </this.context.Provider>
      );
    };

    Launched.instance = this;
  }

  useLaunched() {
    if (!Launched.instance) {
      throw new Error("Launched instance not found.");
    }

    return useContext(
      this.context
    ) as LaunchedContextValue<Schema>;
  }

  useTag<S extends Schema = Schema>(key: keyof S) {
    const tag = this.tags[key];

    if (!tag) throw new Error(`Tag "${String(key)}" not found.`);

    return [
      tag.data.value as S[typeof key],
      <T extends HTMLElement | null>(el: T) => {
        if (!el) throw new Error("Element is null.");

        if (tag.el.current) {
          throw new Error(`Tag "${String(key)}" already bound to an element.`);
        }

        (this.tags[key].el.current as T) = el;
      },
    ] as const;
  }
}

export function useLaunched() {
  if (!Launched.instance) {
    throw new Error("Launched instance not found.");
  }

  return Launched.instance.useLaunched();
}

export function LaunchedProvider({ children }: { children: React.ReactNode }) {
  if (!Launched.instance) {
    throw new Error("Launched instance not found.");
  }

  return <Launched.instance.Provider>{children}</Launched.instance.Provider>;
}
