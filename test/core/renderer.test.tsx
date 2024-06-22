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
import Launched, { Tag } from "../../src/core/context";
import Renderer from "../../src/core/renderer";

var l: Launched;
var r: Renderer;

describe("#Renderer", () => {
  it("should create a new Renderer instance", () => {
    l = new Launched();
    // @ts-expect-error
    r = l.renderer;

    expect(Renderer.roots).toBeInstanceOf(Map);
    expect(Renderer.formats).toBeInstanceOf(Map);
  });
});

describe("#Renderer.registerTagFormat", () => {
  it("should register a new tag format", () => {
    Renderer.registerTagFormat("test", {
      component: () => <div />,
    });

    expect(Renderer.formats.get("test")).toBeDefined();
  });

  it("should not register a new tag format if no component is provided", () => {
    expect(() => Renderer.registerTagFormat("test", {} as any)).toThrow(
      generateError("Custom renderers must have a component.")
    );
  });
});
