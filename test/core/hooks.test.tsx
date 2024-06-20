import React from "react";
import Launched from "../../src/core/context";
import { useTag } from "../../src/core/hooks";
import {
  useTagHook,
  generateError,
  describe,
  it,
  expect,
  render,
  screen,
} from "../.helpers/test-utils";

const L = new Launched();

describe("#useTag", () => {
  it("should throw an error if there is no Launched instance", () => {
    Launched.instance = null;

    expect(() => useTag("foo")).toThrow(
      generateError("Launched not initialized.")
    );

    Launched.instance = L;
  });

  it("should throw an error if the tag is not found", () => {
    expect(() => useTagHook(L, "foo")).toThrow(
      generateError(
        'Tag "foo" does not exist. Try providing a value to useTag.'
      )
    );
  });

  it("should return the value and reference of a new tag", () => {
    const value = "bar";

    const [v, ref] = useTagHook(L, "foo", value);

    expect(v).toBe(value);
    expect(ref).toBeDefined();
  });

  it("should bind the tag to an element", () => {
    const [v, ref] = useTagHook(L, "foo", "bar");

    render(<div ref={ref}>{v}</div>);

    expect(screen.getByText(v)).toBeInTheDocument();
  });
});
