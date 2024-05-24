import { useMediaQuery } from "../../core/hooks";
import { createPortal } from "react-dom";
import type { Renderer } from "../../types/render";
import type { PartialTagValue } from "../../types/tag";
import flattenTagValues from "../../core/util/flatten";

function MultifieldTagUI({
  // element,
  selected,
  value,
  // updateData,
  close,
}: {
  element: HTMLElement;
  selected: boolean;
  value: Record<string, any>;
  updateData: (data: Record<string, PartialTagValue>) => void;
  close: () => void;
}) {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const values = flattenTagValues(value) as Record<string, string | number>;

  console.log(isDesktop);

  let container = document.querySelector(".Launched__popoutContainer");
  if (!container) {
    container = document.createElement("div");
    container.classList.add("Launched__popoutContainer");
    document.body.appendChild(container);
  }

  return createPortal(
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
                  console.log(k, e.target.value);
                }}
              />
            </li>
          );
        })}
      </ul>
    </div>,
    container
  );
}

export const MultifieldTagRenderer: Renderer<Record<string, PartialTagValue>> =
  {
    component: (props) => {
      return <MultifieldTagUI {...props} />;
    },
  };
