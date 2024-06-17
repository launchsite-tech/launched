import "./ui/globals.css";

import Launched from "./core/context";
import Renderer from "./core/renderer";
import { LaunchedProvider } from "./core/context";
import { useTag } from "./core/hooks";

import type { Config, TagData, TagValue, Tag } from "./core/context";
import type { TagRenderer, TagRendererProps } from "./core/renderer";

import { InlineTextRenderer } from "./ui/components/InlineEditor";
import { LinkRenderer } from "./ui/components/LinkEditor";

Renderer.registerTagFormat("string", InlineTextRenderer);
Renderer.registerTagFormat("number", InlineTextRenderer);
Renderer.registerTagFormat("link", LinkRenderer);

export default Launched;
export { useTag, LaunchedProvider };
export type { Config, Tag, TagData, TagValue, TagRenderer, TagRendererProps };
