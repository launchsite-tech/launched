(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('react/jsx-runtime'), require('react'), require('react-dom/client')) :
  typeof define === 'function' && define.amd ? define(['exports', 'react/jsx-runtime', 'react', 'react-dom/client'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.launched = {}, global.jsxRuntime, global.React, global.ReactDOM));
})(this, (function (exports, jsxRuntime, react, client) { 'use strict';

  class EventEmitter {
      events;
      constructor() {
          this.events = {};
      }
      on(event, listener) {
          if (!this.events[event]) {
              this.events[event] = [];
          }
          this.events[event].push(listener);
      }
      off(event, listener) {
          if (!this.events[event])
              return;
          this.events[event] = this.events[event].filter((l) => l !== listener);
      }
      emit(event, ...args) {
          if (!this.events[event])
              return;
          this.events[event].forEach((listener) => listener(...args));
      }
  }
  // Events:
  // tag:ready: a tag is bound to an element => id, tag
  // tag:mount: tag UI component renders => id, tag
  // tag:unmount: tag UI component unmounts => id, tag
  // tag:select: tag UI gains focus => id, tag
  // tag:deselect: tag UI loses focus => id, tag
  // tag:change: a single tag is updated => key, newValue, originalValue
  // data:update: tag data changes => newTagData
  // data:lock: tag data is locked
  // data:unlock: tag data is unlocked

  function error(msg) {
      throw new Error(`Launched error: ${msg}`);
  }

  function flattenTagValue(value) {
      if (Array.isArray(value))
          return value.map((v) => flattenTagValue(v));
      else if (typeof value === "object") {
          return Object.fromEntries(Object.entries(value).map(([key, v]) => {
              if (typeof v === "object" && "value" in v)
                  return [key, flattenTagValue(v.value)];
              else
                  return [key, flattenTagValue(v)];
          }));
      }
      else
          return value;
  }

  class Renderer {
      static formats = new Map();
      static roots = new Map();
      initialRenderOptions = new Map();
      constructor() { }
      static registerTagFormat(name, renderer) {
          if (!renderer.component)
              error("Custom renderers must have a component.");
          Renderer.formats.set(name, renderer);
      }
      renderSingleTagUI(parentTag, id, options, dry) {
          if (!parentTag || !parentTag.el.current)
              return console.warn(`Tag "${id}" was never bound to an element.`);
          const renderTag = (parentTag, tag, childId, index) => {
              if (!tag.el.current)
                  return;
              if (Array.isArray(tag.data.value)) {
                  tag.data.value.forEach((t, i) => {
                      const childEl = tag.el.current.children[i] ?? tag.el.current;
                      renderTag(parentTag, {
                          el: { current: childEl },
                          data: {
                              type: tag.data.type,
                              value: t,
                          },
                          setData: (data) => {
                              tag.setData(tag.data.value.map((v, index) => index === i
                                  ? (typeof data === "function"
                                      ? data(v)
                                      : data)
                                  : v));
                          },
                      }, `${id}-${i}`, i);
                  });
              }
              else if (tag.data.type === "object" &&
                  typeof tag.data.value === "object") {
                  for (const key in tag.data.value) {
                      const childEl = tag.el.current.querySelector(`[data-key="${key}"]`);
                      if (!childEl)
                          error(`Child element with key "${key}" (under "${id}") not found. If you're using a custom renderer, make sure to add a data-key attribute to the targeted element.`);
                      renderTag(parentTag, {
                          el: { current: childEl },
                          data: {
                              type: tag.data.value[key].type,
                              value: tag.data.value[key].value,
                          },
                          setData: (data) => {
                              const newValue = typeof data === "function"
                                  ? data(tag.data.value[key].value)
                                  : data;
                              tag.setData({
                                  ...tag.data.value,
                                  [key]: {
                                      type: tag.data.value[key]
                                          .type,
                                      value: newValue,
                                  },
                              });
                          },
                      }, `${childId}-${key}`, index);
                  }
              }
              else {
                  if (!tag.el.current)
                      return;
                  const renderer = Renderer.formats.get(tag.data.type);
                  if (!renderer) {
                      return console.warn(`No renderer found for tag type "${tag.data.type}".`);
                  }
                  if (renderer.parentValidator &&
                      !renderer.parentValidator(tag.el.current)) {
                      return console.warn(`Parent element of tag "${childId}" does not satisfy the constraints of the "${tag.data.type}" renderer.`);
                  }
                  const id = `Lt-${childId.replaceAll(" ", "-")}`;
                  let userOptions;
                  if (this.initialRenderOptions.get(id))
                      userOptions = this.initialRenderOptions.get(id);
                  else {
                      userOptions = {
                          arrayMutable: options?.arrayMutable ?? false,
                          index,
                          parentTag,
                      };
                      this.initialRenderOptions.set(id, userOptions);
                  }
                  if (dry)
                      return;
                  const existingNode = document.getElementById(id);
                  if (existingNode)
                      existingNode.remove();
                  setTimeout(() => {
                      if (Renderer.roots.get(childId)) {
                          Renderer.roots.get(childId).unmount();
                          Renderer.roots.delete(childId);
                      }
                      const rootNode = document.createElement("div");
                      rootNode.id = id;
                      tag.el.current.appendChild(rootNode);
                      const root = client.createRoot(rootNode);
                      Renderer.roots.set(childId, root);
                      const t = {
                          ...tag,
                          data: {
                              type: tag.data.type,
                              value: flattenTagValue(tag.data.value),
                          },
                      };
                      root.render(jsxRuntime.jsx(TagUI, { tag: t, renderer: renderer, id: childId, options: userOptions }));
                  }, 0);
              }
          };
          renderTag(parentTag, parentTag, id, 0);
      }
      unmountSingleTagUI(tagId) {
          const id = `Lt-${tagId.split(" ").join("-")}`;
          const root = Renderer.roots.get(tagId);
          if (root) {
              root.unmount();
              Renderer.roots.delete(tagId);
          }
          const node = document.getElementById(id);
          if (node)
              node.remove();
      }
  }
  function TagUI({ tag, renderer, id, options, }) {
      const containerRef = react.useRef(null);
      const [selected, setSelected] = react.useState(false);
      const { arrayMutable, parentTag, index } = options;
      function close() {
          setSelected(false);
          containerRef.current?.blur();
          renderer.onClose?.({
              element: tag.el.current ?? undefined,
          });
          Launched.events.emit("tag:deselect", id, tag);
      }
      function updateData(data) {
          tag.setData(data);
          renderer.onDataUpdate?.({
              element: tag.el.current ?? undefined,
              data,
          });
          // @ts-expect-error
          tag.el.current = null;
      }
      function duplicateTagItem() {
          if (!Array.isArray(parentTag.data.value))
              return;
          parentTag.setData((p) => [
              ...p.slice(0, index + 1),
              p[index],
              ...p.slice(index + 1),
          ]);
      }
      function removeTagItem() {
          if (!Array.isArray(parentTag.data.value))
              return;
          parentTag.setData((p) => [
              ...p.slice(0, index),
              ...p.slice(index + 1),
          ]);
      }
      function onTagSelect(selectedId) {
          if (selectedId !== id)
              setSelected(false);
      }
      react.useEffect(() => {
          if (!tag.el.current)
              error("Element is null.");
          tag.el.current.classList.add("tagged");
          if (getComputedStyle(tag.el.current).position === "static") {
              tag.el.current.style.position = "relative";
          }
          Launched.events.emit("tag:mount", id, tag);
          Launched.events.on("tag:select", onTagSelect);
          return () => {
              Launched.events.emit("tag:unmount", id, tag);
              Launched.events.off("tag:select", onTagSelect);
          };
      }, []);
      function select() {
          if (selected)
              return;
          setSelected(true);
          renderer?.onSelect?.({ element: tag.el.current });
          Launched.events.emit("tag:select", id, tag);
      }
      if (!tag.el.current)
          return null;
      return (jsxRuntime.jsxs("div", { ref: containerRef, tabIndex: 0, onMouseDown: select, onFocus: select, className: `Launched__tag-container ${selected && "active"}`, children: [jsxRuntime.jsx(renderer.component, { element: tag.el.current, value: tag.data.value, selected: selected, updateData: (v) => updateData(v), close: () => close(), id: id, context: Launched.instance }), arrayMutable && (jsxRuntime.jsxs("div", { onMouseDown: (e) => e.preventDefault(), className: "Launched__tag-arrayControls Launched__toolbar-tools", children: [jsxRuntime.jsx("button", { className: "Launched__toolbar-button add", onClick: duplicateTagItem, children: jsxRuntime.jsxs("svg", { viewBox: "0 0 24 24", className: "Launched__icon", children: [jsxRuntime.jsx("rect", { x: "9", y: "9", width: "13", height: "13", rx: "2", ry: "2" }), jsxRuntime.jsx("path", { d: "M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" })] }) }), jsxRuntime.jsx("button", { className: "Launched__button remove", onClick: removeTagItem, children: jsxRuntime.jsxs("svg", { viewBox: "0 0 24 24", className: "Launched__icon", children: [jsxRuntime.jsx("polyline", { points: "3 6 5 6 21 6" }), jsxRuntime.jsx("path", { d: "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" })] }) })] }))] }));
  }

  function Toolbar({ position, className, canUndo, canRedo, undo, redo, save, revert, }) {
      // @ts-expect-error
      const [disabled, setDisabled] = react.useState(Launched.instance.config.locked);
      return (jsxRuntime.jsx("div", { "data-position": position, className: `Launched__toolbar ${className || ""} ${disabled && "disabled"}`, children: jsxRuntime.jsxs("div", { className: "Launched__toolbar-tools", children: [jsxRuntime.jsx("button", { onClick: save, className: "Launched__toolbar-saveButton Launched__button", children: "Save" }), jsxRuntime.jsxs("select", { onChange: (e) => {
                          if (e.target.value === "locked") {
                              Launched.lock();
                              setDisabled(true);
                          }
                          else {
                              Launched.unlock();
                              setDisabled(false);
                          }
                      }, className: "Launched__toolbar-lockMode", value: disabled ? "locked" : "unlocked", children: [jsxRuntime.jsx("option", { value: "unlocked", children: "Edit" }), jsxRuntime.jsx("option", { value: "locked", children: "Preview" })] }), jsxRuntime.jsx("button", { disabled: !canUndo, onClick: undo, className: "Launched__toolbar-button undo", children: jsxRuntime.jsxs("svg", { viewBox: "0 0 24 24", className: "Launched__icon", children: [jsxRuntime.jsx("polyline", { points: "1 4 1 10 7 10" }), jsxRuntime.jsx("path", { d: "M3.51 15a9 9 0 1 0 2.13-9.36L1 10" })] }) }), jsxRuntime.jsx("button", { disabled: !canRedo, onClick: redo, className: "Launched__toolbar-button redo", children: jsxRuntime.jsxs("svg", { viewBox: "0 0 24 24", className: "Launched__icon", children: [jsxRuntime.jsx("polyline", { points: "23 4 23 10 17 10" }), jsxRuntime.jsx("path", { d: "M20.49 15a9 9 0 1 1-2.12-9.36L23 10" })] }) }), jsxRuntime.jsx("button", { onClick: revert, className: "Launched__toolbar-revertButton Launched__button", children: "Revert" })] }) }));
  }

  function validateObject(tag) {
      if ("type" in tag && "value" in tag)
          return;
      if (Object.values(tag).some((v) => typeof v === "object" && !("type" in v) && !("value" in v))) {
          error("Objects cannot have nested objects without an explicit type.");
      }
  }
  function transformObjectToTagData(value, type) {
      if (typeof value === "object" && "type" in value && "value" in value)
          return value;
      return Object.fromEntries(Object.entries(value).map(([k, v]) => {
          if (typeof v !== "object")
              return [k, { type: typeof v, value: v }];
          else
              return [k, transformObjectToTagData(v)];
      }));
  }
  function transformTag(tag, type) {
      if (Array.isArray(tag)) {
          if (!tag.length)
              return { type, value: [] };
          else if (tag.some((v) => typeof v !== typeof tag[0]))
              error("Array must have items of the same type.");
          if (typeof tag[0] === "object") {
              if (tag.some((v) => Array.isArray(v)))
                  error("Array cannot have nested arrays.");
              const keys = tag.map((v) => Object.keys(v));
              if (keys[0].some((key) => keys.some((k) => !k.includes(key))))
                  error("Objects must have the same keys.");
              validateObject(tag[0]);
              return {
                  type,
                  value: tag.map((v) => transformObjectToTagData(v)),
              };
          }
          else
              return {
                  type,
                  value: tag,
              };
      }
      else if (typeof tag === "object") {
          validateObject(tag);
          const value = transformObjectToTagData(tag);
          return {
              type,
              value,
          };
      }
      else {
          return {
              type,
              value: tag,
          };
      }
  }
  function createTag(tag, type) {
      const t = transformTag(tag, type);
      return {
          el: react.createRef(),
          data: t,
      };
  }

  function tagToValues(tag) {
      if (Array.isArray(tag.data.value)) {
          return tag.data.value.map((t) => tagToValues({
              ...tag,
              data: {
                  ...tag.data,
                  value: t,
              },
          }));
      }
      else if (typeof tag.data.value === "object") {
          // @ts-expect-error
          return flattenTagValue(tag.data.value);
      }
      else
          return tag.data.value;
  }

  function mergeDeep(target, ...sources) {
      const isObject = (t) => t && typeof t === "object" && !Array.isArray(t);
      if (!sources.length)
          return target;
      const source = sources.shift();
      if (isObject(target) && isObject(source)) {
          for (const key in source) {
              if (isObject(source[key])) {
                  if (!target[key])
                      Object.assign(target, { [key]: {} });
                  mergeDeep(target[key], source[key]);
              }
              else {
                  Object.assign(target, { [key]: source[key] });
              }
          }
      }
      return mergeDeep(target, ...sources);
  }

  const defaults = {
      locked: false,
      arraysMutable: false,
      determineVisibility: () => window &&
          new URLSearchParams(window.location.search).get("mode") === "edit",
      toolbarOptions: {
          position: "center",
      },
  };
  class Launched {
      config;
      renderer = new Renderer();
      addTag = () => { };
      originalTags = new Map();
      version = -1;
      setCanUndo = () => { };
      setCanRedo = () => { };
      history = [];
      tags = {};
      uploadImage;
      Provider;
      context = react.createContext({});
      static instance;
      static events = new EventEmitter();
      constructor(config) {
          if (Launched.instance) {
              error("There can only be one instance of Launched.");
          }
          Launched.instance = this;
          this.config = mergeDeep(defaults, config ?? {});
          this.uploadImage = this.config.onImageUpload;
          this.Provider = ({ children }) => {
              const [canUndo, setCanUndo] = react.useState(false);
              const [canRedo, setCanRedo] = react.useState(false);
              const [visible] = react.useState(() => {
                  const visible = this.config.determineVisibility(this);
                  if (!visible)
                      this.config.locked = true;
                  return visible;
              });
              const [tags, setTags] = react.useState({});
              this.tags = Object.fromEntries(Object.entries(tags).map(([key, data]) => {
                  const setData = (value, config) => {
                      if (!tags[key] || this.config.locked)
                          return;
                      setTags((p) => {
                          const newValue = typeof value === "function" ? value(p[key].data.value) : value;
                          if (!config?.silent)
                              Launched.events.emit("tag:change", key, newValue, p[key]?.data.value);
                          const newTags = { ...p };
                          const tag = newTags[key];
                          if (tag) {
                              tag.data = { ...tag.data, value: newValue };
                          }
                          return newTags;
                      });
                  };
                  return [key, { ...data, setData }];
              }));
              this.addTag = (key, tag) => {
                  setTags((p) => ({ ...p, [key]: tag }));
              };
              react.useEffect(() => {
                  Launched.events.emit("data:update", this.tags);
              }, [tags]);
              react.useEffect(() => {
                  this.setCanUndo = setCanUndo;
                  this.setCanRedo = setCanRedo;
              }, []);
              return (jsxRuntime.jsxs(this.context.Provider, { value: {
                      useTag: this.useTag.bind(this),
                  }, children: [children, visible && (jsxRuntime.jsx(Toolbar, { ...this.config.toolbarOptions, undo: this.undo.bind(this), redo: this.redo.bind(this), revert: this.restore.bind(this, true), save: () => this.config.save?.(Object.fromEntries(Object.entries(this.tags).map(([key, tag]) => [key, tagToValues(tag)]))), canUndo: canUndo, canRedo: canRedo }))] }));
          };
          Launched.events.on("tag:ready", (...props) => {
              this.render(props[0], props[2]);
          });
          Launched.events.on("tag:change", (key, value, prevValue) => {
              if (this.version !== this.history.length - 1) {
                  this.history = this.history.slice(0, this.version + 1);
                  this.setCanRedo(false);
              }
              this.version++;
              this.history.push({ key: String(key), value, prevValue });
              this.setCanUndo(true);
          });
      }
      useTag = ((key, value, options) => {
          const t = this ?? Launched.instance;
          let tag = t.tags[key];
          if (!tag && value != null) {
              const newTag = createTag(value, options?.type ??
                  (Array.isArray(value) ? typeof value[0] : typeof value));
              setTimeout(() => this.addTag(String(key), newTag), 0);
              tag = newTag;
          }
          else if (!tag)
              error(`Tag "${String(key)}" does not exist. Try providing a value to useTag.`);
          const v = typeof tag.data.value === "object"
              ? flattenTagValue(tag.data.value)
              : tag.data.value;
          return [
              v,
              (el) => {
                  if (!el)
                      return;
                  tag.el.current = el;
                  if (!this.originalTags.has(key))
                      this.originalTags.set(key, tag.data.value);
                  const o = {
                      ...options,
                      arrayMutable: options?.arrayMutable ?? this.config.arraysMutable,
                  };
                  Launched.events.emit("tag:ready", key, tag, o);
              },
          ];
      });
      render(tag, options) {
          if (!tag || !this.tags[tag])
              return;
          const dry = options && this.config.locked;
          this.renderer.renderSingleTagUI(this.tags[tag], String(tag), options, dry);
      }
      static lock() {
          if (!Launched.instance)
              error("Launched is not initialized.");
          Launched.instance.config.locked = true;
          function unmountTag(id, value, type) {
              if (type === "object") {
                  Object.keys(value).forEach((key) => {
                      Launched.instance.renderer.unmountSingleTagUI(`${id}-${key}`);
                  });
              }
              else
                  Launched.instance.renderer.unmountSingleTagUI(id);
          }
          Object.entries(Launched.instance.tags).map(([key, tag]) => {
              if (!Array.isArray(tag.data.value))
                  unmountTag(key, tag.data.value, tag.data.type);
              else
                  tag.data.value.forEach((_, i) => {
                      unmountTag(`${key}-${i}`, tag.data.value[i], tag.data.type);
                  });
          });
          Launched.events.emit("data:lock");
      }
      static unlock() {
          if (!Launched.instance)
              error("Launched is not initialized.");
          Launched.instance.config.locked = false;
          Object.entries(Launched.instance.tags).map(([key]) => {
              Launched.instance.render(key);
          });
          Launched.events.emit("data:unlock");
      }
      static toggle() {
          if (!Launched.instance)
              error("Launched is not initialized.");
          Launched.instance.config.locked ? Launched.unlock() : Launched.lock();
      }
      static isVisible() {
          if (!Launched.instance)
              error("Launched is not initialized.");
          return Launched.instance.config.determineVisibility(Launched.instance);
      }
      static registerTagFormat(name, renderer) {
          Renderer.registerTagFormat(name, renderer);
      }
      undo() {
          if (this.version === -1 || this.config.locked)
              return;
          else if (this.version === 0) {
              this.version = -1;
              this.restore();
              this.setCanUndo(false);
              this.setCanRedo(true);
              return;
          }
          const { key, prevValue } = this.history[this.version--];
          this.tags[key].setData(prevValue, { silent: true });
          this.setCanRedo(true);
      }
      redo() {
          if (!this.history.length ||
              this.version === this.history.length - 1 ||
              this.config.locked)
              return;
          const { key, value } = this.history[++this.version];
          this.tags[key].setData(value, { silent: true });
          this.setCanUndo(true);
          if (this.version === this.history.length - 1)
              this.setCanRedo(false);
      }
      restore(hard) {
          if (this.config.locked)
              return;
          if (hard)
              this.history = [];
          this.version = -1;
          this.setCanUndo(false);
          this.setCanRedo(false);
          Array.from(this.originalTags.entries()).map(([key, value]) => {
              if (this.tags[key]?.data.value !== value) {
                  this.tags[key].setData(value, { silent: true });
              }
          });
      }
  }
  function LaunchedProvider({ config, children, }) {
      const L = Launched.instance ?? new Launched(config);
      return jsxRuntime.jsx(L.Provider, { children: children });
  }

  function useTag(key, value, options) {
      if (!Launched.instance)
          error("Launched not initialized.");
      const { useTag } = react.useContext(Launched.instance.context);
      return useTag(key, value, options);
  }

  const HTMLTagsWithoutChildrenLower = [
      "area",
      "base",
      "br",
      "col",
      "embed",
      "hr",
      "img",
      "input",
      "link",
      "meta",
      "param",
      "source",
      "track",
      "wbr",
  ];
  const HTMLTextTagsLower = [
      "p",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "span",
      "div",
  ];
  const HTMLTagsWithoutChildren = HTMLTagsWithoutChildrenLower.map((t) => t.toUpperCase());
  const HTMLTextTags = HTMLTextTagsLower.map((t) => t.toUpperCase());

  function InlineTextUI({ value, selected, updateData, close, }) {
      const editorRef = react.useRef(null);
      const [text, setText] = react.useState(value);
      function sanitizeText(text) {
          return text.replace(/<[^>]*>?/gm, "");
      }
      function handleContentChange() {
          if (!editorRef.current)
              return value;
          const text = sanitizeText(editorRef.current.textContent || "");
          setText(text);
          return text;
      }
      function onClose() {
          const text = handleContentChange();
          if (text !== value)
              updateData(text);
          close();
      }
      react.useEffect(() => {
          if (!editorRef.current)
              return;
          editorRef.current.textContent = value;
      }, []);
      return (jsxRuntime.jsx("div", { ref: editorRef, onInput: () => setText(editorRef.current?.textContent || ""), onBlur: onClose, className: "Launched__tag-inlineEditor", contentEditable: true, suppressContentEditableWarning: true, "data-empty": text === "", spellCheck: selected }));
  }
  const InlineTextRenderer = {
      component: (props) => {
          return jsxRuntime.jsx(InlineTextUI, { ...props });
      },
      parentValidator: (element) => {
          return HTMLTextTags.includes(element.nodeName);
      },
  };

  function LinkUI({ element, value, selected, updateData, close, ...props }) {
      const [href, setHref] = react.useState(value.href);
      function onMouseEnter() {
          element.removeAttribute("href");
      }
      function onMouseLeave() {
          element.setAttribute("href", href);
      }
      react.useEffect(() => {
          element.addEventListener("mouseenter", onMouseEnter);
          element.addEventListener("mouseleave", onMouseLeave);
          return () => {
              element.removeEventListener("mouseenter", onMouseEnter);
              element.removeEventListener("mouseleave", onMouseLeave);
          };
      }, []);
      function onClose(e) {
          if (element.contains(e.relatedTarget))
              return;
          if (href !== value.href)
              updateData({ ...value, href });
          close();
      }
      return (jsxRuntime.jsxs("div", { onBlur: onClose, children: [selected && (jsxRuntime.jsx("div", { className: "Launched__tag-linkInput", children: jsxRuntime.jsx("input", { className: "", type: "text", value: href, placeholder: "Enter a URL...", onChange: (e) => setHref(e.target.value), onBlur: () => {
                          if (href !== value.href)
                              updateData({ ...value, href });
                      } }) })), jsxRuntime.jsx(InlineTextUI, { ...props, value: value.text, updateData: (text) => updateData({ ...value, text }), element: element, selected: selected, close: () => { } })] }));
  }
  const LinkRenderer = {
      component: (props) => {
          return jsxRuntime.jsx(LinkUI, { ...props });
      },
      parentValidator: (element) => {
          return element.nodeName === "A";
      },
  };

  function ImageUI({ id, selected, context, updateData, close, }) {
      async function onUpload(e) {
          try {
              const file = e.target.files?.[0];
              if (!file)
                  return;
              else if (!file.type.startsWith("image/"))
                  return console.error("Invalid file type. Please upload an image.");
              const uploadURL = await context.uploadImage?.(file);
              const reader = new FileReader();
              reader.onloadend = () => {
                  updateData(uploadURL || reader.result);
              };
              reader.readAsDataURL(file);
              close();
          }
          catch (e) {
              console.error("Failed to upload image.");
          }
      }
      return !selected ? null : (jsxRuntime.jsxs("div", { className: "Launched__tag-imageUpload", children: [jsxRuntime.jsx("label", { className: "Launched__button", htmlFor: `${id}-upload`, children: jsxRuntime.jsxs("svg", { viewBox: "0 0 24 24", className: "Launched__icon", children: [jsxRuntime.jsx("path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" }), jsxRuntime.jsx("polyline", { points: "17 8 12 3 7 8" }), jsxRuntime.jsx("line", { x1: "12", y1: "3", x2: "12", y2: "15" })] }) }), jsxRuntime.jsx("input", { id: `${id}-upload`, type: "file", onChange: onUpload, accept: "image/*" })] }));
  }
  const ImageRenderer = {
      component: (props) => {
          return jsxRuntime.jsx(ImageUI, { ...props });
      },
      parentValidator: (element) => {
          const invalid = HTMLTagsWithoutChildren.includes(element.tagName);
          if (invalid)
              console.warn("Hint: If you're trying to attach an image tag to an IMG element, tag a wrapper element instead.");
          return !invalid;
      },
  };

  Launched.registerTagFormat("string", InlineTextRenderer);
  Launched.registerTagFormat("number", InlineTextRenderer);
  Launched.registerTagFormat("link", LinkRenderer);
  Launched.registerTagFormat("image", ImageRenderer);

  exports.LaunchedProvider = LaunchedProvider;
  exports.default = Launched;
  exports.useTag = useTag;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=bundle.js.map
