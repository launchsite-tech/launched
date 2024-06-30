import { describe, it, expect } from "../../.helpers/test-utils";
import tagToValues from "../../../src/core/utils/tagToValues";
import flattenTagValue from "../../../src/core/utils/flattenTagValue";

describe("#tagToValues", () => {
  it("should return a non-object value", () => {
    // @ts-expect-error
    expect(tagToValues({ data: { value: "foo" } })).toBe("foo");
  });

  it("should return a non-object value from an array", () => {
    // @ts-expect-error
    expect(tagToValues({ data: { value: ["foo"] } })).toEqual(["foo"]);
  });

  it("should return a flat object value", () => {
    expect(
      // @ts-expect-error
      tagToValues({ data: { value: { foo: { value: "bar", type: "baz" } } } })
    ).toEqual({
      foo: "bar",
    });
  });

  it("should return a flat object value from an array", () => {
    expect(
      // @ts-expect-error
      tagToValues({ data: { value: [{ foo: { value: "bar", type: "baz" } }] } })
    ).toEqual([{ foo: "bar" }]);
  });
});
