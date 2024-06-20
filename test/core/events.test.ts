import { describe, it, expect } from "../.helpers/test-utils";
import EventEmitter from "../../src/core/events";

const e = new EventEmitter();

function listener(o: Record<string, any>) {
  o["foo"] = "bar";
}

describe("#EventEmitter", () => {
  it("should add a listener", () => {
    e.on("test", listener);

    // @ts-expect-error
    expect(e.events["test"]).toHaveLength(1);
  });

  it("should emit an event", () => {
    const o: Record<string, any> = {};

    e.emit("test", o);

    expect(o).toEqual({ foo: "bar" });
  });

  it("should not emit an event", () => {
    const o: Record<string, any> = {};

    e.emit("test2", o);

    expect(o).toEqual({});
  });

  it("should remove a listener", () => {
    e.off("test", listener);

    // @ts-expect-error
    expect(e.events["test"]).toHaveLength(0);
  });

  it("should not do anything", () => {
    e.off("test2", listener);

    // @ts-expect-error
    expect(e.events["test2"]).toBeUndefined();
  });
});
