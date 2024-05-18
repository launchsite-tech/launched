import { useLaunched } from "./dist/core/context";
import { Schema } from "./siteSchema";
import type { FlatTagSchema } from "./dist/types/tag";

function App() {
  const { useTag } = useLaunched();

  const [title, titleTag] = useTag<Schema>("title");
  const [description, descriptionTag] = useTag<Schema>("description");
  // const [cards, cardsTag] = useTag<Schema>("cards");
  const [person, personTag] = useTag<Schema>("person");

  const t = title as FlatTagSchema<Schema>["title"];
  const d = description as FlatTagSchema<Schema>["description"];
  // const c = cards as FlatTagSchema<Schema>["cards"];
  const p = person as FlatTagSchema<FlatTagSchema<Schema>>["person"];

  return (
    <main>
      <h1 ref={titleTag}>{t}</h1>
      <p ref={descriptionTag}>{d}</p>
      {/* <ul ref={cardsTag}>
        {c.map((card, i) => (
          <li key={i}>
            <h2>{card.title}</h2>
            <p>{card.description}</p>
          </li>
        ))}
      </ul> */}
      <div ref={personTag}>
        <h2>{p.gender.pronouns}</h2>
        <p>{p.gender.name}</p>
      </div>
    </main>
  );
}

export default App;
