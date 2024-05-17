import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

import Launched, { LaunchedProvider } from "./dist/core/context";
import type { Config } from "./dist";
import type { Schema } from "./siteSchema";

const config: Config<Schema> = {
  tags: {
    description: "hello there.",
    image: {
      value: {
        alt: "React logo",
        src: "https://reactjs.org/logo-og.png",
      },
    },
  },
};

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

new Launched(config);

root.render(
  <React.StrictMode>
    <LaunchedProvider>
      <App />
    </LaunchedProvider>
  </React.StrictMode>
);
