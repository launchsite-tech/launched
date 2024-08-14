import React from "react";

import { useState, useEffect } from "react";

import Launched, { LaunchedProvider } from "launched";
import { Text, Number, Image, Link } from "launched/components";
import ReactJson from "react-json-view";

import type { Config, Tag, TagData } from "launched";

const config: Config = {
  determineVisibility: () => true,
  toolbarOptions: {},
};

const LaunchedWrapper = ({ children }: { children: React.ReactNode }) => {
  const [tagData, setTagData] = useState<Record<string, TagData["value"]>>({
    message: "Update some data to get started.",
  } as any);

  function onDataUpdate(rawData: Record<string, Tag>) {
    const data = Object.fromEntries(
      Object.entries(rawData).map(([key, tag]) => [key, tag.data.value])
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
        <div id="header">Output</div>
        <div id="dataview">
          <ReactJson
            src={tagData}
            theme={{
              base00: "transparent",
              base01: "white",
              base02: "white",
              base03: "white",
              base04: "white",
              base05: "white",
              base06: "white",
              base07: "white",
              base08: "white",
              base09: "#FF7F24",
              base0A: "white",
              base0B: "white",
              base0C: "white",
              base0D: "white",
              base0E: "white",
              base0F: "white",
            }}
            collapsed={false}
            name={null}
            enableClipboard={false}
            displayDataTypes={false}
            displayObjectSize={false}
          />
        </div>
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
