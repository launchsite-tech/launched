import React, { createContext, RefObject } from "react";
import type { TagValue, PartialTagValue } from "../types/tag.d.ts";

interface Config {
  tags: Record<string, PartialTagValue>;
  locked?: boolean;
}

const defaults: Partial<Config> = {
  locked: false,
};

const LaunchedContext = createContext<{
  tags: Record<
    string,
    {
      data: TagValue;
      setData: (value: TagValue) => void;
      tag: RefObject<HTMLElement>;
    }
  >;
} | null>(null);

export default function Launched({
  children,
  config,
}: {
  children: React.ReactNode;
  config: Config;
}) {
  const conf = Object.assign({}, defaults, config) as Required<Config>;

  if (!conf.tags) {
    throw new Error("No tags provided.");
  }

  const tags = Object.fromEntries(
    Object.entries(conf.tags).map(([key, value]) => {
      const [data, setData] = React.useState<TagValue>({
        type: "text",
        value,
        locked: conf.locked,
        ...(typeof value === "object" ? value : {}),
      });
      const tag = React.useRef<HTMLElement>(null);

      return [
        key,
        {
          data,
          setData,
          tag,
        },
      ];
    })
  );

  return (
    <LaunchedContext.Provider value={{ tags }}>
      {children}
    </LaunchedContext.Provider>
  );
}

export type { Config };
