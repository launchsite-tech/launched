import { useRef, useState, useContext, createContext } from "react";
import type {
  TagValue,
  PartialTagValue,
  Tag,
  TagSchema,
} from "../types/tag.d.ts";

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

    this.tags = Object.fromEntries(
      Object.entries(this.config.tags).map(([key, value]) => {
        const [data, setData] = useState<TagValue>({
          type: "text",
          value: value as PartialTagValue | Record<string, PartialTagValue>,
          locked: this.config.locked,
          ...(typeof value === "object" ? value : {}),
        });
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
      Launched.instance.context
    ) as LaunchedContextValue<Schema>;
  }

  useTag<S extends Schema>(key: keyof S) {
    const tag = this.tags[key];

    if (!tag) throw new Error(`Tag "${String(key)}" not found.`);

    return [
      tag.data.value as S[typeof key],
      <T extends HTMLElement | null>(el: T) => {
        if (!el) throw new Error("Element is null.");

        if (tag.el.current) {
          throw new Error(`Tag "${String(key)}" already bound to an element.`);
        }

        (this.tags[key]!.el.current as T) = el;
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
