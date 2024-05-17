import logo from "./logo.svg";
import "./App.css";

import { useLaunched } from "./dist/core/context";
import { Schema } from "./siteSchema";

function App() {
  const { useTag } = useLaunched();

  const [description, descriptionTag] = useTag<Schema>("description");
  const [image, imageTag] = useTag<Schema>("image");

  type real<Schema, key extends keyof Schema> = Schema[key] extends {
    value: infer T;
  }
    ? T
    : never;
  type Image = real<Schema, "image">;

  return (
    <div className="App">
      <header className="App-header">
        <img ref={imageTag} src={logo} className="App-logo" alt="logo" />
        <p ref={descriptionTag}>{description}</p>
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
