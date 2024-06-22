import { generateError, describe, it, expect } from "../../.helpers/test-utils";
import flattenTagValue from "../../../src/core/utils/flattenTagValue";

describe("#flattenTagValue", () => {
  it("should return a non-object value", () => {
    // @ts-expect-error
    expect(flattenTagValue("foo")).toBe("foo");
  });

  it("should return a non-object value from an array", () => {
    // @ts-expect-error
    expect(flattenTagValue(["foo"])).toEqual(["foo"]);
  });

  it("should return a flat object value", () => {
    expect(flattenTagValue({ foo: { value: "bar", type: "baz" } })).toEqual({
      foo: "bar",
    });
  });

  it("should return a flat object value from an array", () => {
    expect(flattenTagValue([{ foo: { value: "bar", type: "baz" } }])).toEqual([
      { foo: "bar" },
    ]);
  });

  it("should return a flat object value from a nested object", () => {
    expect(
      // @ts-expect-error
      flattenTagValue({ foo: { bar: { value: "baz", type: "qux" } } })
    ).toEqual({
      foo: { bar: "baz" },
    });
  });

  it("should return a flat object value from a nested object in an array", () => {
    expect(
      // @ts-expect-error
      flattenTagValue([{ foo: { bar: { value: "baz", type: "qux" } } }])
    ).toEqual([{ foo: { bar: "baz" } }]);
  });
});
