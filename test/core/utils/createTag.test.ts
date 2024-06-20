import { generateError, describe, it, expect } from "../../.helpers/test-utils";
import createTag from "../../../src/core/utils/createTag";

describe("#createTag", () => {
  it("should create a basic tag", () => {
    const tag = createTag("foo", "string");

    expect(tag.data).toEqual({
      type: "string",
      value: "foo",
    });
  });

  it("should create a tag with an array value", () => {
    const tag = createTag(["foo", "bar"], "string");

    expect(tag.data).toEqual({
      type: "string",
      value: ["foo", "bar"],
    });
  });

  it("should create a tag with an empty array value", () => {
    const tag = createTag([], "string");

    expect(tag.data).toEqual({
      type: "string",
      value: [],
    });
  });

  it("should create a tag with an array of different types value", () => {
    expect(() => createTag(["foo", 1], "string")).toThrow(
      generateError("Array must have items of the same type.")
    );
  });

  it("should create a tag with an object value", () => {
    const tag = createTag({ foo: "bar", bar: "foo" }, "object");

    expect(tag.data).toEqual({
      type: "object",
      value: {
        foo: { type: "string", value: "bar" },
        bar: { type: "string", value: "foo" },
      },
    });
  });

  it("should create a tag with an array of objects value", () => {
    const tag = createTag([{ foo: "bar" }], "object");

    expect(tag.data).toEqual({
      type: "object",
      value: [{ foo: { type: "string", value: "bar" } }],
    });
  });

  it("should create a tag with an array of objects with different types value", () => {
    expect(() => createTag([{ foo: "bar" }, { bar: 1 }], "object")).toThrow(
      generateError("Objects must have the same keys.")
    );
  });

  it("should create a tag with a nested object value", () => {
    // @ts-expect-error
    expect(() => createTag({ foo: { bar: "baz" } }, "object")).toThrow(
      generateError(
        "Objects cannot have nested objects without an explicit type."
      )
    );
  });

  it("should create a tag with a nested tagData value", () => {
    const tag = createTag({ foo: { type: "string", value: "bar" } }, "object");

    expect(tag.data).toEqual({
      type: "object",
      value: { foo: { type: "string", value: "bar" } },
    });
  });

  it("should create a tag with a nested array value", () => {
    // @ts-expect-error
    expect(() => createTag([["foo", "bar"]], "array")).toThrow(
      generateError("Array cannot have nested arrays.")
    );
  });

  it("should create a tag with a nested tagData array value", () => {
    const tag = createTag([{ type: "string", value: "foo" }], "array");

    expect(tag.data).toEqual({
      type: "array",
      value: [{ type: "string", value: "foo" }],
    });
  });

  it("should create a tag of complex type", () => {
    const tag = createTag(
      [{ foo: { type: "bar", value: "baz" }, bar: 1 }],
      "object"
    );

    expect(tag.data).toEqual({
      type: "object",
      value: [
        {
          foo: { type: "bar", value: "baz" },
          bar: { type: "number", value: 1 },
        },
      ],
    });
  });
});
