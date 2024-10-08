import React from "react";
import EventEmitter from "./events.js";
import { memo, useRef, useState, useEffect, createContext } from "react";
import { useGenerateStaticTags } from "./hooks.js";
import { createRoot } from "react-dom/client";
import Renderer from "./renderer.js";
import Toolbar from "../ui/components/Toolbar.js";
import error from "./utils/error.js";
import createTag from "./utils/createTag.js";
import flattenTagValue from "./utils/flattenTagValue.js";
import tagToValues from "./utils/tagToValues.js";
import mergeDeep from "./utils/mergeDeep.js";
import type { TagRenderer, TagRenderOptions } from "./renderer.js";

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

export type Tag = {
  data: TagData;
  setData: (
    value: TagData["value"] | ((prev: TagData["value"]) => TagData["value"]),
    config?: Partial<{ silent: boolean }>
  ) => void;
  el: React.RefObject<HTMLElement>;
};

export type Config = Partial<{
  mode: "dynamic" | "static";
  locked: boolean;
  arraysMutable: boolean;
  determineVisibility: (context?: Launched) => boolean;
  save: (tags: Record<string, TagData["value"]>) => void;
  onImageUpload: (file: File) => Promise<string | undefined>;
  toolbarOptions: Partial<{
    className: string;
    position: "center" | "right" | "left";
  }>;
}>;

export const defaults: Config = {
  mode: "dynamic",
  determineVisibility: () =>
    window &&
    new URLSearchParams(window.location.search).get("mode") === "edit",
  toolbarOptions: {
    position: "center",
  },
};

interface LaunchedContextValue {
  useTag<V extends TagSchemaValue = TagData["value"]>(
    key: string,
    value?: V,
    options?: TagRenderOptions
  ): readonly [
    V extends string | number
      ? V extends string // Nonsense to avoid constants
        ? string
        : number
      : FlatTagValue<V>,
    <T extends HTMLElement | null>(el: T) => void,
  ];
}

export default class Launched {
  private renderer = new Renderer();
  private addTag: (key: string, tag: Omit<Tag, "setData">) => void = () => {};
  private originalTags = new Map<string, TagData["value"]>();
  private version: number = -1;
  private setCanUndo: React.Dispatch<React.SetStateAction<boolean>> = () => {};
  private setCanRedo: React.Dispatch<React.SetStateAction<boolean>> = () => {};
  private history: {
    key: string;
    value: TagData["value"];
  }[] = [];

  public readonly config: Config;
  public tags: Record<string, Tag> = {} as Record<string, Tag>;
  public uploadImage?: (file: File) => Promise<string | undefined>;
  public Provider: React.FC<{ children: React.ReactNode }>;
  public context = createContext<LaunchedContextValue>(
    {} as LaunchedContextValue
  );

  public static instance: Launched | null;
  public static events = new EventEmitter();

  constructor(config?: Config) {
    if (Launched.instance) {
      error("There can only be one instance of Launched.");
    }

    Launched.instance = this;

    this.config = mergeDeep(defaults, config ?? {});
    this.uploadImage = this.config.onImageUpload;

    this.Provider = ({ children }: { children: React.ReactNode }) => {
      const [canUndo, setCanUndo] = useState(false);
      const [canRedo, setCanRedo] = useState(false);
      const [visible] = useState(() => {
        const visible = this.config.determineVisibility!(this);

        if (!visible) this.config.locked = true;

        return visible;
      });
      const [tags, setTags] = useState(
        {} as Record<string, Omit<Tag, "setData">>
      );

      this.tags = Object.fromEntries(
        Object.entries(tags).map(([key, data]) => {
          const setData = (
            value:
              | TagData["value"]
              | ((prev: TagData["value"]) => TagData["value"]),
            config?: Partial<{ silent: boolean }>
          ) => {
            if (!tags[key] || this.config.locked) return;

            setTags((p) => {
              const newValue =
                typeof value === "function" ? value(p[key]!.data.value) : value;

              if (!config?.silent)
                Launched.events.emit(
                  "tag:change",
                  key,
                  newValue,
                  p[key]?.data.value
                );

              const newTags = { ...p };
              const tag = newTags[key];

              if (tag) {
                tag.data = { ...tag.data, value: newValue };
              }

              return newTags;
            });
          };

          return [key, { ...data, setData }];
        })
      ) as Record<string, Tag>;

      this.addTag = (key, tag) => {
        setTags((p) => ({ ...p, [key]: tag }));
      };

      useEffect(() => {
        Launched.events.emit("data:update", this.tags);
      }, [tags]);

      useEffect(() => {
        this.setCanUndo = setCanUndo;
        this.setCanRedo = setCanRedo;
      }, []);

      return (
        <this.context.Provider
          value={{
            useTag: this.useTag.bind(this),
          }}
        >
          {children}
          {visible && (
            <Toolbar
              {...this.config.toolbarOptions}
              undo={this.undo.bind(this)}
              redo={this.redo.bind(this)}
              revert={this.restore.bind(this, true)}
              save={() =>
                this.config.save?.(
                  Object.fromEntries(
                    Object.entries(this.tags).map(
                      ([key, tag]) => [key, tagToValues(tag)] as const
                    )
                  )
                )
              }
              canUndo={canUndo}
              canRedo={canRedo}
            />
          )}
        </this.context.Provider>
      );
    };

    Launched.events.on(
      "tag:ready",
      (...props: [string, Tag, TagRenderOptions]) => {
        console.log("rendering", props[0]);
        this.render(props[0], props[2]);
      }
    );

    Launched.events.on("tag:change", (key: string, value: TagData["value"]) => {
      if (this.version !== this.history.length - 1) {
        this.history = this.history.slice(0, this.version + 1);
        this.setCanRedo(false);
      }

      this.version++;
      this.history.push({ key: String(key), value });

      this.setCanUndo(true);
    });

    if (this.config.mode === "static") {
      const content = document.body.innerHTML;

      // ! Ugly hack to avoid generating another root component
      const Raw = memo(({ value }: { value: string }) => {
        const ref = useRef<HTMLDivElement>(null);
        const [, set] = useState(0);

        useEffect(() => {
          ref.current!.outerHTML = value;
          set(1);
        }, []);

        useGenerateStaticTags(this.config.mode !== "static" || !ref.current);

        return <div ref={ref} />;
      });

      const root = createRoot(document.body);

      root.render(
        <this.Provider>
          <Raw value={content} />
        </this.Provider>
      );
    }
  }

  private useTag = (<V extends TagSchemaValue = TagData["value"]>(
    key: string,
    value?: V,
    options?: TagRenderOptions
  ) => {
    const t = this ?? Launched.instance;

    let tag: Tag | Omit<Tag, "setData"> | undefined = t.tags[key];

    if (!tag && value != null) {
      const newTag = createTag(
        value,
        options?.type ??
          (Array.isArray(value) ? typeof (value as any[])[0] : typeof value)
      );

      setTimeout(() => this.addTag(String(key), newTag), 0);

      tag = newTag;
    } else if (!tag)
      error(
        `Tag "${String(key)}" does not exist. Try providing a value to useTag.`
      );

    const v =
      typeof tag.data.value === "object"
        ? flattenTagValue(tag.data.value as Record<string, TagData>)
        : tag.data.value;

    return [
      v,
      <T extends HTMLElement | null>(el: T) => {
        if (!el || tag.el.current) return;

        (tag!.el.current as T) = el;

        if (!this.originalTags.has(key))
          this.originalTags.set(key, tag.data.value);

        const o: TagRenderOptions = {
          ...options,
          arrayMutable: options?.arrayMutable ?? this.config.arraysMutable,
        };

        Launched.events.emit("tag:ready", key, tag, o);
      },
    ] as const;
  }) as LaunchedContextValue["useTag"];

  private render(tag: string, options?: TagRenderOptions) {
    if (!tag || !this.tags[tag]) return;

    const dry = options && this.config.locked;

    this.renderer.renderSingleTagUI(this.tags[tag]!, String(tag), options, dry);
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

    Launched.events.emit("data:lock");
  }

  public static unlock() {
    if (!Launched.instance) error("Launched is not initialized.");

    Launched.instance.config.locked = false;

    Object.entries(Launched.instance.tags).map(([key]) => {
      Launched.instance!.render(key);
    });

    Launched.events.emit("data:unlock");
  }

  public static toggle() {
    if (!Launched.instance) error("Launched is not initialized.");

    Launched.instance.config.locked ? Launched.unlock() : Launched.lock();
  }

  public static isVisible() {
    if (!Launched.instance) error("Launched is not initialized.");

    return Launched.instance.config.determineVisibility!(Launched.instance);
  }

  public static registerTagFormat<V>(name: string, renderer: TagRenderer<V>) {
    Renderer.registerTagFormat(name, renderer);
  }

  public undo() {
    if (this.version === -1 || this.config.locked) return;
    else if (this.version === 0) {
      this.version = -1;
      this.restore();

      this.setCanUndo(false);
      this.setCanRedo(true);

      return;
    }

    const { key, value } = this.history[--this.version]!;

    Launched.events.emit("data:undo", value, this.tags[key]!.data.value);

    this.tags[key]!.setData(value, { silent: true });

    this.setCanRedo(true);
  }

  public redo() {
    if (
      !this.history.length ||
      this.version === this.history.length - 1 ||
      this.config.locked
    )
      return;

    const { key, value } = this.history[++this.version]!;

    Launched.events.emit("data:redo", value, this.tags[key]!.data.value);

    this.tags[key]!.setData(value, { silent: true });

    this.setCanUndo(true);
    if (this.version === this.history.length - 1) this.setCanRedo(false);
  }

  public restore(hard?: boolean) {
    if (this.config.locked) return;

    if (hard) this.history = [];
    this.version = -1;

    this.setCanUndo(false);
    this.setCanRedo(false);

    Launched.events.emit("data:restore", this.originalTags, this.tags);

    Array.from(this.originalTags.entries()).map(([key, value]) => {
      if (this.tags[key]?.data.value !== value) {
        this.tags[key]!.setData(value, { silent: true });
      }
    });
  }
}

export function LaunchedProvider({
  config,
  children,
}: {
  config?: Config;
  children: React.ReactNode;
}) {
  const L = Launched.instance ?? new Launched(config);

  return <L.Provider>{children}</L.Provider>;
}
