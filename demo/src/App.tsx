import { useEffect } from "react";
import { useLaunched } from "./dist/index";
import { Schema } from "./siteSchema";
import type { FlatTagSchema } from "./dist/types/tag";

function App() {
  const { useTag } = useLaunched();

  const [title, titleTag] = useTag<Schema>("title");
  const [description, descriptionTag] = useTag<Schema>("description");
  const [cards, cardsTag] = useTag<Schema>("cards");

  const t = title as FlatTagSchema<Schema>["title"];
  const d = description as FlatTagSchema<Schema>["description"];
  const c = cards as FlatTagSchema<Schema>["cards"];

  return (
    <main>
      <h1 ref={titleTag}>{t}</h1>
      <p ref={descriptionTag}>{d}</p>
      <ul ref={cardsTag}>
        {c.map((card, i) => (
          <li key={i}>
            <h2>{card.title}</h2>
            <p>{card.description}</p>
            <img src={card.image.src} alt={card.image.alt} />
          </li>
        ))}
      </ul>
    </main>
  );
}

export default App;
