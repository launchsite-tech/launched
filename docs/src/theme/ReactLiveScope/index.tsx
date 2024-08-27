import React from "react";

import { useState, useEffect } from "react";

import Launched, { LaunchedProvider } from "launched";
import { Text, Number, Image, Link } from "launched/components";
import ReactJson from "react-json-view";

import type { Config, Tag } from "launched";

import flattenTagValue from "@site/utils/flattenTagValue";

const config: Config = {
  determineVisibility: () => true,
  toolbarOptions: {},
};

const LaunchedWrapper = ({ children }: { children: React.ReactNode }) => {
  const [tagData, setTagData] = useState<Record<string, any>>({
    message: "Update some data to get started.",
  } as any);

  function onDataUpdate(rawData: Record<string, Tag>) {
    const data = Object.fromEntries(
      Object.entries(rawData).map(([key, tag]) => [
        key,
        flattenTagValue(tag.data).value,
      ])
    );

    setTagData(data);
  }

  useEffect(() => {
    Launched.events.on("data:update", onDataUpdate);

    return () => {
      Launched.events.off("data:update", onDataUpdate);
    };
  }, []);

  return (
    <div id="Launched__container">
      <div id="content">
        <LaunchedProvider config={config}>{children}</LaunchedProvider>
      </div>
      <div id="output">
        <ReactJson
          src={tagData}
          theme={{
            base00: "transparent",
            base01: "var(--ifm-menu-color-active)",
            base02: "var(--ifm-menu-color-active)",
            base03: "var(--ifm-menu-color-active)",
            base04: "var(--ifm-menu-color-active)",
            base05: "var(--ifm-menu-color-active)",
            base06: "var(--ifm-menu-color-active)",
            base07: "var(--ifm-menu-color-active)",
            base08: "var(--ifm-menu-color-active)",
            base09: "#FF7F24",
            base0A: "var(--ifm-menu-color-active)",
            base0B: "var(--ifm-menu-color-active)",
            base0C: "var(--ifm-menu-color-active)",
            base0D: "var(--ifm-menu-color-active)",
            base0E: "var(--ifm-menu-color-active)",
            base0F: "var(--ifm-menu-color-active)",
          }}
          collapsed={false}
          name={null}
          enableClipboard={false}
          displayDataTypes={false}
          displayObjectSize={false}
          collapseStringsAfterLength={50}
        />
      </div>
    </div>
  );
};

// Add react-live imports you need here
const ReactLiveScope = {
  React,
  ...React,
  LaunchedWrapper,
  Text,
  Number,
  Image,
  Link,
};

export default ReactLiveScope;
