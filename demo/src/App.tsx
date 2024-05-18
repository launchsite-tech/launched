import "./App.css";

import { useLaunched } from "./dist/core/context";
import { Schema } from "./siteSchema";
import type { FlatTagSchema } from "./dist/types/tag";

function App() {
  const { useTag } = useLaunched();

  const [description, descriptionTag] = useTag<Schema>("description");
  const [image, imageTag] = useTag<Schema>("image");

  const i = image as FlatTagSchema<Schema>["image"];
  const d = description as FlatTagSchema<Schema>["description"];

  return (
    <div className="App">
      <header className="App-header">
        <img ref={imageTag} src={i.src} className="App-logo" alt={i.alt} />
        <p ref={descriptionTag}>{d}</p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
