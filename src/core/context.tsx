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

/** The value used in {@link TagData}. The format that all tag values are stored in. */
export type TagValue = string | number | Record<string, TagData>;

/** @internal A value that can be passed into {@link Launched.useTag | useTag}. Later transformed into {@link TagData.value} by {@link createTag}. */
export type TagSchemaValue =
  | TagValue
  | TagValue[]
  | Record<string, Partial<TagData> | string | number>
  | Record<string, Partial<TagData> | string | number>[];

/** @internal Flattens a {@link TagData.value} object recursively to exclude {@link TagData.type | type} parameters. */
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

/** The data structure for a tag. */
export type TagData = {
  /**
   * @internal The data type of the tag's value.
   *
   * @remarks
   * This is used to determine how the tag should be rendered.
   *
   * Builtin types:
   * - `string`
   * - `number`
   * - `link`
   * - `image`
   */
  readonly type: string;

  /**
   * @internal The value of the tag.
   *
   * @remarks
   * Builtin data types:
   * - `string`: `string`
   * - `number`: `number`
   * - `link`: `{ href: string, text: string }`
   * - `image`: `string`
   */
  readonly value: TagValue | TagValue[];
};

/** The format that every tag is stored in. */
export type Tag = {
  /** The data of the tag. @see {@link TagData} */
  data: TagData;

  /**
   * A function that updates the tag's value.
   *
   * @param value The new value of the tag
   * @param config Additional configuration options
   *
   * @remarks
   * - `config.silent`: If `true`, the change will not be recorded in history
   */
  setData: (
    value: TagData["value"] | ((prev: TagData["value"]) => TagData["value"]),
    config?: Partial<{ silent: boolean }>
  ) => void;

  /** A reference to the tag's associated element. */
  el: React.RefObject<HTMLElement>;
};

/** {@link Launched} configuration options. */
export type Config = Partial<{
  /**
   * The instance's register mode.
   *
   * - `dynamic`: Tags are registered via the {@link Launched.useTag | useTag} hook
   * - `static`: Tags are registered automatically from element attributes (see {@link useGenerateStaticTags})
   */
  mode: "dynamic" | "static";

  /** Whether or not data is initially editable. */
  locked: boolean;

  /** Whether or not arrays are mutable by default. Can be overridden individually by {@link TagRenderOptions.arrayMutable}. */
  arraysMutable: boolean;

  /**
   * A function that determines whether Launched tooling should be visible.
   *
   * @param context The current {@link Launched} instance
   *
   * @returns Whether the data should be visible
   *
   * @remarks
   * By default, all tooling (i.e. the toolbar and all tag editors) is hidden unless the current URL's `mode` query parameter is set to `edit`.
   */
  determineVisibility: (context?: Launched) => boolean;

  /**
   * A function that dictates what to do with saved data.
   *
   * @param tags The current tag data
   *
   * @remarks
   * This function is called when the user clicks the "Save" button in the toolbar. This is where you should save your data to a database.
   */
  save: (tags: Record<string, TagData["value"]>) => void;

  /**
   * A function that uploads an image.
   *
   * @param file The image file to upload
   *
   * @returns The URL of the uploaded image
   *
   * @remarks
   * This function is called when an image is uploaded via the image tag editor. This is where you should upload the image to your server.
   */
  onImageUpload: (file: File) => Promise<string | undefined>;

  /**
   * Configuration for the toolbar.
   *
   * @remarks
   * - `position`: The position of the toolbar. Can be `center`, `right`, or `left`.
   * - `className`: Additional classes to apply to the toolbar.
   */
  toolbarOptions: Partial<{
    className: string;
    position: "center" | "right" | "left";
  }>;
}>;

/** The default configuration options. */
export const defaults: Config = {
  mode: "dynamic",
  determineVisibility: () =>
    window &&
    new URLSearchParams(window.location.search).get("mode") === "edit",
  toolbarOptions: {
    position: "center",
  },
};

/** The context value for the Launched instance. */
interface LaunchedContextValue {
  /** @see {@link Launched.useTag} */
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

/**
 * The main class of Launched, responsible for managing tag data and core functionality. Only one instance should exist at a time.
 *
 * An instance of Launched is automatically created by {@link LaunchedProvider}.
 */
export default class Launched {
  /** @internal The Launched instance's assigned {@link Renderer}. */
  private renderer = new Renderer();

  /** @internal A helper method for updating a specific {@link Launched.tags | tag}. */
  private addTag: (key: string, tag: Omit<Tag, "setData">) => void = () => {};

  /** @internal Initial tag data. Used when {@link Launched.restore | restoring data}. */
  private originalTags = new Map<string, TagData["value"]>();

  /** @internal An index of the current revision, referenced by {@link Launched.history}. */
  private version: number = -1;

  /** @internal Set whether there are changes to undo. */
  private setCanUndo: React.Dispatch<React.SetStateAction<boolean>> = () => {};

  /** @internal Set whether there are changes to redo. */
  private setCanRedo: React.Dispatch<React.SetStateAction<boolean>> = () => {};

  /**
   * @internal A history of changes made to tags.
   *
   * @see {@link Launched.undo} and {@link Launched.redo}
   */
  private history: {
    key: string;
    value: TagData["value"];
  }[] = [];

  /** The provided config object, merged with {@link defaults}. */
  public readonly config: Config;

  /**
   * A map of all tags, indexed by their key.
   *
   * @see {@link Launched.useTag}
   */
  public tags: Record<string, Tag> = {};

  /** @internal Upload an image using the function from {@link Launched.config}. */
  public uploadImage?: (file: File) => Promise<string | undefined>;

  /** @internal The context provider for the Launched instance. */
  public Provider: React.FC<{ children: React.ReactNode }>;

  /** @internal The context for the Launched instance. Exposes the {@link Launched.useTag} method. */
  public context = createContext<LaunchedContextValue>(
    {} as LaunchedContextValue
  );

  /** @internal The current instance of {@link Launched}. */
  public static instance: Launched | null;

  /**
   * A static event emitter for global events.
   *
   * @see {@link EventEmitter}
   */
  public static events = new EventEmitter();

  /**
   * Create a new instance of Launched.
   *
   * @param config The configuration object for the instance
   */
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

  /**
   * A hook for creating new tags or accessing existing ones.
   *
   * @param key The unique key of the tag
   * @param value The initial value of the tag
   * @param options Additional {@link TagRenderOptions | options} for rendering the tag
   *
   * @returns A tuple containing the tag's value and a ref to the tag's element
   *
   * @example
   * ```tsx
   * const [title, titleRef] = useTag("title", "Hello, world!");
   *
   * return <h1 ref={titleRef}>{title}</h1>;
   * ```
   */
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
        if (!el) return;

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

  /**
   * @internal
   *
   * {@link Renderer.renderSingleTagUI | Render} a tag with the specified key.
   *
   * @param tag The key of the tag to render
   * @param options Additional options for rendering the tag
   */
  private render(tag: string, options?: TagRenderOptions) {
    if (!tag || !this.tags[tag]) return;

    const dry = options && this.config.locked;

    this.renderer.renderSingleTagUI(this.tags[tag]!, String(tag), options, dry);
  }

  /**
   * Lock the current Launched instance's data, preventing edits from being made.
   *
   * @remarks
   * This method is called when the user clicks the "Preview" button in the toolbar.
   *
   * All tag editors are unmounted.
   *
   * @see {@link Launched.unlock}
   */
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

  /**
   * Unlock the current Launched instance's data, allowing edits to be made.
   *
   * @remarks
   * This method is called when the user clicks the "Edit" button in the toolbar.
   *
   * All tag editors are remounted.
   *
   * @see {@link Launched.lock}
   */
  public static unlock() {
    if (!Launched.instance) error("Launched is not initialized.");

    Launched.instance.config.locked = false;

    Object.entries(Launched.instance.tags).map(([key]) => {
      Launched.instance!.render(key);
    });

    Launched.events.emit("data:unlock");
  }

  /**
   * Toggle the current Launched instance's lock state.
   *
   * @see {@link Launched.lock} and {@link Launched.unlock}
   */
  public static toggle() {
    if (!Launched.instance) error("Launched is not initialized.");

    Launched.instance.config.locked ? Launched.unlock() : Launched.lock();
  }

  /**
   * Determine whether the current Launched instance is visible.
   *
   * @returns Whether the instance is visible
   *
   * @remarks
   * "Visibility" is determined by the {@link Config.determineVisibility | determineVisibility} function in the instance's configuration. An instance that isn't visible will not render any tooling.
   *
   * By default, Launched is only visible when the current URL's `mode` query parameter is set to `edit`.
   */
  public static isVisible() {
    if (!Launched.instance) error("Launched is not initialized.");

    return Launched.instance.config.determineVisibility!(Launched.instance);
  }

  /** @see {@link Renderer.registerTagFormat} */
  public static registerTagFormat<V>(name: string, renderer: TagRenderer<V>) {
    Renderer.registerTagFormat(name, renderer);
  }

  /**
   * Undo the last change made to the current Launched instance's data.
   *
   * @remarks
   * This method is called when the user clicks the "Undo" button in the toolbar.
   *
   * The {@link Launched.tags | tags} are updated to reflect the previous state.
   *
   * @see {@link Launched.redo}
   */
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

  /**
   * Redo the last change made to the current Launched instance's data.
   *
   * @remarks
   * This method is called when the user clicks the "Redo" button in the toolbar.
   *
   * The {@link Launched.tags | tags} are updated to reflect the next state.
   *
   * @see {@link Launched.undo}
   */
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

  /**
   * Restore the current Launched instance's data to its original state.
   *
   * @param hard Whether to clear the {@link Launched.history | history} and {@link Launched.version | version}
   *
   * @remarks
   * This method is called when the user clicks the "Revert" button in the toolbar.
   *
   * The {@link Launched.tags | tags} are updated to reflect the original state.
   */
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

interface LaunchedProviderProps {
  /** @see {@link Config} */
  config?: Config;

  /** The children of the provider. */
  children: React.ReactNode;
}

/**
 * A context provider for the Launched instance. This is the main entry point for using Launched in React.
 *
 * @param props The provider's props; see {@link LaunchedProviderProps}
 *
 * @example
 * ```tsx
 * import { LaunchedProvider } from "launched";
 *
 * const config = {
 *   save: (tags) => {
 *     console.log(tags);
 *   },
 * };
 *
 * export default function App() {
 *   return (
 *     <LaunchedProvider config={config}>
 *       <AppContent />
 *     </LaunchedProvider>
 *   );
 * }
 * ```
 */
export function LaunchedProvider({ config, children }: LaunchedProviderProps) {
  const L = Launched.instance ?? new Launched(config);

  return <L.Provider>{children}</L.Provider>;
}
