// import type Launched from "../index";
import { createRoot } from "react-dom/client";
import type { Tag } from "../types/tag";

export function renderSingleTagUI(tag: Tag) {
  console.log(tag.el.current);
  if (!tag || !tag.el.current) return;

  createRoot(tag.el.current).render(<div>hi</div>);
}
