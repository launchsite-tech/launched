import { useTag } from "../../../dist";

import { Music, Activity, Search, Hash, Check } from "react-feather";

// eslint-disable-next-line react/jsx-key
const icons = [<Music />, <Activity />, <Search />, <Hash />, <Check />];
const defaultCards = [
  {
    icon: 0,
    description:
      "Generate dozens of context-conscious rhymes for any word with a single button.",
  },
  {
    icon: 1,
    description:
      "Receive feedback and suggestions from an AI model tailored to your creative needs.",
  },
  {
    icon: 2,
    description:
      "Search for definitions and synonyms for any word directly within the app.",
  },
  {
    icon: 3,
    description:
      "Easily monitor your rhyme schemes, rhythm, syllables per line, and tone.",
  },
  {
    icon: 4,
    description:
      "Enjoy the features of other high-end text editors for a familiar experience.",
  },
];

export default function Services() {
  const [cards, cardsTag] = useTag("Feature cards", defaultCards);

  return (
    <section id="SERVICES" className="mt-20 w-full max-w-7xl">
      <ul
        ref={cardsTag}
        className="grid w-full grid-cols-5 gap-[2vw] rounded-3xl bg-white p-14 shadow-secondary"
      >
        {cards.map((card: any, index: any) => (
          <li
            key={index}
            className="flex h-64 max-w-48 flex-col items-center justify-center gap-6 rounded-2xl border border-gray-border px-6 text-center font-sans text-sm/[19.6px] text-home"
          >
            <span data-key="icon">{icons[card.icon]}</span>
            <p data-key="description">{card.description}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
