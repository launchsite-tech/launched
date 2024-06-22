import React from "react";
import {
  describe,
  it,
  expect,
  generateError,
  useHookWithWrapper,
  render,
  screen,
} from "../.helpers/test-utils";
import Launched, { Tag, LaunchedProvider } from "../../src/core/context";

var l: Launched;

describe("#Launched", () => {
  it("should create a new Launched instance", () => {
    l = new Launched();

    // @ts-expect-error
    expect(l.config).toEqual({
      locked: false,
      toolbarOptions: {
        position: "center",
      },
    });

    expect(l.tags).toEqual({});
    expect(l.Provider).toBeDefined();
    expect(l.context).toBeDefined();
    expect(Launched.instance).toEqual(l);

    Launched.instance = null;
  });

  it("should create a new Launched instance with custom config", () => {
    function save(tags: any) {
      console.log(tags);
    }

    function onImageUpload(file: File) {
      console.log(file);
    }

    l = new Launched({
      locked: false,
      save,
      onImageUpload,
    });

    // @ts-expect-error
    expect(l.config).toEqual({
      locked: false,
      toolbarOptions: {
        position: "center",
      },
      save,
      onImageUpload,
    });
  });

  it("should throw an error if an instance already exists", () => {
    expect(() => new Launched()).toThrow(
      generateError("There can only be one instance of Launched.")
    );
  });
});

describe("#Launched.addTag", () => {
  it("should create a new tag", async () => {
    const tag: Omit<Tag, "setData"> = {
      data: {
        value: "bar",
        type: "string",
      },
      el: { current: null },
    };

    useHookWithWrapper(() => {
      // @ts-expect-error
      Launched.instance!.addTag("foo", tag);
    }, Launched.instance!);

    expect(Launched.instance!.tags).toHaveProperty("foo");

    const t = Launched.instance!.tags.foo;

    expect(t.data.value).toEqual("bar");
    expect(t.data.type).toEqual("string");
    expect(t.el.current).toBeNull();
    expect(t.setData).toBeDefined();

    // ! Would normally be called by the useTag hook.
    // @ts-expect-error
    l.originalTags.set("foo", "bar");
  });
});

describe("#Launched.lock", () =>
  it("should lock the editor", () => {
    Launched.lock();

    // @ts-expect-error
    expect(l.config.locked).toEqual(true);
  }));

describe("#Launched.unlock", () =>
  it("should unlock the editor", () => {
    Launched.unlock();

    // @ts-expect-error
    expect(l.config.locked).toEqual(false);
  }));

describe("#Launched.toggle", () =>
  it("should toggle the editor", () => {
    Launched.toggle();

    // @ts-expect-error
    expect(l.config.locked).toEqual(true);

    Launched.toggle();

    // @ts-expect-error
    expect(l.config.locked).toEqual(false);
  }));

describe("#History", () => {
  it("should add an item to the history", () => {
    // @ts-expect-error
    const version = l.version;

    l.tags["foo"].setData("baz");

    // @ts-expect-error
    expect(l.history).toHaveLength(1);
    // @ts-expect-error
    expect(l.history[0]).toEqual({
      key: "foo",
      value: "baz",
      prevValue: "bar",
    });
    // @ts-expect-error
    expect(l.version).toEqual(version + 1);
  });

  it("should restore the previous value", () => {
    l.restore();

    expect(l.tags["foo"].data.value).toEqual("bar");
    // @ts-expect-error
    expect(l.version).toEqual(-1);
  });

  it("should redo the next value", () => {
    // @ts-expect-error
    const version = l.version;

    l.redo();

    expect(l.tags["foo"].data.value).toEqual("baz");
    // @ts-expect-error
    expect(l.version).toEqual(version + 1);
  });

  it("should undo the previous value", () => {
    // @ts-expect-error
    const version = l.version;

    l.tags["foo"].setData("qux");

    // @ts-expect-error
    expect(l.history).toHaveLength(2);
    // @ts-expect-error
    expect(l.history[1]).toEqual({
      key: "foo",
      value: "qux",
      prevValue: "baz",
    });

    l.undo();

    expect(l.tags["foo"].data.value).toEqual("baz");
    // @ts-expect-error
    expect(l.version).toEqual(version);
  });

  it("should not undo or redo if the editor is locked", () => {
    Launched.lock();

    // @ts-expect-error
    const version = l.version;

    l.undo();

    expect(l.tags["foo"].data.value).toEqual("baz");
    // @ts-expect-error
    expect(l.version).toEqual(version);

    l.redo();

    expect(l.tags["foo"].data.value).toEqual("baz");
    // @ts-expect-error
    expect(l.version).toEqual(version);

    Launched.unlock();
  });

  it("should undo the previous value", () => {
    // @ts-expect-error
    const version = l.version;

    l.undo();

    expect(l.tags["foo"].data.value).toEqual("bar");
    // @ts-expect-error
    expect(l.version).toEqual(version - 1);
  });

  it("should not undo if the version is -1", () => {
    // @ts-expect-error
    const version = l.version;

    l.undo();

    expect(l.tags["foo"].data.value).toEqual("bar");
    // @ts-expect-error
    expect(l.version).toEqual(version);
  });

  it("should rewrite future history", () => {
    // @ts-expect-error
    const version = l.version;
    // @ts-expect-error
    const history = [...l.history];

    l.tags["foo"].setData("baz");

    expect(l.tags["foo"].data.value).toEqual("baz");
    // @ts-expect-error
    expect(l.version).toEqual(version + 1);
    // @ts-expect-error
    expect(l.history).toHaveLength(history.slice(0, version).length);
  });

  it("should not redo if the version is the last", () => {
    // @ts-expect-error
    const version = l.version;

    l.redo();

    expect(l.tags["foo"].data.value).toEqual("baz");
    // @ts-expect-error
    expect(l.version).toEqual(version);
  });

  it("should hard restore the original values", () => {
    l.tags["foo"].setData("baz");

    // @ts-expect-error
    expect(l.history).toHaveLength(2);

    l.restore(true);

    expect(l.tags["foo"].data.value).toEqual("bar");
    // @ts-expect-error
    expect(l.history).toHaveLength(0);
    // @ts-expect-error
    expect(l.version).toEqual(-1);
  });
});

describe("#LaunchedProvider", () => {
  it("should render the LaunchedProvider from the existing instance", () => {
    render(
      <LaunchedProvider>
        <span>hi</span>
      </LaunchedProvider>
    );

    expect(screen.getByText("hi")).toBeInTheDocument();
    expect(Launched.instance).toEqual(l);
  });

  it("should render the LaunchedProvider from a new instance with a custom config", () => {
    Launched.instance = null;

    render(
      <LaunchedProvider
        config={{
          locked: true,
        }}
      >
        <span>hi</span>
      </LaunchedProvider>
    );

    expect(screen.getByText("hi")).toBeInTheDocument();
    expect(Launched.instance).not.toEqual(l);
    // @ts-expect-error
    expect(Launched.instance!.config.locked).toEqual(true);

    l = Launched.instance!;
  });
});
