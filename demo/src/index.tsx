import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

import Launched from "launched";
import type { Config } from "launched";

const config: Config = {
  tags: {
    description: "This is a description.",
    image: {
      alt: "image",
      src: "https://via.placeholder.com/150",
    },
  },
};

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <Launched config={config}>
      <App />
    </Launched>
  </React.StrictMode>
);
