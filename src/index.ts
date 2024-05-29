import "./ui/globals.css";

import Launched from "./core/context";
import { useTag } from "./core/context";

import type { Config } from "./core/context";
import type { TagValue } from "./types/tag";
import type { Renderer, RendererProps } from "./types/render";

import { InlineTagRenderer } from "./ui/components/InlineEditor";
import { MultifieldTagRenderer } from "./ui/components/ObjectEditor";

Launched.registerTagFormat("string", InlineTagRenderer);

export default Launched;
export { useTag, MultifieldTagRenderer };

export type { Config, TagValue, Renderer, RendererProps };
