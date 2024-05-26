import { useMediaQuery } from "../../core/hooks";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import type { Renderer } from "../../types/render";
import type { PartialTagValue } from "../../types/tag";
import flattenTagValues from "../../core/util/flatten";

function MultifieldTagUI({
  selected,
  value,
  updateData,
  close,
}: {
  selected: boolean;
  value: Record<string, any>;
  updateData: (data: Record<string, PartialTagValue>) => void;
  close: () => void;
}) {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const [values, setValues] = useState<Record<string, string | number>>(
    flattenTagValues(value) as Record<string, string | number>
  );

  console.log(isDesktop);

  let container = document.querySelector(".Launched__popoutContainer");
  if (!container) {
    container = document.createElement("div");
    container.classList.add("Launched__popoutContainer");
    document.body.appendChild(container);
  }

  function onClickOutside(e: Event) {
    if (e.target === container) close();
  }

  useEffect(() => {
    if (selected) container?.addEventListener("click", onClickOutside);
    else container?.removeEventListener("click", onClickOutside);

    return () => {
      container?.removeEventListener("click", onClickOutside);
    };
  }, []);

  return !selected
    ? null
    : createPortal(
        <div
          onClick={(e) => e.stopPropagation()}
          className={`Launched__tag-popoutEditor ${selected && "active"}`}
          aria-hidden={!selected}
        >
          <button onClick={close}>Close</button>
          <ul>
            {Object.keys(values).map((k) => {
              return (
                <li key={k}>
                  <label htmlFor={k}>{k}</label>
                  <input
                    id={k}
                    value={values[k]}
                    // TODO: Complex types
                    type={typeof values[k] === "number" ? "number" : "text"}
                    onChange={(e) => {
                      const v =
                        typeof values[k] === "string"
                          ? e.target.value
                          : parseInt(e.target.value) || 0;

                      updateData({
                        ...value,
                        value: {
                          ...value["value"],
                          [k]: v,
                        },
                      });

                      setValues({
                        ...values,
                        [k]: v,
                      });
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
