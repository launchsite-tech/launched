import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

import { LaunchedProvider } from "./dist/core/context";
import type { Config } from "./dist";
import type { Schema } from "./siteSchema";

const config: Config<Schema> = {
  tags: {
    title: "Launched Demo",
    description: "This is a demo of Launched.",
    // cards: [
    //   {
    //     value: { title: "Card 1", description: "This is the first card." },
    //   },
    //   {
    //     value: { title: "Card 2", description: "This is the second card." },
    //   },
    // ],
    person: {
      value: {
        gender: {
          value: {
            name: "Launched",
            pronouns: "they/them",
          },
        },
      },
    },
  },
};

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <LaunchedProvider config={config}>
      <App />
    </LaunchedProvider>
  </React.StrictMode>
);
