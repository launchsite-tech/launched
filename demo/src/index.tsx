import "./index.css";

import ReactDOM from "react-dom/client";
import App from "./pages/home/home";

import { LaunchedProvider } from "./dist/core/context";
import type { Config } from "./dist";
import type { Schema } from "./siteSchema";

const config: Config<Schema> = {
  tags: {
    title: "Launched Demo",
    description: { value: "This is a demo of Launched.", type: "paragraph" },
    cards: [
      {
        value: {
          title: "Card 1",
          description: { value: "This is the first card.", type: "paragraph" },
          image: {
            value: {
              src: "/logo192.png",
              alt: "Placeholder",
            },
          },
        },
      },
      {
        value: {
          title: "Card 2",
          description: { value: "This is the second card.", type: "paragraph" },
          image: {
            value: {
              src: "/logo192.png",
              alt: "Placeholder",
            },
          },
        },
      },
    ],
  },
};

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);

root.render(
  // <React.StrictMode>
  <LaunchedProvider config={config}>
    <App />
  </LaunchedProvider>,
  // </React.StrictMode>
);
