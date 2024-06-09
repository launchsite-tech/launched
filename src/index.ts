import "./ui/globals.css";

import Launched from "./core/context";
import { LaunchedProvider } from "./core/context";
import { useTag } from "./core/hooks";

import type { Config } from "./core/context";
import type { TagData, TagValue } from "./types/tag";
import type { Renderer, RendererProps } from "./types/render";

import { InlineTagRenderer } from "./ui/components/InlineEditor";
// import { MultifieldTagRenderer } from "./ui/components/ObjectEditor";

Launched.registerTagFormat("string", InlineTagRenderer);
Launched.registerTagFormat("number", InlineTagRenderer);
// Launched.registerTagFormat("object", MultifieldTagRenderer);

export default Launched;
export { useTag, LaunchedProvider };
export type { Config, TagData, TagValue, Renderer, RendererProps };
