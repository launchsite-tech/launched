import "./ui/globals.css";

import Launched from "./core/context";
import { LaunchedProvider } from "./core/context";
import { useTag } from "./core/hooks";

import type { Config, TagData, TagValue, Tag, TagSchema } from "./core/context";
import type { Renderer, RendererProps } from "./core/renderer";

import { InlineTagRenderer } from "./ui/components/InlineEditor";
import { LinkRenderer } from "./ui/components/LinkEditor";

Launched.registerTagFormat("string", InlineTagRenderer);
Launched.registerTagFormat("number", InlineTagRenderer);
Launched.registerTagFormat("link", LinkRenderer);

export default Launched;
export { useTag, LaunchedProvider };
export type {
  Config,
  Tag,
  TagSchema,
  TagData,
  TagValue,
  Renderer,
  RendererProps,
};
