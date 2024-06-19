import Launched from "../../src/core/context";
import { useTag } from "../../src/core/hooks";
import { describe, expect, it } from "vitest";

const L = new Launched();

describe("#useTag", () => {
  it("should throw an error if Launched is not initialized", () => {
    expect(() => useTag("key")).toThrow("Launched not initialized.");
  });
});
