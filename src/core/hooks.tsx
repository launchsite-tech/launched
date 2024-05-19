import { createRef, useReducer, useContext } from "react";
import type { TagSchema, TagValue, PartialTagValue, Tag } from "../types/tag";
import type { Config } from "./context";
import Launched from "./context";

export function useTagData<Schema extends TagSchema<Schema>>(
  config: Config<Schema>
) {
  console.log("useTagData");

  if (!config.tags) {
    throw new Error("Tags not provided.");
  }

  const tags = cleanTags();

  function reducer(
    state: Record<keyof Schema, TagValue>,
    action: {
      key: keyof Schema;
      value: TagValue;
    }
  ) {
    console.log(`Updating ${String(action.key)}`);

    return {
      ...state,
      [action.key]: action.value,
    };
  }

  const [values, dispatch] = useReducer(reducer, tags);

  function cleanTags(): Record<keyof Schema, TagValue> {
    return Object.fromEntries(
      Object.entries(config.tags).map(([key, value]) => {
        let dataValue: TagValue;

        if (Array.isArray(value)) {
          dataValue = {
            type: "text",
            value: value.map((v: Partial<TagValue>) => ({
              type: "text",
              value: v.value,
              locked: config.locked ?? false,
              ...v,
            })),
            locked: config.locked ?? false,
          };
        } else {
          const options: Partial<TagValue> =
            typeof value === "object" ? value! : {};

          dataValue = {
            type: "text",
            value: (typeof value === "object" ? options.value : value) as
              | PartialTagValue
              | Record<string, PartialTagValue>,
            locked: config.locked ?? false,
            ...options,
          };
        }

        return [key, dataValue];
      })
    ) as Record<keyof Schema, TagValue>;
  }

  return Object.fromEntries(
    Object.keys(tags).map((key) => {
      const el = createRef<HTMLElement | null>();

      return [
        key,
        {
          data: values[key],
          setData: (value: TagValue) => {
            dispatch({ key: key as keyof Schema, value });
          },
          el,
        },
      ];
    })
  ) as Record<keyof Schema, Tag>;
}

export function useLaunched() {
  if (!Launched.instance) {
    throw new Error("Launched instance not found.");
  }

  return useContext(Launched.instance.context)!;
}
