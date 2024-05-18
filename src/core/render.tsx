// import type Launched from "../index";
import { createRoot } from "react-dom/client";
import type { PartialTagValue, Tag } from "../types/tag";

export function renderSingleTagUI(tag: Tag) {
  if (!tag || !tag.el.current) return;

  function renderTag(tag: Tag) {
    if (!tag.el.current) return;

    if (Array.isArray(tag.data.value)) {
      Array.from(tag.el.current.children).forEach((child) => {
        renderTag({
          ...tag,
          el: { current: child as HTMLElement },
          data: {
            ...tag.data,
            value: (tag.data.value as PartialTagValue[])[0]!,
          },
        });
      });
    } else {
      const reactLink = document.createElement("div");
      tag.el.current.appendChild(reactLink);

      createRoot(reactLink).render(<TagUI tag={tag} />);
    }
  }

  renderTag(tag);
}

function TagUI({ tag }: { tag: Tag }) {
  console.log(tag);

  return <div>hi</div>;
}
