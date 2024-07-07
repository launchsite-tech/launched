import { describe, it, expect } from "../../.helpers/test-utils";
import mergeDeep from "../../../src/core/utils/mergeDeep";

describe("#mergeDeep", () => {
  it("should return the target if there are no sources", () => {
    expect(mergeDeep({ foo: "bar" })).toEqual({ foo: "bar" });
  });

  it("should merge two objects", () => {
    expect(mergeDeep({ foo: "bar" }, { bar: "baz" })).toEqual({
      foo: "bar",
      bar: "baz",
    });
  });

  it("should merge two objects with nested objects", () => {
    expect(mergeDeep({ foo: { bar: "baz" } }, { foo: { baz: "qux" } })).toEqual(
      {
        foo: { bar: "baz", baz: "qux" },
      }
    );
  });

  it("should initialize an empty object for missing nested objects in target", () => {
    expect(
      mergeDeep({ foo: { bar: "baz" } }, { baz: { qux: "quux" } })
    ).toEqual({
      foo: { bar: "baz" },
      baz: { qux: "quux" },
    });
  });
});
