import { useReducer, useContext, createRef, createContext } from "react";
import { renderSingleTagUI } from "./render";
import type {
  TagValue,
  PartialTagValue,
  Tag,
  TagSchema,
  FlatTagSchema,
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
  ): readonly [
    FlatTagSchema<S>[typeof key],
    <T extends HTMLElement | null>(el: T) => void,
  ];
  render(key?: keyof Schema): void;
}

function flattenNestedValues(obj: any): any {
  if (typeof obj !== "object" || !obj) return obj;

  if (Array.isArray(obj)) {
    return obj.map(flattenNestedValues);
  }

  if ("value" in obj) {
    return flattenNestedValues(obj.value);
  }

  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [key, flattenNestedValues(value)])
  );
}

function useTagData<Schema extends TagSchema<Schema>>(config: Config<Schema>) {
  if (!config.tags) {
    throw new Error("Tags not provided.");
  }

  const tags = cleanTags();

  function reducer(
    state: Record<keyof Schema, TagValue>,
    action: {
      key: keyof Schema;
      value: TagValue;
    }
  ) {
    return {
      ...state,
      [action.key]: action.value,
    };
  }

  const [, dispatch] = useReducer(reducer, tags);

  function cleanTags(): Record<keyof Schema, TagValue> {
    return Object.fromEntries(
      Object.entries(config.tags).map(([key, value]) => {
        let dataValue: TagValue;

        if (Array.isArray(value)) {
          dataValue = {
            type: "text",
            value: value.map((v: Partial<TagValue>) => ({
              type: "text",
              value: v.value,
              locked: config.locked ?? false,
              ...v,
            })),
            locked: config.locked ?? false,
          };
        } else {
          const options: Partial<TagValue> =
            typeof value === "object" ? value! : {};

          dataValue = {
            type: "text",
            value: (typeof value === "object" ? options.value : value) as
              | PartialTagValue
              | Record<string, PartialTagValue>,
            locked: config.locked ?? false,
            ...options,
          };
        }

        return [key, dataValue];
      })
    ) as Record<keyof Schema, TagValue>;
  }

  return Object.fromEntries(
    Object.entries(tags).map(([key, value]) => {
      const updateDataFunc = (value: TagValue) => {
        dispatch({ key: key as keyof Schema, value });
      };

      const el = createRef<HTMLElement | null>();

      return [
        key,
        {
          data: value,
          setData: (value: TagValue) => updateDataFunc(value),
          el,
        },
      ];
    })
  ) as Record<keyof Schema, Tag>;
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

export function useLaunched() {
  if (!Launched.instance) {
    throw new Error("Launched instance not found.");
  }

  return useContext(Launched.instance.context)!;
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
  }

  const l = new Launched(config, tags);
  const Provider = l.Provider;

  return <Provider>{children}</Provider>;
}
