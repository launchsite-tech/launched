import React, { useRef, useState, createContext } from "react";
import type { TagValue, PartialTagValue } from "../types/tag.d.ts";
import type { RefObject } from "react";

export interface Config {
  tags: Record<string, PartialTagValue>;
  locked?: boolean;
}

const defaults: Partial<Config> = {
  locked: false,
};

const LaunchedContext = createContext<{
  tags: {
    [key: string]: {
      data: TagValue;
      setData: (value: TagValue) => void;
      tag: RefObject<HTMLElement & Record<string, any>>;
    };
  };
  useTag: (
    key: string
  ) => readonly [TagValue, RefObject<HTMLElement & Record<string, any>>];
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
      const [data, setData] = useState<TagValue>({
        type: "text",
        value,
        locked: conf.locked,
        ...(typeof value === "object" ? value : {}),
      });
      const tag = useRef<HTMLElement & Record<string, any>>(null);

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

  function useTag(key: string) {
    const tag = tags[key];

    if (!tag) throw new Error(`Tag "${key}" not found.`);

    return [tag.data, tag.tag] as const;
  }

  return (
    <LaunchedContext.Provider value={{ tags, useTag }}>
      {children}
    </LaunchedContext.Provider>
  );
}

export function useLaunched() {
  const context = React.useContext(LaunchedContext);

  if (!context) {
    throw new Error("useLaunched must be used within a LaunchedProvider.");
  }

  return context;
}
