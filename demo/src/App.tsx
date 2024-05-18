import "./App.css";

import { useLaunched } from "./dist/core/context";
import { Schema } from "./siteSchema";

function App() {
  const { useTag } = useLaunched();

  const [description, descriptionTag] = useTag<Schema>("description");
  const [image, imageTag] = useTag<Schema>("image");

  const d = description as Schema["description"];
  const i = image as Schema["image"];

  return (
    <div className="App">
      <header className="App-header">
        <img
          ref={imageTag}
          src={i.value.src}
          className="App-logo"
          alt={i.value.alt}
        />
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
