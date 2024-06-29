import "./ui/globals.css";

import Launched from "./core/context.js";
import Renderer from "./core/renderer.js";
import { LaunchedProvider } from "./core/context.js";
import { useTag } from "./core/hooks.js";

import type { Config, TagData, TagValue, Tag } from "./core/context.js";
import type { TagRenderer, TagRendererProps } from "./core/renderer.js";

import { InlineTextRenderer } from "./ui/components/InlineEditor.js";
import { LinkRenderer } from "./ui/components/LinkEditor.js";
import { ImageRenderer } from "./ui/components/ImageEditor.js";

Renderer.registerTagFormat("string", InlineTextRenderer);
Renderer.registerTagFormat("number", InlineTextRenderer);
Renderer.registerTagFormat("link", LinkRenderer);
Renderer.registerTagFormat("image", ImageRenderer);

export default Launched;
export { useTag, LaunchedProvider };
export type { Config, Tag, TagData, TagValue, TagRenderer, TagRendererProps };
