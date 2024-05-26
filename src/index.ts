import "./ui/globals.css";

import Launched from "./core/context";
import { LaunchedProvider } from "./core/context";
import { useLaunched } from "./core/hooks";

import type { Config } from "./core/context";
import type { TagValue, PartialTagValue } from "./types/tag";
import type { Renderer } from "./types/render";

import { InlineTagRenderer } from "./ui/components/InlineEditor";
import { MultifieldTagRenderer } from "./ui/components/ObjectEditor";

Launched.registerTagFormat("text", InlineTagRenderer);
Launched.registerTagFormat("object", MultifieldTagRenderer);

export default Launched;
export { useLaunched, LaunchedProvider };

export type { Config, TagValue, PartialTagValue, Renderer };
