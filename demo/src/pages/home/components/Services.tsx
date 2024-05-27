import { useTag } from "../../../dist";

import { Music, Activity, Search, Hash, Check } from "react-feather";

import type { Schema } from "../../../siteSchema";
import type { FlatTagSchema } from "../../../dist/types/tag";

// eslint-disable-next-line react/jsx-key
const icons = [<Music />, <Activity />, <Search />, <Hash />, <Check />];

export default function Services() {
  const cardsTag = useTag<Schema>("Feature cards");

  return (
    <section id="SERVICES" className="mt-20 w-full max-w-7xl">
      <ul
        ref={cardsTag}
        className="grid w-full grid-cols-5 gap-[2vw] rounded-3xl bg-white p-14 shadow-secondary"
      >
        {/* {c.map((item, i) => {
          return (
            <li
              className="flex h-64 max-w-48 flex-col items-center justify-center gap-6 rounded-2xl border border-gray-border px-6 text-center font-sans text-sm/[19.6px] text-home"
              key={i}
            >
              <span>{icons[item.icon]}</span>
              <p>{item.description}</p>
            </li>
          );
        })} */}
      </ul>
    </section>
  );
}
