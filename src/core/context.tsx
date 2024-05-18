import { useReducer, useContext, createRef, createContext } from "react";
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
}

function flattenTagValue(value: TagValue | PartialTagValue): PartialTagValue {
  if (typeof value === "object" && "value" in value) {
    return {
      ...value,
      value: flattenTagValue(value.value!),
    };
  }

  return value;
}

function useTagData<Schema extends TagSchema<Schema>>(config: Config<Schema>) {
  if (!config.tags) {
    throw new Error("Tags not provided.");
  }

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

  const [, updateData] = useReducer(
    reducer,
    {} as Record<keyof Schema, TagValue>
  );

  return Object.fromEntries(
    Object.entries(config.tags).map(([key, value]) => {
      const updateDataFunc = (value: TagValue) =>
        updateData({ key: key as keyof Schema, value });

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

      updateDataFunc(dataValue);
      const el = createRef<HTMLElement | null>();

      return [
        key,
        {
          data: dataValue,
          setData: updateDataFunc,
          el,
        },
      ];
    })
  ) as Record<keyof Schema, Tag>;
}

export default class Launched<Schema extends TagSchema<Schema>> {
  private tags;
  private config;

  public Provider;
  public context;

  public static instance: Launched<any> | null;
  public static useLaunched: () => LaunchedContextValue<any>;

  constructor(
    config: Omit<Config<Schema>, "tags">,
    tags: Record<keyof Schema, Tag>
  ) {
    this.context = createContext<LaunchedContextValue<Schema> | null>(null);
    this.config = { ...defaults, ...config } as Required<Config<Schema>>;
    this.tags = tags;

    this.Provider = ({ children }: { children: React.ReactNode }) => {
      return (
        <this.context.Provider value={{ tags: this.tags, useTag: this.useTag }}>
          {children}
        </this.context.Provider>
      );
    };

    console.log(this.config);
    console.log(this.tags);

    Launched.instance = this;
  }

  useTag<S extends Schema = Schema>(key: keyof S) {
    const i = this ?? Launched.instance!;

    const tag = i.tags[key];

    if (!tag) throw new Error(`Tag "${String(key)}" not found.`);

    const v = Array.isArray(tag.data.value)
      ? tag.data.value.map(flattenTagValue)
      : flattenTagValue(tag.data.value);

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
  if (Launched.instance) {
    console.warn("Launched instance already exists. Ignoring new instance.");
    return <Launched.instance.Provider>{children}</Launched.instance.Provider>;
  }

  const tags = useTagData(config);
  new Launched(config, tags);
  const Provider = Launched.instance!.Provider;

  return <Provider>{children}</Provider>;
}
