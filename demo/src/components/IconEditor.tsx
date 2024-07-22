// import { useTag } from "launched";

import * as icons from "react-feather";

import type { TagRenderer, TagRendererProps } from "launched";
// import type { LaunchedComponentProps } from "launched/components";

import { HTMLTagsWithoutChildren } from "launched/components";

export const allIcons = Object.values(icons);

// * Reference later

function IconComponent({
  value,
  close,
  updateData,
  selected,
}: TagRendererProps<number>) {
  return !selected ? null : (
    <ul className="absolute -top-2 left-1/2 grid max-h-64 w-max -translate-x-1/2 -translate-y-full grid-cols-6 gap-2 overflow-y-auto rounded-md border border-gray-200 bg-white p-2 shadow-lg">
      {allIcons.map((Icon, i) => (
        <li
          key={i}
          onClick={() => {
            updateData(i);
            close();
          }}
          className={`text-bg cursor-pointer rounded-md p-2 ${value === i ? "bg-gray-100" : "hover:bg-gray-100"} text-sm transition-colors ease-out`}
        >
          <Icon
            style={{
              width: "1em",
              height: "1em",
            }}
          />
        </li>
      ))}
    </ul>
  );
}

export const iconRenderer: TagRenderer<number> = {
  component: (props) => <IconComponent {...props} />,
  parentValidator: (element) =>
    !HTMLTagsWithoutChildren.includes(element.tagName),
};
