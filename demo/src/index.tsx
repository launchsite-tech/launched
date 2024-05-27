import "./index.css";

import ReactDOM from "react-dom/client";
import App from "./pages/home/home";

import type { Schema } from "./siteSchema";
import type { Config } from "./dist";

import Launched from "./dist";
import { tags } from "./siteSchema";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);

const config: Config<Schema> = {
  tags,
};
new Launched(config);

root.render(
  // <React.StrictMode>
    <App />
  // </React.StrictMode>
);
