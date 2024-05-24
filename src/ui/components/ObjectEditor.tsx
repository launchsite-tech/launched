import type { Renderer } from "../../types/render";
import type { PartialTagValue } from "../../types/tag";

import flattenTagValues from "../../core/util/flatten";

function MultifieldTagUI({
  // element,
  selected,
  value,
  updateData,
  close,
}: {
  element: HTMLElement;
  selected: boolean;
  value: Record<string, any>;
  updateData: (data: Record<string, PartialTagValue>) => void;
  close: () => void;
}) {
  const values = flattenTagValues(value) as Record<string, string | number>;

  return (
    <div className={`Launched__tag-popoutEditor ${selected && "active"}`}>
      <button onClick={close}>Close</button>
      <ul>
        {Object.entries(values).map(([k, v]) => {
          return (
            <li key={k}>
              <label htmlFor={k}>{k}</label>
              <input
                id={k}
                value={v}
                // TODO: Complex types
                type={typeof value === "number" ? "number" : "text"}
                onChange={(e) => {
                  updateData({
                    ...value,
                    [k]: e.target.value,
                  });
                }}
              />
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export const MultifieldTagRenderer: Renderer<Record<string, PartialTagValue>> =
  {
    render: (
      element: HTMLElement,
      value: Record<string, PartialTagValue>,
      options
    ) => {
      return (
        <MultifieldTagUI
          element={element}
          value={value}
          selected={options?.selected ?? false}
          updateData={options?.updateData ?? (() => {})}
          close={options?.close ?? (() => {})}
        />
      );
    },
  };
