import { it, expect } from "../.helpers/test-utils";
import Renderer from "../../src/core/renderer";
import "../../src/index";

it("should define default tag types", () => {
  expect(Renderer.formats.get("string")).toBeDefined();
  expect(Renderer.formats.get("number")).toBeDefined();
  expect(Renderer.formats.get("link")).toBeDefined();
  expect(Renderer.formats.get("image")).toBeDefined();
  // expect(Renderer.formats.get("date")).toBeDefined();
  // expect(Renderer.formats.get("time")).toBeDefined();
});
