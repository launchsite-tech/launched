import Launched from "../../src/core/context";
import {
  useTagHook,
  generateError,
  describe,
  it,
  expect,
} from "../.helpers/test-utils";

const L = new Launched();

describe("#useTag", () => {
  it("should throw an error if the tag is not found", () => {
    expect(() => useTagHook(L, "foo")).toThrow(
      generateError(
        'Tag "foo" does not exist. Try providing a value to useTag.'
      )
    );
  });
});
